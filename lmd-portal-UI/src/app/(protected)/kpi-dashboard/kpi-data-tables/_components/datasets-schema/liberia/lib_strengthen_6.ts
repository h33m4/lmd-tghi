import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

// define your schema here
const libStrengthen6_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  county_type: z.enum(["Non LMH-managed", "LMH-managed"]),
  treatment_type: z.enum(["Malaria", "Diarrhea", "ARI"]),
  number_of_treatments: z.number().gte(0),
  number_of_treatments_cummulative: z.number().gte(0),
});

interface ILibStrengthen6 extends z.infer<typeof libStrengthen6_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibStrengthen6, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "county_type",
    headerName: "County Type",
    minWidth: 160,
  },
  { field: "treatment_type", minWidth: 130 },
  {
    field: "number_of_treatments",
    minWidth: 130,
    valueFormatter: (params) => parseAndFormatNumber(params.value),
  },
  createNumericColumn<ILibStrengthen6>(
    "number_of_treatments",
    "No. of Treatments",
    130
  ),
  {
    field: "number_of_treatments_cummulative",
    minWidth: 140,
    valueFormatter: (params) => parseAndFormatNumber(params.value),
  },
  createNumericColumn<ILibStrengthen6>(
    "number_of_treatments_cummulative",
    "No. of Treatments (Cumulative)",
    140
  ),
];

// generate all column names now
const libStrengthen6_columns: ColDef<ILibStrengthen6, any>[] =
  generateDefaultColumns<ILibStrengthen6>(libStrengthen6_schema, customColumns);

export { libStrengthen6_schema, libStrengthen6_columns };
export type { ILibStrengthen6 };
