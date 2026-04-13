// import {
//   ReactNode,
//   useEffect,
//   useRef,
//   useState,
//   useCallback,
//   useMemo,
// } from "react";
// import * as echarts from "echarts";

// // ============================================================================
// // TYPES & INTERFACES
// // ============================================================================

// export type ChartType =
//   | "line"
//   | "bar"
//   | "area"
//   | "scatter"
//   | "pie"
//   | "donut"
//   | "gauge"
//   | "radar"
//   | "candlestick"
//   | "heatmap"
//   | "sankey"
//   | "graph";

// export type TooltipTrigger = "item" | "axis" | "none";

// export type LegendPosition = "top" | "bottom" | "left" | "right";

// export interface SeriesConfig {
//   name?: string;
//   type: ChartType;
//   data: any[];
//   [key: string]: any;
// }

// export interface AxisConfig {
//   type: "category" | "value" | "time" | "log";
//   data?: string[];
//   [key: string]: any;
// }

// export interface TooltipConfig {
//   show: boolean;
//   trigger: TooltipTrigger;
//   backgroundColor: string;
//   borderColor: string;
//   textStyle: {
//     color: string;
//     fontSize: number;
//   };
//   formatter?: string | ((params: any) => string);
// }

// export interface LegendConfig {
//   show: boolean;
//   position: LegendPosition;
//   textStyle: {
//     color: string;
//     fontSize: number;
//   };
//   [key: string]: any;
// }

// export interface GridConfig {
//   show: boolean;
//   [key: string]: any;
// }

// export interface ChartWrapperConfig {
//   // Basic
//   type: ChartType;
//   theme?: string | object;
//   renderer?: "canvas" | "svg";
//   useDirtyRect?: boolean;

//   // Display
//   showTooltip?: boolean;
//   showLegend?: boolean;
//   showGrid?: boolean;
//   tooltipTrigger?: TooltipTrigger;
//   legendPosition?: LegendPosition;

//   // Animation
//   animation?: boolean;
//   animationDuration?: number;
//   animationEasing?: string;

//   // Sizing
//   width?: string | number;
//   height?: string | number;

//   // Colors
//   color?: string[];
//   backgroundColor?: string;

//   // Error handling
//   onError?: (error: Error) => void;
//   onWarning?: (message: string) => void;

//   // Events
//   onClick?: (params: any) => void;
//   onDblClick?: (params: any) => void;
//   onMouseOver?: (params: any) => void;
//   onMouseOut?: (params: any) => void;
//   onLegendSelectChanged?: (params: any) => void;
//   onDataZoom?: (params: any) => void;

//   // Advanced
//   enableDataZoom?: boolean;
//   enableVisualMap?: boolean;
//   darkMode?: boolean;

//   // Custom
//   customOptions?: Partial<echarts.EChartsOption>;
//   customMergeStrategy?: "replace" | "merge" | "deep-merge";
// }

// export interface EChartsWrapperProps {
//   config: ChartWrapperConfig;
//   xAxis?: AxisConfig;
//   yAxis?: AxisConfig;
//   series: SeriesConfig | SeriesConfig[];
//   title?: string;
//   subtitle?: string;
//   container?: HTMLDivElement | null;
//   className?: string;
//   style?: React.CSSProperties;
//   onReady?: (chart: echarts.ECharts) => void;
//   onResize?: (size: { width: number; height: number }) => void;
//   loading?: boolean;
//   loadingMessage?: string;
//   children?: ReactNode;
// }

// // ============================================================================
// // UTILITY FUNCTIONS
// // ============================================================================

// /**
//  * Validates chart configuration
//  */
// export const validateChartConfig = (config: ChartWrapperConfig): string[] => {
//   const errors: string[] = [];

//   if (!config.type) {
//     errors.push("Chart type is required");
//   }

//   if (
//     config.width !== undefined &&
//     typeof config.width === "number" &&
//     config.width <= 0
//   ) {
//     errors.push("Width must be greater than 0");
//   }

//   if (
//     config.height !== undefined &&
//     typeof config.height === "number" &&
//     config.height <= 0
//   ) {
//     errors.push("Height must be greater than 0");
//   }

//   if (!["canvas", "svg"].includes(config.renderer || "canvas")) {
//     errors.push("Renderer must be 'canvas' or 'svg'");
//   }

//   return errors;
// };

