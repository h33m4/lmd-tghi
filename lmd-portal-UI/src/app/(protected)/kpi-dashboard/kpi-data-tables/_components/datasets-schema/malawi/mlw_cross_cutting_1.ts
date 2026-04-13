import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
} from "@/utils/table-helpers";

// define your schema here
const mlwCrossCutting1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  chw_cadre: z.enum(["CHA", "CHSS", "N/A"]),
  gender: z.enum(["Female", "Male", "Unknown"]),
  number_supported: z.number().gt(-1),
  cumulative_number_supported: z.number().gt(-1),
});

// define your typescript interface here
interface IMlwCrossCutting1 extends z.infer<typeof mlwCrossCutting1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IMlwCrossCutting1, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "gender",
    headerName: "Gender",
    minWidth: 100,
  },
  {
    field: "chw_cadre",
    headerName: "CHW Cadre",
    minWidth: 120,
  },
  // {
  //   field: "number_supported",
  //   headerName: "Number Supported",
  //   minWidth: 150,
  // },
  createNumericColumn<IMlwCrossCutting1>(
    "number_supported",
    "Number Supported",
    150
  ),
  // {
  //   field: "cumulative_number_supported",
  //   headerName: "Cumulative Number Supported",
  //   minWidth: 200,
  // },
  createNumericColumn<IMlwCrossCutting1>(
    "cumulative_number_supported",
    "Number Supported (Cumulative)",
    200
  ),
];

// generate all column names now
const mlwCrossCutting1_columns: ColDef<IMlwCrossCutting1, any>[] =
  generateDefaultColumns<IMlwCrossCutting1>(
    mlwCrossCutting1_schema,
    customColumns
  );

export { mlwCrossCutting1_columns, mlwCrossCutting1_schema };
export type { IMlwCrossCutting1 };
