import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const ethCrossCutting1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  chw_cadre: z.enum(["HEW", "HEW Supervisor", "Other FHW"]),
  gender: z.enum(["Female", "Male", "Missing/Other"]),
  number_supported: z.number().gt(-1),
  number_supported_cumulative: z.number().gt(-1),
});

// define your typescript interface here
interface IEthCrossCutting1 extends z.infer<typeof ethCrossCutting1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IEthCrossCutting1, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 120 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "chw_cadre", headerName: "CHW Cadre", minWidth: 120 },
  { field: "gender", minWidth: 150 },
  // {
  //   field: "number_supported",
  //   headerName: "Number Supported",
  //   minWidth: 150,
  // },
  createNumericColumn<IEthCrossCutting1>(
    "number_supported",
    "Number Supported",
    160
  ),
  // {
  //   field: "number_supported_cumulative",
  //   headerName: "No. Supported Cumulative",
  //   minWidth: 150,
  // },
  createNumericColumn<IEthCrossCutting1>(
    "number_supported_cumulative",
    "Number Supported (Cumulative)",
    170
  ),
];

// generate all column names now
const ethCrossCutting1_columns: ColDef<IEthCrossCutting1, any>[] =
  generateDefaultColumns<IEthCrossCutting1>(
    ethCrossCutting1_schema,
    customColumns
  );

export { ethCrossCutting1_columns, ethCrossCutting1_schema };
export type { IEthCrossCutting1 };
