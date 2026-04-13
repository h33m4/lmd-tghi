import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

// define your schema here
const libCrossCutting2_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  county_type: z.enum(["Non LMH-managed", "LMH-managed"]),
  population_served: z.number().gt(-1),
});

// define your typescript interface here
interface ILibCrossCutting2 extends z.infer<typeof libCrossCutting2_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibCrossCutting2, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  // {
  //   field: "population_served",
  //   headerName: "Population Served",
  //   maxWidth: 180,
  //   valueFormatter: (params) => parseAndFormatNumber(params.value),
  // },
  createNumericColumn<ILibCrossCutting2>(
    "population_served",
    "Population Served",
    180
  ),
  {
    field: "county_type",
    headerName: "County Type",
    minWidth: 180,
    // cellRenderer: (params: { value: string }) => {
    //   return `<span style="color: ${
    //     params.value === "LMH-managed" ? "green" : "red"
    //   }">${params.value}</span>`;
    // },
  },
];

// generate all column names now
const libCrossCutting2_columns: ColDef<ILibCrossCutting2, any>[] =
  generateDefaultColumns<ILibCrossCutting2>(
    libCrossCutting2_schema,
    customColumns
  );

export { libCrossCutting2_columns, libCrossCutting2_schema };
export type { ILibCrossCutting2 };
