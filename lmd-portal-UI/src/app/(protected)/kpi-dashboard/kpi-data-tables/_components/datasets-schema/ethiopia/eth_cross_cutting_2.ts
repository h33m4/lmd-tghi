import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const ethCrossCutting2_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  population_served: z.number().gt(-1),
  population_served_cumulative: z.number().gt(-1),
});

// define your typescript interface here
interface IEthCrossCutting2 extends z.infer<typeof ethCrossCutting2_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IEthCrossCutting2, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 110 },
  {
    field: "population_served",
    headerName: "Population Served",
    // valueFormatter: (params) => {
    //   const formatter = new Intl.NumberFormat("en-US");
    //   return formatter.format(params.value);
    // },
    minWidth: 160,
  },
  createNumericColumn<IEthCrossCutting2>(
    "population_served",
    "No. of Population Served",
    160
  ),
  // {
  //   field: "population_served_cumulative",
  //   headerName: "Population Served Cumulative",
  //   // valueFormatter: (params) => {
  //   //   const formatter = new Intl.NumberFormat("en-US");
  //   //   return formatter.format(params.value);
  //   // },
  //   minWidth: 160,
  // },
  createNumericColumn<IEthCrossCutting2>(
    "population_served_cumulative",
    "No. of Population Served (Cumulative)",
    160
  ),
];

// generate all column names now
const ethCrossCutting2_columns: ColDef<IEthCrossCutting2, any>[] =
  generateDefaultColumns<IEthCrossCutting2>(
    ethCrossCutting2_schema,
    customColumns
  );

export { ethCrossCutting2_columns, ethCrossCutting2_schema };
export type { IEthCrossCutting2 };
