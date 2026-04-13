import { ColDef } from "ag-grid-community";

export interface ILibCbis {
  "1_2a_routine_household_visits_chss": number;
  "1_2b_births_home_chss": number;
  "1_2c_births_facility_chss": number;
  "1_2d_still_births_chss": number;
  "1_2e_neonatal_deaths_chss": number;
  "1_2f_post_neonatal_deaths_chss": number;
  "1_2g_child_deaths_chss": number;
  "1_2h_maternal_deaths_chss": number;
  "1_2i_community_triggers_chss": number;
  "1_2j_hiv_tb_cm_ntd_mentalhealthreferrals_chss": number;
  "1_2k_deaths_over_5_years_community_home_chss": number;
  "2_1a_pregnant_woman_visits_chss": number;
  "2_1b_referred_for_delivery_chss": number;
  "2_1c_referred_for_anc_chss": number;
  "2_1d_post_natal_visits_chss": number;
  "2_1e_referred_for_danger_sign_chss": number;
  "2_1f_hbmnc_within_48_hrs_mother_chss": number;
  "2_1g_hbmnc_within_48_hrs_infant_chss": number;
  "2_2a_clients_currently_using_modern_fp_chss": number;
  "3_1a_active_case_finds_chss": number;
  "3_1b_muac_red_chss": number;
  "3_1c_muac_yellow_chss": number;
  "3_1d_muac_green_chss": number;
  "3_1e_pneumonia_cases_identified_chss": number;
  "3_1f_malaria_rdt_chss": number;
  "3_1g_diarrhea_cases_identified_chss": number;
  "3_1h_pneumonia_treated_antibiotics_chss": number;
  "3_1i_malaria_treated_2_11_months_chss": number;
  "3_1j_malaria_treated_1_5_years_chss": number;
  "3_1k_malaria_treated_less_than_24_hrs_chss": number;
  "3_1l_malaria_treated_in_more_than_24_hrs_chss": number;
  "3_1m_diarrhea_treated_zinc_ors_chss": number;
  "3_1n_referred_to_health_facility_chss": number;
  "4_1a_hiv_client_visits_chss": number;
  "4_1b_tb_client_visits_chss": number;
  "4_1c_cm_ntd_client_visits_chss": number;
  "4_1d_mental_health_client_visits_chss": number;
  "4_1e_ltfu_hiv_clients_traced_chss": number;
  "4_1f_ltfu_tb_clients_traced_chss": number;
  "5_3a_supervision_visits_completed": number;
  "5_3b_number_of_cha_absences": number;
  "5_3c_reviews_completed": number;
  "5_3d_reviews_with_correct_treatment": number;
  "5_3e_cha_reports_on_time": number;
  date_inserted: string;
  day: string;
  id: number;
  last_update_date: string;
  month: string;
  organisationunitcode: number;
  organisationunitdescription: string | null;
  organisationunitid: string;
  organisationunitname: string;
  periodcode: number;
  perioddescription: string | null;
  periodid: number;
  periodname: number;
  t_community_health_chss_monthly_service_report_actual_reports: number;
  year: string;
}

