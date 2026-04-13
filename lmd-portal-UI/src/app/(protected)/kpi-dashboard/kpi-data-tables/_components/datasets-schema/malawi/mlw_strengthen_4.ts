import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const mlwStrengthen4_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  number_lmh_supported_chws: z.number().gt(-1),
  number_lmh_supported_chws_receiving_supervision: z.number().gt(-1),
});

// define your typescript interface here
interface IMlwStrengthen4 extends z.infer<typeof mlwStrengthen4_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IMlwStrengthen4, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  // {
  //   field: "number_lmh_supported_chws",
  //   headerName: "No. LMH Supported CHWs",
  //   minWidth: 180,
  // },
  createNumericColumn<IMlwStrengthen4>(
    "number_lmh_supported_chws",
    "No. of LMH Supported CHWs",
    180
  ),
  // {
  //   field: "number_lmh_supported_chws_receiving_supervision",
  //   headerName: "No. LMH Supported CHWs Receiving Supervision",
  //   minWidth: 200,
  // },
  createNumericColumn<IMlwStrengthen4>(
    "number_lmh_supported_chws_receiving_supervision",
    "No. of LMH Supported CHWs Receiving Supervision",
    210
  ),
];

// generate all column names now
const mlwStrengthen4_columns: ColDef<IMlwStrengthen4, any>[] =
  generateDefaultColumns<IMlwStrengthen4>(mlwStrengthen4_schema, customColumns);

export { mlwStrengthen4_columns, mlwStrengthen4_schema };
export type { IMlwStrengthen4 };
