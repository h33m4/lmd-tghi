import { motion } from "framer-motion";
import { Monitor, Smartphone, Globe, Laptop, Cpu } from "lucide-react";
import { YearStats } from "../../statsData";

interface DevicesSlideProps {
  stats: YearStats;
}

export function DevicesSlide({ stats }: DevicesSlideProps) {
  const getDeviceIcon = (device: string) => {
    const lower = device.toLowerCase();
    if (lower.includes("mobile") || lower.includes("phone")) return Smartphone;
    if (lower.includes("tablet")) return Laptop;
    return Monitor;
  };

  const totalDevices = stats.deviceBreakdown.reduce(
    (sum, d) => sum + d.count,
    0
  );
  const totalBrowsers = stats.browserBreakdown.reduce(
    (sum, b) => sum + b.count,
    0
  );

  const totalOs = stats.osBreakdown.reduce((sum, b) => sum + b.count, 0);

  const browserColors = [
    "bg-lmh-blue",
    "bg-lmh-green",
    "bg-lmh-yellow",
    "bg-lmh-pink",
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-lmh-blue/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-lmh-yellow/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-lmh-blue shadow-[0_0_40px_rgba(75,183,214,0.3)] mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Monitor className="w-10 h-10 text-lmh-dark-blue" />
          </motion.div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-lmh-blue">Devices & Browsers</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            How your team accessed the portal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Device Types */}
          <motion.div
            className="glass rounded-2xl p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-display text-xl text-white font-semibold mb-6">
              Device Types
            </h3>
            <div className="space-y-6">
              {stats.deviceBreakdown.slice(0, 4).map((item, index) => {
                const Icon = getDeviceIcon(item.device);
                const percentage = Math.round(
                  (item.count / totalDevices) * 100
                );
                return (
                  <motion.div
                    key={item.device}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-lmh-blue/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-lmh-blue" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-white">
                          {item.device}
                        </span>
                        <span className="text-lmh-blue font-display font-bold">
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-lmh-blue to-lmh-green rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{
                            delay: 0.5 + index * 0.1,
                            duration: 0.8,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Browsers */}
          <motion.div
            className="glass rounded-2xl p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-display text-xl font-semibold mb-6 text-white">
              Browsers
            </h3>
            <div className="space-y-4">
              {stats.browserBreakdown.slice(0, 4).map((item, index) => {
                const percentage = Math.round(
                  (item.count / totalBrowsers) * 100
                );
                return (
                  <motion.div
                    key={item.browser}
                    className="flex items-center gap-4 p-4 rounded-xl bg-lmh-blue/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${browserColors[index]}`}
                    />
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="flex-1 font-medium text-white">
                      {item.browser}
                    </span>
                    <span className="font-display font-bold text-lmh-blue">
                      {percentage}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-2xl p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-display text-xl font-semibold mb-6 text-white">
              Device OS
            </h3>
            <div className="space-y-4">
              {stats.osBreakdown.slice(0, 4).map((item, index) => {
                const percentage = Math.round((item.count / totalOs) * 100);
                return (
                  <motion.div
                    key={item.os}
                    className="flex items-center gap-4 p-4 rounded-xl bg-lmh-blue/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${browserColors[index]}`}
                    />
                    <Cpu className="w-5 h-5 text-gray-400" />
                    <span className="flex-1 font-medium text-white">
                      {item.os}
                    </span>
                    <span className="font-display font-bold text-lmh-blue">
                      {percentage}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
