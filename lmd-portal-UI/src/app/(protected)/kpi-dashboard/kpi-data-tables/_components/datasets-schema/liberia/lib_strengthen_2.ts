import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

// define your schema here
const libStrengthen2_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  county_type: z.enum(["Non LMH-managed", "LMH-managed", "N/A"]),
  number_cha_assessed: z.number().gt(-1),
  correct_and_on_time_payment: z.number().gt(-1),
  supervision_visits: z.number().gt(-1),
  all_life_saving_commodities_in_stock: z.number().gt(-1),
});

interface ILibStrengthen2 extends z.infer<typeof libStrengthen2_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibStrengthen2, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "county_type",
    headerName: "County Type",
    minWidth: 180,
  },
  // {
  //   field: "number_cha_assessed",
  //   headerName: "No. CHA Assessed",
  //   minWidth: 120,
  // },
  createNumericColumn<ILibStrengthen2>(
    "number_cha_assessed",
    "No. CHA Assessed",
    120,
  ),
  // {
  //   field: "correct_and_on_time_payment",
  //   headerName: "Correct & on time Payment",
  //   minWidth: 130,
  // },
  createNumericColumn<ILibStrengthen2>(
    "correct_and_on_time_payment",
    "Correct & on time Payment",
    150,
  ),
  // {
  //   field: "supervision_visits",
  //   headerName: "No. Supervision Visits",
  //   minWidth: 150,
  // },
  createNumericColumn<ILibStrengthen2>(
    "supervision_visits",
    "No. Supervision Visits",
    180,
  ),
  // {
  //   field: "all_life_saving_commodities_in_stock",
  //   // headerName: "No. CHA Assessed",
  //   minWidth: 160,
  // },
  createNumericColumn<ILibStrengthen2>(
    "all_life_saving_commodities_in_stock",
    "All Life Saving Commodities in Stock",
    200,
  ),
];

// generate all column names now
const libStrengthen2_columns: ColDef<ILibStrengthen2, any>[] =
  generateDefaultColumns<ILibStrengthen2>(libStrengthen2_schema, customColumns);

export { libStrengthen2_schema, libStrengthen2_columns };
export type { ILibStrengthen2 };
