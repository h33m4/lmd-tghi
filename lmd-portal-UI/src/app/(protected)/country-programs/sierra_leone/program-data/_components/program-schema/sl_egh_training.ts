import { ColDef } from "ag-grid-community";

export interface ISlEghTraining {
  id: number;
  age: number;
  chiefdom: string;
  date_inserted: string;
  day: string;
  district: string;
  edu_cat: string;
  etrhtr: string;
  experience: string;
  gender: string;
  last_update_date: string;
  m1_ka_post_score_total_rev: number;
  m1_ka_pre_score_total_rev: number;
  m2_ka_post_score_total_rev: number;
  m2_ka_pre_score_total_rev: number;
  m3_ka_post_score_total_rev: number;
  m3_ka_pre_score_total_rev: number;
  m4_ka_post_score_total: number | null;
  m4_ka_pre_score_total: number | null;
  month: string;
  phu: string;
  role: string;
  training_round: number;
  training_site: string;
  year: string;
}

const SlEghTrainingColumns: ColDef<ISlEghTraining, any>[] = [
  { field: "id", headerName: "ID" },
  { field: "role", headerName: "Role" },
  { field: "age", headerName: "Age" },
  { field: "gender", headerName: "Gender" },
  { field: "experience", headerName: "Experience" },
  { field: "edu_cat", headerName: "Education Category" },
  { field: "etrhtr", headerName: "ETR/HTR" },

  // Location Information
  { field: "district", headerName: "District" },
  { field: "chiefdom", headerName: "Chiefdom" },
  { field: "phu", headerName: "PHU" },

  // Training Information
  { field: "training_round", headerName: "Training Round" },
  { field: "training_site", headerName: "Training Site" },

  // Module Scores
  {
    field: "m1_ka_pre_score_total_rev",
    headerName: "Module 1 Pre-Score",
    valueFormatter: (params) =>
      params.value !== null ? (params.value * 100).toFixed(1) + "%" : "-",
  },
  {
    field: "m1_ka_post_score_total_rev",
    headerName: "Module 1 Post-Score",
    valueFormatter: (params) =>
      params.value !== null ? (params.value * 100).toFixed(1) + "%" : "-",
  },
  {
    field: "m2_ka_pre_score_total_rev",
    headerName: "Module 2 Pre-Score",
    valueFormatter: (params) =>
      params.value !== null ? (params.value * 100).toFixed(1) + "%" : "-",
  },
  {
    field: "m2_ka_post_score_total_rev",
    headerName: "Module 2 Post-Score",
    valueFormatter: (params) =>
      params.value !== null ? (params.value * 100).toFixed(1) + "%" : "-",
  },
  {
    field: "m3_ka_pre_score_total_rev",
    headerName: "Module 3 Pre-Score",
    valueFormatter: (params) =>
      params.value !== null ? (params.value * 100).toFixed(1) + "%" : "-",
  },
  {
    field: "m3_ka_post_score_total_rev",
    headerName: "Module 3 Post-Score",
    valueFormatter: (params) =>
      params.value !== null ? (params.value * 100).toFixed(1) + "%" : "-",
  },
  {
    field: "m4_ka_pre_score_total",
    headerName: "Module 4 Pre-Score",
    valueFormatter: (params) =>
      params.value !== null ? (params.value * 100).toFixed(1) + "%" : "-",
  },
  {
    field: "m4_ka_post_score_total",
    headerName: "Module 4 Post-Score",
    valueFormatter: (params) =>
      params.value !== null ? (params.value * 100).toFixed(1) + "%" : "-",
  },

  // Date Information
  { field: "date_inserted", headerName: "Date Inserted" },
  { field: "last_update_date", headerName: "Last Updated" },
  { field: "year", headerName: "Year" },
  { field: "month", headerName: "Month" },
  { field: "day", headerName: "Day" },
];

export default SlEghTrainingColumns;
