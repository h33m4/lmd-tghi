import { motion } from "framer-motion";
import { FileText, TrendingUp } from "lucide-react";
import { YearStats } from "../../statsData";

interface TopPagesSlideProps {
  stats: YearStats;
}

export function TopPagesSlide({ stats }: TopPagesSlideProps) {
  const maxCount = Math.max(...stats.topPages.map((p) => p.count));

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-lmh-green/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-lmh-blue/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-lmh-green shadow-[0_0_40px_rgba(105,170,85,0.3)] mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <TrendingUp className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-lmh-green">Most Visited Pages</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            The dashboards and pages your team used the most
          </p>
        </motion.div>

        <motion.div
          className="glass rounded-2xl p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-6">
            {stats.topPages.map((item, index) => (
              <motion.div
                key={item.page}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-start gap-4 mb-3">
                  <span className="font-display text-3xl font-bold text-lmh-green">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {item.page}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.count.toLocaleString()} total page views
                    </p>
                  </div>
                  <FileText className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden ml-12">
                  <motion.div
                    className="h-full bg-gradient-to-r from-lmh-green to-lmh-blue rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxCount) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
