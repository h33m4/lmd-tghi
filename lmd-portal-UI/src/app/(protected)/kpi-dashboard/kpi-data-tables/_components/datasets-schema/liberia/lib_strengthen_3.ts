import { ColDef } from "ag-grid-community";
import { z } from "zod";
import { generateDefaultColumns } from "@/utils/table-helpers";

// define your schema here
const libStrengthen3_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  country: z.enum(["Liberia"]),
  county: z.enum([
    "Bomi",
    "Bong",
    "Gbarpolu",
    "Grand Bassa",
    "Grand Cape Mount",
    "Grand Gedeh",
    "Grand Kru",
    "Lofa",
    "Margibi",
    "Maryland",
    "Montserrado",
    "Nimba",
    "River Cess",
    "River Gee",
    "Sinoe",
  ]),
  county_type: z.enum(["Non LMH-managed", "LMH-managed"]),
  funding_secured: z.enum(["Yes", "No"]),
});

interface ILibStrengthen3 extends z.infer<typeof libStrengthen3_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibStrengthen3, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "country", minWidth: 110 },
  {
    field: "county_type",
    headerName: "County Type",
    minWidth: 170,
  },
  {
    field: "county",
    headerName: "County",
    minWidth: 180,
  },
  { field: "funding_secured", minWidth: 150 },
];

// generate all column names now
const libStrengthen3_columns: ColDef<ILibStrengthen3, any>[] =
  generateDefaultColumns<ILibStrengthen3>(libStrengthen3_schema, customColumns);

export { libStrengthen3_schema, libStrengthen3_columns };
export type { ILibStrengthen3 };
