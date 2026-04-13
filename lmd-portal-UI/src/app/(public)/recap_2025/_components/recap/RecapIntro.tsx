import { PaintbrushUnderline } from "@/components/landingPageComponents/Features2";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface RecapIntroProps {
  onStart: () => void;
}

export function RecapIntro({ onStart }: RecapIntroProps) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lmh-blue/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-lmh-green/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-lmh-yellow/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-1.5s" }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.2, delay: 0.3 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-lmh-blue shadow-[0_0_60px_rgba(75,183,214,0.4)] mb-8"
        >
          <Sparkles className="w-12 h-12 text-white  animate-bounce" />
        </motion.div>

        <motion.h1
          className="font-display text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="text-lmh-blue">2025</span>
          <br />
          <span className="text-white dark:text-foreground">
            Year in Review
          </span>
        </motion.h1>

        <motion.div
          className="text-xl md:text-3xl text-gray-200 mb-4 flex items-center  flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="mr-2 font-medium">
            Last Mile Health Data Portal{" "}
          </span>

          <PaintbrushUnderline
            text="(LMD 2.0)"
            className="text-xl md:text-3xl font-medium "
          />
        </motion.div>

        <motion.p
          className="text-lg text-lmh-light-grey mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          A look back at how we used the portal in 2025
        </motion.p>

        <motion.button
          onClick={onStart}
          className="px-10 py-4 rounded-full font-display font-semibold text-lg bg-lmh-blue text-white dark:text-lmh-dark-blue shadow-[0_0_40px_rgba(75,183,214,0.4)] hover:shadow-[0_0_60px_rgba(75,183,214,0.5)] transition-all duration-300 hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Let&apos;s Go ✨
        </motion.button>
      </div>
    </motion.div>
  );
}
