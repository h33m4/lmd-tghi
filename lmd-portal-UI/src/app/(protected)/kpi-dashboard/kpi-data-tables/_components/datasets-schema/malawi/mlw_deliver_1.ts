import { ColDef } from "ag-grid-community";
import { z } from "zod";
import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";

// define your schema here
const mlwDeliver1_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  emergency_type: z.enum(["maternal", "neonatal"]),
  emergency_transports_provided: z.number().gt(-1),
});

interface IMlwDeliver1 extends z.infer<typeof mlwDeliver1_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<IMlwDeliver1, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },

  { field: "emergency_type", minWidth: 120 },

  createNumericColumn<IMlwDeliver1>(
    "emergency_transports_provided",
    "No. Emergency Transports Provided",
    200,
  ),
];

// generate all column names now
const mlwDeliver1_columns: ColDef<IMlwDeliver1, any>[] =
  generateDefaultColumns<IMlwDeliver1>(mlwDeliver1_schema, customColumns);

export { mlwDeliver1_schema, mlwDeliver1_columns };
export type { IMlwDeliver1 };
