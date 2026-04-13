import { ColDef } from "ag-grid-community";

export interface IKPIChangeLog {
  id: number;
  country: string;
  tocpillar: string;
  kpi: string;
  typeofchangemade: string;
  additionaldetails: string;
  oldvalue: string;
  newvalue: string;
  supportingdocumentlink?: string;
  reasonforchange: string;
  dateupdated?: string;
  dateinserted: string;
  actionButton?: unknown;
}

//  "additionaldetails": "FY24 target changed",
//  "country": "Sierra Leone",
//  "dateinserted": "Jul-2023",
//  "id": 9,
//  "kpi": "Number of CHWs who have completed a full training",
//  "newvalue": "0",
//  "oldvalue": "100",
//  "reasonforchange": "Upskill activities deprioritized during FY24 annual planning",
//  "supportingdocumentlink": "N/A",
//  "tocpillar": "Upskill",
//  "typeofchangemade": "Changed target"

const KPIChangeLogColumns: ColDef<IKPIChangeLog>[] = [
  { field: "id", headerName: "ID", minWidth: 60, maxWidth: 65 },
  {
    field: "country",
    headerName: "Country",
    minWidth: 150,
  },
  {
    field: "tocpillar",
    headerName: "Theory of Change Pillar",
    wrapHeaderText: true,
    autoHeaderHeight: true,
    autoHeight: true,
    wrapText: true,
    minWidth: 180,
  },
  {
    field: "kpi",
    headerName: "KPI",
    // width: 300,
    // wrapText: true,
    // autoHeight: true,
    // cellStyle: { textAlign: "center" },
    headerClass: "",
    autoHeight: true,
    wrapText: true,
    minWidth: 450,
  },
  {
    field: "typeofchangemade",
    headerName: "Type of Change Made",
    minWidth: 180,
  },
  {
    field: "additionaldetails",
    headerName:
      "Additional Detail on Change Made (e.g., timeframe or specific changes made)",

    wrapHeaderText: true,
    autoHeaderHeight: true,
    autoHeight: true,
    wrapText: true,
    minWidth: 400,
  },
  {
    field: "oldvalue",
    headerName: "Old Value",
    minWidth: 180,
  },
  {
    field: "newvalue",
    headerName: "New Value",
    minWidth: 180,
  },

  {
    field: "supportingdocumentlink",
    headerName: "Supporting Document for Change (Link)",
    wrapHeaderText: true,
    autoHeaderHeight: true,
    minWidth: 200,
  },
  {
    field: "reasonforchange",
    headerName: "Comments/ Reasons for Change",
    wrapHeaderText: true,
    autoHeaderHeight: true,
    autoHeight: true,
    wrapText: true,
    minWidth: 500,
  },
  {
    field: "dateinserted",
    headerName: "Date KPI was added, or retired",
    wrapHeaderText: true,
    autoHeaderHeight: true,
    minWidth: 180,
  },
  {
    field: "dateupdated",
    headerName: "Last Updated Date",
    wrapHeaderText: true,
    autoHeaderHeight: true,
    minWidth: 220,
  },
];

export default KPIChangeLogColumns;
