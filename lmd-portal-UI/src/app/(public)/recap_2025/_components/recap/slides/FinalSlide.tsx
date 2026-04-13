import { motion } from "framer-motion";
import { Heart, Sparkles, Share2 } from "lucide-react";
import { YearStats } from "../../statsData";
import { PaintbrushUnderline } from "@/components/landingPageComponents/Features2";
import Counter from "@/components/ui/Countup";

interface FinalSlideProps {
  stats: YearStats;
  onRestart: () => void;
}

export function FinalSlide({ stats, onRestart }: FinalSlideProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return hours.toLocaleString();
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lmh-blue/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-lmh-green/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-lmh-yellow/15 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "-1.5s" }}
      />

      <div className="relative z-10 max-w-3xl w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-lmh-blue shadow-[0_0_60px_rgba(75,183,214,0.4)] mb-8 animate-pulse-glow"
        >
          <Sparkles className="w-12 h-12  animate-spin-slow text-white" />
        </motion.div>

        <motion.h2
          className="font-display text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-lmh-blue">That&apos;s a Wrap!</span>
        </motion.h2>

        <motion.p
          className="text-xl text-m mb-12 md:text-2xl font-medium tracking-wide text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Thanks for being part of our <br />
          <PaintbrushUnderline text="success!" className="" />
        </motion.p>

        {/* Summary Stats */}
        <motion.div
          className="glass rounded-2xl p-8 mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="font-display text-3xl font-bold text-lmh-blue">
                <Counter
                  end={Number(stats.totalPageViews)}
                  decimals={0}
                  duration={4.0}
                />
              </p>
              <p className="text-sm text-muted-foreground">Total Page Views</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-lmh-yellow">
                <Counter
                  end={Number(stats.uniqueUsers)}
                  decimals={0}
                  duration={4.0}
                />
              </p>
              <p className="text-sm text-muted-foreground">Users</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-lmh-green">
                <Counter
                  end={stats.topCountries.length}
                  decimals={0}
                  duration={4.0}
                />
                +
              </p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
            <div>
              <p className="font-display  text-3xl font-bold text-lmh-pink ">
                {/* <Counter
                  end={stats.totalSessionDuration}
                  decimals={0}
                  duration={4.0}
                /> */}
                {stats.averageSessionDuration}
              </p>
              <p className="text-sm text-muted-foreground">
                Average Session Duration
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            onClick={onRestart}
            className="px-8 py-4 rounded-full font-display font-semibold bg-lmh-blue text-lmh-dark-blue shadow-[0_0_40px_rgba(75,183,214,0.4)] hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Watch Again ✨
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-12 flex items-center justify-center gap-2 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <span>from the LMD team</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
