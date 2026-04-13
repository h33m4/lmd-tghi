import { ZodObject, ZodTypeAny } from "zod";
import { CustomCellRendererProps } from "ag-grid-react";

export interface BaseRecord {
  id: string | number;
  last_update_date?: string;
  updated_by?: string;
}

export interface IKpiMetadata {
  Program: string;
  ID: string;
  TOC: string;
  "TOC Description": string;
  "Indicator Name": string;
  Definition: string;
  "Data Source": string;
  "Contributing Activities": string;
  Notes: string;
  "Person Responsible": string;
  Approvers: string;
}

export interface ViewRecordModalProps<T extends BaseRecord> {
  props: CustomCellRendererProps<T>;
  schema: ZodObject<Record<string, ZodTypeAny>>;
  onEditCallback: () => void;
  requiredPermissions?: string[];
}

export type ButtonStatus = "default" | "loading" | "success" | "error";

export interface FormState {
  isEditMode: boolean;
  buttonStatus: ButtonStatus;
  formError: string | null;
}

export interface MetadataState {
  data: IKpiMetadata[];
  isLoading: boolean;
  error: string | null;
  currentMetadata: IKpiMetadata | null;
}
