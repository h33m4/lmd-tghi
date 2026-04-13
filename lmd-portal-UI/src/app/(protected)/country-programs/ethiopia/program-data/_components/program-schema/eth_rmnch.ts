import { ColDef } from "ag-grid-community";

export interface IEthRmnch {
  age: number;
  all_assessment: number;
  any_assessment: number;
  attend_yn: string;
  attendance_status: string;
  completed_post_bte: string;
  completed_post_ka: string;
  completed_post_kg: string;
  completed_post_lr: string;
  completed_post_se: string;
  completed_post_sus: string;
  completed_pre_bg: string;
  completed_pre_dt: string;
  completed_pre_ka: string;
  completed_pre_se: string;
  composite_pass_post: number | null;
  composite_pass_pre: number | null;
  composite_score_post: number | null;
  composite_score_pre: number | null;
  date_inserted: string;
  date_joined: string;
  day: string;
  echis_training: string;
  education_level: string;
  first_name: string;
  fp_q01_post: number | null;
  fp_q01_pre: number | null;
  fp_q02_post: number | null;
  fp_q02_pre: number | null;
  fp_q03_post: number | null;
  fp_q03_pre: number | null;
  fp_q04_post: number | null;
  fp_q04_pre: number | null;
  fp_q05_post: number | null;
  fp_q05_pre: number | null;
  fp_q06_post: number | null;
  fp_q06_pre: number | null;
  fp_q07_post: number | null;
  fp_q07_pre: number | null;
  fp_q08_post: number | null;
  fp_q08_pre: number | null;
  fp_q09_post: number | null;
  fp_q09_pre: number | null;
  fp_q10_post: number | null;
  fp_q10_pre: number | null;
  fp_q11_post: number | null;
  fp_q11_pre: number | null;
  fp_q12_post: number | null;
  fp_q12_pre: number | null;
  fp_q13_post: number | null;
  fp_q13_pre: number | null;
  fp_q14_post: number | null;
  fp_q14_pre: number | null;
  fp_q15_post: number | null;
  fp_q15_pre: number | null;
  fp_q16_post: number | null;
  fp_q16_pre: number | null;
  fp_q17_post: number | null;
  fp_q17_pre: number | null;
  fp_score_cat_post: number | null;
  fp_score_cat_pre: number | null;
  fp_score_pc_post: number | null;
  fp_score_pc_pre: number | null;
  fp_score_post: number | null;
  fp_score_pre: number | null;
  gender: string;
  grand_father: string;
  health_post: string;
  health_post_type: string;
  last_name: string;
  last_update_date: string;
  month: string;
  muac_q01_post: number | null;
  muac_q01_pre: number | null;
  muac_q02_post: number | null;
  muac_q02_pre: number | null;
  muac_q03_post: number | null;
  muac_q03_pre: number | null;
  muac_q04_post: number | null;
  muac_q04_pre: number | null;
  muac_q05_post: number | null;
  muac_q05_pre: number | null;
  muac_q06_post: number | null;
  muac_q06_pre: number | null;
  muac_q07_post: number | null;
  muac_q07_pre: number | null;
  muac_q08_post: number | null;
  muac_q08_pre: number | null;
  muac_q09_post: number | null;
  muac_q09_pre: number | null;
  muac_q10_post: number | null;
  muac_q10_pre: number | null;
  muac_q11_post: number | null;
  muac_q11_pre: number | null;
  muac_score_cat_post: number | null;
  muac_score_cat_pre: number | null;
  muac_score_pc_post: number | null;
  muac_score_pc_pre: number | null;
  muac_score_post: number | null;
  muac_score_pre: number | null;
  nb_q01_post: number | null;
  nb_q01_pre: number | null;
  nb_q02_post: number | null;
  nb_q02_pre: number | null;
  nb_q03_post: number | null;
  nb_q03_pre: number | null;
  nb_q04_post: number | null;
  nb_q04_pre: number | null;
  nb_q05_post: number | null;
  nb_q05_pre: number | null;
  nb_q06_post: number | null;
  nb_q06_pre: number | null;
  nb_q07_post: number | null;
  nb_q07_pre: number | null;
  nb_q08_post: number | null;
  nb_q08_pre: number | null;
  nb_q09_post: number | null;
  nb_q09_pre: number | null;
  nb_score_cat_post: number | null;
  nb_score_cat_pre: number | null;
  nb_score_pc_post: number | null;
  nb_score_pc_pre: number | null;
  nb_score_post: number | null;
  nb_score_pre: number | null;
  participant_id: string;
  participant_type: string;
  phcu: string;
  phone_number: number;
  post_ka_passed_cm: number;
  pre_ka_passed_cm: number;
  prepost_ka: number;
  q_post_kg_knowledge_gain: string;
  q_post_lr_accessible: string;
  q_post_lr_effectively: string;
  q_post_lr_engaging: string;
  q_post_lr_inperson: string;
  q_post_lr_length: string;
  q_post_lr_organized: string;
  q_post_lr_satisfied: string;
  q_post_lr_understand: string;
  q_pre_bg_english: string;
  q_pre_bg_experience: string;
  q_pre_bg_irt: string;
  q_pre_bg_irt_rmnch: string;
  q_pre_bg_training: string;
  region: string;
  score_post_ka1: number;
  score_post_ka10: number;
  score_post_ka11: number;
  score_post_ka12: number;
  score_post_ka13: number;
  score_post_ka14: number;
  score_post_ka15: number;
  score_post_ka16: number;
  score_post_ka17: number;
  score_post_ka18: number;
  score_post_ka19: number;
  score_post_ka2: number;
  score_post_ka20: number;
  score_post_ka21: number;
  score_post_ka22: number;
  score_post_ka23: number;
  score_post_ka24: number;
  score_post_ka25: number;
  score_post_ka26: number;
  score_post_ka27: number;
  score_post_ka28: number;
  score_post_ka29: number;
  score_post_ka3: number;
  score_post_ka30: number;
  score_post_ka4: number;
  score_post_ka5: number;
  score_post_ka6: number;
  score_post_ka7: number;
  score_post_ka8: number;
  score_post_ka9: number;
  score_post_ka_pct_cm: number;
  score_pre_ka1: number;
  score_pre_ka10: number;
  score_pre_ka11: number;
  score_pre_ka12: number;
  score_pre_ka13: number;
  score_pre_ka14: number;
  score_pre_ka15: number;
  score_pre_ka16: number;
  score_pre_ka17: number;
  score_pre_ka18: number;
  score_pre_ka19: number;
  score_pre_ka2: number;
  score_pre_ka20: number;
  score_pre_ka21: number;
  score_pre_ka22: number;
  score_pre_ka23: number;
  score_pre_ka24: number;
  score_pre_ka25: number;
  score_pre_ka26: number;
  score_pre_ka27: number;
  score_pre_ka28: number;
  score_pre_ka29: number;
  score_pre_ka3: number;
  score_pre_ka30: number;
  score_pre_ka4: number;
  score_pre_ka5: number;
  score_pre_ka6: number;
  score_pre_ka7: number;
  score_pre_ka8: number;
  score_pre_ka9: number;
  score_pre_ka_pct_cm: number;
  sickch_q01_post: number | null;
  sickch_q01_pre: number | null;
  sickch_q02_post: number | null;
  sickch_q02_pre: number | null;
  sickch_q03_post: number | null;
  sickch_q03_pre: number | null;
  sickch_q04_post: number | null;
  sickch_q04_pre: number | null;
  sickch_q05_post: number | null;
  sickch_q05_pre: number | null;
  sickch_q06_post: number | null;
  sickch_q06_pre: number | null;
  sickch_score_cat_post: number | null;
  sickch_score_cat_pre: number | null;
  sickch_score_pc_post: number | null;
  sickch_score_pc_pre: number | null;
  sickch_score_post: number | null;
  sickch_score_pre: number | null;
  treated: number;
  unit1_kaq_post: number;
  unit1_kaq_pre: number;
  unit2_kaq_post: number;
  unit2_kaq_pre: number;
  unit3_kaq_post: number;
  unit3_kaq_pre: number;
  unit4_kaq_post: number;
  unit4_kaq_pre: number;
  unit5_kaq_post: number;
  unit5_kaq_pre: number;
  unit6_kaq_post: number;
  unit6_kaq_pre: number;
  user_id: number;
  username: string;
  woreda: string;
  year: string;
  zone: string;
}

