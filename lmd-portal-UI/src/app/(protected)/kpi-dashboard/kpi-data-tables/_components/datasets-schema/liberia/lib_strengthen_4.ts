import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

// define your schema here
const libStrengthen4_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  county_type: z.enum(["Non LMH-managed", "LMH-managed"]),
  gender: z.enum(["Female", "Male", "Unknown"]),
  number_cha_receiving_training: z.number().gt(-1),
});

interface ILibStrengthen4 extends z.infer<typeof libStrengthen4_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibStrengthen4, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "gender",
    minWidth: 120,
  },
  {
    field: "county_type",
    headerName: "County Type",
    minWidth: 170,
  },
  // {
  //   field: "number_cha_receiving_training",
  //   headerName: "No. CHA Receiving Training",
  //   minWidth: 180,
  //   valueFormatter: (params) => parseAndFormatNumber(params.value),
  // },
  createNumericColumn<ILibStrengthen4>(
    "number_cha_receiving_training",
    "No. CHA Receiving Training",
    180
  ),
];

// generate all column names now
const libStrengthen4_columns: ColDef<ILibStrengthen4, any>[] =
  generateDefaultColumns<ILibStrengthen4>(libStrengthen4_schema, customColumns);

export { libStrengthen4_schema, libStrengthen4_columns };
export type { ILibStrengthen4 };
