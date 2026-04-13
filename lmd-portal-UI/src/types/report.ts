import { LmhPrograms } from ".";

export type ReportType =
  | "data_review"
  | "donor_report"
  | "impact_report"
  | "quarterly_report"
  | "annual_report"
  | "case_study"
  | "other";

export type ReportStatus = "archived" | "draft" | "published";

export interface Report {
  id: string;
  report_url: string;
  title: string;
  description: string;
  type: ReportType;
  tags: string;
  data_source: string;
  program: LmhPrograms;
  project: string;
  status: ReportStatus;
  uploaded_by: string;
  date_uploaded: string;
  date_updated: string;
  date_published?: string;
}

export interface ReportFormData
  extends Omit<Report, "id" | "date_uploaded" | "date_updated"> {}
