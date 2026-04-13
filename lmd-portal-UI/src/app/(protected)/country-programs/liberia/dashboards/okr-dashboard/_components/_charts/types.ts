/**
 * Chart type definitions
 */
export type ChartType =
  | "line"
  | "bar"
  | "area"
  | "scatter"
  | "pie"
  | "donut"
  | "gauge"
  | "radar"
  | "candlestick"
  | "heatmap"
  | "sankey"
  | "graph";

/**
 * Tooltip configuration types
 */
export type TooltipTrigger = "item" | "axis" | "none";

/**
 * Legend position types
 */
export type LegendPosition = "top" | "bottom" | "left" | "right";

/**
 * Line style types
 */
export type LineStyle = "solid" | "dashed" | "dotted";

/**
 * Color mode for series
 */
export type ColorMode = "status" | "gradient" | "multi" | "solid";

/**
 * Animation easing types
 */
export type AnimationEasing =
  | "linear"
  | "quadraticIn"
  | "quadraticOut"
  | "quadraticInOut"
  | "cubicIn"
  | "cubicOut"
  | "cubicInOut"
  | "quarticIn"
  | "quarticOut"
  | "quarticInOut"
  | "quinticIn"
  | "quinticOut"
  | "quinticInOut"
  | "sinusoidalIn"
  | "sinusoidalOut"
  | "sinusoidalInOut"
  | "exponentialIn"
  | "exponentialOut"
  | "exponentialInOut"
  | "circularIn"
  | "circularOut"
  | "circularInOut"
  | "elasticIn"
  | "elasticOut"
  | "elasticInOut"
  | "backIn"
  | "backOut"
  | "backInOut"
  | "bounceIn"
  | "bounceOut"
  | "bounceInOut";

/**
 * Comprehensive chart configuration interface
 */
export interface ChartConfig {
  // Chart type and basic display
  chartType: ChartType;

  // Animation settings
  showAnimations: boolean;
  animationDuration: number;
  animationEasing: AnimationEasing;

  // Grid and axis settings
  showGridLines: boolean;
  showAxisLines: boolean;

  // Tooltip configuration
  showTooltip: boolean;
  tooltipTrigger: TooltipTrigger;
  tooltipBackgroundColor: string;
  tooltipBorderColor: string;
  tooltipBorderWidth: number;
  tooltipTextColor: string;
  tooltipTextSize: number;

  // Legend configuration
  showLegend: boolean;
  legendPosition: LegendPosition;
  legendTextColor: string;
  legendTextSize: number;
  legendBackgroundColor: string;
  legendBorderColor: string;
  legendBorderRadius: number;

  // Series/Line configuration
  lineWidth: number;
  lineStyle: LineStyle;
  smoothCurve: boolean;
  colorMode: ColorMode;
  dataPointSize: number;
  areaOpacity: number;

  // Target line configuration
  showTarget: boolean;
  targetLineStyle: LineStyle;
  targetLineWidth: number;
  targetLineColor: string;

  // Axis labels and text
  axisLabelSize: number;
  axisLabelColor: string;

  // Grid styling
  gridLineColor: string;
  gridSplitLineColor: string;

  // Padding and sizing
  paddingLeft: string;
  paddingRight: string;
  paddingTop: string;
  paddingBottom: string;
  chartHeight: number;
  chartWidth: number;

  // Series and data configuration
  seriesName: string;
  dataPointBorderWidth: number;
  dataPointBorderColor: string;
  shadowBlur: number;
  shadowColor: string;

  // Advanced options
  useCanvas: boolean;
  useDirtyRect: boolean;
  responsive: boolean;
  maintainAspectRatio: boolean;
}

/**
 * Default chart configuration with sensible defaults
 */
export const DEFAULT_CHART_CONFIG: ChartConfig = {
  chartType: "line",

  // Animation
  showAnimations: true,
  animationDuration: 750,
  animationEasing: "cubicOut",

  // Grid and axis
  showGridLines: true,
  showAxisLines: true,

  // Tooltip
  showTooltip: true,
  tooltipTrigger: "axis",
  tooltipBackgroundColor: "rgba(31, 41, 55, 0.95)",
  tooltipBorderColor: "#374151",
  tooltipBorderWidth: 1,
  tooltipTextColor: "#f3f4f6",
  tooltipTextSize: 12,

  // Legend
  showLegend: true,
  legendPosition: "top",
  legendTextColor: "#6b7280",
  legendTextSize: 12,
  legendBackgroundColor: "transparent",
  legendBorderColor: "transparent",
  legendBorderRadius: 4,

  // Series
  lineWidth: 3,
  lineStyle: "solid",
  smoothCurve: true,
  colorMode: "status",
  dataPointSize: 8,
  areaOpacity: 0.6,

  // Target line
  showTarget: true,
  targetLineStyle: "dashed",
  targetLineWidth: 2,
  targetLineColor: "#3b82f6",

  // Axis
  axisLabelSize: 12,
  axisLabelColor: "#6b7280",

  // Grid
  gridLineColor: "#e5e7eb",
  gridSplitLineColor: "#f3f4f6",

  // Padding
  paddingLeft: "12%",
  paddingRight: "8%",
  paddingTop: "15%",
  paddingBottom: "15%",
  chartHeight: 300,
  chartWidth: 100,

  // Series
  seriesName: "Current",
  dataPointBorderWidth: 2,
  dataPointBorderColor: "#fff",
  shadowBlur: 6,
  shadowColor: "rgba(0, 0, 0, 0.2)",

  // Advanced
  useCanvas: true,
  useDirtyRect: true,
  responsive: true,
  maintainAspectRatio: true,
};

