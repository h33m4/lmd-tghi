import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";
import { ColDef } from "ag-grid-community";
import { z } from "zod";

const gsCrossCutting3_schema = z.object({
  period_start_date: z.coerce.date(),
  period_end_date: z.coerce.date(),
  fy_q: z.string().min(2),
  country: z.enum(["Ethiopia", "Liberia", "Malawi", "Sierra Leone"]),
  number_women_improved_fp_access_cumctd: z.number().gt(-1),
});

interface IGsCrossCutting3 extends z.infer<typeof gsCrossCutting3_schema> {}

const customColumns: Partial<ColDef<IGsCrossCutting3, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "period_end_date",
    headerName: "Period End Date",
    minWidth: 120,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "country",
    minWidth: 150,
  },
  createNumericColumn<IGsCrossCutting3>(
    "number_women_improved_fp_access_cumctd",
    "Number of Women with Improved Family Access (Cummulative - CTD)",
    300,
  ),
];

const gsCrossCutting3_columns: ColDef<IGsCrossCutting3, any>[] =
  generateDefaultColumns<IGsCrossCutting3>(
    gsCrossCutting3_schema,
    customColumns,
  );

export { gsCrossCutting3_columns, gsCrossCutting3_schema };
export type { IGsCrossCutting3 };