const LibCbisColumns: ColDef<ILibCbis, any>[] = [
  {
    field: "1_2a_routine_household_visits_chss",
    headerName: "Routine Household Visits CHSS",
  },
  { field: "1_2b_births_home_chss", headerName: "Births Home CHSS" },
  { field: "1_2c_births_facility_chss", headerName: "Births Facility CHSS" },
  { field: "1_2d_still_births_chss", headerName: "Still Births CHSS" },
  { field: "1_2e_neonatal_deaths_chss", headerName: "Neonatal Deaths CHSS" },
  {
    field: "1_2f_post_neonatal_deaths_chss",
    headerName: "Post Neonatal Deaths CHSS",
  },
  { field: "1_2g_child_deaths_chss", headerName: "Child Deaths CHSS" },
  { field: "1_2h_maternal_deaths_chss", headerName: "Maternal Deaths CHSS" },
  {
    field: "1_2i_community_triggers_chss",
    headerName: "Community Triggers CHSS",
  },
  {
    field: "1_2j_hiv_tb_cm_ntd_mentalhealthreferrals_chss",
    headerName: "HIV/TB/CM/NTD/Mental Health Referrals CHSS",
  },
  {
    field: "1_2k_deaths_over_5_years_community_home_chss",
    headerName: "Deaths Over 5 Years Community Home CHSS",
  },
  {
    field: "2_1a_pregnant_woman_visits_chss",
    headerName: "Pregnant Woman Visits CHSS",
  },
  {
    field: "2_1b_referred_for_delivery_chss",
    headerName: "Referred for Delivery CHSS",
  },
  { field: "2_1c_referred_for_anc_chss", headerName: "Referred for ANC CHSS" },
  {
    field: "2_1d_post_natal_visits_chss",
    headerName: "Post Natal Visits CHSS",
  },
  {
    field: "2_1e_referred_for_danger_sign_chss",
    headerName: "Referred for Danger Sign CHSS",
  },
  {
    field: "2_1f_hbmnc_within_48_hrs_mother_chss",
    headerName: "HBMNC Within 48 Hrs Mother CHSS",
  },
  {
    field: "2_1g_hbmnc_within_48_hrs_infant_chss",
    headerName: "HBMNC Within 48 Hrs Infant CHSS",
  },
  {
    field: "2_2a_clients_currently_using_modern_fp_chss",
    headerName: "Clients Currently Using Modern FP CHSS",
  },
  {
    field: "3_1a_active_case_finds_chss",
    headerName: "Active Case Finds CHSS",
  },
  { field: "3_1b_muac_red_chss", headerName: "MUAC Red CHSS" },
  { field: "3_1c_muac_yellow_chss", headerName: "MUAC Yellow CHSS" },
  { field: "3_1d_muac_green_chss", headerName: "MUAC Green CHSS" },
  {
    field: "3_1e_pneumonia_cases_identified_chss",
    headerName: "Pneumonia Cases Identified CHSS",
  },
  { field: "3_1f_malaria_rdt_chss", headerName: "Malaria RDT CHSS" },
  {
    field: "3_1g_diarrhea_cases_identified_chss",
    headerName: "Diarrhea Cases Identified CHSS",
  },
  {
    field: "3_1h_pneumonia_treated_antibiotics_chss",
    headerName: "Pneumonia Treated with Antibiotics CHSS",
  },
  {
    field: "3_1i_malaria_treated_2_11_months_chss",
    headerName: "Malaria Treated (2-11 Months) CHSS",
  },
  {
    field: "3_1j_malaria_treated_1_5_years_chss",
    headerName: "Malaria Treated (1-5 Years) CHSS",
  },
  {
    field: "3_1k_malaria_treated_less_than_24_hrs_chss",
    headerName: "Malaria Treated in Less Than 24 Hrs CHSS",
  },
  {
    field: "3_1l_malaria_treated_in_more_than_24_hrs_chss",
    headerName: "Malaria Treated in More Than 24 Hrs CHSS",
  },
  {
    field: "3_1m_diarrhea_treated_zinc_ors_chss",
    headerName: "Diarrhea Treated with Zinc/ORS CHSS",
  },
  {
    field: "3_1n_referred_to_health_facility_chss",
    headerName: "Referred to Health Facility CHSS",
  },
  {
    field: "4_1a_hiv_client_visits_chss",
    headerName: "HIV Client Visits CHSS",
  },
  { field: "4_1b_tb_client_visits_chss", headerName: "TB Client Visits CHSS" },
  {
    field: "4_1c_cm_ntd_client_visits_chss",
    headerName: "CM/NTD Client Visits CHSS",
  },
  {
    field: "4_1d_mental_health_client_visits_chss",
    headerName: "Mental Health Client Visits CHSS",
  },
  {
    field: "4_1e_ltfu_hiv_clients_traced_chss",
    headerName: "LTFU HIV Clients Traced CHSS",
  },
  {
    field: "4_1f_ltfu_tb_clients_traced_chss",
    headerName: "LTFU TB Clients Traced CHSS",
  },
  {
    field: "5_3a_supervision_visits_completed",
    headerName: "Supervision Visits Completed",
  },
  {
    field: "5_3b_number_of_cha_absences",
    headerName: "Number of CHA Absences",
  },
  { field: "5_3c_reviews_completed", headerName: "Reviews Completed" },
  {
    field: "5_3d_reviews_with_correct_treatment",
    headerName: "Reviews with Correct Treatment",
  },
  { field: "5_3e_cha_reports_on_time", headerName: "CHA Reports on Time" },
  { field: "date_inserted", headerName: "Date Inserted" },
  { field: "day", headerName: "Day" },
  { field: "id", headerName: "ID" },
  { field: "last_update_date", headerName: "Last Update Date" },
  { field: "month", headerName: "Month" },
  { field: "organisationunitcode", headerName: "Organisation Unit Code" },
  {
    field: "organisationunitdescription",
    headerName: "Organisation Unit Description",
  },
  { field: "organisationunitid", headerName: "Organisation Unit ID" },
  { field: "organisationunitname", headerName: "Organisation Unit Name" },
  { field: "periodcode", headerName: "Period Code" },
  { field: "perioddescription", headerName: "Period Description" },
  { field: "periodid", headerName: "Period ID" },
  { field: "periodname", headerName: "Period Name" },
  {
    field: "t_community_health_chss_monthly_service_report_actual_reports",
    headerName: "Monthly Service Report Actual Reports",
  },
  { field: "year", headerName: "Year" },
];

export default LibCbisColumns;
