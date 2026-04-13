import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

// define your schema here
const libUpskill1_2_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  county_type: z.enum(["Non LMH-managed", "LMH-managed"]),
  number_chas: z.number().gt(-1),
  number_cha_trained_in_iccm: z.number().gt(-1).nullable(),
  number_cha_assessed_on_iccm: z.number().gt(-1).nullable(),
  number_of_cha_passing_iccm: z.number().gt(-1).nullable(),
});

interface ILibUpskill1_2 extends z.infer<typeof libUpskill1_2_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibUpskill1_2, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "number_chas",
    headerName: "No. of CHAs",
    minWidth: 120,
    valueFormatter: (params) => parseAndFormatNumber(params.value),
  },
  {
    field: "number_cha_trained_in_iccm",
    headerName: "No. of CHA trained in ICCM",
    minWidth: 180,
    valueFormatter: (params) => parseAndFormatNumber(params.value),
  },
  {
    field: "number_cha_assessed_on_iccm",
    headerName: "No. of CHA assessed on ICCM",
    minWidth: 180,
    valueFormatter: (params) => parseAndFormatNumber(params.value),
  },
  {
    field: "number_of_cha_passing_iccm",
    headerName: "No. of CHA passing in ICCM",
    minWidth: 180,
    valueFormatter: (params) => parseAndFormatNumber(params.value),
  },
  {
    field: "county_type",
    headerName: "County Type",
    minWidth: 160,
  },
];

// generate all column names now
const libUpskill1_2_columns: ColDef<ILibUpskill1_2, any>[] =
  generateDefaultColumns<ILibUpskill1_2>(libUpskill1_2_schema, customColumns);

export { libUpskill1_2_schema, libUpskill1_2_columns };
export type { ILibUpskill1_2 };
