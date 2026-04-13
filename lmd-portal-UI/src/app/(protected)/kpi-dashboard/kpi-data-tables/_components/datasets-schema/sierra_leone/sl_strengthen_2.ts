import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const slStrengthen2_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  chw_cadre: z.string().min(2),
  number_identified_quality_improvements: z.number().gt(-1),
  number_identified_quality_improvements_completed: z.number().gt(-1),
});

// define your typescript interface here
interface ISlStrengthen2 extends z.infer<typeof slStrengthen2_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ISlStrengthen2, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "chw_cadre", headerName: "CHW Cadre", minWidth: 200 },
  // {
  //   field: "number_identified_quality_improvements",
  //   headerName: "No. Identified Quality Improvements",
  //   minWidth: 200,
  // },
  createNumericColumn<ISlStrengthen2>(
    "number_identified_quality_improvements",
    "No. of Identified Quality Improvements",
    210
  ),
  // {
  //   field: "number_identified_quality_improvements_completed",
  //   headerName: "No. Identifed Quality Improvements Completed",
  //   minWidth: 200,
  // },
  createNumericColumn<ISlStrengthen2>(
    "number_identified_quality_improvements_completed",
    "No. of Identifed Quality Improvements Completed",
    230
  ),
];

// generate all column names now
const slStrengthen2_columns: ColDef<ISlStrengthen2, any>[] =
  generateDefaultColumns<ISlStrengthen2>(slStrengthen2_schema, customColumns);

export { slStrengthen2_columns, slStrengthen2_schema };
export type { ISlStrengthen2 };
