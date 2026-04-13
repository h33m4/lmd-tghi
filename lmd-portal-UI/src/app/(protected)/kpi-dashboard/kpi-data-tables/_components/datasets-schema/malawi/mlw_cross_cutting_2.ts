import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const mlwCrossCutting2_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  population_served: z.number().gt(-1),
  cumulative_population_served: z.number().gt(-1),
});

// define your typescript interface here
interface IMlwCrossCutting2 extends z.infer<typeof mlwCrossCutting2_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IMlwCrossCutting2, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  // {
  //   field: "population_served",
  //   headerName: "Population Served",
  //   minWidth: 140,
  // },
  createNumericColumn<IMlwCrossCutting2>(
    "population_served",
    "Population Served",
    150
  ),
  // {
  //   field: "cumulative_population_served",
  //   headerName: "Cumulative Population Served",
  //   minWidth: 180,
  // },
  createNumericColumn<IMlwCrossCutting2>(
    "cumulative_population_served",
    "Population Served (Cumulative)",
    150
  ),
];

// generate all column names now
const mlwCrossCutting2_columns: ColDef<IMlwCrossCutting2, any>[] =
  generateDefaultColumns<IMlwCrossCutting2>(
    mlwCrossCutting2_schema,
    customColumns
  );

export { mlwCrossCutting2_columns, mlwCrossCutting2_schema };
export type { IMlwCrossCutting2 };