const EthRmnchColumns: ColDef<IEthRmnch, any>[] = [
  { field: "age", headerName: "Age" },
  { field: "all_assessment", headerName: "All Assessment" },
  { field: "any_assessment", headerName: "Any Assessment" },
  { field: "attend_yn", headerName: "Attend Y/N" },
  { field: "attendance_status", headerName: "Attendance Status" },
  { field: "completed_post_bte", headerName: "Completed Post BTE" },
  { field: "completed_post_ka", headerName: "Completed Post KA" },
  { field: "completed_post_kg", headerName: "Completed Post KG" },
  { field: "completed_post_lr", headerName: "Completed Post LR" },
  { field: "completed_post_se", headerName: "Completed Post SE" },
  { field: "completed_post_sus", headerName: "Completed Post SUS" },
  { field: "completed_pre_bg", headerName: "Completed Pre BG" },
  { field: "completed_pre_dt", headerName: "Completed Pre DT" },
  { field: "completed_pre_ka", headerName: "Completed Pre KA" },
  { field: "completed_pre_se", headerName: "Completed Pre SE" },
  { field: "composite_pass_post", headerName: "Composite Pass Post" },
  { field: "composite_pass_pre", headerName: "Composite Pass Pre" },
  { field: "composite_score_post", headerName: "Composite Score Post" },
  { field: "composite_score_pre", headerName: "Composite Score Pre" },
  { field: "date_inserted", headerName: "Date Inserted" },
  { field: "date_joined", headerName: "Date Joined" },
  { field: "day", headerName: "Day" },
  { field: "echis_training", headerName: "Echis Training" },
  { field: "education_level", headerName: "Education Level" },
  { field: "first_name", headerName: "First Name" },
  { field: "fp_q01_post", headerName: "FP Q01 Post" },
  { field: "fp_q01_pre", headerName: "FP Q01 Pre" },
  { field: "fp_q02_post", headerName: "FP Q02 Post" },
  { field: "fp_q02_pre", headerName: "FP Q02 Pre" },
  { field: "fp_q03_post", headerName: "FP Q03 Post" },
  { field: "fp_q03_pre", headerName: "FP Q03 Pre" },
  { field: "fp_q04_post", headerName: "FP Q04 Post" },
  { field: "fp_q04_pre", headerName: "FP Q04 Pre" },
  { field: "fp_q05_post", headerName: "FP Q05 Post" },
  { field: "fp_q05_pre", headerName: "FP Q05 Pre" },
  { field: "fp_q06_post", headerName: "FP Q06 Post" },
  { field: "fp_q06_pre", headerName: "FP Q06 Pre" },
  { field: "fp_q07_post", headerName: "FP Q07 Post" },
  { field: "fp_q07_pre", headerName: "FP Q07 Pre" },
  { field: "fp_q08_post", headerName: "FP Q08 Post" },
  { field: "fp_q08_pre", headerName: "FP Q08 Pre" },
  { field: "fp_q09_post", headerName: "FP Q09 Post" },
  { field: "fp_q09_pre", headerName: "FP Q09 Pre" },
  { field: "fp_q10_post", headerName: "FP Q10 Post" },
  { field: "fp_q10_pre", headerName: "FP Q10 Pre" },
  { field: "fp_q11_post", headerName: "FP Q11 Post" },
  { field: "fp_q11_pre", headerName: "FP Q11 Pre" },
  { field: "fp_q12_post", headerName: "FP Q12 Post" },
  { field: "fp_q12_pre", headerName: "FP Q12 Pre" },
  { field: "fp_q13_post", headerName: "FP Q13 Post" },
  { field: "fp_q13_pre", headerName: "FP Q13 Pre" },
  { field: "fp_q14_post", headerName: "FP Q14 Post" },
  { field: "fp_q14_pre", headerName: "FP Q14 Pre" },
  { field: "fp_q15_post", headerName: "FP Q15 Post" },
  { field: "fp_q15_pre", headerName: "FP Q15 Pre" },
  { field: "fp_q16_post", headerName: "FP Q16 Post" },
  { field: "fp_q16_pre", headerName: "FP Q16 Pre" },
  { field: "fp_q17_post", headerName: "FP Q17 Post" },
  { field: "fp_q17_pre", headerName: "FP Q17 Pre" },
  { field: "fp_score_cat_post", headerName: "FP Score Category Post" },
  { field: "fp_score_cat_pre", headerName: "FP Score Category Pre" },
  { field: "fp_score_pc_post", headerName: "FP Score Percentage Post" },
  { field: "fp_score_pc_pre", headerName: "FP Score Percentage Pre" },
  { field: "fp_score_post", headerName: "FP Score Post" },
  { field: "fp_score_pre", headerName: "FP Score Pre" },
  { field: "gender", headerName: "Gender" },
  { field: "grand_father", headerName: "Grand Father" },
  { field: "health_post", headerName: "Health Post" },
  { field: "health_post_type", headerName: "Health Post Type" },
  { field: "last_name", headerName: "Last Name" },
  { field: "last_update_date", headerName: "Last Update Date" },
  { field: "month", headerName: "Month" },
  { field: "muac_q01_post", headerName: "MUAC Q01 Post" },
  { field: "muac_q01_pre", headerName: "MUAC Q01 Pre" },
  { field: "muac_q02_post", headerName: "MUAC Q02 Post" },
  { field: "muac_q02_pre", headerName: "MUAC Q02 Pre" },
  { field: "muac_q03_post", headerName: "MUAC Q03 Post" },
  { field: "muac_q03_pre", headerName: "MUAC Q03 Pre" },
  { field: "muac_q04_post", headerName: "MUAC Q04 Post" },
  { field: "muac_q04_pre", headerName: "MUAC Q04 Pre" },
  { field: "muac_q05_post", headerName: "MUAC Q05 Post" },
  { field: "muac_q05_pre", headerName: "MUAC Q05 Pre" },
  { field: "muac_q06_post", headerName: "MUAC Q06 Post" },
  { field: "muac_q06_pre", headerName: "MUAC Q06 Pre" },
  { field: "muac_q07_post", headerName: "MUAC Q07 Post" },
  { field: "muac_q07_pre", headerName: "MUAC Q07 Pre" },
  { field: "muac_q08_post", headerName: "MUAC Q08 Post" },
  { field: "muac_q08_pre", headerName: "MUAC Q08 Pre" },
  { field: "muac_q09_post", headerName: "MUAC Q09 Post" },
  { field: "muac_q09_pre", headerName: "MUAC Q09 Pre" },
  { field: "muac_q10_post", headerName: "MUAC Q10 Post" },
  { field: "muac_q10_pre", headerName: "MUAC Q10 Pre" },
  { field: "muac_q11_post", headerName: "MUAC Q11 Post" },
  { field: "muac_q11_pre", headerName: "MUAC Q11 Pre" },
  { field: "muac_score_cat_post", headerName: "MUAC Score Category Post" },
  { field: "muac_score_cat_pre", headerName: "MUAC Score Category Pre" },
  { field: "muac_score_pc_post", headerName: "MUAC Score Percentage Post" },
  { field: "muac_score_pc_pre", headerName: "MUAC Score Percentage Pre" },
  { field: "muac_score_post", headerName: "MUAC Score Post" },
  { field: "muac_score_pre", headerName: "MUAC Score Pre" },
  { field: "nb_q01_post", headerName: "NB Q01 Post" },
  { field: "nb_q01_pre", headerName: "NB Q01 Pre" },
  { field: "nb_q02_post", headerName: "NB Q02 Post" },
  { field: "nb_q02_pre", headerName: "NB Q02 Pre" },
  { field: "nb_q03_post", headerName: "NB Q03 Post" },
  { field: "nb_q03_pre", headerName: "NB Q03 Pre" },
  { field: "nb_q04_post", headerName: "NB Q04 Post" },
  { field: "nb_q04_pre", headerName: "NB Q04 Pre" },
  { field: "nb_q05_post", headerName: "NB Q05 Post" },
  { field: "nb_q05_pre", headerName: "NB Q05 Pre" },
  { field: "nb_q06_post", headerName: "NB Q06 Post" },
  { field: "nb_q06_pre", headerName: "NB Q06 Pre" },
  { field: "nb_q07_post", headerName: "NB Q07 Post" },
  { field: "nb_q07_pre", headerName: "NB Q07 Pre" },
  { field: "nb_q08_post", headerName: "NB Q08 Post" },
  { field: "nb_q08_pre", headerName: "NB Q08 Pre" },
  { field: "nb_q09_post", headerName: "NB Q09 Post" },
  { field: "nb_q09_pre", headerName: "NB Q09 Pre" },
  { field: "nb_score_cat_post", headerName: "NB Score Category Post" },
  { field: "nb_score_cat_pre", headerName: "NB Score Category Pre" },
  { field: "nb_score_pc_post", headerName: "NB Score Percentage Post" },
  { field: "nb_score_pc_pre", headerName: "NB Score Percentage Pre" },
  { field: "nb_score_post", headerName: "NB Score Post" },
  { field: "nb_score_pre", headerName: "NB Score Pre" },
  { field: "participant_id", headerName: "Participant ID" },
  { field: "participant_type", headerName: "Participant Type" },
  { field: "phcu", headerName: "PHCU" },
  { field: "phone_number", headerName: "Phone Number" },
  { field: "post_ka_passed_cm", headerName: "Post KA Passed CM" },
  { field: "pre_ka_passed_cm", headerName: "Pre KA Passed CM" },
  { field: "prepost_ka", headerName: "Pre/Post KA" },
  { field: "q_post_kg_knowledge_gain", headerName: "Q Post KG Knowledge Gain" },
  { field: "q_post_lr_accessible", headerName: "Q Post LR Accessible" },
  { field: "q_post_lr_effectively", headerName: "Q Post LR Effectively" },
  { field: "q_post_lr_engaging", headerName: "Q Post LR Engaging" },
  { field: "q_post_lr_inperson", headerName: "Q Post LR In-Person" },
  { field: "q_post_lr_length", headerName: "Q Post LR Length" },
  { field: "q_post_lr_organized", headerName: "Q Post LR Organized" },
  { field: "q_post_lr_satisfied", headerName: "Q Post LR Satisfied" },
  { field: "q_post_lr_understand", headerName: "Q Post LR Understand" },
  { field: "q_pre_bg_english", headerName: "Q Pre BG English" },
  { field: "q_pre_bg_experience", headerName: "Q Pre BG Experience" },
  { field: "q_pre_bg_irt", headerName: "Q Pre BG IRT" },
  { field: "q_pre_bg_irt_rmnch", headerName: "Q Pre BG IRT RMNCH" },
  { field: "q_pre_bg_training", headerName: "Q Pre BG Training" },
  { field: "region", headerName: "Region" },
  { field: "score_post_ka1", headerName: "Score Post KA1" },
  { field: "score_post_ka10", headerName: "Score Post KA10" },
  { field: "score_post_ka11", headerName: "Score Post KA11" },
  { field: "score_post_ka12", headerName: "Score Post KA12" },
  { field: "score_post_ka13", headerName: "Score Post KA13" },
  { field: "score_post_ka14", headerName: "Score Post KA14" },
  { field: "score_post_ka15", headerName: "Score Post KA15" },
  { field: "score_post_ka16", headerName: "Score Post KA16" },
  { field: "score_post_ka17", headerName: "Score Post KA17" },
  { field: "score_post_ka18", headerName: "Score Post KA18" },
  { field: "score_post_ka19", headerName: "Score Post KA19" },
  { field: "score_post_ka2", headerName: "Score Post KA2" },
  { field: "score_post_ka20", headerName: "Score Post KA20" },
  { field: "score_post_ka21", headerName: "Score Post KA21" },
  { field: "score_post_ka22", headerName: "Score Post KA22" },
  { field: "score_post_ka23", headerName: "Score Post KA23" },
  { field: "score_post_ka24", headerName: "Score Post KA24" },
  { field: "score_post_ka25", headerName: "Score Post KA25" },
  { field: "score_post_ka26", headerName: "Score Post KA26" },
  { field: "score_post_ka27", headerName: "Score Post KA27" },
  { field: "score_post_ka28", headerName: "Score Post KA28" },
  { field: "score_post_ka29", headerName: "Score Post KA29" },
  { field: "score_post_ka3", headerName: "Score Post KA3" },
  { field: "score_post_ka30", headerName: "Score Post KA30" },
  { field: "score_post_ka4", headerName: "Score Post KA4" },
  { field: "score_post_ka5", headerName: "Score Post KA5" },
  { field: "score_post_ka6", headerName: "Score Post KA6" },
  { field: "score_post_ka7", headerName: "Score Post KA7" },
  { field: "score_post_ka8", headerName: "Score Post KA8" },
  { field: "score_post_ka9", headerName: "Score Post KA9" },
  { field: "score_post_ka_pct_cm", headerName: "Score Post KA Percentage CM" },
  { field: "score_pre_ka1", headerName: "Score Pre KA1" },
  { field: "score_pre_ka10", headerName: "Score Pre KA10" },
  { field: "score_pre_ka11", headerName: "Score Pre KA11" },
  { field: "score_pre_ka12", headerName: "Score Pre KA12" },
  { field: "score_pre_ka13", headerName: "Score Pre KA13" },
  { field: "score_pre_ka14", headerName: "Score Pre KA14" },
  { field: "score_pre_ka15", headerName: "Score Pre KA15" },
  { field: "score_pre_ka16", headerName: "Score Pre KA16" },
  { field: "score_pre_ka17", headerName: "Score Pre KA17" },
  { field: "score_pre_ka18", headerName: "Score Pre KA18" },
  { field: "score_pre_ka19", headerName: "Score Pre KA19" },
  { field: "score_pre_ka2", headerName: "Score Pre KA2" },
  { field: "score_pre_ka20", headerName: "Score Pre KA20" },
  { field: "score_pre_ka21", headerName: "Score Pre KA21" },
  { field: "score_pre_ka22", headerName: "Score Pre KA22" },
  { field: "score_pre_ka23", headerName: "Score Pre KA23" },
  { field: "score_pre_ka24", headerName: "Score Pre KA24" },
  { field: "score_pre_ka25", headerName: "Score Pre KA25" },
  { field: "score_pre_ka26", headerName: "Score Pre KA26" },
  { field: "score_pre_ka27", headerName: "Score Pre KA27" },
  { field: "score_pre_ka28", headerName: "Score Pre KA28" },
  { field: "score_pre_ka29", headerName: "Score Pre KA29" },
  { field: "score_pre_ka3", headerName: "Score Pre KA3" },
  { field: "score_pre_ka30", headerName: "Score Pre KA30" },
  { field: "score_pre_ka4", headerName: "Score Pre KA4" },
  { field: "score_pre_ka5", headerName: "Score Pre KA5" },
  { field: "score_pre_ka6", headerName: "Score Pre KA6" },
  { field: "score_pre_ka7", headerName: "Score Pre KA7" },
  { field: "score_pre_ka8", headerName: "Score Pre KA8" },
  { field: "score_pre_ka9", headerName: "Score Pre KA9" },
  { field: "score_pre_ka_pct_cm", headerName: "Score Pre KA Percentage CM" },
  { field: "sickch_q01_post", headerName: "sickch_q01_post" },
  { field: "sickch_q01_pre", headerName: "sickch_q01_pre" },
  { field: "sickch_q02_post", headerName: "sickch_q02_post" },
  { field: "sickch_q02_pre", headerName: "sickch_q02_pre" },
  { field: "sickch_q03_post", headerName: "sickch_q03_post" },
  { field: "sickch_q03_pre", headerName: "sickch_q03_pre" },
  { field: "sickch_q04_post", headerName: "sickch_q04_post" },
  { field: "sickch_q04_pre", headerName: "sickch_q04_pre" },
  { field: "sickch_q05_post", headerName: "sickch_q05_post" },
  { field: "sickch_q05_pre", headerName: "sickch_q05_pre" },
  { field: "sickch_q06_post", headerName: "sickch_q06_post" },
  { field: "sickch_q06_pre", headerName: "sickch_q06_pre" },
  { field: "sickch_score_cat_post", headerName: "sickch_score_cat_post" },
  { field: "sickch_score_cat_pre", headerName: "sickch_score_cat_pre" },
  { field: "sickch_score_pc_post", headerName: "sickch_score_pc_post" },
  { field: "sickch_score_pc_pre", headerName: "sickch_score_pc_pre" },
  { field: "sickch_score_post", headerName: "sickch_score_post" },
  { field: "sickch_score_pre", headerName: "sickch_score_pre" },
  { field: "treated", headerName: "treated" },
  { field: "unit1_kaq_post", headerName: "unit1_kaq_post" },
  { field: "unit1_kaq_pre", headerName: "unit1_kaq_pre" },
  { field: "unit2_kaq_post", headerName: "unit2_kaq_post" },
  { field: "unit2_kaq_pre", headerName: "unit2_kaq_pre" },
  { field: "unit3_kaq_post", headerName: "unit3_kaq_post" },
  { field: "unit3_kaq_pre", headerName: "unit3_kaq_pre" },
  { field: "unit4_kaq_post", headerName: "unit4_kaq_post" },
  { field: "unit4_kaq_pre", headerName: "unit4_kaq_pre" },
  { field: "unit5_kaq_post", headerName: "unit5_kaq_post" },
  { field: "unit5_kaq_pre", headerName: "unit5_kaq_pre" },
  { field: "unit6_kaq_post", headerName: "unit6_kaq_post" },
  { field: "unit6_kaq_pre", headerName: "unit6_kaq_pre" },
  { field: "user_id", headerName: "user_id" },
  { field: "username", headerName: "username" },
  { field: "woreda", headerName: "woreda" },
  { field: "year", headerName: "Year" },
  { field: "zone", headerName: "Zone" },
];

export default EthRmnchColumns;
