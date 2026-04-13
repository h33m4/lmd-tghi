import { ReactNode } from "react";

export interface ServerSuccessResponse {
  success: string;
}

export interface ServerErrorResponse {
  error: string;
}

export type LmhPrograms =
  | "Liberia"
  | "Malawi"
  | "Ethiopia"
  | "Sierra_Leone"
  | "AFF";

// use by all server action calls

export type IPageName =
  | "Home"
  | "KPI dashboard"
  | "Country Programs"
  | "AFF Dashboard"
  | "Resources";

export type IButtonStatus = "default" | "loading" | "disabled";

export interface IResetPassordFormData {
  email: string;
  recoveryCode: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface INavItem {
  title: string;
  icon: any;
  href: string;
}

type ISideBarNavChildren = {
  name: string;
  href: string;
};

export type ISideBarNavigationData = {
  name: string;
  icon: React.ComponentType<any>; // Assuming you are using React and these icons are components
  current: boolean;
  href: string;
  children?: ISideBarNavChildren[]; // Recursive type for nested navigation items
};

export type ICountryStatsData = {
  "Rural Population": string;
  "Child Mortality": string;
  "Maternal Mortality": string;
  "Basic Vaccine Coverage": string;
  "HIV Prevalence": string;
  "Health Worker Coverage": string;
};

export type ITocPillar = "Upskill" | "Deliver" | "Strengthen";

export type IKeyCountyProjectData = {
  title: string;
  description: string;
  tocPillar: ITocPillar;
  readMoreUrl: string;
};

export interface ICountryProgram {
  name: string;
  code: string;
}

export type ICountryNames = "Liberia" | "Malawi" | "Ethiopia" | "Sierra_Leone";
export type LMH_ProgramCountries =
  | "Liberia"
  | "Ethiopia"
  | "Malawi"
  | "Sierra_Leone";

export interface ITicketInfo {
  id?: string;
  category: string;
  lastUpdatedAt?: string;
  comments?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  openedBy: string;
  dateOpened: string;
  actionButton?: unknown;
}
