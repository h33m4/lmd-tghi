import { motion } from "framer-motion";
import { Calendar, TrendingUp } from "lucide-react";
import { YearStats } from "../../statsData";

interface MonthlySlideProps {
  stats: YearStats;
}

export function MonthlySlide({ stats }: MonthlySlideProps) {
  // Guard: no data
  if (!stats?.monthlyActivity?.length) return null;

  const maxActivity = Math.max(...stats.monthlyActivity.map((m) => m.count));

  const peakMonth = stats.monthlyActivity.reduce((max, m) =>
    m.count > max.count ? m : max
  );

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-lmh-green/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-lmh-yellow/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-lmh-yellow shadow-[0_0_40px_rgba(237,192,30,0.3)] mb-6">
            <Calendar className="w-10 h-10 text-lmh-dark-blue" />
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-lmh-yellow">Monthly Activity</span>
          </h2>

          <p className="text-muted-foreground text-lg">
            Our busiest month was{" "}
            <span className="text-lmh-yellow font-semibold">
              {peakMonth.month}
            </span>
          </p>
        </motion.div>

        {/* Chart */}
        <motion.div
          className="glass rounded-2xl p-8   overflow-hidden  overflow-x-scroll md:overflow-x-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* BAR CONTAINER */}
          <div className="flex items-end justify-between gap-3 h-64 mb-6 ">
            {stats.monthlyActivity.map((month, index) => {
              const ratio = maxActivity > 0 ? month.count / maxActivity : 0;

              const isPeak = month.month === peakMonth.month;

              return (
                <div
                  key={month.month}
                  className="flex-1 flex flex-col justify-end items-center w-full  h-full"
                >
                  <span className="text-white text-sm mb-4">
                    {month.count.toLocaleString("en-US")}
                  </span>
                  {/* BAR TRACK */}
                  <div className="w-full h-full flex items-end border relative">
                    <motion.div
                      className={`w-full rounded-t-lg origin-bottom ${
                        isPeak
                          ? "bg-lmh-yellow shadow-[0_0_24px_rgba(237,192,30,0.45)]"
                          : "bg-gradient-to-t from-lmh-blue to-lmh-green"
                      }`}
                      style={{ height: "100%" }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: Math.max(ratio, 0.05) }}
                      transition={{
                        duration: 0.9,
                        ease: "easeOut",
                        delay: 0.4 + index * 0.06,
                      }}
                    />
                    {/* <div className="border absolute">55555</div> */}
                  </div>

                  {/* label */}

                  <div
                    key={month.month}
                    className="flex-1 text-center w-full mt-2"
                  >
                    {/* Mobile: 3-letter month */}
                    <p
                      className={`text-xs font-medium sm:hidden ${
                        month.month === peakMonth.month
                          ? "text-lmh-yellow"
                          : "text-muted-foreground"
                      }`}
                    >
                      {month.month.slice(0, 3)}
                    </p>

                    {/* Desktop: full month */}
                    <p
                      className={`text-xs font-medium hidden sm:block ${
                        month.month === peakMonth.month
                          ? "text-lmh-yellow"
                          : "text-muted-foreground"
                      }`}
                    >
                      {month.month}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Month Labels */}
        </motion.div>

        {/* Insight */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-5 h-5 text-lmh-yellow" />
            <span>
              Peak:{" "}
              <span className="text-lmh-yellow font-semibold">
                {peakMonth.count.toLocaleString()}
              </span>{" "}
              total page views in {peakMonth.month}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
