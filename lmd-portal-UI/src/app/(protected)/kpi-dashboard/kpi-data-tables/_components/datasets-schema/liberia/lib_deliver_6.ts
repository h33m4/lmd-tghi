import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

// define your schema here
const libDeliver6_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  // county: z.enum(["Rivercess", "Grand Bassa", "Grand Gedeh"]),
  district: z.string(),
  lmhmanaged_chss: z.number().gt(-1),
  lmhmanaged_chss_submitting_digiting_report_previous_month: z.number().gt(-1),
});

interface ILibDeliver6 extends z.infer<typeof libDeliver6_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibDeliver6, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },

  {
    field: "district",
    headerName: "District",
    minWidth: 100,
  },

  createNumericColumn<ILibDeliver6>(
    "lmhmanaged_chss",
    "No. of Active LMH Managed CHSS",
    200,
  ),

  createNumericColumn<ILibDeliver6>(
    "lmhmanaged_chss_submitting_digiting_report_previous_month",
    "No. LMH Managed CHSSs Submitting Report Previous Month",
    300,
  ),
];

// generate all column names now
const libDeliver6_columns: ColDef<ILibDeliver6, any>[] =
  generateDefaultColumns<ILibDeliver6>(libDeliver6_schema, customColumns);

export { libDeliver6_schema, libDeliver6_columns };
export type { ILibDeliver6 };
