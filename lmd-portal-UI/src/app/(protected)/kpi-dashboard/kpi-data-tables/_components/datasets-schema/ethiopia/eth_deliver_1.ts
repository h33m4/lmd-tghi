import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const ethDeliver1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  gender: z.enum(["Female", "Male", "Unknown"]),
  number_eyeglasses_distributed_ann: z.number().gt(-1),
  number_eyeglasses_districts_ann: z.number().gt(-1),
});

// define your typescript interface here
interface IEthDeliver1 extends z.infer<typeof ethDeliver1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IEthDeliver1, any>>[] = [
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

  // {
  //   field: "number_completing_irt_course",
  //   headerName: "No. Completing IRT Course",
  //   minWidth: 170,
  // },
  createNumericColumn<IEthDeliver1>(
    "number_eyeglasses_distributed_ann",
    "No. Eye Glasses Distributed (Annual)",
    170,
  ),
  // {
  //   field: "number_completing_irt_course_cumulative",
  //   headerName: "No. Completing IRT Course (cumulative)",
  //   minWidth: 170,
  // },
  createNumericColumn<IEthDeliver1>(
    "number_eyeglasses_districts_ann",
    "No. Eye Glasses Districts (Annual)",
    170,
  ),
];

// generate all column names now
const ethDeliver1_columns: ColDef<IEthDeliver1, any>[] =
  generateDefaultColumns<IEthDeliver1>(ethDeliver1_schema, customColumns);

export { ethDeliver1_columns, ethDeliver1_schema };
export type { IEthDeliver1 };
