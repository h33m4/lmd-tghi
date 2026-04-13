import {
  CalculationMethod,
  ChartType,
  ConfidenceLevel,
  MeasurementUnit,
  MetricType,
  MilestoneStatus,
  OkrRecord,
  OkrStatus,
} from "@/types/okrTracker";

/** Transform a raw Prisma OKR row (already flattenObjective'd) into OkrRecord. */
export function transformDbOkrToRecord(dbOkr: any): OkrRecord {
  return {
    id: dbOkr.id,
    okrId: dbOkr.okrId,
    objectiveId: dbOkr.objectiveId,
    okrObjective: dbOkr.okrObjective,
    objectiveToc: dbOkr.objectiveToc,
    objective: dbOkr.objective,
    keyResult: dbOkr.keyResult,
    priority: dbOkr.priority,
    status: dbOkr.status as OkrStatus,
    progress: dbOkr.progress ?? 0,
    confidenceLevel: dbOkr.confidenceLevel as ConfidenceLevel,

    unit: dbOkr.unit as MeasurementUnit,
    baseline: dbOkr.baseline,
    targetValue: dbOkr.targetValue,
    minValue: dbOkr.minValue,
    maxValue: dbOkr.maxValue,
    calculationMethod: dbOkr.calculationMethod as CalculationMethod,
    valuePrompt: dbOkr.valuePrompt,
    valueHint: dbOkr.valueHint,

    denominator: dbOkr.denominator ?? null,
    denominatorLabel: dbOkr.denominatorLabel ?? null,
    numeratorLabel: dbOkr.numeratorLabel ?? null,

    periodStart:
      typeof dbOkr.periodStart === "string"
        ? dbOkr.periodStart
        : dbOkr.periodStart?.toISOString().split("T")[0],
    periodEnd:
      typeof dbOkr.periodEnd === "string"
        ? dbOkr.periodEnd
        : dbOkr.periodEnd?.toISOString().split("T")[0],

    chartType: dbOkr.chartType as ChartType,
    chartMetricType: dbOkr.chartMetricType as MetricType,
    chartMetricUnit: dbOkr.chartMetricUnit,

    milestones: (dbOkr.milestones || []).map((m: any) => ({
      milestone: m.milestone,
      dueDate:
        typeof m.dueDate === "string"
          ? m.dueDate
          : m.dueDate?.toISOString().split("T")[0],
      status: m.status as MilestoneStatus,
      completionDate: m.completionDate
        ? typeof m.completionDate === "string"
          ? m.completionDate
          : m.completionDate?.toISOString().split("T")[0]
        : undefined,
    })),

    monthlyUpdates: (dbOkr.monthlyUpdates || []).map((mu: any) => ({
      month: mu.month,
      year: mu.year,
      numerator: mu.numerator,
      denominatorOverride: mu.denominatorOverride,
      value: mu.value ?? "",
      narrative: mu.narrative ?? "",
      status: mu.status,
      risks: mu.risks || [],
      mitigations: mu.mitigations || [],
      createdByEmail: mu.createdByEmail ?? undefined,
      updatedByEmail: mu.updatedByEmail ?? undefined,
      createdAt: mu.createdAt
        ? typeof mu.createdAt === "string"
          ? mu.createdAt
          : mu.createdAt.toISOString()
        : undefined,
      updatedAt: mu.updatedAt
        ? typeof mu.updatedAt === "string"
          ? mu.updatedAt
          : mu.updatedAt.toISOString()
        : undefined,
    })),

    archived: dbOkr.archived,
    archivedAt: dbOkr.archivedAt,
    archivedBy: dbOkr.archivedBy,
  };
}
