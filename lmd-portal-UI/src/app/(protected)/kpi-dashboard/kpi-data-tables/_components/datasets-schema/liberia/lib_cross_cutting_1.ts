import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";
import { ColDef } from "ag-grid-community";
import { z } from "zod";

const libCrossCutting1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  chw_cadre: z.enum(["CHA", "CHSS", "CHP", "N/A"]),
  gender: z.enum(["Female", "Male"]),
  county_type: z.enum(["Non LMH-managed", "LMH-managed"]),
  number_supported: z.number().gt(-1),
});

// define your typescript interface here
interface ILibCrossCutting1 extends z.infer<typeof libCrossCutting1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibCrossCutting1, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "chw_cadre", headerName: "CHW Cadre", minWidth: 100 },
  { field: "gender", minWidth: 100 },
  // {
  //   field: "number_supported",
  //   headerName: "Number Supported",
  //   valueFormatter: (params) => parseAndFormatNumber(params.value),
  //   minWidth: 200,
  // },
  createNumericColumn<ILibCrossCutting1>(
    "number_supported",
    "Number Supported",
    200
  ),

  {
    field: "county_type",
    headerName: "County Type",
    minWidth: 160,
    // cellRenderer: (params: { value: string }) => {
    //   return `<span style="color: ${
    //     params.value === "LMH-managed" ? "green" : "red"
    //   }">${params.value}</span>`;
    // },
  },
];

// generate all column names now
const libCrossCutting1_columns: ColDef<ILibCrossCutting1, any>[] =
  generateDefaultColumns<ILibCrossCutting1>(
    libCrossCutting1_schema,
    customColumns
  );

export { libCrossCutting1_columns, libCrossCutting1_schema };
export type { ILibCrossCutting1 };
