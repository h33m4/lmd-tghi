import { ColDef } from "ag-grid-community";

export interface ILibChwMasterList {
  _merge: string | null;
  chw_id: string;
  chwid_chss_moh: string;
  comm10_moh: string | null;
  comm11_moh: string | null;
  comm12_moh: string | null;
  comm13_moh: string | null;
  comm14_moh: string | null;
  comm15_moh: string | null;
  comm16_moh: string | null;
  comm17_moh: string | null;
  comm18_moh: string | null;
  comm19_moh: string | null;
  comm1_moh: string;
  comm2_moh: string | null;
  comm3_moh: string | null;
  comm4_moh: string | null;
  comm5_moh: string | null;
  comm6_moh: string | null;
  comm7_moh: string | null;
  comm8_moh: string | null;
  comm9_moh: string | null;
  comment: string | null;
  community: string | null;
  county: string;
  date_inserted: string;
  day: string;
  discrepancy: string | null;
  district: string;
  education_lmh: string | null;
  employ_status: string;
  end_date: string | null;
  facility: string;
  full_name: string;
  full_name_chss_moh: string;
  full_name_dho_moh: string | null;
  full_name_oic_moh: string | null;
  id: number;
  inactive_reason: string | null;
  last_update_date: string;
  license_lmh: string | null;
  lmh_managed: number;
  month: string;
  national_id_lmh: string | null;
  num_communities_moh: number;
  phone_mobilemoney_lmh: string | null;
  phone_number: string;
  phone_number_chss_moh: string;
  phone_number_dho_moh: string | null;
  phone_number_oic_moh: string | null;
  position: string;
  qualification_lmh: string | null;
  sex: string;
  sex_chss_moh: string;
  sex_dho_moh: string | null;
  sex_oic_moh: string | null;
  start_date_lmh: string | null;
  year: string;
}

const LibChwMasterListColumns: ColDef<ILibChwMasterList, any>[] = [
  { field: "_merge", headerName: "Merge Status" },
  { field: "chw_id", headerName: "CHW ID" },
  { field: "chwid_chss_moh", headerName: "CHWID CHSS MOH" },
  { field: "comm10_moh", headerName: "Community 10 MOH" },
  { field: "comm11_moh", headerName: "Community 11 MOH" },
  { field: "comm12_moh", headerName: "Community 12 MOH" },
  { field: "comm13_moh", headerName: "Community 13 MOH" },
  { field: "comm14_moh", headerName: "Community 14 MOH" },
  { field: "comm15_moh", headerName: "Community 15 MOH" },
  { field: "comm16_moh", headerName: "Community 16 MOH" },
  { field: "comm17_moh", headerName: "Community 17 MOH" },
  { field: "comm18_moh", headerName: "Community 18 MOH" },
  { field: "comm19_moh", headerName: "Community 19 MOH" },
  { field: "comm1_moh", headerName: "Community 1 MOH" },
  { field: "comm2_moh", headerName: "Community 2 MOH" },
  { field: "comm3_moh", headerName: "Community 3 MOH" },
  { field: "comm4_moh", headerName: "Community 4 MOH" },
  { field: "comm5_moh", headerName: "Community 5 MOH" },
  { field: "comm6_moh", headerName: "Community 6 MOH" },
  { field: "comm7_moh", headerName: "Community 7 MOH" },
  { field: "comm8_moh", headerName: "Community 8 MOH" },
  { field: "comm9_moh", headerName: "Community 9 MOH" },
  { field: "comment", headerName: "Comment" },
  { field: "community", headerName: "Community" },
  { field: "county", headerName: "County" },
  { field: "date_inserted", headerName: "Date Inserted" },
  { field: "day", headerName: "Day" },
  { field: "discrepancy", headerName: "Discrepancy" },
  { field: "district", headerName: "District" },
  { field: "education_lmh", headerName: "Education LMH" },
  { field: "employ_status", headerName: "Employment Status" },
  { field: "end_date", headerName: "End Date" },
  { field: "facility", headerName: "Facility" },
  { field: "full_name", headerName: "Full Name" },
  { field: "full_name_chss_moh", headerName: "Full Name CHSS MOH" },
  { field: "full_name_dho_moh", headerName: "Full Name DHO MOH" },
  { field: "full_name_oic_moh", headerName: "Full Name OIC MOH" },
  { field: "id", headerName: "ID" },
  { field: "inactive_reason", headerName: "Inactive Reason" },
  { field: "last_update_date", headerName: "Last Update Date" },
  { field: "license_lmh", headerName: "License LMH" },
  { field: "lmh_managed", headerName: "LMH Managed" },
  { field: "month", headerName: "Month" },
  { field: "national_id_lmh", headerName: "National ID LMH" },
  { field: "num_communities_moh", headerName: "Number of Communities MOH" },
  { field: "phone_mobilemoney_lmh", headerName: "Phone Mobile Money LMH" },
  { field: "phone_number", headerName: "Phone Number" },
  { field: "phone_number_chss_moh", headerName: "Phone Number CHSS MOH" },
  { field: "phone_number_dho_moh", headerName: "Phone Number DHO MOH" },
  { field: "phone_number_oic_moh", headerName: "Phone Number OIC MOH" },
  { field: "position", headerName: "Position" },
  { field: "qualification_lmh", headerName: "Qualification LMH" },
  { field: "sex", headerName: "Sex" },
  { field: "sex_chss_moh", headerName: "Sex CHSS MOH" },
  { field: "sex_dho_moh", headerName: "Sex DHO MOH" },
  { field: "sex_oic_moh", headerName: "Sex OIC MOH" },
  { field: "start_date_lmh", headerName: "Start Date LMH" },
  { field: "year", headerName: "Year" },
];

export default LibChwMasterListColumns;
