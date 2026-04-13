import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const mlwStrengthen6_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  district_support: z.enum(["LMH", "non-LMH"]),
  new_reg_cbmnc_ichis_pregwomen: z.number().gt(-1),
  new_reg_cbmnc_ichis_neonates: z.number().gt(-1),
});

// define your typescript interface here
interface IMlwStrengthen6 extends z.infer<typeof mlwStrengthen6_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IMlwStrengthen6, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  { field: "district_support", minWidth: 180 },

  createNumericColumn<IMlwStrengthen6>(
    "new_reg_cbmnc_ichis_pregwomen",
    "No. Pregnant Womem Registered in ICHIS",
    250,
  ),

  createNumericColumn<IMlwStrengthen6>(
    "new_reg_cbmnc_ichis_neonates",
    "No. Neonatal Cases Registered in ICHIS",
    250,
  ),
];

// generate all column names now
const mlwStrengthen6_columns: ColDef<IMlwStrengthen6, any>[] =
  generateDefaultColumns<IMlwStrengthen6>(mlwStrengthen6_schema, customColumns);

export { mlwStrengthen6_columns, mlwStrengthen6_schema };
export type { IMlwStrengthen6 };
