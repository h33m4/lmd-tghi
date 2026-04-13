import { ColDef } from "ag-grid-community";

export interface IEthIrtTraining {
  bmi_score_cat_post: string | null;
  bmi_score_cat_pre: string | null;
  bmi_score_passed_post: boolean | null;
  bmi_score_passed_pre: boolean | null;
  bmi_score_pc_post: number | null;
  bmi_score_pc_pre: number | null;
  bp_score_cat_post: string | null;
  bp_score_cat_pre: string | null;
  bp_score_passed_post: boolean | null;
  bp_score_passed_pre: boolean | null;
  bp_score_pc_post: number | null;
  bp_score_pc_pre: number | null;
  breast_score_cat_post: string | null;
  breast_score_cat_pre: string | null;
  breast_score_passed_post: boolean | null;
  breast_score_passed_pre: boolean | null;
  breast_score_pc_post: number | null;
  breast_score_pc_pre: number | null;
  date_inserted: string;
  date_joined: string;
  day: string;
  echis_training: string;
  education_level: string;
  ermnch_attend_yn: string | null;
  ermnch_cohort: string | null;
  ermnch_imp_phase: string | null;
  ermnch_post_ka_pct: number | null;
  ermnch_post_sa_passed: boolean | null;
  ermnch_post_sa_pct: number | null;
  ermnch_pre_ka_pct: number | null;
  ermnch_pre_sa_passed: boolean | null;
  ermnch_pre_sa_pct: number | null;
  ermnch_skills_assign: string | null;
  ermnch_training_center: string | null;
  ermnch_training_date: string | null;
  eye_score_cat_post: string | null;
  eye_score_cat_pre: string | null;
  eye_score_passed_post: boolean | null;
  eye_score_passed_pre: boolean | null;
  eye_score_pc_post: number | null;
  eye_score_pc_pre: number | null;
  first_name: string;
  flag_ermnch: number | null;
  flag_irmnch: number;
  flag_mcd: number | null;
  flag_ncd: number | null;
  flag_rmnch_pilot: number | null;
  flag_rmnch_scaleup: number | null;
  fp_score_cat_post: string | null;
  fp_score_cat_pre: string | null;
  fp_score_passed_post: boolean | null;
  fp_score_passed_pre: boolean | null;
  fp_score_pc_post: number | null;
  fp_score_pc_pre: number | null;
  gender: string;
  glucose_score_cat_post: string | null;
  glucose_score_cat_pre: string | null;
  glucose_score_passed_post: boolean | null;
  glucose_score_passed_pre: boolean | null;
  glucose_score_pc_post: number | null;
  glucose_score_pc_pre: number | null;
  gmp_score_cat_post: string | null;
  gmp_score_cat_pre: string | null;
  gmp_score_passed_post: boolean | null;
  gmp_score_passed_pre: boolean | null;
  gmp_score_pc_post: number | null;
  gmp_score_pc_pre: number | null;
  grand_father: string;
  health_post: string;
  health_post_uid: string;
  hiv_score_cat_post: string | null;
  hiv_score_cat_pre: string | null;
  hiv_score_passed_post: boolean | null;
  hiv_score_passed_pre: boolean | null;
  hiv_score_pc_post: number | null;
  hiv_score_pc_pre: number | null;
  id: number;
  irmnch_attend_yn: string;
  irmnch_cohort: string;
  irmnch_imp_phase: string;
  irmnch_post_ka_pct: number;
  irmnch_post_sa_passed: boolean | null;
  irmnch_post_sa_pct: number | null;
  irmnch_pre_ka_pct: number;
  irmnch_pre_sa_passed: boolean | null;
  irmnch_pre_sa_pct: number | null;
  irmnch_skills_assign: string | null;
  irmnch_training_center: string;
  irmnch_training_date: string;
  last_name: string;
  last_update_date: string;
  malaria_score_cat_post: string | null;
  malaria_score_cat_pre: string | null;
  malaria_score_passed_post: boolean | null;
  malaria_score_passed_pre: boolean | null;
  malaria_score_pc_post: number | null;
  malaria_score_pc_pre: number | null;
  mcd_attend_yn: string | null;
  mcd_cohort: string | null;
  mcd_imp_phase: string | null;
  mcd_post_ka_pct: number | null;
  mcd_post_sa_passed: boolean | null;
  mcd_post_sa_pct: number | null;
  mcd_pre_ka_pct: number | null;
  mcd_pre_sa_passed: boolean | null;
  mcd_pre_sa_pct: number | null;
  mcd_skills_assign: string | null;
  mcd_training_center: string | null;
  mcd_training_date: string | null;
  month: string;
  muac_score_cat_post: string | null;
  muac_score_cat_pre: string | null;
  muac_score_passed_post: boolean | null;
  muac_score_passed_pre: boolean | null;
  muac_score_pc_post: number | null;
  muac_score_pc_pre: number | null;
  nb_score_cat_post: string | null;
  nb_score_cat_pre: string | null;
  nb_score_passed_post: boolean | null;
  nb_score_passed_pre: boolean | null;
  nb_score_pc_post: number | null;
  nb_score_pc_pre: number | null;
  ncd_attend_yn: string | null;
  ncd_cohort: string | null;
  ncd_imp_phase: string | null;
  ncd_post_ka_pct: number | null;
  ncd_post_sa_passed: boolean | null;
  ncd_post_sa_pct: number | null;
  ncd_pre_ka_pct: number | null;
  ncd_pre_sa_passed: boolean | null;
  ncd_pre_sa_pct: number | null;
  ncd_skills_assign: string | null;
  ncd_training_center: string | null;
  ncd_training_date: string | null;
  ntd_score_cat_post: string | null;
  ntd_score_cat_pre: string | null;
  ntd_score_passed_post: boolean | null;
  ntd_score_passed_pre: boolean | null;
  ntd_score_pc_post: number | null;
  ntd_score_pc_pre: number | null;
  participant_type: string;
  phcu: string;
  phcu_uid: string;
  phone_number: number;
  q_pre_bg_english: string | null;
  q_pre_bg_experience: string | null;
  region: string;
  region_uid: string;
  rmnch_pilot_attend_yn: string | null;
  rmnch_pilot_post_ka_pct: number | null;
  rmnch_pilot_post_sa_passed: boolean | null;
  rmnch_pilot_post_sa_pct: number | null;
  rmnch_pilot_pre_ka_pct: number | null;
  rmnch_pilot_pre_sa_passed: boolean | null;
  rmnch_pilot_pre_sa_pct: number | null;
  rmnch_pilot_training_date: string | null;
  rmnch_scaleup_attend_yn: string | null;
  rmnch_scaleup_post_ka_pct: number | null;
  rmnch_scaleup_post_sa_passed: boolean | null;
  rmnch_scaleup_post_sa_pct: number | null;
  rmnch_scaleup_pre_ka_pct: number | null;
  rmnch_scaleup_pre_sa_passed: boolean | null;
  rmnch_scaleup_pre_sa_pct: number | null;
  rmnch_scaleup_skills_assign: string | null;
  rmnch_scaleup_training_center: string | null;
  rmnch_scaleup_training_date: string;
  rmnch_training_date: string | null;
  sickch_score_cat_post: string | null;
  sickch_score_cat_pre: string | null;
  sickch_score_passed_post: boolean | null;
  sickch_score_passed_pre: boolean | null;
  sickch_score_pc_post: number | null;
  sickch_score_pc_pre: number | null;
  tb_score_cat_post: string | null;
  tb_score_cat_pre: string | null;
  tb_score_passed_post: boolean | null;
  tb_score_passed_pre: boolean | null;
  tb_score_pc_post: number | null;
  tb_score_pc_pre: number | null;
  user_id: number;
  username: string;
  vax_score_cat_post: string | null;
  vax_score_cat_pre: string | null;
  vax_score_passed_post: boolean | null;
  vax_score_passed_pre: boolean | null;
  vax_score_pc_post: number | null;
  vax_score_pc_pre: number | null;
  woreda: string;
  woreda_uid: string;
  year: string;
  year_of_birth: number;
  year_of_employment: number;
  zone: string;
  zone_uid: string;
}

