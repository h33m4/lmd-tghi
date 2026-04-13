// "use client";
// import React from "react";
// import DashboardHeader from "./dashboardHeader";
// import { StatsOverview } from "./statusOverview";
// import okrData from "./okr_data.json";
// import okrGroupData from "./okr_group_data.json";

// export interface MonthlyUpdate {
//   month: string;
//   value: number;
//   narrative: string;
// }

// export interface OKR {
//   okrId: string;
//   objectiveToc: string;
//   objective: string;
//   keyResult: string;
//   targetValue: number;
//   unit: string;
//   status: "on-track" | "at-risk" | "behind" | "achieved";
//   progress: number;
//   monthlyUpdates: MonthlyUpdate[];
// }

// export interface OkrGroup {
//   okrGroupId: number;
//   okrGroupToc: string;
//   okrGroupObjective: string;
// }

// const sampleOKRs: OKR[] = okrData as OKR[];
// const OkrGroupData: OkrGroup[] = okrGroupData as OkrGroup[];

// const currentUpdate = monthlyUpdates[monthlyUpdates.length - 1];
// const currentValue = currentUpdate?.value ?? 0;

// // Component for percentage-based metrics with bar chart
// function PercentageChart({
//   okr,
//   currentMonth,
// }: {
//   okr: OKR;
//   currentMonth?: string;
// }) {
//   const progressPercent = Math.min(
//     (okr.currentValue / okr.targetValue) * 100,
//     100
//   );

//   return (
//     <div className="space-y-3">
//       <div className="flex justify-between items-start">
//         <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
//           {okr.keyResult}
//         </h3>
//         <span
//           className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
//             okr.status === "on-track"
//               ? "bg-green-100 text-green-800"
//               : okr.status === "at-risk"
//               ? "bg-yellow-100 text-yellow-800"
//               : okr.status === "achieved"
//               ? "bg-blue-100 text-blue-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {okr.status}
//         </span>
//       </div>

//       {/* Progress Bar */}
//       <div className="space-y-2">
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Current: {okr.currentValue}%</span>
//           <span className="text-gray-600">Target: {okr.targetValue}%</span>
//         </div>
//         <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
//           <div
//             className={`absolute left-0 top-0 h-full transition-all ${
//               okr.status === "on-track"
//                 ? "bg-green-500"
//                 : okr.status === "at-risk"
//                 ? "bg-yellow-500"
//                 : okr.status === "achieved"
//                 ? "bg-blue-500"
//                 : "bg-red-500"
//             }`}
//             style={{ width: `${Math.min(progressPercent, 100)}%` }}
//           />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="text-xs font-semibold text-gray-700">
//               {progressPercent.toFixed(1)}% Complete
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Target Line Visualization */}
//       <div className="relative h-20 border border-gray-300 rounded bg-white p-2">
//         <div className="text-xs text-gray-500 mb-1">Progress Visualization</div>
//         <div className="relative h-12 flex items-end">
//           {/* Current Value Bar */}
//           <div className="relative flex-1 flex items-end justify-center">
//             <div
//               className={`w-16 rounded-t ${
//                 okr.status === "on-track"
//                   ? "bg-green-500"
//                   : okr.status === "at-risk"
//                   ? "bg-yellow-500"
//                   : okr.status === "achieved"
//                   ? "bg-blue-500"
//                   : "bg-red-500"
//               }`}
//               style={{
//                 height: `${(okr.currentValue / okr.targetValue) * 100}%`,
//               }}
//             />
//             <span className="absolute -bottom-5 text-xs font-medium">
//               Current
//             </span>
//           </div>

