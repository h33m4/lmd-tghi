import { motion } from "framer-motion";
import { Globe, MapPin } from "lucide-react";
import { YearStats } from "../../statsData";

interface GeographySlideProps {
  stats: YearStats;
}

const geographyData = {};

export function GeographySlide({ stats }: GeographySlideProps) {
  const maxCount = Math.max(...stats.topCountries.map((c) => c.count));

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-lmh-yellow/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-lmh-blue/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-lmh-yellow shadow-[0_0_40px_rgba(237,192,30,0.3)] mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Globe className="w-10 h-10 text-lmh-dark-blue" />
          </motion.div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-lmh-yellow">Around the World</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Your team accessed the portal from these locations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Countries */}
          <motion.div
            className="glass rounded-2xl p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-display text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-lmh-blue" />
              Top Countries
            </h3>
            <div className="space-y-4">
              {stats.topCountries.map((item, index) => (
                <motion.div
                  key={item.country}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">
                      {item.country}
                    </span>
                    <span className="text-lmh-blue font-display font-bold">
                      {item.count.toLocaleString()}{" "}
                      <span className="text-sm font-light text-white">
                        unique page views
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-lmh-blue to-lmh-green rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / maxCount) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cities */}
          {/* <motion.div
            className="glass rounded-2xl p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-display text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-lmh-yellow" />
              Top Cities
            </h3>
            <div className="space-y-4">
              {stats.topCities.map((item, index) => (
                <motion.div
                  key={item.city}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <span className="font-display text-2xl font-bold text-lmh-yellow">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.city}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.count.toLocaleString()} events
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div> */}
        </div>
      </div>
    </motion.div>
  );
}