const EthIrtTrainingColumns: ColDef<IEthIrtTraining, any>[] = [
  { field: "id", headerName: "ID" },
  { field: "user_id", headerName: "User ID" },
  { field: "first_name", headerName: "First Name" },
  { field: "last_name", headerName: "Last Name" },
  { field: "grand_father", headerName: "Grandfather" },
  { field: "username", headerName: "Username" },
  { field: "gender", headerName: "Gender" },
  { field: "year_of_birth", headerName: "Birth Year" },
  { field: "year_of_employment", headerName: "Employment Year" },
  { field: "education_level", headerName: "Education Level" },
  { field: "participant_type", headerName: "Participant Type" },
  { field: "phone_number", headerName: "Phone Number" },
  { field: "date_joined", headerName: "Date Joined" },
  { field: "date_inserted", headerName: "Date Inserted" },
  { field: "last_update_date", headerName: "Last Updated" },
  { field: "year", headerName: "Year" },
  { field: "month", headerName: "Month" },
  { field: "day", headerName: "Day" },
  { field: "echis_training", headerName: "eCHIS Training" },

  // Location Info
  { field: "health_post", headerName: "Health Post" },
  { field: "health_post_uid", headerName: "Health Post UID" },
  { field: "phcu", headerName: "PHCU" },
  { field: "phcu_uid", headerName: "PHCU UID" },
  { field: "woreda", headerName: "Woreda" },
  { field: "woreda_uid", headerName: "Woreda UID" },
  { field: "zone", headerName: "Zone" },
  { field: "zone_uid", headerName: "Zone UID" },
  { field: "region", headerName: "Region" },
  { field: "region_uid", headerName: "Region UID" },

  // Flag fields
  { field: "flag_ermnch", headerName: "ERMNCH Flag" },
  { field: "flag_irmnch", headerName: "IRMNCH Flag" },
  { field: "flag_mcd", headerName: "MCD Flag" },
  { field: "flag_ncd", headerName: "NCD Flag" },
  { field: "flag_rmnch_pilot", headerName: "RMNCH Pilot Flag" },
  { field: "flag_rmnch_scaleup", headerName: "RMNCH Scaleup Flag" },

  // IRMNCH Data
  { field: "irmnch_attend_yn", headerName: "IRMNCH Attended" },
  { field: "irmnch_cohort", headerName: "IRMNCH Cohort" },
  { field: "irmnch_imp_phase", headerName: "IRMNCH Impl. Phase" },
  { field: "irmnch_training_center", headerName: "IRMNCH Training Center" },
  { field: "irmnch_training_date", headerName: "IRMNCH Training Date" },
  { field: "irmnch_pre_ka_pct", headerName: "IRMNCH Pre-KA %" },
  { field: "irmnch_post_ka_pct", headerName: "IRMNCH Post-KA %" },
  { field: "irmnch_pre_sa_passed", headerName: "IRMNCH Pre-SA Passed" },
  { field: "irmnch_pre_sa_pct", headerName: "IRMNCH Pre-SA %" },
  { field: "irmnch_post_sa_passed", headerName: "IRMNCH Post-SA Passed" },
  { field: "irmnch_post_sa_pct", headerName: "IRMNCH Post-SA %" },
  { field: "irmnch_skills_assign", headerName: "IRMNCH Skills Assign" },

  // ERMNCH Data
  { field: "ermnch_attend_yn", headerName: "ERMNCH Attended" },
  { field: "ermnch_cohort", headerName: "ERMNCH Cohort" },
  { field: "ermnch_imp_phase", headerName: "ERMNCH Impl. Phase" },
  { field: "ermnch_training_center", headerName: "ERMNCH Training Center" },
  { field: "ermnch_training_date", headerName: "ERMNCH Training Date" },
  { field: "ermnch_pre_ka_pct", headerName: "ERMNCH Pre-KA %" },
  { field: "ermnch_post_ka_pct", headerName: "ERMNCH Post-KA %" },
  { field: "ermnch_pre_sa_passed", headerName: "ERMNCH Pre-SA Passed" },
  { field: "ermnch_pre_sa_pct", headerName: "ERMNCH Pre-SA %" },
  { field: "ermnch_post_sa_passed", headerName: "ERMNCH Post-SA Passed" },
  { field: "ermnch_post_sa_pct", headerName: "ERMNCH Post-SA %" },
  { field: "ermnch_skills_assign", headerName: "ERMNCH Skills Assign" },

  // MCD Data
  { field: "mcd_attend_yn", headerName: "MCD Attended" },
  { field: "mcd_cohort", headerName: "MCD Cohort" },
  { field: "mcd_imp_phase", headerName: "MCD Impl. Phase" },
  { field: "mcd_training_center", headerName: "MCD Training Center" },
  { field: "mcd_training_date", headerName: "MCD Training Date" },
  { field: "mcd_pre_ka_pct", headerName: "MCD Pre-KA %" },
  { field: "mcd_post_ka_pct", headerName: "MCD Post-KA %" },
  { field: "mcd_pre_sa_passed", headerName: "MCD Pre-SA Passed" },
  { field: "mcd_pre_sa_pct", headerName: "MCD Pre-SA %" },
  { field: "mcd_post_sa_passed", headerName: "MCD Post-SA Passed" },
  { field: "mcd_post_sa_pct", headerName: "MCD Post-SA %" },
  { field: "mcd_skills_assign", headerName: "MCD Skills Assign" },

  // NCD Data
  { field: "ncd_attend_yn", headerName: "NCD Attended" },
  { field: "ncd_cohort", headerName: "NCD Cohort" },
  { field: "ncd_imp_phase", headerName: "NCD Impl. Phase" },
  { field: "ncd_training_center", headerName: "NCD Training Center" },
  { field: "ncd_training_date", headerName: "NCD Training Date" },
  { field: "ncd_pre_ka_pct", headerName: "NCD Pre-KA %" },
  { field: "ncd_post_ka_pct", headerName: "NCD Post-KA %" },
  { field: "ncd_pre_sa_passed", headerName: "NCD Pre-SA Passed" },
  { field: "ncd_pre_sa_pct", headerName: "NCD Pre-SA %" },
  { field: "ncd_post_sa_passed", headerName: "NCD Post-SA Passed" },
  { field: "ncd_post_sa_pct", headerName: "NCD Post-SA %" },
  { field: "ncd_skills_assign", headerName: "NCD Skills Assign" },

  // RMNCH Pilot Data
  { field: "rmnch_pilot_attend_yn", headerName: "RMNCH Pilot Attended" },
  {
    field: "rmnch_pilot_training_date",
    headerName: "RMNCH Pilot Training Date",
  },
  { field: "rmnch_pilot_pre_ka_pct", headerName: "RMNCH Pilot Pre-KA %" },
  { field: "rmnch_pilot_post_ka_pct", headerName: "RMNCH Pilot Post-KA %" },
  {
    field: "rmnch_pilot_pre_sa_passed",
    headerName: "RMNCH Pilot Pre-SA Passed",
  },
  { field: "rmnch_pilot_pre_sa_pct", headerName: "RMNCH Pilot Pre-SA %" },
  {
    field: "rmnch_pilot_post_sa_passed",
    headerName: "RMNCH Pilot Post-SA Passed",
  },
  { field: "rmnch_pilot_post_sa_pct", headerName: "RMNCH Pilot Post-SA %" },

  // RMNCH Scaleup Data
  { field: "rmnch_scaleup_attend_yn", headerName: "RMNCH Scaleup Attended" },
  {
    field: "rmnch_scaleup_training_center",
    headerName: "RMNCH Scaleup Training Center",
  },
  {
    field: "rmnch_scaleup_training_date",
    headerName: "RMNCH Scaleup Training Date",
  },
  { field: "rmnch_scaleup_pre_ka_pct", headerName: "RMNCH Scaleup Pre-KA %" },
  { field: "rmnch_scaleup_post_ka_pct", headerName: "RMNCH Scaleup Post-KA %" },
  {
    field: "rmnch_scaleup_pre_sa_passed",
    headerName: "RMNCH Scaleup Pre-SA Passed",
  },
  { field: "rmnch_scaleup_pre_sa_pct", headerName: "RMNCH Scaleup Pre-SA %" },
  {
    field: "rmnch_scaleup_post_sa_passed",
    headerName: "RMNCH Scaleup Post-SA Passed",
  },
  { field: "rmnch_scaleup_post_sa_pct", headerName: "RMNCH Scaleup Post-SA %" },
  {
    field: "rmnch_scaleup_skills_assign",
    headerName: "RMNCH Scaleup Skills Assign",
  },
  { field: "rmnch_training_date", headerName: "RMNCH Training Date" },

  // Assessment Scores - BMI
  { field: "bmi_score_cat_pre", headerName: "BMI Pre Category" },
  { field: "bmi_score_cat_post", headerName: "BMI Post Category" },
  { field: "bmi_score_pc_pre", headerName: "BMI Pre %" },
  { field: "bmi_score_pc_post", headerName: "BMI Post %" },
  { field: "bmi_score_passed_pre", headerName: "BMI Pre Passed" },
  { field: "bmi_score_passed_post", headerName: "BMI Post Passed" },

  // Assessment Scores - BP
  { field: "bp_score_cat_pre", headerName: "BP Pre Category" },
  { field: "bp_score_cat_post", headerName: "BP Post Category" },
  { field: "bp_score_pc_pre", headerName: "BP Pre %" },
  { field: "bp_score_pc_post", headerName: "BP Post %" },
  { field: "bp_score_passed_pre", headerName: "BP Pre Passed" },
  { field: "bp_score_passed_post", headerName: "BP Post Passed" },

  // Assessment Scores - Breast
  { field: "breast_score_cat_pre", headerName: "Breast Pre Category" },
  { field: "breast_score_cat_post", headerName: "Breast Post Category" },
  { field: "breast_score_pc_pre", headerName: "Breast Pre %" },
  { field: "breast_score_pc_post", headerName: "Breast Post %" },
  { field: "breast_score_passed_pre", headerName: "Breast Pre Passed" },
  { field: "breast_score_passed_post", headerName: "Breast Post Passed" },

  // Assessment Scores - Eye
  { field: "eye_score_cat_pre", headerName: "Eye Pre Category" },
  { field: "eye_score_cat_post", headerName: "Eye Post Category" },
  { field: "eye_score_pc_pre", headerName: "Eye Pre %" },
  { field: "eye_score_pc_post", headerName: "Eye Post %" },
  { field: "eye_score_passed_pre", headerName: "Eye Pre Passed" },
  { field: "eye_score_passed_post", headerName: "Eye Post Passed" },

  // Assessment Scores - FP
  { field: "fp_score_cat_pre", headerName: "FP Pre Category" },
  { field: "fp_score_cat_post", headerName: "FP Post Category" },
  { field: "fp_score_pc_pre", headerName: "FP Pre %" },
  { field: "fp_score_pc_post", headerName: "FP Post %" },
  { field: "fp_score_passed_pre", headerName: "FP Pre Passed" },
  { field: "fp_score_passed_post", headerName: "FP Post Passed" },

  // Assessment Scores - Glucose
  { field: "glucose_score_cat_pre", headerName: "Glucose Pre Category" },
  { field: "glucose_score_cat_post", headerName: "Glucose Post Category" },
  { field: "glucose_score_pc_pre", headerName: "Glucose Pre %" },
  { field: "glucose_score_pc_post", headerName: "Glucose Post %" },
  { field: "glucose_score_passed_pre", headerName: "Glucose Pre Passed" },
  { field: "glucose_score_passed_post", headerName: "Glucose Post Passed" },

  // Assessment Scores - GMP
  { field: "gmp_score_cat_pre", headerName: "GMP Pre Category" },
  { field: "gmp_score_cat_post", headerName: "GMP Post Category" },
  { field: "gmp_score_pc_pre", headerName: "GMP Pre %" },
  { field: "gmp_score_pc_post", headerName: "GMP Post %" },
  { field: "gmp_score_passed_pre", headerName: "GMP Pre Passed" },
  { field: "gmp_score_passed_post", headerName: "GMP Post Passed" },

  // Assessment Scores - HIV
  { field: "hiv_score_cat_pre", headerName: "HIV Pre Category" },
  { field: "hiv_score_cat_post", headerName: "HIV Post Category" },
  { field: "hiv_score_pc_pre", headerName: "HIV Pre %" },
  { field: "hiv_score_pc_post", headerName: "HIV Post %" },
  { field: "hiv_score_passed_pre", headerName: "HIV Pre Passed" },
  { field: "hiv_score_passed_post", headerName: "HIV Post Passed" },

  // Assessment Scores - Malaria
  { field: "malaria_score_cat_pre", headerName: "Malaria Pre Category" },
  { field: "malaria_score_cat_post", headerName: "Malaria Post Category" },
  { field: "malaria_score_pc_pre", headerName: "Malaria Pre %" },
  { field: "malaria_score_pc_post", headerName: "Malaria Post %" },
  { field: "malaria_score_passed_pre", headerName: "Malaria Pre Passed" },
  { field: "malaria_score_passed_post", headerName: "Malaria Post Passed" },

  // Assessment Scores - MUAC
  { field: "muac_score_cat_pre", headerName: "MUAC Pre Category" },
  { field: "muac_score_cat_post", headerName: "MUAC Post Category" },
  { field: "muac_score_pc_pre", headerName: "MUAC Pre %" },
  { field: "muac_score_pc_post", headerName: "MUAC Post %" },
  { field: "muac_score_passed_pre", headerName: "MUAC Pre Passed" },
  { field: "muac_score_passed_post", headerName: "MUAC Post Passed" },

  // Assessment Scores - NB
  { field: "nb_score_cat_pre", headerName: "NB Pre Category" },
  { field: "nb_score_cat_post", headerName: "NB Post Category" },
  { field: "nb_score_pc_pre", headerName: "NB Pre %" },
  { field: "nb_score_pc_post", headerName: "NB Post %" },
  { field: "nb_score_passed_pre", headerName: "NB Pre Passed" },
  { field: "nb_score_passed_post", headerName: "NB Post Passed" },

  // Assessment Scores - NTD
  { field: "ntd_score_cat_pre", headerName: "NTD Pre Category" },
  { field: "ntd_score_cat_post", headerName: "NTD Post Category" },
  { field: "ntd_score_pc_pre", headerName: "NTD Pre %" },
  { field: "ntd_score_pc_post", headerName: "NTD Post %" },
  { field: "ntd_score_passed_pre", headerName: "NTD Pre Passed" },
  { field: "ntd_score_passed_post", headerName: "NTD Post Passed" },

  // Assessment Scores - SickCH
  { field: "sickch_score_cat_pre", headerName: "SickCH Pre Category" },
  { field: "sickch_score_cat_post", headerName: "SickCH Post Category" },
  { field: "sickch_score_pc_pre", headerName: "SickCH Pre %" },
  { field: "sickch_score_pc_post", headerName: "SickCH Post %" },
  { field: "sickch_score_passed_pre", headerName: "SickCH Pre Passed" },
  { field: "sickch_score_passed_post", headerName: "SickCH Post Passed" },

  // Assessment Scores - TB
  { field: "tb_score_cat_pre", headerName: "TB Pre Category" },
  { field: "tb_score_cat_post", headerName: "TB Post Category" },
  { field: "tb_score_pc_pre", headerName: "TB Pre %" },
  { field: "tb_score_pc_post", headerName: "TB Post %" },
  { field: "tb_score_passed_pre", headerName: "TB Pre Passed" },
  { field: "tb_score_passed_post", headerName: "TB Post Passed" },

  // Assessment Scores - VAX
  { field: "vax_score_cat_pre", headerName: "VAX Pre Category" },
  { field: "vax_score_cat_post", headerName: "VAX Post Category" },
  { field: "vax_score_pc_pre", headerName: "VAX Pre %" },
  { field: "vax_score_pc_post", headerName: "VAX Post %" },
  { field: "vax_score_passed_pre", headerName: "VAX Pre Passed" },
  { field: "vax_score_passed_post", headerName: "VAX Post Passed" },

  // Background Info
  { field: "q_pre_bg_english", headerName: "English Background" },
  { field: "q_pre_bg_experience", headerName: "Experience Background" },
];

export default EthIrtTrainingColumns;
