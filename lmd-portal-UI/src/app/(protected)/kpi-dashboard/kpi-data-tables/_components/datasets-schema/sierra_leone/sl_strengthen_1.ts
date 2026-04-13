import { ColDef } from "ag-grid-community";
import { z } from "zod";
import { generateDefaultColumns } from "@/utils/table-helpers";

// define your schema here
const slStrengthen1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  targeted_activity: z.string().min(5).describe("textarea"),
  targeted_activity_summary: z.string().min(5).describe("textarea"),
  progress_update: z.string().min(5).describe("textarea"),
  progress_update_summary: z.string().min(5).describe("textarea"),
  status: z.string().min(5).describe("textarea"),
});

// define your typescript interface here
interface ISlStrengthen1 extends z.infer<typeof slStrengthen1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ISlStrengthen1, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "targeted_activity", minWidth: 300 },
  { field: "targeted_activity_summary", minWidth: 300 },
  { field: "progress_update", minWidth: 600 },
  { field: "progress_update_summary", minWidth: 500 },
  { field: "status", minWidth: 300 },
];

// generate all column names now
const slStrengthen1_columns: ColDef<ISlStrengthen1, any>[] =
  generateDefaultColumns<ISlStrengthen1>(slStrengthen1_schema, customColumns);

export { slStrengthen1_columns, slStrengthen1_schema };
export type { ISlStrengthen1 };
