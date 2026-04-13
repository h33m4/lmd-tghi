// export function getCurrentMonthUpdate(okr: OKR, currentMonth?: string) {
//   const { monthlyUpdates } = okr;

import { OkrMonthlyUpdate, OkrRecord, OkrStatus } from "@/types/okrTracker";

/**
 * Format month and year to display text
 */
export function formatMonthYearDisplay(month: number, year: number): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${monthNames[month - 1]} ${year}`;
}

/**
 * Format month and year to short display
 */
export function formatMonthYearShort(month: number, year: number): string {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[month - 1]} ${year}`;
}

/**
 * Format month name only
 */
export function formatMonthName(month: number): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month - 1];
}

/**
 * Get current month and year
 */
export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return {
    month: now.getMonth() + 1, // 1-12
    year: now.getFullYear(),
  };
}

/**
 * Get current month update from OKR
 * Updated to use separate month and year integers
 */
export const getCurrentMonthUpdate = (
  okr: OkrRecord,
  month?: number,
  year?: number,
): OkrMonthlyUpdate => {
  // If month and year provided, find that specific update
  if (month !== undefined && year !== undefined) {
    const found = okr.monthlyUpdates.find(
      (u) => u.month === month && u.year === year,
    );
    if (found) return found;
  }

  // Otherwise return the latest update
  if (okr.monthlyUpdates.length > 0) {
    const sorted = sortMonthlyUpdates(okr.monthlyUpdates);
    return sorted[sorted.length - 1];
  }

  // Fallback if no updates exist
  const current = getCurrentMonthYear();
  return {
    month: current.month,
    year: current.year,
    value: "",
    narrative: "No updates available",
    risks: [],
    mitigations: [],
  };
};

/**
 * Sort monthly updates chronologically
 */
export function sortMonthlyUpdates(
  updates: OkrMonthlyUpdate[],
): OkrMonthlyUpdate[] {
  return [...updates].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
}

/**
 * Get unique month/year combinations for filters
 */
