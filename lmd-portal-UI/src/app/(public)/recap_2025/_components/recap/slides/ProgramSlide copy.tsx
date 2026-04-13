import { motion } from "framer-motion";
import { Globe, TrendingUp, Users, Activity } from "lucide-react";
import { YearStats } from "../../statsData";

interface ProgramSlideProps {
  stats: YearStats;
}

const countries = [
  {
    name: "Global",
    flag: "🌍",
    activeUsers: 38,
    totalPageVisits: 10993,
    uniquePageVisits: 146,
    topMetric: "Most consistent usage",
  },
  {
    name: "Liberia",
    flag: "🇱🇷",
    activeUsers: 8,
    totalPageVisits: 404,
    uniquePageVisits: 35,
    topMetric: "Most data submissions rate",
  },
  {
    name: "Ethiopia",
    flag: "🇪🇹",
    activeUsers: 9,
    totalPageVisits: 315,
    uniquePageVisits: 17,
    topMetric: "Fastest adoption rate",
  },
  {
    name: "Malawi",
    flag: "🇲🇼",
    activeUsers: 2,
    totalPageVisits: 144,
    uniquePageVisits: 15,
    topMetric: "Moderate engagement",
  },
  {
    name: "AFF",
    flag: "🌍",
    activeUsers: 1,
    totalPageVisits: 33,
    uniquePageVisits: 17,
    topMetric: "Top exploratory engagement",
  },
  {
    name: "Sierra Leone",
    flag: "🇸🇱",
    activeUsers: 1,
    totalPageVisits: 5,
    uniquePageVisits: 1,
    topMetric: "Slow but curious",
  },
];

export function ProgramCountriesSlide({ stats }: ProgramSlideProps) {
  // const maxSessions = Math.max(...countries.map((c) => c.sessions));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lmh-blue/20 text-lmh-blue mb-4">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">LMH Programs</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
          Reach Across <span className="text-lmh-yellow">Programs</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Platform performance across our programs
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {countries.map((country, index) => (
          <motion.div
            key={country.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="glass p-6 rounded-2xl border border-lmh-blue/20 hover:border-lmh-blue/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{country.flag}</span>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">
                    {country.name}
                  </h3>
                  <span className="text-xs text-lmh-blue bg-lmh-blue/20 px-2 py-0.5 rounded-full">
                    {country.topMetric}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-lmh-green text-sm font-semibold">
                {/* <TrendingUp className="w-4 h-4" />+{country.growth}% */}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Unique Page Views</span>
                <span className="font-semibold text-white">
                  {country.uniquePageVisits.toLocaleString()}
                </span>
              </div>
              {/* <div className="h-2 bg-muted rounded-full overflow-hidden border">
                <motion.div
                  className="h-full bg-gradient-to-r from-lmh-blue to-lmh-green rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (country.totalPageVisits / stats.totalPageViews) * 100
                    }%`,
                  }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div> */}
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Total Page Views</span>
                <span className="font-semibold text-white">
                  {country.totalPageVisits.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{country.activeUsers} user(s)</span>
              </div>
              {/* <div className="flex items-center gap-1.5 text-muted-foreground">
                <Activity className="w-4 h-4" />
                <span>Active daily</span>
              </div> */}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 glass px-8 py-4 rounded-full border border-lmh-blue/30"
      >
        <span className="text-muted-foreground">
          Total across all programs:{" "}
        </span>
        <span className="font-display font-bold text-xl text-lmh-blue">
          {/* {countries.reduce((sum, c) => sum + c.sessions, 0).toLocaleString()}{" "} */}
          {stats.totalPageViews.toLocaleString("en-US")} Page views
        </span>
      </motion.div>
    </div>
  );
}