/**
 * Preset configurations for different use cases
 */
export const CHART_PRESETS = {
  minimal: {
    showGridLines: false,
    showAxisLines: false,
    showLegend: false,
    showAnimations: false,
  } as Partial<ChartConfig>,

  detailed: {
    showGridLines: true,
    showAxisLines: true,
    showLegend: true,
    showAnimations: true,
    tooltipTrigger: "cross" as TooltipTrigger,
    animationDuration: 1000,
  } as Partial<ChartConfig>,

  dark: {
    tooltipBackgroundColor: "rgba(15, 23, 42, 0.98)",
    tooltipBorderColor: "#1e293b",
    tooltipTextColor: "#f1f5f9",
    axisLabelColor: "#94a3b8",
    gridLineColor: "#334155",
    gridSplitLineColor: "#1e293b",
    legendTextColor: "#94a3b8",
  } as Partial<ChartConfig>,

  light: {
    tooltipBackgroundColor: "rgba(255, 255, 255, 0.95)",
    tooltipBorderColor: "#e5e7eb",
    tooltipTextColor: "#1f2937",
    axisLabelColor: "#4b5563",
    gridLineColor: "#d1d5db",
    gridSplitLineColor: "#e5e7eb",
    legendTextColor: "#4b5563",
  } as Partial<ChartConfig>,

  performance: {
    showAnimations: false,
    useDirtyRect: true,
    useCanvas: true,
    shadowBlur: 0,
  } as Partial<ChartConfig>,

  dashboard: {
    chartHeight: 250,
    paddingTop: "10%",
    paddingBottom: "10%",
    legendPosition: "bottom",
    animationDuration: 500,
  } as Partial<ChartConfig>,

  report: {
    chartHeight: 400,
    lineWidth: 2,
    dataPointSize: 6,
    animationDuration: 1000,
    showLegend: true,
    legendPosition: "right",
  } as Partial<ChartConfig>,

  compact: {
    chartHeight: 200,
    paddingLeft: "8%",
    paddingRight: "4%",
    paddingTop: "8%",
    paddingBottom: "8%",
    dataPointSize: 4,
    lineWidth: 2,
    axisLabelSize: 10,
    tooltipTextSize: 10,
    legendTextSize: 10,
  } as Partial<ChartConfig>,
} as const;

/**
 * Utility function to merge chart configs with defaults
 */
export function mergeChartConfig(
  base: ChartConfig = DEFAULT_CHART_CONFIG,
  overrides?: Partial<ChartConfig>
): ChartConfig {
  return {
    ...base,
    ...overrides,
  };
}

/**
 * Utility function to apply a preset to a config
 */
export function applyPreset(
  preset: keyof typeof CHART_PRESETS,
  config: ChartConfig = DEFAULT_CHART_CONFIG
): ChartConfig {
  return mergeChartConfig(config, CHART_PRESETS[preset]);
}

/**
 * Utility function to create a custom preset
 */
export function createPreset(
  overrides: Partial<ChartConfig>
): Partial<ChartConfig> {
  return overrides;
}

/**
 * Type for chart color configuration
 */
export interface ChartColorConfig {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  muted: string;
  background: string;
  text: string;
}

/**
 * Default color scheme
 */
export const DEFAULT_COLORS: ChartColorConfig = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  muted: "#d1d5db",
  background: "rgba(255, 255, 255, 0.95)",
  text: "#1f2937",
};

/**
 * Dark mode color scheme
 */
export const DARK_MODE_COLORS: ChartColorConfig = {
  primary: "#60a5fa",
  secondary: "#a78bfa",
  success: "#34d399",
  warning: "#fbbf24",
  error: "#f87171",
  muted: "#6b7280",
  background: "rgba(31, 41, 55, 0.95)",
  text: "#f3f4f6",
};

/**
 * High contrast color scheme
 */
export const HIGH_CONTRAST_COLORS: ChartColorConfig = {
  primary: "#0000ff",
  secondary: "#ff00ff",
  success: "#00aa00",
  warning: "#ff6600",
  error: "#ff0000",
  muted: "#999999",
  background: "rgba(255, 255, 255, 0.98)",
  text: "#000000",
};