// /**
//  * Safe get value from object with path notation
//  */
// export const getValueByPath = (
//   obj: any,
//   path: string,
//   defaultValue: any = undefined
// ) => {
//   try {
//     const value = path.split(".").reduce((acc, part) => acc?.[part], obj);
//     return value !== undefined ? value : defaultValue;
//   } catch {
//     return defaultValue;
//   }
// };

// /**
//  * Deep merge objects safely
//  */
// export const deepMerge = (target: any, source: any): any => {
//   if (!source || typeof source !== "object") return target;
//   if (!target || typeof target !== "object") return source;

//   const result = { ...target };

//   Object.keys(source).forEach((key) => {
//     if (
//       source[key] &&
//       typeof source[key] === "object" &&
//       !Array.isArray(source[key]) &&
//       result[key] &&
//       typeof result[key] === "object" &&
//       !Array.isArray(result[key])
//     ) {
//       result[key] = deepMerge(result[key], source[key]);
//     } else {
//       result[key] = source[key];
//     }
//   });

//   return result;
// };

// /**
//  * Get responsive chart options
//  */
// export const getResponsiveOptions = (
//   width: number,
//   height: number
// ): Partial<echarts.EChartsOption> => {
//   if (width < 400 || height < 300) {
//     return {
//       textStyle: { fontSize: 10 },
//       title: { textStyle: { fontSize: 12 } },
//       legend: { textStyle: { fontSize: 10 } },
//       tooltip: { textStyle: { fontSize: 10 } },
//     };
//   }

//   if (width < 600 || height < 400) {
//     return {
//       textStyle: { fontSize: 11 },
//       title: { textStyle: { fontSize: 13 } },
//       legend: { textStyle: { fontSize: 11 } },
//       tooltip: { textStyle: { fontSize: 11 } },
//     };
//   }

//   return {};
// };

// // ============================================================================
// // MAIN ECHARTS WRAPPER COMPONENT
// // ============================================================================

// export const EChartsWrapper = ({
//   config,
//   xAxis,
//   yAxis,
//   series,
//   title,
//   subtitle,
//   container,
//   className,
//   style,
//   onReady,
//   onResize,
//   loading = false,
//   loadingMessage = "Loading...",
//   children,
// }: EChartsWrapperProps) => {
//   const chartContainerRef = useRef<HTMLDivElement>(null);
//   const chartInstanceRef = useRef<echarts.ECharts | null>(null);
//   const resizeObserverRef = useRef<ResizeObserver | null>(null);
//   const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
//   const [error, setError] = useState<string | null>(null);

//   // Validate config on mount
//   useEffect(() => {
//     const validationErrors = validateChartConfig(config);
//     if (validationErrors.length > 0) {
//       const errorMessage = validationErrors.join("; ");
//       setError(errorMessage);
//       config.onError?.(new Error(errorMessage));
//     }
//   }, [config]);

//   // Initialize chart
//   useEffect(() => {
//     const chartContainer = container || chartContainerRef.current;

//     if (!chartContainer) {
//       config.onWarning?.("Chart container not found");
//       return;
//     }

//     try {
//       // Dispose existing chart instance
//       if (chartInstanceRef.current) {
//         chartInstanceRef.current.dispose();
//       }

//       // Initialize new chart
//       chartInstanceRef.current = echarts.init(chartContainer, config.theme, {
//         renderer: config.renderer || "canvas",
//         useDirtyRect: config.useDirtyRect !== false,
//       });

//       // Call onReady callback
//       onReady?.(chartInstanceRef.current);

//       // Setup event listeners
//       setupEventListeners(chartInstanceRef.current, config);

//       // Setup resize observer
//       setupResizeObserver(chartContainer);

//       setError(null);
//     } catch (err) {
//       const error = err instanceof Error ? err : new Error(String(err));
//       setError(error.message);
//       config.onError?.(error);
//     }

//     return () => {
//       // Cleanup
//       if (resizeObserverRef.current) {
//         resizeObserverRef.current.disconnect();
//         resizeObserverRef.current = null;
//       }
//     };
//   }, [container, config, onReady]);

//   // Update chart options
//   useEffect(() => {
//     if (!chartInstanceRef.current) return;

//     try {
//       if (loading) {
//         chartInstanceRef.current.showLoading("default", {
//           text: loadingMessage,
//           textStyle: { color: "#666" },
//         });
//         return;
//       }

