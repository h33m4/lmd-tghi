// actions/okr/okrs.ts
"use server";

import { prismaReader, prismaWriter } from "@/lib/prisma";
import {
  CalculationMethod,
  ChartType,
  ConfidenceLevel,
  MeasurementUnit,
  MetricType,
  OkrStatus,
  MilestoneStatus,
} from "@/types/okrTracker";
import { revalidatePath } from "next/cache";
import { deriveConfidenceLevel } from "./utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Next.js server actions serialize `undefined` as the string "$undefined".
 * Sanitize optional values before passing them to Prisma.
 */
const safeNum = (v: unknown): number | null =>
  typeof v === "number" && isFinite(v) ? v : null;
const safeStr = (v: unknown): string | null =>
  typeof v === "string" && v !== "$undefined" && v !== "" ? v : null;

/** Derive chartMetricType from the measurement unit — no need to store it separately. */
function deriveChartMetricType(unit: MeasurementUnit): MetricType {
  switch (unit) {
    case "percent":    return "percentage";
    case "yes_no":     return "yes_no";
    case "qualitative":return "binary";
    default:           return "count"; // number, currency, counties
  }
}

/**
 * Flatten okrObjective into the top-level shape that existing consumers expect.
 * All callers of getAllOKRs / getOKRById etc. can still read `okr.objective`
 * and `okr.objectiveToc` as plain strings.
 */
function flattenObjective<T extends { okrObjective: { text: string; toc: string } | null }>(okr: T) {
  return {
    ...okr,
    objective: okr.okrObjective?.text ?? "",
    objectiveToc: okr.okrObjective?.toc ?? "",
  };
}

// Note: not `as const` — the readonly arrays it produces are incompatible with Prisma's input types.
const OKR_INCLUDE = {
  okrObjective: true,
  monthlyUpdates: { orderBy: [{ year: "desc" as const }, { month: "desc" as const }] },
  milestones: { orderBy: { dueDate: "asc" as const } },
};

// ─── Type ─────────────────────────────────────────────────────────────────────

type OKRUpdateFields = {
  objectiveId?: string;
  keyResult?: string;
  priority?: number;

  status?: OkrStatus;
  progress?: number;
  confidenceLevel?: ConfidenceLevel;

  unit?: MeasurementUnit;
  baseline?: number;
  targetValue?: number;
  minValue?: number;
  maxValue?: number;
  calculationMethod?: CalculationMethod;
  valuePrompt?: string;
  valueHint?: string;

  denominator?: number;
  denominatorLabel?: string;
  numeratorLabel?: string;

  periodStart?: Date | string;
  periodEnd?: Date | string;

  chartMetricType?: MetricType;
  chartType?: ChartType;
  chartMetricUnit?: string;
};

// ============= OBJECTIVE CRUD =============

/**
 * Get all objectives ordered by number
 */
export async function getAllObjectives() {
  try {
    const objectives = await prismaReader.okrObjective.findMany({
      orderBy: { number: "asc" },
      include: { okrs: { select: { id: true, okrId: true } } },
    });
    return { success: true, data: objectives };
  } catch (error) {
    console.error("Error fetching objectives:", error);
    return { success: false, error: "Failed to fetch objectives" };
  }
}

/**
 * Create a new objective. Number is auto-assigned as max + 1.
 */
export async function createObjective(data: { text: string; toc?: string; number?: number }) {
  try {
    let number = data.number;
    if (!number) {
      const last = await prismaWriter.okrObjective.findFirst({ orderBy: { number: "desc" } });
      number = (last?.number ?? 0) + 1;
    }
    const objective = await prismaWriter.okrObjective.create({
      data: { number, text: data.text, toc: data.toc ?? "" },
    });
    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, data: objective };
  } catch (error: any) {
    console.error("Error creating objective:", error);
    if (error.code === "P2002") return { success: false, error: "Objective number already exists" };
    return { success: false, error: "Failed to create objective" };
  }
}

/**
 * Update an objective's text and/or TOC.
 * All linked KRs automatically reflect the change via the relation.
 */