export function getUniqueMonthYears(okrs: OkrRecord[]): Array<{
  month: number;
  year: number;
  display: string;
  key: string;
}> {
  const monthYearSet = new Map<string, { month: number; year: number }>();

  okrs.forEach((okr) => {
    okr.monthlyUpdates.forEach((update) => {
      const key = `${update.month}_${update.year}`;
      if (!monthYearSet.has(key)) {
        monthYearSet.set(key, { month: update.month, year: update.year });
      }
    });
  });

  return Array.from(monthYearSet.entries())
    .map(([key, { month, year }]) => ({
      month,
      year,
      display: formatMonthYearDisplay(month, year),
      key,
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
}

/**
 * Get all unique values from OKR dataset
 */
export const getOkrDashboardUniqueValues = (okrs: OkrRecord[]) => {
  const statuses = new Set<OkrStatus>();
  const priorities = new Set<number>();
  const objectiveTocs = new Set<string>();
  const monthYears = getUniqueMonthYears(okrs);

  okrs.forEach((okr) => {
    statuses.add(okr.status);
    if (okr.priority) priorities.add(okr.priority);
    objectiveTocs.add(okr.objectiveToc);
  });

  return {
    statuses: Array.from(statuses).sort(),
    priorities: Array.from(priorities).sort((a, b) => a - b),
    objectiveTocs: Array.from(objectiveTocs).sort(),
    monthYears,
  };
};

/**
 * Format status for display
 */
export const formatOkrDashboardStatus = (status: OkrStatus): string => {
  const statusMap: Record<OkrStatus, string> = {
    achieved: "Achieved",
    on_track: "On Track",
    delayed: "Delayed",
    okr_under_review: "Under Review",
    at_risk: "At Risk",
  };
  return statusMap[status];
};

/**
 * Compare if two month/year are equal
 */
export function isSameMonthYear(
  month1: number,
  year1: number,
  month2: number,
  year2: number,
): boolean {
  return month1 === month2 && year1 === year2;
}

/**
 * Get next month/year
 */
export function getNextMonthYear(
  month: number,
  year: number,
): { month: number; year: number } {
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return { month: nextMonth, year: nextYear };
}

/**
 * Get previous month/year
 */
export function getPreviousMonthYear(
  month: number,
  year: number,
): { month: number; year: number } {
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  return { month: prevMonth, year: prevYear };
}

/**
 * Check if a month/year is before another
 */
export function isBeforeMonthYear(
  month1: number,
  year1: number,
  month2: number,
  year2: number,
): boolean {
  if (year1 < year2) return true;
  if (year1 > year2) return false;
  return month1 < month2;
}

/**
 * Check if a month/year is after another
 */
export function isAfterMonthYear(
  month1: number,
  year1: number,
  month2: number,
  year2: number,
): boolean {
  if (year1 > year2) return true;
  if (year1 < year2) return false;
  return month1 > month2;
}

/**
 * Format month/year to key string (for use as map keys, etc.)
 */
export function formatMonthYearKey(month: number, year: number): string {
  return `${month}_${year}`;
}

// =============================================================================
// DEPRECATED FUNCTIONS (for backwards compatibility during migration)
// =============================================================================

/**
 * @deprecated Use formatMonthYearDisplay(month, year) instead
 */
export const formatOkrUpdateMonthLong = (monthString: string): string => {
  const [monthNum, year] = monthString.split("_");
  return formatMonthYearDisplay(parseInt(monthNum, 10), parseInt(year, 10));
};

/**
 * @deprecated Use formatMonthYearDisplay(month, year) instead
 */
export const formatOkrDashboardMonthDisplay = (
  monthOrNumber: number | string,
  year?: number,
): string => {
  if (typeof monthOrNumber === "string") {
    // Old format: "01_2024"
    return formatOkrUpdateMonthLong(monthOrNumber);
  }
  // New format: separate month and year
  return formatMonthYearDisplay(monthOrNumber, year!);
};

/**
 * @deprecated No longer needed with new structure
 */
export const formatMonthShort = (month: string): string => {
  return month.split("_")[0];
};

/**
 * @deprecated Use getCurrentMonthYear() instead
 */
export const getOkrDashboardCurrentMonthYear = (): {
  display: string;
  month: number;
  year: number;
} => {
  const { month, year } = getCurrentMonthYear();
  return {
    display: formatMonthYearDisplay(month, year),
    month,
    year,
  };
};

/**
 * @deprecated No longer needed with new structure
 */
export const getOkrDashboardMonthInternalFormat = (
  monthDisplay: string,
): string => {
  if (monthDisplay.includes("_")) {
    return monthDisplay;
  }

  const monthNames: Record<string, string> = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  const parts = monthDisplay.toLowerCase().split(" ");
  if (parts.length === 2) {
    const monthNum = monthNames[parts[0]];
    const year = parts[1];
    if (monthNum && year) {
      return `${monthNum}_${year}`;
    }
  }

  return monthDisplay;
};

/**
 * Calculate progress based on latest monthly update
 */
export const calculateOkrProgress = (
  updates: OkrMonthlyUpdate[],
  okr: OkrRecord,
  // measurement: OkrRecord["measurement"],
): number => {
  if (updates.length === 0) return 0;

  const sorted = sortMonthlyUpdates(updates);
  const latestUpdate = sorted[sorted.length - 1];
  const value = typeof latestUpdate.value === "number" ? latestUpdate.value : 0;

  // For yes/no metrics
  if (okr.unit === "yes_no") {
    return value === 1 ? 100 : 0;
  }

  // For ALL numeric metrics (including percent), calculate progress toward target
  if (okr.targetValue > 0) {
    const progress = Math.round((value / okr.targetValue) * 100);
    // Allow over 100% progress (overachievement)
    return progress;
  }

  return 0;
};
