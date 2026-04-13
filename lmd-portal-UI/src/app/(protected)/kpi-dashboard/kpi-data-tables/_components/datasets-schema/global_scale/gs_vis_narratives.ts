import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";
import { ColDef } from "ag-grid-community";
import { z } from "zod";

const gsVisNarratives_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  kpi_name: z.enum(["c1", "c2", "c3", "c4"]),
  variance_status: z.enum([
    "N/A",
    "Achieved",
    "On track",
    "Slightly off track",
    "Very off track",
  ]),
  variance_narrative: z.string().min(2).describe("textarea"),
  data_viz_narrative: z.string().min(2).describe("textarea"),
  note_1: z.string().nullable().optional().describe("textarea"),
  note_2: z.string().nullable().optional().describe("textarea"),
});

interface IGsVisNarratives extends z.infer<typeof gsVisNarratives_schema> {}

const customColumns: Partial<ColDef<IGsVisNarratives, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "kpi_name",
    headerName: "KPI Name",
    minWidth: 180,
  },
  {
    field: "variance_status",
    headerName: "Variance Status",
    minWidth: 180,
  },
  {
    field: "variance_narrative",
    headerName: "Variance Narrative",
    minWidth: 420,
  },
  {
    field: "data_viz_narrative",
    headerName: "Data Visualization Narrative",
    minWidth: 400,
  },
  {
    field: "note_1",
    headerName: "Optional Note 1",
    minWidth: 300,
  },
  {
    field: "note_2",
    headerName: "Optional Note 2",
    minWidth: 300,
  },
];

const gsVisNarratives_columns: ColDef<IGsVisNarratives, any>[] =
  generateDefaultColumns<IGsVisNarratives>(
    gsVisNarratives_schema,
    customColumns,
  );

export { gsVisNarratives_columns, gsVisNarratives_schema };
export type { IGsVisNarratives };
