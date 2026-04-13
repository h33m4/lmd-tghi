import { ColDef } from "ag-grid-community";
import { z } from "zod";
import { generateDefaultColumns } from "@/utils/table-helpers";

// define your schema here
const mlwStrengthen1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  fy_target: z.string().min(5).describe("textarea"),
  fy_target_summary: z.string().min(5).describe("textarea"),
  programmatic_updates: z.string().min(5).describe("textarea"),
  programmatic_updates_summary: z.string().min(5).describe("textarea"),
  number_modules_developed: z.string().min(5).describe("textarea"),
  number_districts_trained_lmh: z.string().min(5).describe("textarea"),
  number_districts_trained_partner: z.string().min(5).describe("textarea"),
  m_e_system: z.string().min(5).describe("textarea"),
});

// define your typescript interface here
interface IMlwStrengthen1 extends z.infer<typeof mlwStrengthen1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IMlwStrengthen1, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "fy_target", headerName: "FY Target", minWidth: 100 },
  {
    field: "fy_target_summary",
    headerName: "FY Target Summary",
    minWidth: 150,
  },
  { field: "programmatic_updates", minWidth: 200 },
  { field: "programmatic_updates_summary", minWidth: 200 },
  {
    field: "number_modules_developed",
    headerName: "No. of Modules Developed",
    minWidth: 160,
  },
  {
    field: "number_districts_trained_lmh",
    headerName: "No. of Districts Trained (LMH)",
    minWidth: 150,
  },
  {
    field: "number_districts_trained_partner",
    headerName: "No. of Districts Trained (Partner)",
    minWidth: 170,
  },
  { field: "m_e_system", headerName: "M & E System", minWidth: 150 },
];

// generate all column names now
const mlwStrengthen1_columns: ColDef<IMlwStrengthen1, any>[] =
  generateDefaultColumns<IMlwStrengthen1>(mlwStrengthen1_schema, customColumns);

export { mlwStrengthen1_columns, mlwStrengthen1_schema };
export type { IMlwStrengthen1 };
