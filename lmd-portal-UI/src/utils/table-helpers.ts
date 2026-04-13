// utils/table-helpers.ts
import { ColDef } from "ag-grid-community";
import { z } from "zod";

/**
 * Capitalizes and formats column header names
 * @param field The field name to capitalize
 * @returns Formatted header name
 */
export const capitalizeHeaderName = (field: string): string =>
  field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Generates AG-Grid column definitions from a Zod schema
 * @param schema The Zod schema containing field definitions
 * @param customColumns Array of custom column definitions to merge
 * @returns Array of AG-Grid column definitions
 */
export function generateDefaultColumns<T>(
  schema: z.ZodObject<any>,
  customColumns: Partial<ColDef<T, any>>[]
): ColDef<T, any>[] {
  // Generate default columns from schema
  const defaultColumns = Object.keys(schema.shape).map((key) => {
    return {
      field: key,
      headerName: capitalizeHeaderName(key),
      sortable: true,
      filter: true,
    } as ColDef<T, any>;
  });

  // Merge with custom columns
  customColumns.forEach((customColumn) => {
    const index = defaultColumns.findIndex(
      (col) => col.field === customColumn.field
    );
    if (index !== -1) {
      defaultColumns[index] = { ...defaultColumns[index], ...customColumn };
    } else {
      defaultColumns.push(customColumn as ColDef<T, any>);
    }
  });

  return defaultColumns;
}

/**
 * Generates filename for exported files. Based on LMD naming conventions
 * @param initialname The initialname of file name passed
 * @returns a string like initialname_mm_dd_yyyy.csv
 */
export function generateFileName(initialname: string) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${initialname}_${month}_${day}_${year}.csv`;
}

export const zodDateMMDDYYYY = z
  .string()
  .refine(
    (val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), // Checks if date is in mm/dd/yyyy format
    {
      message: "Date must be in mm/dd/yyyy format",
    }
  )
  .transform((val) => {
    const [month, day, year] = val.split("/").map(Number);
    return new Date(year, month - 1, day); // Convert to Date object
  });

/**
 * Parses a string number (with or without commas) and returns a formatted number string
 * @param value - The input value (string or number)
 * @returns Formatted number string with commas, or empty string for invalid input
 */
export const parseAndFormatNumber = (
  value: string | number | null | undefined
): string => {
  // Handle null/undefined/empty cases
  if (value === null || value === undefined || value === "") return "";

  let numValue: number;

  if (typeof value === "string") {
    // Remove commas, whitespace, and convert to number
    const cleaned = value.replace(/,/g, "").trim();

    // Handle empty string after cleaning
    if (cleaned === "" || cleaned === "-") return "0";

    numValue = Number(cleaned);

    // Return empty if can't parse
    if (isNaN(numValue)) return "";
  } else {
    numValue = Number(value);
    if (isNaN(numValue)) return "";
  }

  // Format with commas using Intl.NumberFormat
  return new Intl.NumberFormat("en-US").format(numValue);
};

/**
 * Parse numeric strings like "20,304" or "2220" into numbers.
 */
export const parseNumber = (value: any): number => {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  return Number(String(value).replace(/,/g, "")) || 0;
};

/**
 * NEW: Helper function to parse numbers that might contain commas
 * */

export const parseNumberFromString = (
  value: string | number
): number | null => {
  if (typeof value === "number") {
    return isNaN(value) ? null : value;
  }

  if (typeof value === "string") {
    // Remove commas and other non-numeric characters except decimal points and minus signs
    const cleanedValue = value.replace(/[^\d.-]/g, "");

    if (cleanedValue === "" || cleanedValue === "-") {
      return null;
    }

    const parsed = Number(cleanedValue);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
};

/**
 * Create a numeric column definition for ag-grid where values might come
 * as strings with commas (e.g. "20,304").
 *
 * @param field - the data field name
 * @param headerName - column header to display
 * @param minWidth - optional column min width
 */
export function createNumericColumn<T extends Record<string, any>>(
  field: string & keyof T,
  headerName?: string,
  minWidth: number = 120
): ColDef<T, number> {
  return {
    field: field as any, // ✅ Type assertion to satisfy ag-Grid's strict typing
    headerName,
    minWidth,
    valueGetter: (params) => parseNumber(params.data?.[field]),
    valueFormatter: (params) =>
      params.value != null ? params.value.toLocaleString("en-US") : "",
    comparator: (a, b) => {
      // ✅ Handle null/undefined values in comparator
      if (a == null && b == null) return 0;
      if (a == null) return -1;
      if (b == null) return 1;
      return a - b;
    },
    // type: "numericColumn", // ✅ Add this for better ag-grid numeric handling
  };
}
