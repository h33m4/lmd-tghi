import { ColDef } from "ag-grid-community";
import { z } from "zod";
import { generateDefaultColumns } from "@/utils/table-helpers";

// define your schema here
const mlwUpskill123_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  chw_completing_full_training_hbp: z.number().gt(-1),
  chw_assessed_on_hbp_skills: z.number().gt(-1),
  chw_assessed_on_hbp_knowledge: z.number().gt(-1),
  chw_passing_skills_assessment: z.number().gt(-1),
  chw_passing_knowledge_assessment: z.number().gt(-1),
});

// define your typescript interface here
interface IMlwUpskill123 extends z.infer<typeof mlwUpskill123_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IMlwUpskill123, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "chw_completing_full_training_hbp",
    headerName: "No. CHW Completing Full Training in HBP",
    // valueFormatter: (params) => {
    //   const formatter = new Intl.NumberFormat("en-US");
    //   return formatter.format(params.value);
    // },
    minWidth: 200,
  },
  {
    field: "chw_assessed_on_hbp_skills",
    headerName: "No. CHW Assessed on HBP Skills",
    // valueFormatter: (params) => {
    //   const formatter = new Intl.NumberFormat("en-US");
    //   return formatter.format(params.value);
    // },
    minWidth: 150,
  },
  {
    field: "chw_assessed_on_hbp_knowledge",
    headerName: "No. CHW Assessed on HBP Knowledge",
    // valueFormatter: (params) => {
    //   const formatter = new Intl.NumberFormat("en-US");
    //   return formatter.format(params.value);
    // },
    minWidth: 150,
  },
  {
    field: "chw_passing_knowledge_assessment",
    headerName: "No. of CHW Passing Knowledge Assessment",
    // valueFormatter: (params) => {
    //   const formatter = new Intl.NumberFormat("en-US");
    //   return formatter.format(params.value);
    // },
    minWidth: 170,
  },
  {
    field: "chw_passing_skills_assessment",
    headerName: "No. CHW Passing Skills Assessment",
    // valueFormatter: (params) => {
    //   const formatter = new Intl.NumberFormat("en-US");
    //   return formatter.format(params.value);
    // },
    minWidth: 150,
  },
];

// generate all column names now
const mlwUpskill123_columns: ColDef<IMlwUpskill123, any>[] =
  generateDefaultColumns<IMlwUpskill123>(mlwUpskill123_schema, customColumns);

export { mlwUpskill123_columns, mlwUpskill123_schema };
export type { IMlwUpskill123 };
