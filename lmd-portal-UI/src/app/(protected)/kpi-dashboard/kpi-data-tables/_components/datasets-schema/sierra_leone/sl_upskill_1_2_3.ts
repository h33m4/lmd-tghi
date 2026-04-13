import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const slUpskill123_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  chw_cadre: z.enum(["CHW", "PS", "Other"]),
  gender: z.enum(["Female", "Male", "Unknown"]),
  number_chw_completing_a_full_training: z.number().gt(-1),
  number_chw_assessed_skills: z.number().gt(-1),
  number_chw_passing_skills_assessment: z.number().gt(-1),
  number_chw_assessed_knowledge: z.number().gt(-1),
  number_chw_passing_knowledge_assessment: z.number().gt(-1),
});

// define your typescript interface here
interface ISlUpskill123 extends z.infer<typeof slUpskill123_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ISlUpskill123, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "chw_cadre", headerName: "CHW Cadre", minWidth: 150 },
  { field: "gender", minWidth: 150 },
  {
    field: "number_chw_completing_a_full_training",
    headerName: "No. CHW Completing A Full Training",
    minWidth: 180,
  },
  createNumericColumn<ISlUpskill123>(
    "number_chw_completing_a_full_training",
    "No. of CHW Completing A Full Training",
    200
  ),
  {
    field: "number_chw_assessed_skills",
    headerName: "No. CHW Assessed Skills",
    minWidth: 180,
  },
  createNumericColumn<ISlUpskill123>(
    "number_chw_assessed_skills",
    "No. of CHW Assessed Skills",
    200
  ),
  {
    field: "number_chw_assessed_knowledge",
    headerName: "No. CHW Assessed Knowledge",
    minWidth: 180,
  },
  createNumericColumn<ISlUpskill123>(
    "number_chw_assessed_knowledge",
    "No. of CHW Assessed Knowledge",
    200
  ),
  {
    field: "number_chw_passing_knowledge_assessment",
    headerName: "No. CHW Passing Knowledge Assessment",
    minWidth: 180,
  },
  createNumericColumn<ISlUpskill123>(
    "number_chw_passing_knowledge_assessment",
    "No. of CHW Passing Knowledge Assessment",
    200
  ),
  {
    field: "number_chw_passing_skills_assessment",
    headerName: "No. CHW Passing Skills Assessment",
    minWidth: 180,
  },
  createNumericColumn<ISlUpskill123>(
    "number_chw_passing_skills_assessment",
    "No. of CHW Passing Skills Assessment",
    200
  ),
];

// generate all column names now
const slUpskill123_columns: ColDef<ISlUpskill123, any>[] =
  generateDefaultColumns<ISlUpskill123>(slUpskill123_schema, customColumns);

export { slUpskill123_columns, slUpskill123_schema };
export type { ISlUpskill123 };
