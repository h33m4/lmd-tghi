import { OkrStatus } from "@/types/okrTracker";
import { useMemo } from "react";

interface StatusColors {
  // Tailwind classes
  mainBg: string;
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText: string;
  lightBg: string;
  darkText: string;
  statusBadgeClassName: string;

  // Hex colors for charts
  hex: string;
  hexLight: string;

  // Icon colors
  iconColor: string;
  iconBg: string;
}

interface StatusColorMap {
  achieved: StatusColors;
  on_track: StatusColors;
  delayed: StatusColors;
  okr_under_review: StatusColors;
  at_risk: StatusColors;
}

// ============================================================================
// COLOR DEFINITIONS
// ============================================================================

const STATUS_COLOR_MAP: StatusColorMap = {
  // ✅ ACHIEVED - Pure Green
  achieved: {
    mainBg: "bg-green-600",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-400",
    hex: "#16a34a", // Green-600
    hexLight: "#dcfce7", // Green-100
    hoverBg: "hover:bg-green-200",
    hoverText: "hover:text-green-900",
    lightBg: "bg-green-50",
    darkText: "text-green-900",
    statusBadgeClassName: "bg-green-100 text-green-800 border border-green-400",
    iconColor: "text-green-700",
    iconBg: "bg-green-100",
  },

  // 🟡 ON_TRACK - Yellow/Amber + Green mix (Positive progress)
  on_track: {
    mainBg: "bg-lime-600",
    bg: "bg-lime-100",
    text: "text-lime-800",
    border: "border-lime-400",
    hex: "#84cc16", // Lime-500 (Yellow-Green blend)
    hexLight: "#f2fce7", // Lime-100
    hoverBg: "hover:bg-lime-200",
    hoverText: "hover:text-lime-900",
    lightBg: "bg-lime-50",
    darkText: "text-lime-900",
    statusBadgeClassName: "bg-lime-100 text-lime-800 border border-lime-400",
    iconColor: "text-lime-700",
    iconBg: "bg-lime-100",
  },

  // 🔶 DELAYED - Light Red shade (Warning but not critical)
  delayed: {
    mainBg: "bg-orange-500",
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-400",
    hex: "#f97316", // Orange-500 (light red)
    hexLight: "#ffedd5", // Orange-100
    hoverBg: "hover:bg-orange-200",
    hoverText: "hover:text-orange-900",
    lightBg: "bg-orange-50",
    darkText: "text-orange-900",
    statusBadgeClassName:
      "bg-orange-100 text-orange-800 border border-orange-400",
    iconColor: "text-orange-700",
    iconBg: "bg-orange-100",
  },

  // 🔵 OKR_UNDER_REVIEW - Greenish + Blue (Teal/Cyan blend)
  okr_under_review: {
    mainBg: "bg-cyan-600",
    bg: "bg-cyan-100",
    text: "text-cyan-800",
    border: "border-cyan-400",
    hex: "#06b6d4", // Cyan-500 (greenish blue)
    hexLight: "#cffafe", // Cyan-100
    hoverBg: "hover:bg-cyan-200",
    hoverText: "hover:text-cyan-900",
    lightBg: "bg-cyan-50",
    darkText: "text-cyan-900",
    statusBadgeClassName: "bg-cyan-100 text-cyan-800 border border-cyan-400",
    iconColor: "text-cyan-700",
    iconBg: "bg-cyan-100",
  },

  // 🔴 AT_RISK - Danger Red
  at_risk: {
    mainBg: "bg-red-600",
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-400",
    hex: "#dc2626", // Red-600 (danger)
    hexLight: "#fee2e2", // Red-100
    hoverBg: "hover:bg-red-200",
    hoverText: "hover:text-red-900",
    lightBg: "bg-red-50",
    darkText: "text-red-900",
    statusBadgeClassName: "bg-red-100 text-red-800 border border-red-400",
    iconColor: "text-red-700",
    iconBg: "bg-red-100",
  },
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * Custom hook for managing OKR status colors
 * Provides utilities for styling status badges, cards, and charts
 *
 * @returns Object containing color getters and utility functions
 *
 * @example
 * const { getStatusColors, getStatusHex, getStatusLabel } = useOkrStatusColors();
 *
 * // Get all colors for a status
 * const colors = getStatusColors('on_track');
 *
 * // Get hex color for charts
 * const hex = getStatusHex('achieved');
 *
 * // Get label
 * const label = getStatusLabel('delayed');
 */
export function useOkrStatusColors() {
  const colors = useMemo<StatusColorMap>(() => STATUS_COLOR_MAP, []);

  /**
   * Get all color utilities for a specific status
   * @param status The OKR status type
   * @returns Object containing all color properties for the status
   */
  const getStatusColors = (status: OkrStatus): StatusColors => {
    return colors[status] || colors.on_track;
  };

  /**
   * Get hex color for charts and visualizations
   * @param status The OKR status type
   * @returns Hex color string (e.g., "#10b981")
   */
  const getStatusHex = (status: OkrStatus): string => {
    return colors[status]?.hex || "#3b82f6";
  };

  /**
   * Get light hex color (useful for chart fills and backgrounds)
   * @param status The OKR status type
   * @returns Light hex color string
   */
  const getStatusHexLight = (status: OkrStatus): string => {
    return colors[status]?.hexLight || "#dbeafe";
  };

  /**
   * Get Tailwind classes for badge/pill component
   * @param status The OKR status type
   * @returns String of Tailwind classes for badge styling
   */
  const getStatusBadgeClasses = (status: OkrStatus): string => {
    const statusColors = colors[status];
    return statusColors.statusBadgeClassName;
  };

  /**
   * Get Tailwind classes for card component with status styling
   * @param status The OKR status type
   * @returns String of Tailwind classes for card styling
   */
  const getStatusCardClasses = (status: OkrStatus): string => {
    const statusColors = colors[status];
    return `${statusColors.lightBg} ${statusColors.border} border-l-4`;
  };

  /**
   * Get color for progress bars
   * @param status The OKR status type
   * @returns Hex color string for progress bar
   */
  const getProgressBarColor = (status: OkrStatus): string => {
    return colors[status]?.hex || "#3b82f6";
  };

  /**
   * Get Tailwind classes for status icon
   * @param status The OKR status type
   * @returns String of Tailwind classes for icon styling
   */
  const getStatusIconClasses = (status: OkrStatus): string => {
    const statusColors = colors[status];
    return statusColors.iconColor;
  };

  /**
   * Get icon background classes
   * @param status The OKR status type
   * @returns String of Tailwind classes for icon background
   */
  const getStatusIconBgClasses = (status: OkrStatus): string => {
    const statusColors = colors[status];
    return statusColors.iconBg;
  };

  /**
   * Determine status based on progress percentage
   * @param currentValue Current progress value
   * @param targetValue Target progress value
   * @returns OKR status based on percentage
   */
  const getStatusFromProgress = (
    currentValue: number,
    targetValue: number,
  ): OkrStatus => {
    if (targetValue <= 0) return "on_track";

    const progressPercent = (currentValue / targetValue) * 100;

    if (progressPercent >= 100) return "achieved";
    if (progressPercent >= 75) return "on_track";
    if (progressPercent >= 50) return "delayed";
    if (progressPercent >= 25) return "okr_under_review";
    return "at_risk";
  };

  /**
   * Get human-readable label for status
   * @param status The OKR status type
   * @returns Formatted status label
   */
  const getStatusLabel = (status: OkrStatus): string => {
    const labels: Record<OkrStatus, string> = {
      achieved: "Achieved",
      on_track: "On Track",
      delayed: "Delayed",
      okr_under_review: "Under Review",
      at_risk: "At Risk",
    };

    return labels[status] || "Unknown";
  };

  /**
   * Get status description (helpful for tooltips)
   * @param status The OKR status type
   * @returns Status description
   */
  const getStatusDescription = (status: OkrStatus): string => {
    const descriptions: Record<OkrStatus, string> = {
      achieved: "Goal has been successfully achieved",
      on_track: "Progress is on track to meet the goal",
      delayed: "Progress is behind schedule but recoverable",
      okr_under_review: "Status is being reviewed and requires attention",
      at_risk: "Goal is at significant risk of not being achieved",
    };

    return descriptions[status] || "No description available";
  };

  /**
   * Get all available statuses
   * @returns Array of all status types
   */
  const getAllStatuses = (): OkrStatus[] => {
    return ["achieved", "on_track", "delayed", "okr_under_review", "at_risk"];
  };

  /**
   * Get status statistics (for counting status distribution)
   * @returns Object containing color info for all statuses
   */
  const getStatusColorMap = (): StatusColorMap => {
    return colors;
  };

  /**
   * Check if a status indicates issue (at_risk or okr_under_review)
   * @param status The OKR status type
   * @returns Boolean indicating if status requires attention
   */
  const isStatusAlertingIssue = (status: OkrStatus): boolean => {
    return status === "at_risk" || status === "okr_under_review";
  };

  /**
   * Check if a status indicates success
   * @param status The OKR status type
   * @returns Boolean indicating if status is successful
   */
  const isStatusSuccess = (status: OkrStatus): boolean => {
    return status === "achieved";
  };

  /**
   * Check if a status indicates progress warning
   * @param status The OKR status type
   * @returns Boolean indicating if status shows warning
   */
  const isStatusWarning = (status: OkrStatus): boolean => {
    return status === "delayed";
  };

  return {
    // Color maps
    colors,

    // Color getters
    getStatusColors,
    getStatusHex,
    getStatusHexLight,

    // Tailwind class getters
    getStatusBadgeClasses,
    getStatusCardClasses,
    getStatusIconClasses,
    getStatusIconBgClasses,

    // Chart helpers
    getProgressBarColor,

    // Status calculators
    getStatusFromProgress,
    getStatusLabel,
    getStatusDescription,
    getAllStatuses,
    getStatusColorMap,

    // Status checkers
    isStatusAlertingIssue,
    isStatusSuccess,
    isStatusWarning,
  };
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type UseOkrStatusColorsReturn = ReturnType<typeof useOkrStatusColors>;
export type { StatusColors, StatusColorMap };
