import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const slStrengthen3_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  district: z.string().min(2),
  expected_chw_reports_chis_lmhmanaged: z.number().gt(-1),
  chw_reports_entered_ontime_chis_lmhmanaged: z.number().gt(-1),
});

// define your typescript interface here
interface ISlStrengthen3 extends z.infer<typeof slStrengthen3_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ISlStrengthen3, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "district", minWidth: 200 },
  // {
  //   field: "number_identified_quality_improvements",
  //   headerName: "No. Identified Quality Improvements",
  //   minWidth: 200,
  // },
  createNumericColumn<ISlStrengthen3>(
    "expected_chw_reports_chis_lmhmanaged",
    "No. Expected CHW Reports for LMH Managed Districts",
    300,
  ),
  // {
  //   field: "number_identified_quality_improvements_completed",
  //   headerName: "No. Identifed Quality Improvements Completed",
  //   minWidth: 200,
  // },
  createNumericColumn<ISlStrengthen3>(
    "chw_reports_entered_ontime_chis_lmhmanaged",
    "No. Actual CHW Reports Entered Ontime for LMH Managed Districts ",
    300,
  ),
];

// generate all column names now
const slStrengthen3_columns: ColDef<ISlStrengthen3, any>[] =
  generateDefaultColumns<ISlStrengthen3>(slStrengthen3_schema, customColumns);

export { slStrengthen3_columns, slStrengthen3_schema };
export type { ISlStrengthen3 };
