import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

// define your schema here
const libStrengthen5_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  county_type: z.enum(["Non LMH-managed", "LMH-managed"]),
  gender: z.enum(["Female", "Male", "Unknown"]),
  number_of_cha_trained: z.number().gt(-1),
  number_chas_submitting_digital_report_in_the_previous_month: z
    .number()
    .gt(-1),
});

interface ILibStrengthen5 extends z.infer<typeof libStrengthen5_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibStrengthen5, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "gender", minWidth: 120 },
  {
    field: "county_type",
    headerName: "County Type",
    minWidth: 170,
  },
  // {
  //   field: "number_of_cha_trained",
  //   headerName: "No. CHAs Trained",
  //   minWidth: 150,
  //   valueFormatter: (params) => parseAndFormatNumber(params.value),
  // },
  createNumericColumn<ILibStrengthen5>(
    "number_of_cha_trained",
    "No. CHAs Trained",
    150
  ),
  // {
  //   field: "number_chas_submitting_digital_report_in_the_previous_month",
  //   minWidth: 200,
  //   headerName: "No. CHAs Submitting Digital Report in the Previous Month",
  //   valueFormatter: (params) => parseAndFormatNumber(params.value),
  // },
  createNumericColumn<ILibStrengthen5>(
    "number_chas_submitting_digital_report_in_the_previous_month",
    "No. CHAs Submitting Digital Report in the Previous Month",
    200
  ),
];

// generate all column names now
const libStrengthen5_columns: ColDef<ILibStrengthen5, any>[] =
  generateDefaultColumns<ILibStrengthen5>(libStrengthen5_schema, customColumns);

export { libStrengthen5_schema, libStrengthen5_columns };
export type { ILibStrengthen5 };
