"use client";
import { useState } from "react";
import { motion } from "framer-motion";

import { Loader2 } from "lucide-react";
import { RecapIntro } from "./recap/RecapIntro";
import { RecapSlideshow } from "./recap/RecapSlideshow";
// import { useAnalyticsData } from "./useAnalytic";
import { portalStatsData, YearStats } from "./statsData";

import "@/styles/recap.css";

const YearCap2025 = () => {
  // const { stats, loading, error } = useAnalyticsData();
  const [started, setStarted] = useState(false);

  const statss = portalStatsData as YearStats;

  // if (loading) {
  //   return (
  //     <div className="min-h-screen  flex flex-col items-center justify-center bg-background">
  //       <motion.div
  //         initial={{ opacity: 0 }}
  //         animate={{ opacity: 1 }}
  //         className="text-center"
  //       >
  //         <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
  //         <p className="text-muted-foreground font-display">
  //           Loading your year in review...
  //         </p>
  //       </motion.div>
  //     </div>
  //   );
  // }

  // if (error || !stats) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-background">
  //       <div className="text-center glass p-8 rounded-2xl max-w-md mx-4">
  //         <h2 className="font-display text-2xl font-bold text-destructive mb-4">
  //           Oops!
  //         </h2>
  //         <p className="text-muted-foreground">
  //           {error || "Failed to load analytics data"}
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!started) {
    return <RecapIntro onStart={() => setStarted(true)} />;
  }

  return <RecapSlideshow stats={statss} onRestart={() => setStarted(false)} />;
};

export default YearCap2025;
