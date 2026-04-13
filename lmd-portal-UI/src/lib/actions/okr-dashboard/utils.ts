// actions/okr/utils.ts

import {
  // ChartMetadata,
  // Measurement,
  OkrMonthlyUpdate,
  OkrRecord,
  OkrStatus,
  // Period,
  // Tracking,
} from "@/types/okrTracker";

export function deriveConfidenceLevel(
  status: OkrStatus,
  progress: number,
): "high" | "medium" | "low" {
  if (status === "achieved") return "high";
  if (status === "okr_under_review") return "low";

  if (status === "on_track") {
    return progress >= 70 ? "high" : "medium";
  }

  if (status === "at_risk" || status === "delayed") {
    return progress >= 50 ? "medium" : "low";
  }

  return "medium";
}

// export function transformToOkrRecord(okr: any, keyResult: any): OkrRecord {
//   const metadata = (keyResult.metadata || {}) as any;

//   return {
//     okrId: keyResult.id,
//     objectiveToc:
//       metadata.objectiveToc ||
//       `OKR-${okr.year}-Q${okr.quarter}-${okr.id.substring(0, 8)}`,
//     objective: okr.title,
//     keyResult: keyResult.description,
//     priority: metadata.priority || 1,

//     tracking: transformTracking(metadata.tracking, keyResult),

//     measurement: transformMeasurement(metadata.measurement, keyResult),

//     period: transformPeriod(metadata.period, okr),

//     monthlyUpdates: transformMonthlyUpdates(keyResult.monthlyUpdates || []),

//     chartMetadata: transformChartMetadata(metadata.chartMetadata, keyResult),
//   };
// }

// function transformTracking(tracking: any, keyResult: any): Tracking {
//   if (tracking) {
//     return {
//       status: tracking.status as OkrStatus,
//       progress: tracking.progress,
//       confidenceLevel: tracking.confidenceLevel,
//       milestones: tracking.milestones || [],
//     };
//   }

//   // Calculate default tracking
//   const progress = calculateProgress(keyResult.current, keyResult.target);
//   const status = getStatusFromProgress(progress);

//   return {
//     status,
//     progress,
//     confidenceLevel: "medium",
//     milestones: [],
//   };
// }

// function transformMeasurement(measurement: any, keyResult: any): Measurement {
//   if (measurement) {
//     return {
//       unit: measurement.unit,
//       baseline: measurement.baseline,
//       targetValue: measurement.targetValue,
//       minValue: measurement.minValue,
//       maxValue: measurement.maxValue,
//       calculationMethod: measurement.calculationMethod || "latest",
//       valuePrompt: measurement.valuePrompt,
//       valueHint: measurement.valueHint,
//     };
//   }

//   // Default measurement from keyResult
//   return {
//     unit: mapUnitToMeasurementUnit(keyResult.unit),
//     baseline: 0,
//     targetValue: keyResult.target,
//     calculationMethod: "latest",
//   };
// }

// function transformPeriod(period: any, okr: any): Period {
//   if (period && period.start && period.end) {
//     return {
//       start: period.start,
//       end: period.end,
//     };
//   }

//   // Calculate default period based on quarter
//   const year = okr.year;
//   const quarter = okr.quarter;

//   const quarterStartMonth = (quarter - 1) * 3 + 1;
//   const quarterEndMonth = quarter * 3;

//   const start = `${year}-${String(quarterStartMonth).padStart(2, "0")}-01`;
//   const end = `${year}-${String(quarterEndMonth).padStart(2, "0")}-${getLastDayOfMonth(year, quarterEndMonth)}`;

//   return { start, end };
// }

// function transformMonthlyUpdates(updates: any[]): OkrMonthlyUpdate[] {
//   return updates.map((update) => {
//     const metadata = (update.metadata || {}) as any;

//     return {
//       month: formatMonthYear(update.month, update.year),
//       value: update.value ?? "",
//       narrative: update.notes || "",
//       risks: metadata.risks || [],
//       mitigations: metadata.mitigations || [],
//     };
//   });
// }