//           {/* Target Value Bar */}
//           <div className="relative flex-1 flex items-end justify-center">
//             <div
//               className="w-16 bg-gray-400 rounded-t"
//               style={{ height: "100%" }}
//             />
//             <span className="absolute -bottom-5 text-xs font-medium">
//               Target
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Monthly Trend */}
//       {okr.monthlyUpdates && okr.monthlyUpdates.length > 0 && (
//         <div className="mt-4">
//           <div className="text-xs font-medium text-gray-700 mb-2">
//             Monthly Progress
//           </div>
//           <div className="relative h-24 border border-gray-200 rounded bg-gray-50 p-2">
//             <svg
//               className="w-full h-full"
//               viewBox="0 0 100 100"
//               preserveAspectRatio="none"
//             >
//               {/* Target line */}
//               <line
//                 x1="0"
//                 y1={
//                   100 -
//                   (okr.targetValue /
//                     Math.max(
//                       okr.targetValue,
//                       ...okr.monthlyUpdates.map((u) => u.value)
//                     )) *
//                     90
//                 }
//                 x2="100"
//                 y2={
//                   100 -
//                   (okr.targetValue /
//                     Math.max(
//                       okr.targetValue,
//                       ...okr.monthlyUpdates.map((u) => u.value)
//                     )) *
//                     90
//                 }
//                 stroke="#9ca3af"
//                 strokeWidth="0.5"
//                 strokeDasharray="2,2"
//               />
//               {okr.monthlyUpdates.map((update, idx) => {
//                 const x =
//                   (idx / Math.max(okr.monthlyUpdates.length - 1, 1)) * 100;
//                 const maxVal = Math.max(
//                   okr.targetValue,
//                   ...okr.monthlyUpdates.map((u) => u.value)
//                 );
//                 const y = 100 - (update.value / maxVal) * 90;
//                 const nextUpdate = okr.monthlyUpdates[idx + 1];

//                 return (
//                   <g key={idx}>
//                     {nextUpdate && (
//                       <line
//                         x1={x}
//                         y1={y}
//                         x2={
//                           ((idx + 1) /
//                             Math.max(okr.monthlyUpdates.length - 1, 1)) *
//                           100
//                         }
//                         y2={100 - (nextUpdate.value / maxVal) * 90}
//                         stroke="#3b82f6"
//                         strokeWidth="1.5"
//                       />
//                     )}
//                     <circle cx={x} cy={y} r="2" fill="#3b82f6" />
//                   </g>
//                 );
//               })}
//             </svg>
//           </div>
//           <div className="flex justify-between text-xs text-gray-500 mt-1">
//             {okr.monthlyUpdates.slice(0, 3).map((update, idx) => (
//               <span key={idx} className="truncate">
//                 {update.month.split(" ")[0]}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Component for binary (Yes/No) metrics with pie chart
// function BinaryChart({ okr }: { okr: OKR }) {
//   const isAchieved = okr.currentValue >= okr.targetValue;
//   const percentage = isAchieved ? 100 : 0;

//   return (
//     <div className="space-y-3">
//       <div className="flex justify-between items-start">
//         <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
//           {okr.keyResult}
//         </h3>
//         <span
//           className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
//             okr.status === "on-track" || okr.status === "achieved"
//               ? "bg-green-100 text-green-800"
//               : okr.status === "at-risk"
//               ? "bg-yellow-100 text-yellow-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {okr.status}
//         </span>
//       </div>

//       {/* Pie Chart */}
//       <div className="flex items-center justify-center py-4">
//         <div className="relative w-32 h-32">
//           <svg className="w-full h-full transform -rotate-90">
//             <circle
//               cx="64"
//               cy="64"
//               r="56"
//               fill="none"
//               stroke="#e5e7eb"
//               strokeWidth="16"
//             />
//             <circle
//               cx="64"
//               cy="64"
//               r="56"
//               fill="none"
//               stroke={isAchieved ? "#10b981" : "#ef4444"}
//               strokeWidth="16"
//               strokeDasharray={`${(percentage / 100) * 351.86} 351.86`}
//               className="transition-all duration-500"
//             />
//           </svg>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-center">
//               <div
//                 className={`text-3xl font-bold ${
//                   isAchieved ? "text-green-600" : "text-red-600"
//                 }`}
//               >
//                 {isAchieved ? "YES" : "NO"}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Status Information */}
//       <div className="space-y-2 text-sm">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Current:</span>
//           <span className="font-medium">
//             {okr.currentValue} {okr.unit}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Target:</span>
//           <span className="font-medium">
//             {okr.targetValue} {okr.unit}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Status:</span>
//           <span
//             className={`font-medium ${
//               isAchieved ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {isAchieved ? "Achieved" : "Not Achieved"}
//           </span>
//         </div>
//       </div>

