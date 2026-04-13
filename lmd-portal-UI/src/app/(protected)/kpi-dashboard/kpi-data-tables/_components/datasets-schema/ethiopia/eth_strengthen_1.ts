import { ColDef } from "ag-grid-community";
import { z } from "zod";
import { generateDefaultColumns } from "@/utils/table-helpers";

// define your schema here
const ethStrengthen1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  progress_update: z.string().min(5).describe("textarea"),
  progress_update_summary: z.string().min(5).describe("textarea"),
  status: z.enum([
    "N/A",
    "Achieved",
    "On track",
    "Slightly off track",
    "Very off track",
  ]),
  status_of_blended_irt_modules_echis: z.enum([
    "Not started",
    "Adapted & piloted",
    "Adaptation in progress",
    "Scale-up",
  ]),
  status_of_blended_irt_modules_ehh: z.enum([
    "Not started",
    "Adapted & piloted",
    "Adaptation in progress",
    "Scale-up",
  ]),
  status_of_blended_irt_modules_first_aid: z.enum([
    "Not started",
    "Adapted & piloted",
    "Adaptation in progress",
    "Scale-up",
  ]),
  status_of_blended_irt_modules_mcd: z.enum([
    "Not started",
    "Adapted & piloted",
    "Adaptation in progress",
    "Scale-up",
  ]),
  status_of_blended_irt_modules_ncd: z.enum([
    "Not started",
    "Adapted & piloted",
    "Adaptation in progress",
    "Scale-up",
  ]),
  status_of_blended_irt_modules_rmnch: z.enum([
    "Not started",
    "Adapted & piloted",
    "Adaptation in progress",
    "Scale-up",
  ]),
  status_of_blended_irt_modules_sbcc: z.enum([
    "Not started",
    "Adapted & piloted",
    "Adaptation in progress",
    "Scale-up",
  ]),
  targeted_activity: z.string().min(5).describe("textarea"),
  targeted_activity_summary: z.string().min(5).describe("textarea"),
});

// define your typescript interface here
interface IEthStrengthen1 extends z.infer<typeof ethStrengthen1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IEthStrengthen1, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "fy_q",
    headerName: "FY_Q",
    minWidth: 100,
  },

  {
    field: "progress_update",
    headerName: "Progress Update",
    minWidth: 200,
  },
  {
    field: "progress_update_summary",
    headerName: "Progress Update Summary",
    minWidth: 200,
  },
  {
    field: "status",
    minWidth: 120,
  },
  {
    field: "status_of_blended_irt_modules_echis",
    headerName: "ECHIS Module Status",
    minWidth: 150,
  },
  {
    field: "status_of_blended_irt_modules_ehh",
    headerName: "EHH Module Status",
    minWidth: 150,
  },
  {
    field: "status_of_blended_irt_modules_first_aid",
    headerName: "First Aid Module Status",
    minWidth: 150,
  },
  {
    field: "status_of_blended_irt_modules_mcd",
    headerName: "MCD Module Status",
    minWidth: 150,
  },
  {
    field: "status_of_blended_irt_modules_ncd",
    headerName: "NCD Module Status",
    minWidth: 150,
  },
  {
    field: "status_of_blended_irt_modules_rmnch",
    headerName: "RMNCH Module Status",
    minWidth: 150,
  },
  {
    field: "status_of_blended_irt_modules_sbcc",
    headerName: "SBCC Module Status",
    minWidth: 150,
  },
  {
    field: "targeted_activity",
    headerName: "Targeted Activity",
    minWidth: 200,
  },
  {
    field: "targeted_activity_summary",
    headerName: "Targeted Activity Summary",
    minWidth: 500,
  },
];

// generate all column names now
const ethStrengthen1_columns: ColDef<IEthStrengthen1, any>[] =
  generateDefaultColumns<IEthStrengthen1>(ethStrengthen1_schema, customColumns);

export { ethStrengthen1_columns, ethStrengthen1_schema };
export type { IEthStrengthen1 };
