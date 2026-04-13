import { ColDef } from "ag-grid-community";

export interface IEthEchisTraining {
  id: number;
  user_id: number;
  tei_id: string;
  date_inserted: string;
  date_joined: string;
  enrollment_date: string;
  incident_date: string;
  last_update_date: string;
  year: string;
  month: string;
  day: string;
  gender: string;
  year_of_birth: number;
  year_of_employment: number | null;
  education_level: string;
  participant_type: string;
  phone_number: number;
  echis_training: string;
  org_unit: string;
  no_geometry: null;
}

const EthEchisTrainingColumns: ColDef<IEthEchisTraining, any>[] = [
  { field: "id", headerName: "ID" },
  { field: "user_id", headerName: "User ID" },
  { field: "tei_id", headerName: "TEI ID" },
  { field: "participant_type", headerName: "Participant Type" },
  { field: "gender", headerName: "Gender" },
  { field: "year_of_birth", headerName: "Birth Year" },
  { field: "year_of_employment", headerName: "Employment Year" },
  { field: "education_level", headerName: "Education Level" },
  { field: "echis_training", headerName: "eCHIS Training" },
  { field: "org_unit", headerName: "Organization Unit" },
  { field: "phone_number", headerName: "Phone Number" },
  { field: "date_joined", headerName: "Date Joined" },
  { field: "enrollment_date", headerName: "Enrollment Date" },
  { field: "incident_date", headerName: "Incident Date" },
  { field: "date_inserted", headerName: "Date Inserted" },
  { field: "last_update_date", headerName: "Last Updated" },
  { field: "year", headerName: "Year" },
  { field: "month", headerName: "Month" },
  { field: "day", headerName: "Day" },
  { field: "no_geometry", headerName: "No Geometry" },
];

export default EthEchisTrainingColumns;
