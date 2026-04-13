import {
  createNumericColumn,
  generateDefaultColumns,
  parseAndFormatNumber,
} from "@/utils/table-helpers";
import { ColDef } from "ag-grid-community";
import { z } from "zod";

const libDeliver123_schema = z.object({
  period_start_date: z.coerce.date(),
  fy_q: z.string().min(2),
  county: z.enum(["Rivercess", "Grand Bassa"]),
  disease_type: z.enum(["Malaria", "Diarrhea", "Pneumonia"]),
  number_treatments_u5_lmh_counties: z.number().gt(-1),
});

interface ILibDeliver123 extends z.infer<typeof libDeliver123_schema> {}

// define any custom columns here
const customColumns: Partial<ColDef<ILibDeliver123, any>>[] = [
  { field: "fy_q", headerName: "FY_Q", minWidth: 100 },
  {
    field: "period_start_date",
    headerName: "Period Start Date",
    minWidth: 120,
  },
  { field: "county", minWidth: 150 },
  { field: "disease_type", minWidth: 150 },
  // {
  //   field: "number_treatments_u5_lmh_counties",
  //   headerName: "No. of Treatments under 5 in LMH Counties",
  //   minWidth: 210,
  //   valueFormatter: (params) => parseAndFormatNumber(params.value),
  // },
  createNumericColumn<ILibDeliver123>(
    "number_treatments_u5_lmh_counties",
    "No. of Treatments under 5 in LMH Counties",
    210
  ),
];

const libDeliver123_columns: ColDef<ILibDeliver123, any>[] =
  generateDefaultColumns<ILibDeliver123>(libDeliver123_schema, customColumns);

export { libDeliver123_schema, libDeliver123_columns };
export type { ILibDeliver123 };
