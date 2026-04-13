import dayjs from "dayjs";

/**
 * Formats date for display
 */
const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value?: string | number | Date): string {
  if (!value) return "Never";

  const date = new Date(value);
  return isNaN(date.getTime()) ? "Invalid date" : formatter.format(date);
}

/**
 * Formats date for display
 */
export function formatDateForReport(
  date?: Date,
  format: string = "DD MMM, YYYY"
): string {
  if (!date) return "";
  return dayjs(date).format(format);
}
