/**
 * Catalog of all known app routes that can be toggled between public/protected.
 * Admin/auth/settings routes are excluded — those should never be made public.
 */

export type RouteEntry = {
  route: string;
  label: string;
  category: string;
  description?: string;
};

export const ROUTE_CATALOG: RouteEntry[] = [
  // ── General ──────────────────────────────────────────────────────────────
  { route: "/", label: "Public Landing", category: "General", description: "Root landing page" },
  { route: "/home", label: "Portal Home", category: "General", description: "Main dashboard after login" },
  { route: "/privacy-policy", label: "Privacy Policy", category: "General" },
  { route: "/external-kpi-dashboard", label: "External KPI Dashboard", category: "General", description: "Embeddable KPI view for external use" },
  { route: "/recap_2025", label: "2025 Recap", category: "General" },
  { route: "/resources", label: "Resources", category: "General" },
  { route: "/learning-agenda", label: "Learning Agenda", category: "General" },
  { route: "/lmh-statistics-ref-guide", label: "Statistics Reference Guide", category: "General" },
  { route: "/aff-dashboard", label: "AFF Dashboard", category: "General" },

  // ── Documentation ─────────────────────────────────────────────────────────
  { route: "/docs", label: "Docs Home", category: "Documentation" },
  { route: "/docs/about-lmd2", label: "About LMD 2.0", category: "Documentation" },
  { route: "/docs/how-it-works", label: "How It Works", category: "Documentation" },
  { route: "/docs/user-guides", label: "User Guides", category: "Documentation" },
  { route: "/docs/faqs", label: "FAQs", category: "Documentation" },

  // ── KPI Dashboard ────────────────────────────────────────────────────────
  { route: "/kpi-dashboard", label: "KPI Dashboard", category: "KPI Dashboard" },
  { route: "/kpi-dashboard/global-scale", label: "Global Scale", category: "KPI Dashboard" },
  { route: "/kpi-dashboard/kpi-progress-summary", label: "KPI Progress Summary", category: "KPI Dashboard" },
  { route: "/kpi-dashboard/theory-of-change", label: "Theory of Change", category: "KPI Dashboard" },
  { route: "/kpi-dashboard/data-dictionary", label: "Data Dictionary", category: "KPI Dashboard" },
  { route: "/kpi-dashboard/kpi-change-log", label: "KPI Change Log", category: "KPI Dashboard" },
  { route: "/kpi-dashboard/faq", label: "KPI FAQ", category: "KPI Dashboard" },
  { route: "/kpi-dashboard/liberia", label: "Liberia KPIs", category: "KPI Dashboard" },
  { route: "/kpi-dashboard/malawi", label: "Malawi KPIs", category: "KPI Dashboard" },
  { route: "/kpi-dashboard/ethiopia", label: "Ethiopia KPIs", category: "KPI Dashboard" },
  { route: "/kpi-dashboard/sierra_leone", label: "Sierra Leone KPIs", category: "KPI Dashboard" },
  { route: "/kpi-dashboard/aff", label: "AFF KPIs", category: "KPI Dashboard" },

  // ── Liberia ───────────────────────────────────────────────────────────────
  { route: "/country-programs/liberia", label: "Liberia Overview", category: "Liberia" },
  { route: "/country-programs/liberia/overview/one-pager", label: "Liberia One-Pager", category: "Liberia" },
  { route: "/country-programs/liberia/dashboards", label: "Liberia Dashboards", category: "Liberia" },
  { route: "/country-programs/liberia/dashboards/okr-dashboard", label: "Liberia OKR Dashboard", category: "Liberia" },
  { route: "/country-programs/liberia/dashboards/nchap-scale", label: "Liberia NCHAP Scale", category: "Liberia" },
  { route: "/country-programs/liberia/dashboards/cha-module-1-summary", label: "Liberia CHA Module 1 Summary", category: "Liberia" },
  { route: "/country-programs/liberia/reports", label: "Liberia Reports", category: "Liberia" },
  { route: "/country-programs/liberia/reports/ecbis", label: "Liberia ECBIS Reports", category: "Liberia" },
  { route: "/country-programs/liberia/reports/data-reviews", label: "Liberia Data Reviews", category: "Liberia" },
  { route: "/country-programs/liberia/maps", label: "Liberia Maps", category: "Liberia" },
  { route: "/country-programs/liberia/program-data", label: "Liberia Program Data", category: "Liberia" },

  // ── Malawi ────────────────────────────────────────────────────────────────
  { route: "/country-programs/malawi", label: "Malawi Overview", category: "Malawi" },
  { route: "/country-programs/malawi/overview/one-pager", label: "Malawi One-Pager", category: "Malawi" },
  { route: "/country-programs/malawi/dashboards", label: "Malawi Dashboards", category: "Malawi" },
  { route: "/country-programs/malawi/dashboards/cbmnc-training", label: "Malawi CBMNC Training", category: "Malawi" },
  { route: "/country-programs/malawi/dashboards/ichis-training", label: "Malawi iCHIS Training", category: "Malawi" },
  { route: "/country-programs/malawi/reports", label: "Malawi Reports", category: "Malawi" },
  { route: "/country-programs/malawi/reports/data-reviews", label: "Malawi Data Reviews", category: "Malawi" },
  { route: "/country-programs/malawi/maps", label: "Malawi Maps", category: "Malawi" },
  { route: "/country-programs/malawi/program-data", label: "Malawi Program Data", category: "Malawi" },

  // ── Ethiopia ──────────────────────────────────────────────────────────────
  { route: "/country-programs/ethiopia", label: "Ethiopia Overview", category: "Ethiopia" },
  { route: "/country-programs/ethiopia/overview/one-pager", label: "Ethiopia One-Pager", category: "Ethiopia" },
  { route: "/country-programs/ethiopia/dashboards", label: "Ethiopia Dashboards", category: "Ethiopia" },
  { route: "/country-programs/ethiopia/dashboards/blended-irt-training", label: "Ethiopia Blended IRT Training", category: "Ethiopia" },
  { route: "/country-programs/ethiopia/dashboards/ncd-training", label: "Ethiopia NCD Training", category: "Ethiopia" },
  { route: "/country-programs/ethiopia/reports", label: "Ethiopia Reports", category: "Ethiopia" },
  { route: "/country-programs/ethiopia/reports/data-reviews", label: "Ethiopia Data Reviews", category: "Ethiopia" },
  { route: "/country-programs/ethiopia/maps", label: "Ethiopia Maps", category: "Ethiopia" },
  { route: "/country-programs/ethiopia/program-data", label: "Ethiopia Program Data", category: "Ethiopia" },

  // ── Sierra Leone ──────────────────────────────────────────────────────────
  { route: "/country-programs/sierra_leone", label: "Sierra Leone Overview", category: "Sierra Leone" },
  { route: "/country-programs/sierra_leone/overview/one-pager", label: "Sierra Leone One-Pager", category: "Sierra Leone" },
  { route: "/country-programs/sierra_leone/dashboards", label: "Sierra Leone Dashboards", category: "Sierra Leone" },
  { route: "/country-programs/sierra_leone/dashboards/egh-training", label: "Sierra Leone EGH Training", category: "Sierra Leone" },
  { route: "/country-programs/sierra_leone/dashboards/national-pre-service-training-for-chws", label: "Sierra Leone National Pre-Service Training", category: "Sierra Leone" },
  { route: "/country-programs/sierra_leone/reports", label: "Sierra Leone Reports", category: "Sierra Leone" },
  { route: "/country-programs/sierra_leone/reports/data-reviews", label: "Sierra Leone Data Reviews", category: "Sierra Leone" },
  { route: "/country-programs/sierra_leone/maps", label: "Sierra Leone Maps", category: "Sierra Leone" },
  { route: "/country-programs/sierra_leone/program-data", label: "Sierra Leone Program Data", category: "Sierra Leone" },
];

export const CATEGORY_ORDER = [
  "General",
  "Documentation",
  "KPI Dashboard",
  "Liberia",
  "Malawi",
  "Ethiopia",
  "Sierra Leone",
];
