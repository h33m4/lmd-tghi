import { ColDef } from "ag-grid-community";

export interface IMlwCbmncTraining {
  id_number: string;
  age: number;
  catchment_area: string;
  date_inserted: string;
  day: string;
  district: string;
  end_date: number;
  full_name: string;
  gender: string;
  health_facility: string;
  highest_level_of_education: string;
  id: number;
  last_update_date: string;
  month: string;
  phone_number: number;
  position: string;
  pre_assessment_score: number;
  reporting_catchment_area_name: string;
  reporting_health_facility_name: string;
  start_date: number;
  status: string;
  test_type: string;
  work_location: string;
  year: string;
}

const MlwCbmncTrainingColumns: ColDef<IMlwCbmncTraining, any>[] = [
  { field: "id_number", headerName: "ID Number" },
  { field: "age", headerName: "Age" },
  { field: "catchment_area", headerName: "Catchment Area" },
  { field: "date_inserted", headerName: "Date Inserted" },
  { field: "day", headerName: "Day" },
  { field: "district", headerName: "District" },
  { field: "end_date", headerName: "End Date" },
  { field: "full_name", headerName: "Full Name" },
  { field: "gender", headerName: "Gender" },
  { field: "health_facility", headerName: "Health Facility" },
  {
    field: "highest_level_of_education",
    headerName: "Highest Level Of Education",
  },
  { field: "id", headerName: "ID" },
  { field: "last_update_date", headerName: "Last Update Date" },
  { field: "month", headerName: "Month" },
  { field: "phone_number", headerName: "Phone Number" },
  { field: "position", headerName: "Position" },
  { field: "pre_assessment_score", headerName: "Pre-Assessment Score" },
  {
    field: "reporting_catchment_area_name",
    headerName: "Reporting Catchment Area Name",
  },
  {
    field: "reporting_health_facility_name",
    headerName: "Reporting Health Facility Name",
  },
  { field: "start_date", headerName: "Start Date" },
  { field: "status", headerName: "Status" },
  { field: "test_type", headerName: "Test Type" },
  { field: "work_location", headerName: "Work Location" },
  { field: "year", headerName: "Year" },
];

export default MlwCbmncTrainingColumns;
