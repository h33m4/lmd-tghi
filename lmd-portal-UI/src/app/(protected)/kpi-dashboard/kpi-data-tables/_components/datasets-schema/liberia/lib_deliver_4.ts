import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

// define your schema here
const libDeliver4_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  county: z.enum(["Rivercess", "Grand Bassa"]),
  number_births_facility: z.number().gt(-1),
  number_births_total: z.number().gt(-1),
});

interface ILibDeliver4 extends z.infer<typeof libDeliver4_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibDeliver4, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "county", minWidth: 160 },
  // {
  //   field: "number_births_facility",
  //   headerName: "No. Births (Facility)",
  //   minWidth: 180,
  //   valueFormatter: (params) => parseAndFormatNumber(params.value),
  // },
  createNumericColumn<ILibDeliver4>(
    "number_births_facility",
    "No. Births (Facility)",
    180
  ),
  // {
  //   field: "number_births_total",
  //   headerName: "No. Births (Total)",
  //   minWidth: 180,
  //   valueFormatter: (params) => parseAndFormatNumber(params.value),
  // },
  createNumericColumn<ILibDeliver4>(
    "number_births_total",
    "No. Births (Total))",
    180
  ),
];

// generate all column names now
const libDeliver4_columns: ColDef<ILibDeliver4, any>[] =
  generateDefaultColumns<ILibDeliver4>(libDeliver4_schema, customColumns);

export { libDeliver4_schema, libDeliver4_columns };
export type { ILibDeliver4 };
