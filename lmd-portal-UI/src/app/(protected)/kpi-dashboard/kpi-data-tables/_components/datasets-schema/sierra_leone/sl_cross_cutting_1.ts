import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const slCrossCutting1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  chw_cadre: z.enum(["CHW", "Peer Supervisor", "Other FHW"]),
  gender: z.enum(["Female", "Male", "Unknown"]),
  // type_of_support: z.enum(["COVID-19 Training", "Supervision"]),
  number_supported: z.number().gt(-1),
  number_supported_cumulative: z.number().gt(-1),
  annual_quarterly: z.enum(["Annual", "Quarterly"]),
});

// define your typescript interface here
interface ISlCrossCutting1 extends z.infer<typeof slCrossCutting1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ISlCrossCutting1, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  // {
  //   field: "number_supported",
  //   headerName: "No. Supported",
  //   minWidth: 170,
  // },
  // {
  //   field: "number_supported_cumulative",
  //   headerName: "No. Supported (Cumulative)",
  //   minWidth: 170,
  // },
  createNumericColumn<ISlCrossCutting1>(
    "number_supported",
    "Number Supported",
    170
  ),
  createNumericColumn<ISlCrossCutting1>(
    "number_supported_cumulative",
    "Number Supported (Cumulative)",
    170
  ),
  {
    field: "annual_quarterly",
    headerName: "Annual / Quarterly",
    minWidth: 120,
  },
  { field: "chw_cadre", headerName: "CHW Cadre", minWidth: 150 },
  { field: "gender", minWidth: 130 },
];

// generate all column names now
const slCrossCutting1_columns: ColDef<ISlCrossCutting1, any>[] =
  generateDefaultColumns<ISlCrossCutting1>(
    slCrossCutting1_schema,
    customColumns
  );

export { slCrossCutting1_columns, slCrossCutting1_schema };
export type { ISlCrossCutting1 };