//       chartInstanceRef.current.hideLoading();

//       const option = buildChartOption({
//         config,
//         xAxis,
//         yAxis,
//         series,
//         title,
//         subtitle,
//       });

//       if (!option) {
//         config.onWarning?.("Failed to build chart option");
//         return;
//       }

//       // Merge custom options
//       let finalOption = option;
//       if (config.customOptions) {
//         const mergeStrategy = config.customMergeStrategy || "merge";
//         if (mergeStrategy === "deep-merge") {
//           finalOption = deepMerge(finalOption, config.customOptions);
//         } else if (mergeStrategy === "merge") {
//           finalOption = { ...finalOption, ...config.customOptions };
//         } else {
//           finalOption = config.customOptions;
//         }
//       }

//       // Apply responsive options
//       const responsiveOpts = getResponsiveOptions(
//         chartSize.width,
//         chartSize.height
//       );
//       finalOption = deepMerge(finalOption, responsiveOpts);

//       chartInstanceRef.current.setOption(finalOption, {
//         lazyUpdate: false,
//         silent: false,
//       });
//     } catch (err) {
//       const error = err instanceof Error ? err : new Error(String(err));
//       setError(error.message);
//       config.onError?.(error);
//     }
//   }, [
//     config,
//     xAxis,
//     yAxis,
//     series,
//     title,
//     subtitle,
//     loading,
//     loadingMessage,
//     chartSize,
//   ]);

//   // Setup event listeners
//   const setupEventListeners = useCallback(
//     (chart: echarts.ECharts, cfg: ChartWrapperConfig) => {
//       if (cfg.onClick) {
//         chart.off("click");
//         chart.on("click", cfg.onClick);
//       }

//       if (cfg.onDblClick) {
//         chart.off("dblclick");
//         chart.on("dblclick", cfg.onDblClick);
//       }

//       if (cfg.onMouseOver) {
//         chart.off("mousemove");
//         chart.on("mousemove", cfg.onMouseOver);
//       }

//       if (cfg.onMouseOut) {
//         chart.off("mouseout");
//         chart.on("mouseout", cfg.onMouseOut);
//       }

//       if (cfg.onLegendSelectChanged) {
//         chart.off("legendselectchanged");
//         chart.on("legendselectchanged", cfg.onLegendSelectChanged);
//       }

//       if (cfg.onDataZoom) {
//         chart.off("datazoom");
//         chart.on("datazoom", cfg.onDataZoom);
//       }
//     },
//     []
//   );

//   // Setup resize observer
//   const setupResizeObserver = useCallback(
//     (container: HTMLElement) => {
//       if (!window.ResizeObserver) {
//         config.onWarning?.(
//           "ResizeObserver not supported, resize events may not work"
//         );
//         return;
//       }

//       if (resizeObserverRef.current) {
//         resizeObserverRef.current.disconnect();
//       }

//       resizeObserverRef.current = new ResizeObserver(() => {
//         try {
//           const width = container.clientWidth;
//           const height = container.clientHeight;

//           if (width > 0 && height > 0) {
//             setChartSize({ width, height });
//             chartInstanceRef.current?.resize();
//             onResize?.({ width, height });
//           }
//         } catch (err) {
//           config.onWarning?.(`Resize error: ${err}`);
//         }
//       });

