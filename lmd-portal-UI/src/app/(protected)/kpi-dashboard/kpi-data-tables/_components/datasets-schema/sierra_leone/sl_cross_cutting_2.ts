import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const slCrossCutting2_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  population_served: z.number().gt(-1),
  population_served_cumulative: z.number().gt(-1),
});

// define your typescript interface here
interface ISlCrossCutting2 extends z.infer<typeof slCrossCutting2_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ISlCrossCutting2, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "population_served",
    headerName: "Population Served",
    minWidth: 150,
  },
  createNumericColumn<ISlCrossCutting2>(
    "population_served",
    "Population Served",
    150
  ),
  // {
  //   field: "population_served_cumulative",
  //   headerName: "Population Served (Cumulative)",
  //   minWidth: 150,
  // },
  createNumericColumn<ISlCrossCutting2>(
    "population_served_cumulative",
    "Population Served (Cumulative)",
    150
  ),
];

// generate all column names now
const slCrossCutting2_columns: ColDef<ISlCrossCutting2, any>[] =
  generateDefaultColumns<ISlCrossCutting2>(
    slCrossCutting2_schema,
    customColumns
  );

export { slCrossCutting2_columns, slCrossCutting2_schema };
export type { ISlCrossCutting2 };
