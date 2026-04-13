// import React, { useState, useCallback, useRef } from "react";
// import {
//   EChartsWrapper,
//   ChartWrapperConfig,
//   SeriesConfig,
//   CHART_PRESETS,
//   chartManager,
//   useChart,
// } from "./chartWrapper";

// // ============================================================================
// // EXAMPLE 1: SIMPLE LINE CHART
// // ============================================================================

// export const SimpleLineChartExample = () => {
//   const config: ChartWrapperConfig = {
//     type: "line",
//     height: "400px",
//     showTooltip: true,
//     showLegend: true,
//     animation: true,
//   };

//   const xAxisData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

//   const series: SeriesConfig = {
//     name: "Sales",
//     type: "line",
//     data: [120, 200, 150, 80, 70, 110],
//     smooth: true,
//     symbolSize: 8,
//   };

//   return (
//     <EChartsWrapper
//       config={config}
//       xAxis={{ type: "category", data: xAxisData }}
//       yAxis={{ type: "value" }}
//       series={series}
//       title="Monthly Sales"
//       subtitle="2024"
//     />
//   );
// };

// // ============================================================================
// // EXAMPLE 2: MULTI-SERIES BAR CHART
// // ============================================================================

// export const MultiSeriesBarChartExample = () => {
//   const config: ChartWrapperConfig = {
//     type: "bar",
//     height: "400px",
//     showTooltip: true,
//     showLegend: true,
//     legendPosition: "top",
//     animation: true,
//     color: ["#3b82f6", "#10b981", "#f59e0b"],
//   };

//   const xAxisData = ["Q1", "Q2", "Q3", "Q4"];

//   const series: SeriesConfig[] = [
//     {
//       name: "Product A",
//       type: "bar",
//       data: [320, 332, 301, 334],
//     },
//     {
//       name: "Product B",
//       type: "bar",
//       data: [120, 132, 101, 134],
//     },
//     {
//       name: "Product C",
//       type: "bar",
//       data: [220, 182, 191, 234],
//     },
//   ];

//   return (
//     <EChartsWrapper
//       config={config}
//       xAxis={{ type: "category", data: xAxisData }}
//       yAxis={{ type: "value" }}
//       series={series}
//       title="Quarterly Revenue by Product"
//     />
//   );
// };

// // ============================================================================
// // EXAMPLE 3: PIE CHART WITH CUSTOMIZATION
// // ============================================================================

// export const PieChartExample = () => {
//   const config: ChartWrapperConfig = {
//     type: "pie",
//     height: "400px",
//     showTooltip: true,
//     showLegend: true,
//     legendPosition: "right",
//     animation: true,
//   };

//   const series: SeriesConfig = {
//     name: "Market Share",
//     type: "pie",
//     radius: "50%",
//     data: [
//       { value: 1048, name: "Company A" },
//       { value: 735, name: "Company B" },
//       { value: 580, name: "Company C" },
//       { value: 484, name: "Company D" },
//       { value: 300, name: "Company E" },
//     ],
//     emphasis: {
//       itemStyle: {
//         shadowBlur: 10,
//         shadowOffsetX: 0,
//         shadowColor: "rgba(0, 0, 0, 0.5)",
//       },
//     },
//   };

//   return (
//     <EChartsWrapper
//       config={config}
//       series={series}
//       title="Market Share Distribution"
//     />
//   );
// };

// // ============================================================================
// // EXAMPLE 4: GAUGE CHART (FOR PROGRESS)
// // ============================================================================

// export const GaugeChartExample = () => {
//   const [progress, setProgress] = useState(65);

//   const config: ChartWrapperConfig = {
//     type: "gauge",
//     height: "400px",
//     showTooltip: false,
//     showLegend: false,
//     animation: true,
//   };

//   const series: SeriesConfig = {
//     name: "Progress",
//     type: "gauge",
//     radius: "75%",
//     center: ["50%", "50%"],
//     min: 0,
//     max: 100,
//     splitNumber: 10,
//     axisLine: {
//       lineStyle: {
//         width: 30,
//         color: [
//           [0.3, "#ef4444"],
//           [0.7, "#f59e0b"],
//           [1, "#10b981"],
//         ],
//       },
//     },
//     axisTick: {
//       lineStyle: { color: "#666" },
//     },
//     axisLabel: {
//       distance: 50,
//       fontSize: 16,
//     },
//     detail: {
//       valueAnimation: true,
//       formatter: "{value}%",
//       color: "#000",
//       fontSize: 30,
//       fontWeight: "bold",
//     },
//     data: [{ value: progress, name: "Progress" }],
//   };