//       resizeObserverRef.current.observe(container);
//     },
//     [config, onResize]
//   );

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (resizeObserverRef.current) {
//         resizeObserverRef.current.disconnect();
//       }

//       if (chartInstanceRef.current) {
//         chartInstanceRef.current.dispose();
//         chartInstanceRef.current = null;
//       }
//     };
//   }, []);

//   const defaultStyle: React.CSSProperties = {
//     width: config.width || "100%",
//     height: config.height || "400px",
//     backgroundColor: config.backgroundColor || "transparent",
//     ...style,
//   };

//   return (
//     <div className={className} style={defaultStyle}>
//       {error && (
//         <div
//           style={{
//             padding: "16px",
//             backgroundColor: "#fee",
//             borderRadius: "4px",
//             color: "#c33",
//             fontSize: "14px",
//             marginBottom: "8px",
//           }}
//         >
//           ⚠️ Chart Error: {error}
//         </div>
//       )}

//       <div
//         ref={chartContainerRef}
//         style={{
//           width: "100%",
//           height: "100%",
//           minHeight: "300px",
//         }}
//       />

//       {children}
//     </div>
//   );
// };

// // ============================================================================
// // CHART OPTION BUILDER
// // ============================================================================

// interface BuildChartOptionProps {
//   config: ChartWrapperConfig;
//   xAxis?: AxisConfig;
//   yAxis?: AxisConfig;
//   series: SeriesConfig | SeriesConfig[];
//   title?: string;
//   subtitle?: string;
// }

// /**
//  * Build complete chart option object
//  */
// export const buildChartOption = ({
//   config,
//   xAxis,
//   yAxis,
//   series,
//   title,
//   subtitle,
// }: BuildChartOptionProps): echarts.EChartsOption | null => {
//   try {
//     if (!series) {
//       return null;
//     }

//     const seriesArray = Array.isArray(series) ? series : [series];

//     const baseOption: echarts.EChartsOption = {
//       animation: config.animation !== false,
//       animationDuration: config.animationDuration || 750,
//       animationEasing: config.animationEasing
//         ? config.animationEasing
//         : "cubicIn",
//       backgroundColor: config.backgroundColor,
//     };

//     // Add title if provided
//     if (title) {
//       baseOption.title = {
//         text: title,
//         subtext: subtitle,
//         left: "center",
//         textStyle: {
//           fontSize: 16,
//           fontWeight: "bold",
//           color: config.darkMode ? "#eee" : "#333",
//         },
//         subtextStyle: {
//           fontSize: 12,
//           color: config.darkMode ? "#bbb" : "#666",
//         },
//       };
//     }

//     // Add tooltip
//     if (config.showTooltip !== false) {
//       baseOption.tooltip = {
//         show: true,
//         trigger: config.tooltipTrigger || "axis",
//         backgroundColor: config.darkMode
//           ? "rgba(50, 50, 50, 0.95)"
//           : "rgba(255, 255, 255, 0.95)",
//         borderColor: config.darkMode ? "#555" : "#ddd",
//         textStyle: {
//           color: config.darkMode ? "#eee" : "#333",
//           fontSize: 12,
//         },
//         formatter: "{a} <br/> {b} : {c}",
//       };
//     }

//     // Add legend
//     if (config.showLegend !== false) {
//       const legendPosition: any = {
//         top: { top: 12 },
//         bottom: { bottom: 12 },
//         left: { left: 12, orient: "vertical" },
//         right: { right: 12, orient: "vertical" },
//       };

//       baseOption.legend = {
//         ...legendPosition[config.legendPosition || "top"],
//         textStyle: {
//           color: config.darkMode ? "#bbb" : "#666",
//           fontSize: 12,
//         },
//       };
//     }

//     // Add grid (for cartesian charts)
//     if (config.showGrid !== false && (xAxis || yAxis)) {
//       baseOption.grid = {
//         left: "10%",
//         right: "10%",
//         top: title ? "80px" : "40px",
//         bottom: "60px",
//         containLabel: true,
//       };
//     }

//     // Add axes
//     if (xAxis) {
//       baseOption.xAxis = {
//         ...xAxis,
//         axisLine: { lineStyle: { color: config.darkMode ? "#555" : "#ddd" } },
//         axisLabel: { color: config.darkMode ? "#aaa" : "#666" },
//         splitLine: { lineStyle: { color: config.darkMode ? "#333" : "#eee" } },
//       };
//     }

//     if (yAxis) {
//       baseOption.yAxis = {
//         ...yAxis,
//         axisLine: { lineStyle: { color: config.darkMode ? "#555" : "#ddd" } },
//         axisLabel: { color: config.darkMode ? "#aaa" : "#666" },
//         splitLine: { lineStyle: { color: config.darkMode ? "#333" : "#eee" } },
//       };
//     }

//     // Add series
//     baseOption.series = seriesArray.map((s) => ({
//       ...s,
//       type: s.type || config.type,
//     }));

//     // Add color palette
//     if (config.color) {
//       baseOption.color = config.color;
//     }

//     // Add data zoom if enabled
//     if (config.enableDataZoom) {
//       baseOption.dataZoom = [
//         {
//           type: "slider",
//           show: true,
//           yAxisIndex: [0],
//           start: 0,
//           end: 100,
//         },
//       ];
//     }

//     return baseOption;
//   } catch (err) {
//     console.error("Error building chart option:", err);
//     return null;
//   }
// };

// // ============================================================================
// // PRESET CHART CONFIGURATIONS
// // ============================================================================

// export const CHART_PRESETS = {
//   line: {
//     type: "line" as ChartType,
//     showTooltip: true,
//     showLegend: true,
//     animation: true,
//     showGrid: true,
//   },
//   bar: {
//     type: "bar" as ChartType,
//     showTooltip: true,
//     showLegend: true,
//     animation: true,
//     showGrid: true,
//   },
//   pie: {
//     type: "pie" as ChartType,
//     showTooltip: true,
//     showLegend: true,
//     animation: true,
//     showGrid: false,
//   },
//   gauge: {
//     type: "gauge" as ChartType,
//     showTooltip: false,
//     showLegend: false,
//     animation: true,
//     showGrid: false,
//   },
//   dark: {
//     darkMode: true,
//     theme: "dark",
//     backgroundColor: "#1f1f1f" as any,
//   },
//   light: {
//     darkMode: false,
//     theme: "light",
//     backgroundColor: "#fff" as any,
//   },
// };

// // ============================================================================
// // CHART INSTANCE MANAGER
// // ============================================================================

// export class ChartManager {
//   private charts: Map<string, echarts.ECharts> = new Map();

//   register(id: string, chart: echarts.ECharts): void {
//     if (this.charts.has(id)) {
//       this.charts.get(id)?.dispose();
//     }
//     this.charts.set(id, chart);
//   }

//   get(id: string): echarts.ECharts | undefined {
//     return this.charts.get(id);
//   }

//   remove(id: string): void {
//     const chart = this.charts.get(id);
//     if (chart) {
//       chart.dispose();
//       this.charts.delete(id);
//     }
//   }

//   disposeAll(): void {
//     this.charts.forEach((chart) => chart.dispose());
//     this.charts.clear();
//   }

//   getAll(): Map<string, echarts.ECharts> {
//     return new Map(this.charts);
//   }

//   resize(id: string): void {
//     this.charts.get(id)?.resize();
//   }

//   resizeAll(): void {
//     this.charts.forEach((chart) => chart.resize());
//   }

//   setOption(id: string, option: echarts.EChartsOption): void {
//     this.charts.get(id)?.setOption(option);
//   }

//   getOption(id: string): echarts.EChartsOption {
//     return this.charts.get(id)?.getOption() || {};
//   }
// }

// export const chartManager = new ChartManager();

// // ============================================================================
// // HOOKS
// // ============================================================================

// /**
//  * useChart hook for easy chart management
//  */
// export const useChart = (
//   containerId: string,
//   config: ChartWrapperConfig,
//   options?: Partial<echarts.EChartsOption>
// ) => {
//   const chartRef = useRef<echarts.ECharts | null>(null);

//   const initialize = useCallback(() => {
//     try {
//       const container = document.getElementById(containerId);
//       if (!container) {
//         console.warn(`Container with id "${containerId}" not found`);
//         return null;
//       }

//       if (chartRef.current) {
//         chartRef.current.dispose();
//       }

//       chartRef.current = echarts.init(container, config.theme, {
//         renderer: config.renderer || "canvas",
//         useDirtyRect: config.useDirtyRect !== false,
//       });

//       chartManager.register(containerId, chartRef.current);

//       if (options) {
//         chartRef.current.setOption(options);
//       }

//       return chartRef.current;
//     } catch (error) {
//       console.error("Error initializing chart:", error);
//       return null;
//     }
//   }, [containerId, config, options]);

//   const setOption = useCallback((option: echarts.EChartsOption) => {
//     if (chartRef.current) {
//       chartRef.current.setOption(option, { lazyUpdate: false });
//     }
//   }, []);

//   const resize = useCallback(() => {
//     if (chartRef.current) {
//       chartRef.current.resize();
//     }
//   }, []);

//   const dispose = useCallback(() => {
//     if (chartRef.current) {
//       chartRef.current.dispose();
//       chartRef.current = null;
//       chartManager.remove(containerId);
//     }
//   }, [containerId]);

//   useEffect(() => {
//     initialize();
//     return () => {
//       dispose();
//     };
//   }, [initialize, dispose]);

//   return {
//     chart: chartRef.current,
//     setOption,
//     resize,
//     dispose,
//     initialize,
//   };
// };

// export default EChartsWrapper;
