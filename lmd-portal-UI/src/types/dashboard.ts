export type DashbaordStatus = "archived" | "draft" | "published";

export interface IDashboardData {
  id: number;
  title: string;
  description: string;
  status: DashbaordStatus;
  program: string;
  bi_tool: string;
  embed_url: string;
  slug: string;
  tags: string;
  project?: string;
  data_source?: string | string[];
  country: string | null;
  created_by: string;
  date_inserted: string;
  published_at: string;
  last_update_date: string;
}

export interface ILocalCustomDashboardData {
  id: number;
  title: string;
  description: string;
  status: DashbaordStatus;
  program: string;
  bi_tool: string;
  page_url: string;
  embed_url: string;
  slug: string;
  tags: string;
  data_source: string[];
  country: string | null;
  created_by: string;
  date_inserted: string;
  published_at: string;
  last_update_date: string;
}

export const dashboardStatusOptions = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export const dashboardBiToolsOptions = [
  { value: "all", label: "All BI Tools" },
  { value: "powerbi", label: "Power BI" },
  { value: "looker_studio", label: "Looker Studio" },
  { value: "tableau", label: "Tableau" },
  { value: "qlik", label: "Qlik" },
  { value: "other", label: "Other" },
];

export const dashboardSortOptions = [
  { value: "updated_desc", label: "Recently Updated" },
  { value: "created_desc", label: "Recently Created" },
  { value: "title_asc", label: "Title (A-Z)" },
  { value: "status_asc", label: "Status" },
];
