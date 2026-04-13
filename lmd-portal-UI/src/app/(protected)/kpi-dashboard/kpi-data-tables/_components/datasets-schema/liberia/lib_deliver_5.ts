import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

// define your schema here
const libDeliver5_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  county: z.enum(["Rivercess", "Grand Bassa", "Grand Gedeh"]),
  number_cha_newly_recruited: z.number().gt(-1),
  number_cha_newly_recruited_female: z.number().gt(-1),
});

interface ILibDeliver5 extends z.infer<typeof libDeliver5_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibDeliver5, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "county",
    minWidth: 160,
  },
  { field: "county", minWidth: 160 },
  // {
  //   field: "number_cha_newly_recruited",
  //   headerName: "No. CHA Newly Recruited",
  //   minWidth: 180,
  //   valueFormatter: (params) => parseAndFormatNumber(params.value),
  // },
  createNumericColumn<ILibDeliver5>(
    "number_cha_newly_recruited",
    "No. CHA Newly Recruited",
    180
  ),
  // {
  //   field: "number_cha_newly_recruited_female",
  //   headerName: "No. CHA Newly Recruited (Female)",
  //   minWidth: 180,
  //   valueFormatter: (params) => parseAndFormatNumber(params.value),
  // },
  createNumericColumn<ILibDeliver5>(
    "number_cha_newly_recruited_female",
    "No. CHA Newly Recruited (Female)",
    180
  ),
];

// generate all column names now
const libDeliver5_columns: ColDef<ILibDeliver5, any>[] =
  generateDefaultColumns<ILibDeliver5>(libDeliver5_schema, customColumns);

export { libDeliver5_schema, libDeliver5_columns };
export type { ILibDeliver5 };
