import { motion } from "framer-motion";
import { Activity, Users, LogIn, Clock } from "lucide-react";
import { StatCard } from "../StatCard";
import { YearStats } from "../../statsData";

interface OverviewSlideProps {
  stats: YearStats;
}

// data

export function OverviewSlide({ stats }: OverviewSlideProps) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-lmh-blue/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-lmh-green/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl w-full">
        <motion.h2
          className="font-display text-3xl md:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-lmh-blue">The Big Picture</span>
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-center text-lg mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          The portal activity at a glance
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Unique Users"
            value={stats.uniqueUsers}
            subtitle="Team members active"
            icon={<Users className="w-8 h-8 text-primary-foreground" />}
            gradient="secondary"
            delay={0.4}
          />
          <StatCard
            title="Total Logins"
            value={stats.totalLogins}
            subtitle="Logins"
            icon={<LogIn className="w-8 h-8 text-primary-foreground" />}
            gradient="accent"
            delay={0.5}
          />
          <StatCard
            title="Page Views"
            value={stats.totalPageViews}
            subtitle="Interactions tracked"
            icon={<Activity className="w-8 h-8 text-primary-foreground" />}
            gradient="primary"
            delay={0.3}
          />

          <StatCard
            title="Avg time spent per login"
            value={70}
            subtitle="Session duration in mins."
            icon={<Clock className="w-8 h-8 text-primary-foreground" />}
            gradient="pink"
            delay={0.6}
            // unit="(mins)"
          />
        </div>
      </div>
    </motion.div>
  );
}
