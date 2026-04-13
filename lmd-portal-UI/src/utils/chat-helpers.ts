import { Block, KnownBlock } from "@slack/bolt";

export function formatChatTime(timestamp: number): string {
  const date = new Date(timestamp);

  // Get the hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Pad the minutes with leading zero if needed
  const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();

  // Get the month and day
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();

  // Format the date and time
  const formattedDate = `${hours}:${minutesStr} ${ampm} ${month} ${day}`;

  return formattedDate;
}

export function getInitials(fullName?: string, email?: string): string {
  // Check if fullName is provided and process it
  if (fullName) {
    const nameParts = fullName.trim().split(" ");

    if (nameParts.length === 0) return "";

    const firstNameInitial = nameParts[0][0].toUpperCase();
    const lastNameInitial =
      nameParts.length > 1
        ? nameParts[nameParts.length - 1][0].toUpperCase()
        : "";

    return firstNameInitial + lastNameInitial;
  }

  // Fallback to using email if fullName is not provided
  if (email) {
    const emailInitial = email.trim()[0]?.toUpperCase() || "";
    return emailInitial;
  }

  // Return empty string if neither fullName nor email is provided
  return "";
}

function formatPathname(url: string): string {
  // Extract the pathname from the URL
  const pathname = new URL(url).pathname;

  // Remove the leading slash and split the pathname by "/"
  const parts = pathname.replace(/^\//, "").split("/");

  // Capitalize the first letter of each part and join them with " - "
  const formattedParts = parts.map(
    (part) =>
      part
        .split("-") // Split the part by "-"
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(" ") // Join words with a space
  );

  return formattedParts.join(" - ");
}
