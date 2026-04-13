import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const mlwStrengthen5_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  district_support: z.enum(["LMH", "non-LMH"]),
  // county: z.enum(["Rivercess", "Grand Bassa", "Grand Gedeh"]),
  sick_child_cases_entered_ichis_imci: z.number().gt(-1),
});

// define your typescript interface here
interface IMlwStrengthen5 extends z.infer<typeof mlwStrengthen5_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IMlwStrengthen5, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  { field: "district_support", minWidth: 180 },

  createNumericColumn<IMlwStrengthen5>(
    "sick_child_cases_entered_ichis_imci",
    "No. Sick Child Cases Entered into ICHIS IMCI",
    200,
  ),
];

// generate all column names now
const mlwStrengthen5_columns: ColDef<IMlwStrengthen5, any>[] =
  generateDefaultColumns<IMlwStrengthen5>(mlwStrengthen5_schema, customColumns);

export { mlwStrengthen5_columns, mlwStrengthen5_schema };
export type { IMlwStrengthen5 };
