import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";
import { ColDef } from "ag-grid-community";
import { z } from "zod";

const gsCrossCutting4_schema = z.object({
  period_start_date: z.coerce.date(),
  period_end_date: z.coerce.date(),
  fy_q: z.string().min(2),
  toc_pillar: z.enum(["Strengthen", "Deliver", "Upskill"]),
  country: z.enum(["Ethiopia", "Liberia", "Malawi", "Sierra Leone"]),
  u5_lives_saved_ann: z.number().gt(-1),
  u5_lives_saved_cumctd: z.number().gt(-1),
});

interface IGsCrossCutting4 extends z.infer<typeof gsCrossCutting4_schema> {}

const customColumns: Partial<ColDef<IGsCrossCutting4, any>>[] = [
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 150,
  },
  {
    field: "period_end_date",
    headerName: "Period End Date",
    minWidth: 150,
  },
  { field: "fy_q", headerName: "FY_Q", minWidth: 120 },
  { field: "toc_pillar", headerName: "TOC Pillar", minWidth: 200 },
  {
    field: "country",
    minWidth: 150,
  },
  createNumericColumn<IGsCrossCutting4>(
    "u5_lives_saved_ann",
    "Number of U5 Lives Saved Annual",
    200,
  ),
  createNumericColumn<IGsCrossCutting4>(
    "u5_lives_saved_cumctd",
    "Number of U5 Lives Saved Cummulative - CTD",
    300,
  ),
];

const gsCrossCutting4_columns: ColDef<IGsCrossCutting4, any>[] =
  generateDefaultColumns<IGsCrossCutting4>(
    gsCrossCutting4_schema,
    customColumns,
  );

export { gsCrossCutting4_columns, gsCrossCutting4_schema };
export type { IGsCrossCutting4 };
