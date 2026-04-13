import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const ethDeliver2_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  number_hews_used_hep_assist_ann: z.number().gt(-1),
});

// define your typescript interface here
interface IEthDeliver2 extends z.infer<typeof ethDeliver2_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IEthDeliver2, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },

  createNumericColumn<IEthDeliver2>(
    "number_hews_used_hep_assist_ann",
    "No. HEWs who used HEPAssist (Annual)",
    170,
  ),
];

// generate all column names now
const ethDeliver2_columns: ColDef<IEthDeliver2, any>[] =
  generateDefaultColumns<IEthDeliver2>(ethDeliver2_schema, customColumns);

export { ethDeliver2_columns, ethDeliver2_schema };
export type { IEthDeliver2 };
