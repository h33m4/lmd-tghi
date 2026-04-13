import { ColDef } from "ag-grid-community";

export interface IMlwIchisTraining {
  age_range: string;
  attended_ichis_rollout_exercise: string;
  catchment_area_population: string;
  catchment_area_setting: string;
  cluster_location: string;
  commonly_used_phone_no: string;
  date_inserted: string;
  day: string;
  district: string;
  first_name: string;
  gender: string;
  hsa_catchment_area: string;
  id: number;
  last_update_date: string;
  month: string;
  number: number;
  position: string;
  reporting_health_facility: string;
  surname: string;
  training_date1: string;
  training_date2: string;
  training_date3: string;
  training_date4: string;
  training_date5: string;
  training_date6: string;
  training_date7: string;
  training_days_attended: number;
  year: string;
}

const MlwIchisTrainingColumns: ColDef<IMlwIchisTraining, any>[] = [
  {
    field: "age_range",
    headerName: "Age Range",
    width: 180,
  },
  {
    field: "attended_ichis_rollout_exercise",
    headerName: "Attended ICHIS Rollout Exercise",
    width: 180,
  },
  {
    field: "catchment_area_population",
    headerName: "Catchment Area Population",
    width: 180,
  },
  {
    field: "catchment_area_setting",
    headerName: "Catchment Area Setting",
    width: 180,
  },
  { field: "cluster_location", headerName: "Cluster Location" },
  {
    field: "commonly_used_phone_no",
    headerName: "Commonly Used Phone No",
    width: 180,
  },
  { field: "date_inserted", headerName: "Date Inserted", width: 180 },
  { field: "day", headerName: "Day", width: 180 },
  { field: "district", headerName: "District", width: 180 },
  { field: "first_name", headerName: "First Name", width: 180 },
  { field: "gender", headerName: "Gender", width: 180 },
  { field: "hsa_catchment_area", headerName: "HSA Catchment Area", width: 180 },
  { field: "id", headerName: "ID", width: 180 },
  { field: "last_update_date", headerName: "Last Update Date", width: 180 },
  { field: "month", headerName: "Month", width: 180 },
  { field: "number", headerName: "Number", width: 180 },
  { field: "position", headerName: "Position", width: 180 },
  {
    field: "reporting_health_facility",
    headerName: "Reporting Health Facility",
    width: 180,
  },
  {
    field: "surname",
    headerName: "Surname",
  },
  {
    field: "training_date1",
    headerName: "Traning Date 1",
  },
  {
    field: "training_date2",
    headerName: "Traning Date 2",
  },
  {
    field: "training_date3",
    headerName: "Traning Date 3",
  },
  {
    field: "training_date4",
    headerName: "Traning Date 4",
  },
  {
    field: "training_date5",
    headerName: "Traning Date 5",
  },
  {
    field: "training_date6",
    headerName: "Traning Date 6",
  },
  {
    field: "training_date7",
    headerName: "Traning Date 7",
  },
  {
    field: "training_days_attended",
    headerName: "Training Days Attended",
    width: 180,
  },
  { field: "year", headerName: "Year", width: 180 },
];

export default MlwIchisTrainingColumns;
