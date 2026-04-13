"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Award, Medal } from "lucide-react";
import { useState } from "react";
import { YearStats } from "../../statsData";

interface TopUsersSlideProps {
  stats: YearStats;
}

type UserType = "nonTech" | "tech";

export function TopUsersSlide({ stats }: TopUsersSlideProps) {
  const [activeTab, setActiveTab] = useState<UserType>("nonTech");

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return Trophy;
      case 1:
        return Award;
      case 2:
        return Medal;
      default:
        return Star;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-lmh-yellow";
      case 1:
        return "text-lmh-light-grey";
      case 2:
        return "text-lmh-pink";
      default:
        return "text-lmh-blue";
    }
  };

  const users =
    activeTab === "nonTech" ? stats.topNonTechUsers : stats.topTechUsers;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-dark" />

      <div className="relative z-10 max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-lmh-yellow shadow-[0_0_40px_rgba(237,192,30,0.3)] mb-6">
            <Trophy className="w-10 h-10 text-lmh-dark-blue" />
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold mb-2">
            <span className="text-lmh-yellow">Power Users</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our most active team members
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-white/5 p-1">
            <button
              onClick={() => setActiveTab("nonTech")}
              className={`px-4 py-2 text-sm rounded-lg transition ${
                activeTab === "nonTech"
                  ? "bg-lmh-yellow text-lmh-dark-blue font-semibold"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Non-Technical Users
            </button>
            <button
              onClick={() => setActiveTab("tech")}
              className={`px-4 py-2 text-sm rounded-lg transition ${
                activeTab === "tech"
                  ? "bg-lmh-yellow text-lmh-dark-blue font-semibold"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Technical Users
            </button>
          </div>
        </div>

        {/* User List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {users
              .sort((a, b) => b.uniqueVisits - a.uniqueVisits)
              .map((user, index) => {
                const Icon = getRankIcon(index);
                const rankColor = getRankColor(index);
                const isTop3 = index < 3;

                const shareUnique = (
                  (user.uniqueVisits / stats.totalUniquePageVisits) *
                  100
                ).toFixed(1);

                const shareTotal = (
                  (user.totalVisits / stats.totalPageViews) *
                  100
                ).toFixed(1);

                return (
                  <motion.div
                    key={user.email}
                    className={`glass rounded-2xl p-6 ${
                      isTop3 ? "ring-1 ring-lmh-yellow/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                          isTop3 ? "bg-lmh-yellow/20" : "bg-lmh-blue/10"
                        }`}
                      >
                        <Icon className={`w-7 h-7 ${rankColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-lg truncate text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {user.department}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-display text-2xl font-bold text-lmh-blue">
                          {user.uniqueVisits.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-300">
                          {shareUnique}% of unique visits
                        </p>
                        <p className="text-xs text-gray-400">
                          {shareTotal}% of total visits (
                          {user.totalVisits.toLocaleString()})
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
