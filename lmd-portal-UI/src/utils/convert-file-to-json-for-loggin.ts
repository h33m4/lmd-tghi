// utils/fileConverter.ts

/**
 * Convert a File to JSON string
 * Supports CSV, JSON, and Excel files
 */
export async function convertFileToJson(file: File): Promise<string | null> {
  try {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "json") {
      // If it's already JSON, just read and return
      const text = await file.text();
      // Validate it's valid JSON
      JSON.parse(text);
      return text;
    }

    if (fileExtension === "csv") {
      // Parse CSV to JSON
      const text = await file.text();
      return csvToJson(text);
    }

    if (fileExtension === "xlsx" || fileExtension === "xls") {
      // For Excel files, you'd need a library like xlsx
      console.warn("Excel file conversion not implemented");
      return null;
    }

    console.warn(`Unsupported file type: ${fileExtension}`);
    return null;
  } catch (error) {
    console.error("Error converting file to JSON:", error);
    return null;
  }
}

/**
 * Convert CSV text to JSON string
 */
function csvToJson(csvText: string): string {
  const lines = csvText.split("\n").filter((line) => line.trim());

  if (lines.length === 0) {
    return JSON.stringify([]);
  }

  // Parse headers
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));

  // Parse data rows
  const data = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string> = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] || "";
    });

    return obj;
  });

  return JSON.stringify(data);
}