//   return (
//     <div>
//       <EChartsWrapper
//         config={config}
//         series={series}
//         title="Project Progress"
//       />
//       <div style={{ marginTop: "16px" }}>
//         <input
//           type="range"
//           min="0"
//           max="100"
//           value={progress}
//           onChange={(e) => setProgress(Number(e.target.value))}
//           style={{ width: "100%" }}
//         />
//         <p>Adjust progress: {progress}%</p>
//       </div>
//     </div>
//   );
// };

// // ============================================================================
// // EXAMPLE 5: INTERACTIVE CHART WITH EVENT HANDLING
// // ============================================================================

// export const InteractiveChartExample = () => {
//   const [selectedItem, setSelectedItem] = useState<string | null>(null);
//   const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

//   const config: ChartWrapperConfig = {
//     type: "line",
//     height: "400px",
//     animation: true,
//     onClick: (params: { name: React.SetStateAction<string | null> }) => {
//       setSelectedItem(params.name);
//       console.log("Clicked:", params);
//     },
//     onMouseOver: (params: {
//       dataIndex: React.SetStateAction<number | null> | undefined;
//     }) => {
//       if (params.dataIndex !== undefined) {
//         setHoveredPoint(params.dataIndex);
//       }
//     },
//     onMouseOut: () => {
//       setHoveredPoint(null);
//     },
//   };

//   const xAxisData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//   const series: SeriesConfig = {
//     name: "Website Traffic",
//     type: "line",
//     data: [120, 200, 150, 80, 70, 110, 130],
//     smooth: true,
//     symbolSize: 10,
//     itemStyle: {
//       color: "#3b82f6",
//       borderWidth: 2,
//       borderColor: "#fff",
//     },
//   };

//   return (
//     <div>
//       <EChartsWrapper
//         config={config}
//         xAxis={{ type: "category", data: xAxisData }}
//         yAxis={{ type: "value" }}
//         series={series}
//         title="Interactive Website Traffic"
//       />
//       <div
//         style={{
//           marginTop: "16px",
//           padding: "16px",
//           backgroundColor: "#f5f5f5",
//         }}
//       >
//         {selectedItem && <p>Selected: {selectedItem}</p>}
//         {hoveredPoint !== null && <p>Hovering over index: {hoveredPoint}</p>}
//       </div>
//     </div>
//   );
// };

// // ============================================================================
// // EXAMPLE 6: DARK MODE CHART
// // ============================================================================

// export const DarkModeChartExample = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const config: ChartWrapperConfig = {
//     ...CHART_PRESETS.line,
//     height: "400px",
//     darkMode: isDarkMode,
//     backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
//     theme: isDarkMode ? "dark" : "light",
//   };

//   const xAxisData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

//   const series: SeriesConfig = {
//     name: "Performance",
//     type: "line",
//     data: [100, 120, 150, 130, 180, 200],
//     smooth: true,
//   };

//   return (
//     <div>
//       <button
//         onClick={() => setIsDarkMode(!isDarkMode)}
//         style={{
//           padding: "8px 16px",
//           marginBottom: "16px",
//           backgroundColor: isDarkMode ? "#333" : "#ddd",
//           color: isDarkMode ? "#fff" : "#000",
//           border: "none",
//           borderRadius: "4px",
//           cursor: "pointer",
//         }}
//       >
//         {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
//       </button>
//       <EChartsWrapper
//         config={config}
//         xAxis={{ type: "category", data: xAxisData }}
//         yAxis={{ type: "value" }}
//         series={series}
//         style={{
//           backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
//         }}
//       />
//     </div>
//   );
// };

// // ============================================================================
// // EXAMPLE 7: RESPONSIVE CHART
// // ============================================================================

// export const ResponsiveChartExample = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [size, setSize] = useState({ width: 0, height: 0 });

