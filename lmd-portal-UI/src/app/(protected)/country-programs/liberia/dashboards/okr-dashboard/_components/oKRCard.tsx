// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { TrendingUp, MessageSquare } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { useState } from "react";
// import { StatusBadge } from "./statusBagde";
// import { ProgressBar } from "./ProgressBar";
// import { OKR } from "./dashboardContent";
// // import { OKR } from "./dashboardContent";

// interface OKRCardProps {
//   okr: OKR;
//   currentMonth?: string;
// }

// export const OKRCard = ({ okr, currentMonth }: OKRCardProps) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const currentUpdate =
//     okr.monthlyUpdates.find(
//       (update) => update.month.toLowerCase() === currentMonth?.toLowerCase()
//     ) || okr.monthlyUpdates[okr.monthlyUpdates.length - 1];

//   return (
//     <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in bg-card flex justify-between">
//       <CardHeader className="pb-4 ">
//         <div className="space-y-3">
//           <div className="flex items-start justify-between gap-4">
//             <div className="flex-1 space-y-1">
//               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 KR# {okr.okrId} - {okr.objectiveToc}
//               </p>
//               {/* <h3 className="text-sm font-semibold text-foreground leading-snug">
//                 {okr.objective}
//               </h3> */}
//             </div>
//             <StatusBadge status={okr.status} />
//           </div>
//           <div>
//             <p className="text-xs font-semibold text-muted-foreground mb-1">
//               KEY RESULT
//             </p>
//             <p className="text-base font-medium text-foreground">
//               {okr.keyResult}
//             </p>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
//           <div className="flex items-center gap-2">
//             <TrendingUp className="w-4 h-4 text-primary" />
//             <span className="text-sm font-medium text-foreground">Current</span>
//           </div>
//           <span className="text-lg font-bold text-foreground">
//             {currentUpdate.value} / {okr.targetValue} {okr.unit}
//           </span>
//         </div>

//         <ProgressBar value={okr.progress} status={okr.status} />

//         <Collapsible open={isOpen} onOpenChange={setIsOpen}>
//           <CollapsibleTrigger asChild>
//             <Button variant="outline" className="w-full gap-2" size="sm">
//               <MessageSquare className="w-4 h-4" />
//               {isOpen ? "Hide" : "View"} Monthly Updates (
//               {okr.monthlyUpdates.length})
//             </Button>
//           </CollapsibleTrigger>
//           <CollapsibleContent className="space-y-3 mt-4">
//             {okr.monthlyUpdates.map((update, index) => (
//               <div
//                 key={index}
//                 className="p-4 bg-muted/50 rounded-lg border border-border space-y-2 animate-slide-up"
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-semibold text-foreground">
//                     {update.month}
//                   </span>
//                   <span className="text-sm font-bold text-primary">
//                     {update.value} {okr.unit}
//                   </span>
//                 </div>
//                 <p className="text-sm text-muted-foreground leading-relaxed">
//                   {update.narrative}
//                 </p>
//               </div>
//             ))}
//           </CollapsibleContent>
//         </Collapsible>
//       </CardContent>
//     </Card>
//   );
// };
