export type OkrStatus =
  | "achieved"
  | "on_track"
  | "delayed"
  | "okr_under_review"
  | "at_risk";

export type MilestoneStatus = "not_started" | "in_progress" | "completed";

export type MeasurementUnit =
  | "percent"
  | "number"
  | "currency"
  | "counties"
  | "yes_no"
  | "qualitative";

/** Units where progress is tracked by narrative only — no numeric value. */
export const isNarrativeUnit = (unit: MeasurementUnit): boolean =>
  unit === "qualitative" || unit === "yes_no";

export type CalculationMethod = "latest" | "cumulative" | "average";

export type MetricType = "percentage" | "binary" | "count" | "yes_no";

export type ChartType = "bar" | "line" | "pie" | "geomap" | "yes_no";

export type ConfidenceLevel = "low" | "medium" | "high";

export interface OkrGroup {
  okrGroupId: number;
  okrGroupToc: string;
  okrGroupObjective: string;
}

/** Normalized objective entity */
export interface OkrObjectiveData {
  id: string;
  number: number;   // matches the numeric prefix of KR IDs (e.g. 2 → KRs 2.1, 2.2)
  text: string;
  toc: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OkrMonthlyUpdate {
  numerator?: number;
  denominatorOverride?: number;

  value: number | ""; // empty string allowed per sample data
  month: number;
  year: number;
  narrative: string;
  risks?: string[];
  mitigations?: string[];

  status?: OkrStatus;

  //
  createdByEmail?: string;
  updatedByEmail?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface OkrMilestone {
  milestone: string;
  dueDate: string; // ISO date (YYYY-MM-DD)
  status: MilestoneStatus;
  completionDate?: string; // present only if completed
}

export interface OkrBaseData {
  id: string; // cuid
  okrId: string;
  // Normalized objective relation
  objectiveId: string;
  okrObjective: OkrObjectiveData;
  // Flattened aliases populated by getAllOKRs — keep existing consumers working
  objective: string;       // === okrObjective.text
  objectiveToc: string;    // === okrObjective.toc
  keyResult: string;
  priority: number;
  status: OkrStatus;

  // measurement
  unit: MeasurementUnit;
  baseline: number;
  targetValue: number;
  minValue?: number;
  maxValue?: number;
  calculationMethod: CalculationMethod;
  valuePrompt?: string;
  valueHint?: string;

  // NEW: For percentage-based OKRs
  denominator?: number;
  denominatorLabel?: string;
  numeratorLabel?: string;

  // period
  periodStart: string;
  periodEnd: string;

  // char
  chartType: ChartType;
  chartMetricType: MetricType;
  chartMetricUnit: string;
}

export interface OkrRecord extends OkrBaseData {
  // tracking
  progress: number; // 0–100
  confidenceLevel: ConfidenceLevel;

  monthlyUpdates: OkrMonthlyUpdate[];
  milestones: OkrMilestone[];

  // soft delete
  archived?: boolean;
  archivedAt?: string;
  archivedBy?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface OkrBaseInput {
  okrId: string;
  objectiveId: string;
  // Kept for UI convenience (pre-fill display); not written to Okr table directly
  objectiveToc?: string;
  objective?: string;
  keyResult: string;
  priority: number;
  unit: MeasurementUnit;
  baseline: number;
  targetValue: number;
  minValue?: number;
  maxValue?: number;
  calculationMethod: CalculationMethod;
  valuePrompt?: string;
  valueHint?: string;
  // NEW: For percentage-based OKRs
  denominator?: number;
  denominatorLabel?: string;
  numeratorLabel?: string;

  periodStart: string;
  periodEnd: string;
  chartType: ChartType;
  chartMetricType: MetricType;
  chartMetricUnit: string;
}