export async function updateObjective(id: string, data: { text?: string; toc?: string }) {
  try {
    const objective = await prismaWriter.okrObjective.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, data: objective };
  } catch (error: any) {
    console.error("Error updating objective:", error);
    if (error.code === "P2025") return { success: false, error: "Objective not found" };
    return { success: false, error: "Failed to update objective" };
  }
}

/**
 * Delete an objective. Will fail if KRs are still linked (FK restrict).
 */
export async function deleteObjective(id: string) {
  try {
    await prismaWriter.okrObjective.delete({ where: { id } });
    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting objective:", error);
    if (error.code === "P2025") return { success: false, error: "Objective not found" };
    if (error.code === "P2003") return { success: false, error: "Cannot delete — key results still exist under this objective" };
    return { success: false, error: "Failed to delete objective" };
  }
}

// ============= READ OPERATIONS =============

/**
 * Fetch all OKRs with their monthly updates and milestones.
 * Returns flattened `objective` and `objectiveToc` strings for backwards compat.
 */
export async function getAllOKRs(filters?: {
  status?: OkrStatus;
  objectiveId?: string;
  year?: number;
  month?: number;
}) {
  try {
    const okrs = await prismaReader.okr.findMany({
      where: {
        status: filters?.status,
        objectiveId: filters?.objectiveId,
        ...(filters?.year && {
          monthlyUpdates: {
            some: {
              year: filters.year,
              ...(filters?.month && { month: filters.month }),
            },
          },
        }),
      },
      include: OKR_INCLUDE,
      orderBy: { id: "asc" },
    });

    return { success: true, data: okrs.map(flattenObjective) };
  } catch (error) {
    console.error("Error fetching OKRs:", error);
    return { success: false, error: "Failed to fetch OKRs" };
  }
}

/**
 * Get a single OKR by ID with all related data
 */
export async function getOKRById(id: string) {
  try {
    const okr = await prismaReader.okr.findUnique({ where: { id }, include: OKR_INCLUDE });
    if (!okr) return { success: false, error: "OKR not found" };
    return { success: true, data: flattenObjective(okr) };
  } catch (error) {
    console.error("Error fetching OKR:", error);
    return { success: false, error: "Failed to fetch OKR" };
  }
}

/**
 * Get OKR by okrId (the unique identifier)
 */
export async function getOKRByOkrId(okrId: string) {
  try {
    const okr = await prismaReader.okr.findUnique({ where: { okrId }, include: OKR_INCLUDE });
    if (!okr) return { success: false, error: "OKR not found" };
    return { success: true, data: flattenObjective(okr) };
  } catch (error) {
    console.error("Error fetching OKR:", error);
    return { success: false, error: "Failed to fetch OKR" };
  }
}

/**
 * Get OKRs by objective ID
 */
export async function getOKRsByObjectiveId(objectiveId: string) {
  try {
    const okrs = await prismaReader.okr.findMany({
      where: { objectiveId },
      include: OKR_INCLUDE,
      orderBy: { priority: "asc" },
    });
    return { success: true, data: okrs.map(flattenObjective) };
  } catch (error) {
    console.error("Error fetching OKRs by objective:", error);
    return { success: false, error: "Failed to fetch OKRs" };
  }
}

/** @deprecated Use getOKRsByObjectiveId instead */
export async function getOKRsByObjectiveToc(objectiveToc: string) {
  try {
    const okrs = await prismaReader.okr.findMany({
      where: { okrObjective: { toc: objectiveToc } },
      include: OKR_INCLUDE,
      orderBy: { priority: "asc" },
    });
    return { success: true, data: okrs.map(flattenObjective) };
  } catch (error) {
    console.error("Error fetching OKRs by objective toc:", error);
    return { success: false, error: "Failed to fetch OKRs" };
  }
}

/**
 * Get OKRs by status
 */
