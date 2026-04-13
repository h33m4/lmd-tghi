import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const ethUpskill2_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  module: z.enum(["RMNCH", "NCD", "MCD"]),
  gender: z.enum(["Female", "Male", "Unknown"]),
  number_of_completions: z.number().gt(-1),
  number_of_completions_cumulative: z.number().gt(-1),
});

// define your typescript interface here
interface IEthUpskill2 extends z.infer<typeof ethUpskill2_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IEthUpskill2, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "gender",
    minWidth: 100,
  },
  { field: "module", minWidth: 150 },
  // {
  //   field: "number_of_completions",
  //   headerName: "No. Completions",
  //   minWidth: 160,
  // },
  createNumericColumn<IEthUpskill2>(
    "number_of_completions",
    "Number of Completions",
    160,
  ),

  createNumericColumn<IEthUpskill2>(
    "number_of_completions_cumulative",
    "Number of Completions (Cumulative)",
    180,
  ),
];

// generate all column names now
const ethUpskill2_columns: ColDef<IEthUpskill2, any>[] =
  generateDefaultColumns<IEthUpskill2>(ethUpskill2_schema, customColumns);

export { ethUpskill2_columns, ethUpskill2_schema };
export type { IEthUpskill2 };