//   const config: ChartWrapperConfig = {
//     type: "area",
//     animation: true,
//     showTooltip: true,
//     onError: (error: any) => console.error("Chart error:", error),
//     onWarning: (message: any) => console.warn("Chart warning:", message),
//   };

//   const handleResize = useCallback(
//     (newSize: { width: number; height: number }) => {
//       setSize(newSize);
//     },
//     []
//   );

//   const xAxisData = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);

//   const series: SeriesConfig = {
//     name: "Revenue",
//     type: "area",
//     data: Array.from({ length: 12 }, () => Math.random() * 1000),
//     smooth: true,
//     areaStyle: {
//       opacity: 0.5,
//     },
//   };

//   return (
//     <div ref={containerRef} style={{ width: "100%", minHeight: "500px" }}>
//       <EChartsWrapper
//         config={config}
//         container={containerRef.current}
//         xAxis={{ type: "category", data: xAxisData }}
//         yAxis={{ type: "value" }}
//         series={series}
//         title="Responsive Area Chart"
//         onResize={handleResize}
//       />
//       <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
//         Size: {size.width}x{size.height}
//       </div>
//     </div>
//   );
// };

// // ============================================================================
// // EXAMPLE 8: USING useChart HOOK
// // ============================================================================

// export const UseChartHookExample = () => {
//   const { chart, setOption, resize } = useChart("my-chart", {
//     type: "bar",
//     animation: true,
//   });

//   const handleUpdateData = () => {
//     if (chart) {
//       setOption({
//         xAxis: { type: "category", data: ["A", "B", "C", "D", "E"] },
//         yAxis: { type: "value" },
//         series: [
//           {
//             name: "Random Data",
//             type: "bar",
//             data: Array.from({ length: 5 }, () => Math.random() * 1000),
//           },
//         ],
//       });
//     }
//   };

//   return (
//     <div>
//       <div
//         id="my-chart"
//         style={{ width: "100%", height: "400px", marginBottom: "16px" }}
//       />
//       <button
//         onClick={handleUpdateData}
//         style={{
//           padding: "8px 16px",
//           backgroundColor: "#3b82f6",
//           color: "#fff",
//           border: "none",
//           borderRadius: "4px",
//           cursor: "pointer",
//         }}
//       >
//         Update Chart Data
//       </button>
//     </div>
//   );
// };

// // ============================================================================
// // EXAMPLE 9: ADVANCED CUSTOMIZATION WITH CUSTOM OPTIONS
// // ============================================================================

// export const AdvancedCustomizationExample = () => {
//   const config: ChartWrapperConfig = {
//     type: "line",
//     height: "400px",
//     customMergeStrategy: "deep-merge",
//     customOptions: {
//       // Custom gradients
//       graphic: {
//         elements: [
//           {
//             type: "rect",
//             left: "10%",
//             top: "10%",
//             z: 100,
//             shape: { width: 100, height: 50 },
//             style: {
//               fill: "rgba(0, 0, 255, 0.1)",
//             },
//           },
//         ],
//       },
//       // Custom visual effects
//       visualMap: {
//         type: "continuous",
//         min: 0,
//         max: 1000,
//         inRange: {
//           color: ["#50a3ba", "#eac736", "#d94e5d"],
//         },
//       },
//     },
//   };

//   const xAxisData = ["A", "B", "C", "D", "E", "F"];

//   const series: SeriesConfig = {
//     name: "Advanced Series",
//     type: "line",
//     data: [300, 400, 350, 500, 450, 600],
//     smooth: true,
//     symbolSize: [8, 12],
//     itemStyle: {
//       color: new (
//         require("echarts") as typeof import("echarts")
//       ).graphic.LinearGradient(0, 0, 0, 1, [
//         { offset: 0, color: "#83bff6" },
//         { offset: 0.5, color: "#188df0" },
//         { offset: 1, color: "#188df0" },
//       ]),
//     },
//   };

//   return (
//     <EChartsWrapper
//       config={config}
//       xAxis={{ type: "category", data: xAxisData }}
//       yAxis={{ type: "value" }}
//       series={series}
//       title="Advanced Customization"
//     />
//   );
// };

