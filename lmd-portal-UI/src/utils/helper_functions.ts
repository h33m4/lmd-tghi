import React from "react";
import { centerCrop, makeAspectCrop, PixelCrop } from "react-image-crop";

export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${formattedMinutes}:${formattedSeconds}`;
};

export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error == "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something went wrong, please try again";
  }

  return message;
};

export function concatClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const ApiSimulator = (value: boolean, delay = 1500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value) {
        resolve(value);
      } else {
        reject(new Error("Simulated error: value is false"));
      }
    }, delay);
  });
};

export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext("2d");
  const TO_RADIANS = Math.PI / 180;

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  // const pixelRatio = 1

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}

export const isFormFilled = (userData: any) => {
  const { ...rest } = userData;
  for (const key in rest) {
    if (Object.prototype.hasOwnProperty.call(rest, key)) {
      if (rest[key as keyof typeof userData] === "") {
        return key;
      }
    }
  }
  return null; // Return null if all fields are filled
};

/**
 * compareTimeToNow
 * mostly used for checking the expiration of tokens
 * @param {string} date - given date in string 2024-04-12T03:40:58.756Z
 * @returns {Boolean} Response: [true, false]
 * returns true if more than now or false if less than now
 */
export const compareTimeToNow = (date: string) => {
  const givenDate = new Date(date).getTime();
  const dateNow = new Date().getTime();

  return givenDate > dateNow;
};

export function getReadableTimeForFile(lastModified: number): string {
  // Convert the timestamp to a Date object
  const date = new Date(lastModified);

  // Format the date and time
  const readableTime = date.toLocaleString();

  return readableTime;
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function downloadJSON(data: any, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2); // Convert JSON array to string with indentation
  const blob = new Blob([jsonStr], { type: "application/json" }); // Create a Blob with the JSON data
  const url = URL.createObjectURL(blob); // Create a URL for the Blob

  const link = document.createElement("a"); // Create an anchor element
  link.href = url;
  link.download = `${filename}.json`; // Set the download attribute with the desired filename
  link.click(); // Trigger the download

  URL.revokeObjectURL(url); // Clean up the URL object
}

export function capitalizeWords(
  str: string,
  wordsToCapitalize: string[] = []
): string {
  return str
    .split(" ")
    .map((word) => {
      if (wordsToCapitalize.includes(word.toLowerCase())) {
        return word.toUpperCase(); // Fully capitalize the word if it matches an entry in the wordsToCapitalize array
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize the first letter of other words
      }
    })
    .join(" "); // Join the array back into a string
}

export function getFiscalYearAndQuarter(dateString: string): string {
  const date = new Date(dateString);

  // Extract the full year and month
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // getUTCMonth is zero-indexed

  let fiscalYear: number;
  let quarter: number;

  // Fiscal year logic
  if (month >= 7) {
    // From July to December, it's the next fiscal year
    fiscalYear = year + 1;
  } else {
    // From January to June, it's the current fiscal year
    fiscalYear = year;
  }

  // Determine the quarter
  if (month >= 7 && month <= 9) {
    quarter = 1; // Q1: July - September
  } else if (month >= 10 && month <= 12) {
    quarter = 2; // Q2: October - December
  } else if (month >= 1 && month <= 3) {
    quarter = 3; // Q3: January - March
  } else {
    quarter = 4; // Q4: April - June
  }

  // Convert the fiscal year to two digits
  const twoDigitYear = fiscalYear.toString().slice(-2);

  return `FY${twoDigitYear} Q${quarter}`;
}
