import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const mlwStrengthen3_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  district_support: z.enum(["LMH", "Non-LMH"]),
  number_chw_trained: z.number().gt(-1),
  number_trained_chw_who_have_reported_into_ichis: z.number().gt(-1),
});

// define your typescript interface here
interface IMlwStrengthen3 extends z.infer<typeof mlwStrengthen3_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IMlwStrengthen3, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "district_support",
    headerName: "District Supported",
    minWidth: 100,
  },
  // {
  //   field: "number_chw_trained",
  //   headerName: "No. CHW Trained",
  //   minWidth: 150,
  // },
  createNumericColumn<IMlwStrengthen3>(
    "number_chw_trained",
    "No. of CHW Trained",
    150
  ),
  {
    field: "number_trained_chw_who_have_reported_into_ichis",
    headerName: "No. CHW Trained who have Reported into iCHIS",
    minWidth: 220,
  },
  createNumericColumn<IMlwStrengthen3>(
    "number_trained_chw_who_have_reported_into_ichis",
    "No. of CHW Trained who have Reported into iCHIS",
    220
  ),
];

// generate all column names now
const mlwStrengthen3_columns: ColDef<IMlwStrengthen3, any>[] =
  generateDefaultColumns<IMlwStrengthen3>(mlwStrengthen3_schema, customColumns);

export { mlwStrengthen3_columns, mlwStrengthen3_schema };
export type { IMlwStrengthen3 };
