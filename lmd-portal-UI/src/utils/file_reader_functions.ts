import { RcFile } from "antd/es/upload";
import Papa from "papaparse";

export async function parseCSV(file: File | RcFile): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        resolve(results as any);
        // resolve(removeUnderscoreFields(results.data));
      },
      header: true,
      error: (error) => {
        console.error("CSV Parsing Error -> ", error);
        reject(error); // Reject the promise if there's an error
      },
    });
  });
}

export function parseRcFileToFile(rcFile: any): File {
  // Check if rcFile is already a File object
  if (rcFile instanceof File) {
    return rcFile;
  }

  const { uid, name, type, lastModified, originFileObj } = rcFile;
  const blob =
    originFileObj instanceof Blob
      ? originFileObj
      : new Blob([rcFile], { type });

  const file = new File([blob], name, {
    type,
    lastModified: lastModified || Date.now(),
  });
  return file;
}

export function extractKeys(data: any[]): string[] {
  if (data && data.length > 0) {
    const allKeys = new Set(data.flatMap(Object.keys));
    return Array.from(allKeys);
  }

  return [];
}

function removeUnderscoreFields(data: any[]) {
  return data.map((item) => {
    return Object.fromEntries(
      Object.entries(item).filter(([key]) => key !== "" && !key.startsWith("_"))
    );
  });
}

export const downloadCSV = (data: string, filename: string) => {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export function createFileFromFileData(
  fileData: any,
  originalName: string
): File {
  try {
    const rows = fileData.data || [];
    const headers = fileData.meta?.fields || Object.keys(rows[0] || {});
    const csv = Papa.unparse({ fields: headers, data: rows });
    const blob = new Blob([csv], { type: "text/csv" });
    const cleanedName = originalName.replace(/\.[^/.]+$/, ""); // remove ext
    return new File([blob], `${cleanedName}_edited.csv`, {
      type: "text/csv",
    });
  } catch (err) {
    console.error("Error creating CSV file:", err);
    return new File([""], "invalid.csv", { type: "text/csv" });
  }
}