// // ============================================================================
// // EXAMPLE 10: MULTIPLE CHARTS WITH CHART MANAGER
// // ============================================================================

// export const ChartManagerExample = () => {
//   const [charts, setCharts] = useState<string[]>(["chart1", "chart2"]);

//   const handleAddChart = () => {
//     const newId = `chart${charts.length + 1}`;
//     setCharts([...charts, newId]);
//   };

//   const handleRemoveChart = (id: string) => {
//     chartManager.remove(id);
//     setCharts(charts.filter((c) => c !== id));
//   };

//   const handleResizeAll = () => {
//     chartManager.resizeAll();
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: "16px" }}>
//         <button
//           onClick={handleAddChart}
//           style={{
//             padding: "8px 16px",
//             marginRight: "8px",
//             backgroundColor: "#10b981",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//         >
//           + Add Chart
//         </button>
//         <button
//           onClick={handleResizeAll}
//           style={{
//             padding: "8px 16px",
//             backgroundColor: "#3b82f6",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//         >
//           Resize All
//         </button>
//       </div>

//       <div
//         style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
//       >
//         {charts.map((id) => (
//           <div
//             key={id}
//             style={{ border: "1px solid #ddd", borderRadius: "4px" }}
//           >
//             <EChartsWrapper
//               config={{
//                 type: "line",
//                 height: "300px",
//               }}
//               xAxis={{ type: "category", data: ["A", "B", "C", "D", "E"] }}
//               yAxis={{ type: "value" }}
//               series={{
//                 name: id,
//                 type: "line",
//                 data: Array.from({ length: 5 }, () => Math.random() * 1000),
//               }}
//               title={id}
//             />
//             <button
//               onClick={() => handleRemoveChart(id)}
//               style={{
//                 padding: "8px 12px",
//                 margin: "8px",
//                 backgroundColor: "#ef4444",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // ============================================================================
// // DEMO APP - SHOWCASING ALL EXAMPLES
// // ============================================================================

// export const EChartsWrapperDemo = () => {
//   const [activeExample, setActiveExample] = useState(0);

//   const examples = [
//     {
//       name: "Simple Line Chart",
//       component: <SimpleLineChartExample />,
//     },
//     {
//       name: "Multi-Series Bar Chart",
//       component: <MultiSeriesBarChartExample />,
//     },
//     {
//       name: "Pie Chart",
//       component: <PieChartExample />,
//     },
//     {
//       name: "Gauge Chart",
//       component: <GaugeChartExample />,
//     },
//     {
//       name: "Interactive Chart",
//       component: <InteractiveChartExample />,
//     },
//     {
//       name: "Dark Mode",
//       component: <DarkModeChartExample />,
//     },
//     {
//       name: "Responsive Chart",
//       component: <ResponsiveChartExample />,
//     },
//     {
//       name: "useChart Hook",
//       component: <UseChartHookExample />,
//     },
//     {
//       name: "Advanced Customization",
//       component: <AdvancedCustomizationExample />,
//     },
//     {
//       name: "Chart Manager",
//       component: <ChartManagerExample />,
//     },
//   ];

//   return (
//     <div
//       style={{
//         padding: "24px",
//         backgroundColor: "#f9fafb",
//         minHeight: "100vh",
//       }}
//     >
//       <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//         <h1
//           style={{ marginBottom: "24px", fontSize: "32px", fontWeight: "bold" }}
//         >
//           ECharts Wrapper - Complete Examples
//         </h1>

//         <div
//           style={{
//             display: "flex",
//             gap: "8px",
//             marginBottom: "24px",
//             flexWrap: "wrap",
//           }}
//         >
//           {examples.map((example, index) => (
//             <button
//               key={index}
//               onClick={() => setActiveExample(index)}
//               style={{
//                 padding: "8px 16px",
//                 backgroundColor:
//                   activeExample === index ? "#3b82f6" : "#e5e7eb",
//                 color: activeExample === index ? "#fff" : "#000",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 fontWeight: activeExample === index ? "bold" : "normal",
//               }}
//             >
//               {example.name}
//             </button>
//           ))}
//         </div>

//         <div
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: "8px",
//             padding: "24px",
//             boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           {examples[activeExample].component}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EChartsWrapperDemo;
