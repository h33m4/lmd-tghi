import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const ethUpskill3_4_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  // module: z.enum(["RMNCH", "NCD", "MCD"]),
  number_taking_knowledge_assessment: z.number().gt(-1),
  number_passing_knowledge_assessment: z.number().gt(-1),
  number_taking_skills_assessment: z.number().gt(-1),
  number_passing_skills_assessment: z.number().gt(-1),
});

// define your typescript interface here
interface IEthUpskill3_4 extends z.infer<typeof ethUpskill3_4_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IEthUpskill3_4, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  // { field: "module", minWidth: 150 },
  createNumericColumn<IEthUpskill3_4>(
    "number_taking_knowledge_assessment",
    "No. Taking Knowledge Assessment",
    200
  ),
  createNumericColumn<IEthUpskill3_4>(
    "number_passing_knowledge_assessment",
    "No. Passing Knowledge Assessment",
    200
  ),
  createNumericColumn<IEthUpskill3_4>(
    "number_taking_skills_assessment",
    "No. Taking Skills Assessment",
    200
  ),
  createNumericColumn<IEthUpskill3_4>(
    "number_passing_skills_assessment",
    "No. Passing Skills Assessment",
    200
  ),
  {
    field: "number_taking_knowledge_assessment",
    headerName: "No. Taking Knowledge Assessment",
    minWidth: 200,
  },
  {
    field: "number_passing_knowledge_assessment",
    headerName: "No. Passing Knowledge Assessment",
    minWidth: 200,
  },
  {
    field: "number_taking_skills_assessment",
    headerName: "No. Taking Skills Assessment",
    minWidth: 200,
  },
  {
    field: "number_passing_skills_assessment",
    headerName: "No. Passing Skills Assessment",
    minWidth: 200,
  },
];

// generate all column names now
const ethUpskill3_4_columns: ColDef<IEthUpskill3_4, any>[] =
  generateDefaultColumns<IEthUpskill3_4>(ethUpskill3_4_schema, customColumns);

export { ethUpskill3_4_columns, ethUpskill3_4_schema };
export type { IEthUpskill3_4 };
