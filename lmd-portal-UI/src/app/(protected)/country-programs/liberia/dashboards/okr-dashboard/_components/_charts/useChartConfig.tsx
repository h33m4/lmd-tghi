import { useState, useCallback, useMemo } from "react";
import {
  applyPreset,
  CHART_PRESETS,
  ChartColorConfig,
  ChartConfig,
  DEFAULT_CHART_CONFIG,
  DEFAULT_COLORS,
  mergeChartConfig,
} from "./types";

export interface UseChartConfigOptions {
  initialConfig?: Partial<ChartConfig>;
  preset?: keyof typeof CHART_PRESETS;
  colors?: ChartColorConfig;
  onConfigChange?: (config: ChartConfig) => void;
}

/**
 * Custom hook for managing chart configuration
 * Provides state management, presets, and utility functions
 */
export function useChartConfig({
  initialConfig,
  preset,
  colors = DEFAULT_COLORS,
  onConfigChange,
}: UseChartConfigOptions = {}) {
  const [config, setConfigState] = useState<ChartConfig>(() => {
    let baseConfig = mergeChartConfig(DEFAULT_CHART_CONFIG, initialConfig);
    if (preset) {
      baseConfig = applyPreset(preset, baseConfig);
    }
    return baseConfig;
  });

  const setConfig = useCallback(
    (newConfig: ChartConfig | ((prev: ChartConfig) => ChartConfig)) => {
      setConfigState((prevConfig) => {
        const updated =
          typeof newConfig === "function" ? newConfig(prevConfig) : newConfig;
        onConfigChange?.(updated);
        return updated;
      });
    },
    [onConfigChange]
  );

  const updateConfig = useCallback(
    (updates: Partial<ChartConfig>) => {
      setConfig((prev) => mergeChartConfig(prev, updates));
    },
    [setConfig]
  );

  const updateConfigField = useCallback(
    <K extends keyof ChartConfig>(key: K, value: ChartConfig[K]) => {
      setConfig((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setConfig]
  );

  const applyChartPreset = useCallback(
    (presetName: keyof typeof CHART_PRESETS) => {
      updateConfig(CHART_PRESETS[presetName]);
    },
    [updateConfig]
  );

  const resetToDefaults = useCallback(() => {
    setConfig(DEFAULT_CHART_CONFIG);
  }, [setConfig]);

  const toggleOption = useCallback(
    (key: keyof ChartConfig) => {
      setConfig((prev) => ({
        ...prev,
        [key]: !(prev[key] as boolean),
      }));
    },
    [setConfig]
  );

  // Memoized computed values
  const gridConfig = useMemo(
    () => ({
      left: config.paddingLeft,
      right: config.paddingRight,
      top: config.paddingTop,
      bottom: config.paddingBottom,
      containLabel: true,
    }),
    [
      config.paddingLeft,
      config.paddingRight,
      config.paddingTop,
      config.paddingBottom,
    ]
  );

  const tooltipConfig = useMemo(
    () => ({
      show: config.showTooltip,
      trigger:
        config.tooltipTrigger === "none" ? "none" : config.tooltipTrigger,
      backgroundColor: config.tooltipBackgroundColor,
      borderColor: config.tooltipBorderColor,
      borderWidth: config.tooltipBorderWidth,
      textStyle: {
        color: config.tooltipTextColor,
        fontSize: config.tooltipTextSize,
      },
      padding: [8, 12],
    }),
    [
      config.showTooltip,
      config.tooltipTrigger,
      config.tooltipBackgroundColor,
      config.tooltipBorderColor,
      config.tooltipBorderWidth,
      config.tooltipTextColor,
      config.tooltipTextSize,
    ]
  );

  const legendConfig = useMemo(
    () => ({
      show: config.showLegend,
      orient:
        config.legendPosition === "left" || config.legendPosition === "right"
          ? "vertical"
          : "horizontal",
      [config.legendPosition]: "center",
      textStyle: {
        color: config.legendTextColor,
        fontSize: config.legendTextSize,
      },
      backgroundColor: config.legendBackgroundColor,
      borderColor: config.legendBorderColor,
      borderRadius: config.legendBorderRadius,
    }),
    [
      config.showLegend,
      config.legendPosition,
      config.legendTextColor,
      config.legendTextSize,
      config.legendBackgroundColor,
      config.legendBorderColor,
      config.legendBorderRadius,
    ]
  );

  const axisConfig = useMemo(
    () => ({
      showGridLines: config.showGridLines,
      showAxisLines: config.showAxisLines,
      labelSize: config.axisLabelSize,
      labelColor: config.axisLabelColor,
      gridLineColor: config.gridLineColor,
      gridSplitLineColor: config.gridSplitLineColor,
    }),
    [
      config.showGridLines,
      config.showAxisLines,
      config.axisLabelSize,
      config.axisLabelColor,
      config.gridLineColor,
      config.gridSplitLineColor,
    ]
  );

  const animationConfig = useMemo(
    () => ({
      show: config.showAnimations,
      duration: config.animationDuration,
      easing: config.animationEasing,
    }),
    [config.showAnimations, config.animationDuration, config.animationEasing]
  );

  const seriesConfig = useMemo(
    () => ({
      lineWidth: config.lineWidth,
      lineStyle: config.lineStyle,
      smoothCurve: config.smoothCurve,
      colorMode: config.colorMode,
      dataPointSize: config.dataPointSize,
      areaOpacity: config.areaOpacity,
      dataPointBorderWidth: config.dataPointBorderWidth,
      dataPointBorderColor: config.dataPointBorderColor,
      shadowBlur: config.shadowBlur,
      shadowColor: config.shadowColor,
    }),
    [
      config.lineWidth,
      config.lineStyle,
      config.smoothCurve,
      config.colorMode,
      config.dataPointSize,
      config.areaOpacity,
      config.dataPointBorderWidth,
      config.dataPointBorderColor,
      config.shadowBlur,
      config.shadowColor,
    ]
  );

  const renderConfig = useMemo(
    () => ({
      renderer: config.useCanvas ? "canvas" : "svg",
      useDirtyRect: config.useDirtyRect,
    }),
    [config.useCanvas, config.useDirtyRect]
  );

  return {
    // State
    config,
    setConfig,

    // Update methods
    updateConfig,
    updateConfigField,
    applyChartPreset,
    resetToDefaults,
    toggleOption,

    // Computed config groups
    gridConfig,
    tooltipConfig,
    legendConfig,
    axisConfig,
    animationConfig,
    seriesConfig,
    renderConfig,

    // Color config
    colors,
  };
}

export type UseChartConfigReturn = ReturnType<typeof useChartConfig>;
