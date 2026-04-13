import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const ethUpskill1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  cadre: z.enum(["HEW", "HEW Supervisor", "Other FHW"]),
  gender: z.enum(["Female", "Male", "Unknown"]),
  number_completing_irt_course: z.number().gt(-1),
  number_completing_irt_course_cumulative: z.number().gt(-1),
});

// define your typescript interface here
interface IEthUpskill1 extends z.infer<typeof ethUpskill1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IEthUpskill1, any>>[] = [
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
  {
    field: "cadre",
    headerName: "CHW Cadre",
    minWidth: 150,
  },
  // {
  //   field: "number_completing_irt_course",
  //   headerName: "No. Completing IRT Course",
  //   minWidth: 170,
  // },
  createNumericColumn<IEthUpskill1>(
    "number_completing_irt_course",
    "No. Completing IRT Course",
    170
  ),
  // {
  //   field: "number_completing_irt_course_cumulative",
  //   headerName: "No. Completing IRT Course (cumulative)",
  //   minWidth: 170,
  // },
  createNumericColumn<IEthUpskill1>(
    "number_completing_irt_course_cumulative",
    "No. Completing IRT Course (Cumulative)",
    170
  ),
];

// generate all column names now
const ethUpskill1_columns: ColDef<IEthUpskill1, any>[] =
  generateDefaultColumns<IEthUpskill1>(ethUpskill1_schema, customColumns);

export { ethUpskill1_columns, ethUpskill1_schema };
export type { IEthUpskill1 };