export async function getOKRsByStatus(status: OkrStatus) {
  try {
    const okrs = await prismaReader.okr.findMany({
      where: { status },
      include: OKR_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: okrs.map(flattenObjective) };
  } catch (error) {
    console.error("Error fetching OKRs by status:", error);
    return { success: false, error: "Failed to fetch OKRs" };
  }
}

/**
 * Get OKR statistics
 */
export async function getOKRStats() {
  try {
    const [total, achieved, onTrack, delayed, atRisk, underReview] = await Promise.all([
      prismaReader.okr.count(),
      prismaReader.okr.count({ where: { status: "achieved" } }),
      prismaReader.okr.count({ where: { status: "on_track" } }),
      prismaReader.okr.count({ where: { status: "delayed" } }),
      prismaReader.okr.count({ where: { status: "at_risk" } }),
      prismaReader.okr.count({ where: { status: "okr_under_review" } }),
    ]);

    const avgProgress = await prismaReader.okr.aggregate({ _avg: { progress: true } });

    return {
      success: true,
      data: {
        total, achieved, onTrack, delayed, atRisk, underReview,
        averageProgress: Math.round(avgProgress._avg.progress || 0),
      },
    };
  } catch (error) {
    console.error("Error fetching OKR stats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}

// ============= CREATE OPERATIONS =============

/**
 * Create a new OKR (key result) under an existing objective.
 * Pass `objectiveId` — the objective must already exist.
 */
export async function createOKR(data: {
  okrId: string;
  objectiveId: string;
  keyResult: string;
  priority: number;
  status: OkrStatus;
  progress: number;
  confidenceLevel?: ConfidenceLevel;
  unit: MeasurementUnit;
  baseline: number;
  targetValue: number;
  minValue?: number;
  maxValue?: number;
  calculationMethod: CalculationMethod;
  valuePrompt?: string;
  valueHint?: string;
  denominator?: number;
  denominatorLabel?: string;
  numeratorLabel?: string;
  periodStart: Date | string;
  periodEnd: Date | string;
  chartMetricType?: MetricType; // derived from unit if omitted
  chartType: ChartType;
  chartMetricUnit: string;
  milestones?: Array<{
    milestone: string;
    dueDate: Date | string;
    status: MilestoneStatus;
    completionDate?: Date | string;
  }>;
}) {
  try {
    const okr = await prismaWriter.okr.create({
      data: {
        okrId: data.okrId,
        objectiveId: data.objectiveId,
        keyResult: data.keyResult,
        priority: data.priority,
        status: data.status,
        progress: data.progress,
        confidenceLevel: data.confidenceLevel ?? deriveConfidenceLevel(data.status, data.progress),
        unit: data.unit,
        baseline: data.baseline,
        targetValue: data.targetValue,
        minValue: safeNum(data.minValue),
        maxValue: safeNum(data.maxValue),
        calculationMethod: data.calculationMethod,
        valuePrompt: safeStr(data.valuePrompt),
        valueHint: safeStr(data.valueHint),
        denominator: safeNum(data.denominator),
        denominatorLabel: safeStr(data.denominatorLabel),
        numeratorLabel: safeStr(data.numeratorLabel),
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        chartMetricType: data.chartMetricType ?? deriveChartMetricType(data.unit),
        chartType: data.chartType,
        chartMetricUnit: data.chartMetricUnit,
        ...(data.milestones && {
          milestones: {
            create: data.milestones.map((m) => ({
              milestone: m.milestone,
              dueDate: new Date(m.dueDate),
              status: m.status,
              completionDate: m.completionDate ? new Date(m.completionDate) : null,
            })),
          },
        }),
      },
      include: OKR_INCLUDE,
    });

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, data: flattenObjective(okr) };
  } catch (error: any) {
    console.error("Error creating OKR:", error);
    if (error.code === "P2002") return { success: false, error: "OKR ID already exists" };
    if (error.code === "P2003") return { success: false, error: "Objective not found" };
    return { success: false, error: error?.message ?? "Failed to create OKR" };
  }
}

// ============= UPDATE OPERATIONS =============

/**
 * Update OKR progress and status
 */
export async function updateOKRProgress(id: string, progress: number, status?: OkrStatus) {
  try {
    const okr = await prismaWriter.okr.update({
      where: { id },
      data: { progress, ...(status && { status }), updatedAt: new Date() },
    });
    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, data: okr };
  } catch (error) {
    console.error("Error updating OKR progress:", error);
    return { success: false, error: "Failed to update progress" };
  }
}

/**
 * Update OKR status
 */
export async function updateOKRStatus(id: string, status: OkrStatus) {
  try {
    const current = await prismaReader.okr.findUnique({
      where: { id },
      select: { progress: true },
    });
    const confidenceLevel = deriveConfidenceLevel(status, current?.progress ?? 0);
    const okr = await prismaWriter.okr.update({
      where: { id },
      data: { status, confidenceLevel, updatedAt: new Date() },
    });
    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, data: okr };
  } catch (error) {
    console.error("Error updating OKR status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * Singleton update for KR fields.
 * Pass `objectiveId` to move a KR to a different objective.
 * Does NOT accept `objective` / `objectiveToc` strings — use updateObjective() for those.
 */
export async function updateOKRField(id: string, data: OKRUpdateFields) {
  try {
    if (!id?.trim()) return { success: false, error: "Invalid OKR ID" };
    if (!data || Object.keys(data).length === 0) return { success: false, error: "No update data provided" };

    // Pick only the fields Prisma accepts — strips computed/relation fields
    // (okrObjective, monthlyUpdates, milestones, objective, objectiveToc, id, createdAt, etc.)
    const updateData: any = {};
    const allowed: (keyof OKRUpdateFields)[] = [
      "objectiveId", "keyResult", "priority", "status", "progress",
      "confidenceLevel", "unit", "baseline", "targetValue", "minValue",
      "maxValue", "calculationMethod", "valuePrompt", "valueHint",
      "denominator", "denominatorLabel", "numeratorLabel",
      "periodStart", "periodEnd", "chartMetricType", "chartType", "chartMetricUnit",
    ];
    for (const key of allowed) {
      if (key in data) updateData[key] = (data as any)[key];
    }
    if (data.periodStart) updateData.periodStart = new Date(data.periodStart);
    if (data.periodEnd) updateData.periodEnd = new Date(data.periodEnd);
    // Re-derive chartMetricType whenever unit changes
    if (data.unit) updateData.chartMetricType = deriveChartMetricType(data.unit);
    // Sanitize optional fields that Next.js may serialize as "$undefined"
    if ("minValue" in data) updateData.minValue = safeNum(data.minValue);
    if ("maxValue" in data) updateData.maxValue = safeNum(data.maxValue);
    if ("denominator" in data) updateData.denominator = safeNum(data.denominator);
    if ("valuePrompt" in data) updateData.valuePrompt = safeStr(data.valuePrompt);
    if ("valueHint" in data) updateData.valueHint = safeStr(data.valueHint);
    if ("denominatorLabel" in data) updateData.denominatorLabel = safeStr(data.denominatorLabel);
    if ("numeratorLabel" in data) updateData.numeratorLabel = safeStr(data.numeratorLabel);

    const updatedOKR = await prismaWriter.okr.update({
      where: { id },
      data: { ...updateData, updatedAt: new Date() },
      include: OKR_INCLUDE,
    });

    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    revalidatePath(`/okrs/${id}`);

    return { success: true, data: flattenObjective(updatedOKR), message: "OKR updated successfully" };
  } catch (error: any) {
    console.error("Error updating OKR field:", error);
    if (error.code === "P2025") return { success: false, error: "OKR not found" };
    if (error.code === "P2002") return { success: false, error: "A unique field value already exists" };
    return { success: false, error: error.message || "Failed to update OKR" };
  }
}

// ============= DELETE OPERATIONS =============

/**
 * Delete a KR (cascades to monthly updates and milestones)
 */
export async function deleteOKR(id: string) {
  try {
    await prismaWriter.okr.delete({ where: { id } });
    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting OKR:", error);
    if (error.code === "P2025") return { success: false, error: "OKR not found" };
    return { success: false, error: "Failed to delete OKR" };
  }
}

/**
 * Bulk delete KRs
 */
export async function bulkDeleteOKRs(ids: string[]) {
  try {
    const result = await prismaWriter.okr.deleteMany({ where: { id: { in: ids } } });
    revalidatePath("/country-programs/liberia/dashboards/okr-dashboard");
    revalidatePath("/country-programs/liberia/admin/dashboards/okr-dashboard");
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error bulk deleting OKRs:", error);
    return { success: false, error: "Failed to delete OKRs" };
  }
}
