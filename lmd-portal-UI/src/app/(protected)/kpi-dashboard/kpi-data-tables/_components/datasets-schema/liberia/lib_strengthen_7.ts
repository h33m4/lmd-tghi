import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

const parseNumber = (value: any): number => {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  // Remove commas and convert to number
  return Number(String(value).replace(/,/g, "")) || 0;
};

// define your schema here
const libStrengthen7_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  county_type: z.enum(["Non LMH-managed", "LMH-managed"]),
  number_routine_home_visits: z.number().gte(0),
  number_routine_home_visits_cumulative: z.number().gte(0),
});

interface ILibStrengthen7 extends z.infer<typeof libStrengthen7_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibStrengthen7, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "county_type",
    headerName: "County Type",
    minWidth: 160,
  },
  // {
  //   field: "number_routine_home_visits",
  //   headerName: "No. Routine Home Visits",
  //   minWidth: 150,
  //   valueFormatter: (params) => parseAndFormatNumber(params.value),
  // },
  // {
  //   field: "number_routine_home_visits_cumulative",
  //   headerName: "No. Routine Home Visits (Cumulative)",
  //   minWidth: 170,
  //   type: "numericColumn",
  //   valueGetter: (params) =>
  //     parseNumber(params.data?.number_routine_home_visits_cumulative),
  //   valueFormatter: (params) => params.value?.toLocaleString("en-US") ?? "",
  //   comparator: (a, b) => a - b,
  // },
  createNumericColumn<ILibStrengthen7>(
    "number_routine_home_visits",
    "No. of Routine Home Visits",
    150
  ),
  createNumericColumn<ILibStrengthen7>(
    "number_routine_home_visits_cumulative",
    "No. of Routine Home Visits (Cumulative)",
    170
  ),
];

// generate all column names now
const libStrengthen7_columns: ColDef<ILibStrengthen7, any>[] =
  generateDefaultColumns<ILibStrengthen7>(libStrengthen7_schema, customColumns);

export { libStrengthen7_schema, libStrengthen7_columns };
export type { ILibStrengthen7 };
