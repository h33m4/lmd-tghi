import { ColDef } from "ag-grid-community";
import { z } from "zod";
import { generateDefaultColumns } from "@/utils/table-helpers";

// define your schema here
const libStrengthen1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  targeted_activity: z.string().min(5).describe("textarea"),
  targeted_activity_summary: z.string().min(5).describe("textarea"),
  progress_update: z.string().min(5).describe("textarea"),
  progress_update_summary: z.string().min(5).describe("textarea"),
  status: z.enum([
    "N/A",
    "Achieved",
    "On track",
    "Slightly off track",
    "Very off track",
  ]),
});

interface ILibStrengthen1 extends z.infer<typeof libStrengthen1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibStrengthen1, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "targeted_activity",
    minWidth: 200,
  },
  {
    field: "targeted_activity_summary",
    minWidth: 300,
  },
  {
    field: "progress_update",
    minWidth: 620,
  },
  { field: "progress_update_summary", minWidth: 400 },
  { field: "status", minWidth: 180 },
];

// generate all column names now
const libStrengthen1_columns: ColDef<ILibStrengthen1, any>[] =
  generateDefaultColumns<ILibStrengthen1>(libStrengthen1_schema, customColumns);

export { libStrengthen1_schema, libStrengthen1_columns };
export type { ILibStrengthen1 };