// function transformChartMetadata(
//   chartMetadata: any,
//   keyResult: any,
// ): ChartMetadata {
//   if (chartMetadata) {
//     return {
//       metricType: chartMetadata.metricType,
//       chartType: chartMetadata.chartType,
//       metricUnit: chartMetadata.metricUnit,
//     };
//   }

//   // Default chart metadata based on unit
//   const unit = keyResult.unit;

//   return {
//     metricType: getMetricTypeFromUnit(unit),
//     chartType: "line",
//     metricUnit: unit,
//   };
// }

// ============= HELPER FUNCTIONS =============

export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(Math.round(progress), 100);
}

function getStatusFromProgress(progress: number): OkrStatus {
  if (progress >= 100) return "achieved";
  if (progress >= 75) return "on_track";
  if (progress >= 50) return "delayed";
  if (progress >= 25) return "at_risk";
  return "okr_under_review";
}

function mapUnitToMeasurementUnit(
  unit: string,
): "percent" | "number" | "currency" | "counties" | "yes_no" {
  const lowerUnit = unit.toLowerCase();

  if (lowerUnit.includes("%") || lowerUnit.includes("percent"))
    return "percent";
  if (
    lowerUnit.includes("$") ||
    lowerUnit.includes("currency") ||
    lowerUnit.includes("dollar")
  )
    return "currency";
  if (lowerUnit.includes("county") || lowerUnit.includes("counties"))
    return "counties";
  if (lowerUnit === "yes_no" || lowerUnit === "yes/no") return "yes_no";

  return "number";
}

function getMetricTypeFromUnit(
  unit: string,
): "percentage" | "binary" | "count" | "yes_no" {
  const lowerUnit = unit.toLowerCase();

  if (lowerUnit.includes("%") || lowerUnit.includes("percent"))
    return "percentage";
  if (lowerUnit === "yes_no" || lowerUnit === "yes/no") return "yes_no";
  if (lowerUnit.includes("count") || lowerUnit.includes("number"))
    return "count";

  // Binary for 0/1 or boolean-like units
  if (lowerUnit === "binary" || lowerUnit === "0/1") return "binary";

  return "count";
}

export function formatMonthYear(month: number, year: number): string {
  return `${String(month).padStart(2, "0")}_${year}`;
}

export function parseMonthYear(monthYear: string): {
  month: number;
  year: number;
} {
  const [monthStr, yearStr] = monthYear.split("_");
  return {
    month: parseInt(monthStr, 10),
    year: parseInt(yearStr, 10),
  };
}

function getLastDayOfMonth(year: number, month: number): string {
  const lastDay = new Date(year, month, 0).getDate();
  return String(lastDay).padStart(2, "0");
}

// ============= REVERSE TRANSFORM (OkrRecord to Prisma format) =============

// export function transformFromOkrRecord(record: OkrRecord) {
//   return {
//     description: record.keyResult,
//     target: record.measurement.targetValue,
//     current: record.measurement.baseline,
//     unit: record.measurement.unit,
//     metadata: {
//       objectiveToc: record.objectiveToc,
//       priority: record.priority,
//       measurement: record.measurement,
//       tracking: record.tracking,
//       chartMetadata: record.chartMetadata,
//       period: record.period,
//     },
//   };
// }

// Transform multiple OKRs with all their key results
// export function transformOKRsToRecords(okrs: any[]): OkrRecord[] {
//   return okrs.flatMap((okr) =>
//     (okr.keyResults || []).map((kr: any) => transformToOkrRecord(okr, kr)),
//   );
// }

// Group OkrRecords back by objective
export function groupRecordsByObjective(
  records: OkrRecord[],
): Map<string, OkrRecord[]> {
  const grouped = new Map<string, OkrRecord[]>();

  records.forEach((record) => {
    const key = record.objectiveToc;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(record);
  });

  return grouped;
}
