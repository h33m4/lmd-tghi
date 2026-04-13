import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const mlwStrengthen2_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  chw_cadre: z.enum(["SHSA", "HSA", "N/A"]),
  gender: z.enum(["Female", "Male", "Unknown"]),
  organization_responsible: z.enum(["LMH", "Partner"]),
  number_ichis_trained_and_one_module_given: z.number().gt(-1),
  cumulative_number_ichis_trained_and_one_module_given: z.number().gt(-1),
});

// define your typescript interface here
interface IMlwStrengthen2 extends z.infer<typeof mlwStrengthen2_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IMlwStrengthen2, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "chw_cadre",
    headerName: "CHW Cadre",
    minWidth: 100,
  },
  { field: "gender", minWidth: 100 },
  { field: "organization_responsible", minWidth: 160 },
  // {
  //   field: "number_ichis_trained_and_one_module_given",
  //   headerName: "No. ICHIS Trained and one Module Given",
  //   minWidth: 200,
  // },
  createNumericColumn<IMlwStrengthen2>(
    "number_ichis_trained_and_one_module_given",
    "No. of ICHIS Trained and One Module Given",
    200
  ),
  // {
  //   field: "cumulative_number_ichis_trained_and_one_module_given",
  //   headerName: "Cumulative Number ICHIS Trained and one Module Given",
  //   minWidth: 200,
  // },
  createNumericColumn<IMlwStrengthen2>(
    "cumulative_number_ichis_trained_and_one_module_given",
    "No. of ICHIS Trained and One Module Given (Cumulative)",
    200
  ),
];

// generate all column names now
const mlwStrengthen2_columns: ColDef<IMlwStrengthen2, any>[] =
  generateDefaultColumns<IMlwStrengthen2>(mlwStrengthen2_schema, customColumns);

export { mlwStrengthen2_columns, mlwStrengthen2_schema };
export type { IMlwStrengthen2 };
