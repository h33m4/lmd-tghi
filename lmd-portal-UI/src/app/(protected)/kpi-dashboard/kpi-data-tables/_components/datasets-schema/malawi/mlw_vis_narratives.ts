import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

// define schema
const mlwVisNarratives_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  kpi_name: z.string().min(2),
  narrative_long: z.string().min(2).describe("textarea"),
  narrative_short: z.string().min(2).describe("textarea"),
  note_1: z.string().nullable().optional().describe("textarea"),
  note_2: z.string().nullable().optional().describe("textarea"),
  variance_status: z.enum([
    "N/A",
    "Achieved",
    "On track",
    "Slightly off track",
    "Very off track",
  ]),
});

interface IMlwVisNarratives extends z.infer<typeof mlwVisNarratives_schema> {}

const customColumns: Partial<ColDef<IMlwVisNarratives, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  {
    field: "kpi_name",
    headerName: "KPI Name",
    minWidth: 100,
  },
  {
    field: "narrative_long",
    headerName: "Narrative (Long)",
    minWidth: 500,
  },
  {
    field: "narrative_short",
    headerName: "Narrative (Short)",
    minWidth: 200,
  },
  {
    field: "note_1",
    headerName: "Optional Note 1",
    minWidth: 250,
  },
  {
    field: "note_2",
    headerName: "Optional Note 2",
    minWidth: 250,
  },
  {
    field: "variance_status",
    minWidth: 250,
  },
];

const mlwVisNarratives_columns: ColDef<IMlwVisNarratives, any>[] =
  generateDefaultColumns<IMlwVisNarratives>(
    mlwVisNarratives_schema,
    customColumns
  );

export { mlwVisNarratives_columns, mlwVisNarratives_schema };
export type { IMlwVisNarratives };
