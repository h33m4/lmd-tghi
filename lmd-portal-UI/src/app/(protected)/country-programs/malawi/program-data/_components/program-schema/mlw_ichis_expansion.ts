import { ColDef } from "ag-grid-community";

export interface IMlwIchisExpansion {
  age_category: string;
  catchment_area_population_size: number | null;
  date: string;
  date_inserted: string;
  day: string;
  deviceid: string;
  district: string;
  district_health_zone: string;
  end_date: string;
  final_score: string;
  gender: string;
  id: number;
  last_update_date: string;
  month: string;
  name_of_participant: string;
  participant_id_number: number;
  position: string;
  q10_score: string;
  q10_score3: string;
  q1_score: string;
  q3_score: string;
  q4_score: string;
  q5_score: string;
  q6_score: string;
  q7_score: string;
  q8_score: string;
  q8_score2: string;
  q9_score: string;
  qualification: string;
  reporting_catchment_area_name: string;
  reporting_health_facility_name: string;
  score: number;
  status: string;
  testtype: string;
  training_id_number: string;
  year: string;
  years_worked_as_a_health_worker: string;
}

const MlwIchisExpansionColumns: ColDef<IMlwIchisExpansion, any>[] = [
  { field: "age_category", headerName: "Age Category" },
  {
    field: "catchment_area_population_size",
    headerName: "Catchment Area Population Size",
  },
  { field: "date", headerName: "Date" },
  { field: "date_inserted", headerName: "Date Inserted" },
  { field: "day", headerName: "Day" },
  { field: "deviceid", headerName: "Device ID" },
  { field: "district", headerName: "District" },
  { field: "district_health_zone", headerName: "District Health Zone" },
  { field: "end_date", headerName: "End Date" },
  { field: "final_score", headerName: "Final Score" },
  { field: "gender", headerName: "Gender" },
  { field: "id", headerName: "ID" },
  { field: "last_update_date", headerName: "Last Update Date" },
  { field: "month", headerName: "Month" },
  { field: "name_of_participant", headerName: "Name of Participant" },
  { field: "participant_id_number", headerName: "Participant ID Number" },
  { field: "position", headerName: "Position" },
  { field: "q10_score", headerName: "Q10 Score" },
  { field: "q10_score3", headerName: "Q10 Score3" },
  { field: "q1_score", headerName: "Q1 Score" },
  { field: "q3_score", headerName: "Q3 Score" },
  { field: "q4_score", headerName: "Q4 Score" },
  { field: "q5_score", headerName: "Q5 Score" },
  { field: "q6_score", headerName: "Q6 Score" },
  { field: "q7_score", headerName: "Q7 Score" },
  { field: "q8_score", headerName: "Q8 Score" },
  { field: "q8_score2", headerName: "Q8 Score2" },
  { field: "q9_score", headerName: "Q9 Score" },
  { field: "qualification", headerName: "Qualification" },
  {
    field: "reporting_catchment_area_name",
    headerName: "Reporting Catchment Area Name",
  },
  {
    field: "reporting_health_facility_name",
    headerName: "Reporting Health Facility Name",
  },
  { field: "score", headerName: "Score" },
  { field: "status", headerName: "Status" },
  { field: "testtype", headerName: "Test Type" },
  { field: "training_id_number", headerName: "Training ID Number" },
  { field: "year", headerName: "Year" },
  {
    field: "years_worked_as_a_health_worker",
    headerName: "Years Worked as a Health Worker",
  },
];

export default MlwIchisExpansionColumns;