//       {/* Latest Update Narrative */}
//       {okr.monthlyUpdates && okr.monthlyUpdates.length > 0 && (
//         <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
//           <div className="text-xs font-medium text-gray-700 mb-1">
//             Latest Update (
//             {okr.monthlyUpdates[okr.monthlyUpdates.length - 1].month})
//           </div>
//           <p className="text-xs text-gray-600 line-clamp-3">
//             {okr.monthlyUpdates[okr.monthlyUpdates.length - 1].narrative}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// // Component for count-based metrics with comparison bars
// function CountChart({ okr }: { okr: OKR }) {
//   const progressPercent = Math.min(
//     (okr.currentValue / okr.targetValue) * 100,
//     100
//   );
//   const isReduction = okr.unit.toLowerCase().includes("reduction");
//   const isVariance = okr.unit.toLowerCase().includes("variance");

//   return (
//     <div className="space-y-3">
//       <div className="flex justify-between items-start">
//         <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
//           {okr.keyResult}
//         </h3>
//         <span
//           className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
//             okr.status === "on-track"
//               ? "bg-green-100 text-green-800"
//               : okr.status === "at-risk"
//               ? "bg-yellow-100 text-yellow-800"
//               : okr.status === "achieved"
//               ? "bg-blue-100 text-blue-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {okr.status}
//         </span>
//       </div>

//       {/* Horizontal Bar Chart */}
//       <div className="space-y-3">
//         <div className="space-y-1">
//           <div className="flex justify-between text-xs text-gray-600">
//             <span>Current</span>
//             <span className="font-medium">
//               {okr.currentValue} {okr.unit}
//             </span>
//           </div>
//           <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
//             <div
//               className={`h-full ${
//                 okr.status === "on-track"
//                   ? "bg-green-500"
//                   : okr.status === "at-risk"
//                   ? "bg-yellow-500"
//                   : okr.status === "achieved"
//                   ? "bg-blue-500"
//                   : "bg-red-500"
//               }`}
//               style={{ width: `${progressPercent}%` }}
//             />
//           </div>
//         </div>

//         <div className="space-y-1">
//           <div className="flex justify-between text-xs text-gray-600">
//             <span>Target</span>
//             <span className="font-medium">
//               {okr.targetValue} {okr.unit}
//             </span>
//           </div>
//           <div className="h-6 bg-gray-400 rounded-full" />
//         </div>
//       </div>

//       {/* Progress Metric */}
//       <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
//         <span className="text-sm text-gray-600">Progress</span>
//         <span className="text-lg font-bold text-gray-900">
//           {progressPercent.toFixed(1)}%
//         </span>
//       </div>

//       {/* Gap Analysis */}
//       {!isReduction && !isVariance && (
//         <div className="p-3 bg-blue-50 rounded border border-blue-200">
//           <div className="flex justify-between items-center">
//             <span className="text-xs text-blue-700">Gap to Target:</span>
//             <span className="text-sm font-bold text-blue-900">
//               {okr.targetValue - okr.currentValue} {okr.unit}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Monthly Updates Summary */}
//       {okr.monthlyUpdates && okr.monthlyUpdates.length > 0 && (
//         <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
//           <div className="text-xs font-medium text-gray-700 mb-1">
//             Latest Update (
//             {okr.monthlyUpdates[okr.monthlyUpdates.length - 1].month})
//           </div>
//           <p className="text-xs text-gray-600 line-clamp-2">
//             {okr.monthlyUpdates[okr.monthlyUpdates.length - 1].narrative}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// // Main OKR Card component that routes to appropriate visualization
// export default function OKRCard({ okr }: { okr: OKR }) {
//   const isPercentage =
//     okr.unit === "%" ||
//     okr.unit === "percent" ||
//     okr.unit.toLowerCase().includes("percent");

//   const isBinary =
//     okr.unit.toLowerCase() === "yes/no" ||
//     okr.unit.toLowerCase() === "binary" ||
//     okr.unit.toLowerCase() === "project" ||
//     okr.unit.toLowerCase() === "innovation" ||
//     okr.unit.toLowerCase() === "position" ||
//     okr.unit.toLowerCase() === "strategy" ||
//     okr.unit.toLowerCase() === "database" ||
//     (okr.targetValue === 1 && okr.currentValue <= 1);

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
//       <div className="text-xs text-gray-500 mb-2">
//         {okr.okrId} - {okr.objectiveToc}
//       </div>

//       {isPercentage ? (
//         <PercentageChart okr={okr} />
//       ) : isBinary ? (
//         <BinaryChart okr={okr} />
//       ) : (
//         <CountChart okr={okr} />
//       )}
//     </div>
//   );
// }
