import {
  CalculationMethod,
  ChartType,
  MeasurementUnit,
  MetricType,
  OkrBaseData,
  OkrBaseInput,
} from "@/types/okrTracker";

// ─── Constants ────────────────────────────────────────────────────────────────

export const UNIT_OPTIONS: MeasurementUnit[] = [
  "percent",
  "number",
  "currency",
  "counties",
  "yes_no",
  "qualitative",
];
export const CALCULATION_OPTIONS: CalculationMethod[] = [
  "latest",
  "cumulative",
  "average",
];

/** Per-unit description shown as inline helper text under the Unit picker. */
export const UNIT_DESCRIPTIONS: Record<MeasurementUnit, string> = {
  percent:
    "A ratio expressed as 0–100%. Use when progress is a share of a total — e.g. % of CHAs trained. Calculation defaults to 'latest' since the most recent value already represents cumulative progress.",
  number:
    "A raw whole or decimal count — e.g. number of facilities supported. Use 'cumulative' when each entry adds to a running total, or 'latest' when each entry replaces the previous figure.",
  currency:
    "A monetary amount (USD or local currency). Behaves like 'number' but signals financial data. Use 'cumulative' for spend/disbursements that accumulate over time.",
  counties:
    "A count of geographic counties or districts covered. Typically tracked cumulatively as coverage expands. Consider pairing with a geomap chart type.",
  yes_no:
    "A binary milestone — either achieved (1) or not (0). Use for deliverables with a clear done/not-done state, e.g. 'Policy submitted'. Progress is 100% when value = 1.",
  qualitative:
    "No numeric value — progress is captured through narrative text only. Use for KRs where outcomes can't be meaningfully quantified, e.g. 'Stakeholder engagement strategy developed'.",
};

/** Sensible defaults pre-filled when the user switches measurement unit. */
export const UNIT_PREFILLS: Record<MeasurementUnit, Partial<OkrBaseInput>> = {
  percent: {
    calculationMethod: "latest",
    baseline: 0,
    targetValue: 100,
    chartMetricType: "percentage",
    chartMetricUnit: "%",
    chartType: "bar",
  },
  number: {
    calculationMethod: "cumulative",
    baseline: 0,
    targetValue: 100,
    chartMetricType: "count",
    chartMetricUnit: "",
    chartType: "bar",
  },
  currency: {
    calculationMethod: "cumulative",
    baseline: 0,
    targetValue: 10000,
    chartMetricType: "count",
    chartMetricUnit: "USD",
    chartType: "bar",
  },
  counties: {
    calculationMethod: "cumulative",
    baseline: 0,
    targetValue: 15,
    minValue: 0,
    maxValue: 15,
    chartMetricType: "count",
    chartMetricUnit: "counties",
    chartType: "geomap",
  },
  yes_no: {
    calculationMethod: "latest",
    baseline: 0,
    targetValue: 1,
    minValue: undefined,
    maxValue: undefined,
    chartMetricType: "yes_no",
    chartMetricUnit: "",
    chartType: "yes_no",
  },
  qualitative: {
    calculationMethod: "latest",
    baseline: 0,
    targetValue: 100,
    chartMetricType: "binary",
    chartMetricUnit: "",
    chartType: "bar",
  },
};

export const METRIC_TYPE_OPTIONS: MetricType[] = [
  "percentage",
  "binary",
  "count",
  "yes_no",
];
export const CHART_TYPE_OPTIONS: ChartType[] = [
  "bar",
  "line",
  "pie",
  "geomap",
  "yes_no",
];

export const EMPTY_FORM: Partial<OkrBaseInput> = {
  okrId: "",
  objectiveToc: "",
  objective: "",
  keyResult: "",
  priority: 1,
  unit: "percent",
  baseline: 0,
  targetValue: 100,
  calculationMethod: "latest",
  periodStart: "",
  periodEnd: "",
  chartMetricType: "percentage",
  chartType: "bar",
  chartMetricUnit: "%",
};

export const UNIT_COLOR: Record<string, { bg: string; text: string; bar: string }> = {
  percent: { bg: "bg-primary/10", text: "text-primary", bar: "bg-primary" },
  number: {
    bg: "bg-lmh-green/10",
    text: "text-lmh-green",
    bar: "bg-lmh-green",
  },
  currency: {
    bg: "bg-lmh-yellow/20",
    text: "text-yellow-700 dark:text-lmh-yellow",
    bar: "bg-lmh-yellow",
  },
  counties: { bg: "bg-lmh-pink/10", text: "text-lmh-pink", bar: "bg-lmh-pink" },
  yes_no: {
    bg: "bg-lmh-blue/10",
    text: "text-lmh-dark-blue",
    bar: "bg-lmh-blue",
  },
  qualitative: {
    bg: "bg-purple-100 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-400",
    bar: "bg-purple-500",
  },
};

export const unitColor = (unit: string) => UNIT_COLOR[unit] ?? UNIT_COLOR.percent;

export const formatDate = (v: string | Date | null | undefined) => {
  if (!v) return "";
  if (v instanceof Date) return v.toISOString().split("T")[0];
  return String(v);
};

export const fmtDisplay = (v: string | Date | null | undefined) => {
  if (!v) return "—";
  const d = new Date(String(v));
  return isNaN(d.getTime())
    ? String(v)
    : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export function validateEnums(d: Partial<OkrBaseData>): string | null {
  if (d.unit && !UNIT_OPTIONS.includes(d.unit))
    return `Invalid unit: ${d.unit}`;
  if (d.calculationMethod && !CALCULATION_OPTIONS.includes(d.calculationMethod))
    return `Invalid calc method: ${d.calculationMethod}`;
  if (d.chartMetricType && !METRIC_TYPE_OPTIONS.includes(d.chartMetricType))
    return `Invalid metric type: ${d.chartMetricType}`;
  if (d.chartType && !CHART_TYPE_OPTIONS.includes(d.chartType))
    return `Invalid chart type: ${d.chartType}`;
  return null;
}
