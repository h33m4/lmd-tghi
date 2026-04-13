import { ColDef } from "ag-grid-community";
import { z } from "zod";
import { generateDefaultColumns } from "@/utils/table-helpers";

// define your schema here
const slUpskill1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  chw_cadre: z.enum(["CHW", "Other FHW"]),
  gender: z.enum(["Female", "Male", "Unknown"]),
  number_chw_completing_a_full_training: z.number().gt(-1),
  number_chw_assessed: z.number().gt(-1),
  number_chw_passing_skills_assessment: z.number().gt(-1),
  number_chw_passing_knowledge_assessment: z.number().gt(-1),
});

// define your typescript interface here
interface ISlUpskill1 extends z.infer<typeof slUpskill1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ISlUpskill1, any>>[] = [
  { field: "fy_q", headerName: "FY_Q" },
  { field: "chw_cadre", headerName: "CHW Cadre" },
];

// generate all column names now
const slUpskill1_columns: ColDef<ISlUpskill1, any>[] =
  generateDefaultColumns<ISlUpskill1>(slUpskill1_schema, customColumns);

export { slUpskill1_columns, slUpskill1_schema };
export type { ISlUpskill1 };
