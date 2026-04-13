import { motion } from "framer-motion";
import { Globe, Users } from "lucide-react";
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
  },
  {
    name: "Liberia",
    flag: "🇱🇷",
    activeUsers: 8,
    totalPageVisits: 404,
    uniquePageVisits: 35,
  },
  {
    name: "Ethiopia",
    flag: "🇪🇹",
    activeUsers: 9,
    totalPageVisits: 315,
    uniquePageVisits: 17,
  },
  {
    name: "Malawi",
    flag: "🇲🇼",
    activeUsers: 2,
    totalPageVisits: 144,
    uniquePageVisits: 15,
  },
  {
    name: "AFF",
    flag: "🌍",
    activeUsers: 1,
    totalPageVisits: 33,
    uniquePageVisits: 17,
  },
  {
    name: "Sierra Leone",
    flag: "🇸🇱",
    activeUsers: 1,
    totalPageVisits: 5,
    uniquePageVisits: 1,
  },
];

export function ProgramCountriesSlide({ stats }: ProgramSlideProps) {
  // Sort countries by total page visits (excluding Global for comparison)
  const sortedCountries = [...countries].sort(
    (a, b) => b.totalPageVisits - a.totalPageVisits
  );
  const maxVisits = Math.max(...countries.map((c) => c.totalPageVisits));

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
          Program <span className="text-lmh-yellow">Engagement</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Comparing activity across all regions
        </p>
      </motion.div>

      <div className="max-w-4xl w-full space-y-4">
        {sortedCountries.map((country, index) => {
          const percentage = (country.totalPageVisits / maxVisits) * 100;
          const avgVisitsPerUser = (
            country.totalPageVisits / country.activeUsers
          ).toFixed(0);

          return (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-6 rounded-2xl border border-lmh-blue/20 hover:border-lmh-blue/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">
                      {country.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span>{country.activeUsers} user(s)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-lmh-blue">
                    {country.totalPageVisits.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    page visits
                  </div>
                </div>
              </div>

              {/* Visual bar */}
              <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-2">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-lmh-blue to-lmh-green rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                />
              </div>

              {/* Stats row */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Avg: {avgVisitsPerUser} visits/user
                </span>
                <span className="text-lmh-yellow font-semibold">
                  {country.uniquePageVisits} unique page(s)
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 glass px-8 py-4 rounded-full border border-lmh-blue/30"
      >
        <span className="text-muted-foreground">Total platform activity: </span>
        <span className="font-display font-bold text-xl text-lmh-blue">
          {stats.totalPageViews.toLocaleString("en-US")} page views
        </span>
      </motion.div>
    </div>
  );
}
