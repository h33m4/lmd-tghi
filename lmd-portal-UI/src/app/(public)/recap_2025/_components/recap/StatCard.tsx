import Counter from "@/components/ui/Countup";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  gradient?: "primary" | "accent" | "secondary" | "pink";
  delay?: number;
  unit?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient = "primary",
  delay = 0,
  unit,
}: StatCardProps) {
  const gradientClasses = {
    primary: "bg-lmh-blue shadow-[0_0_40px_rgba(75,183,214,0.3)]",
    accent: "bg-lmh-yellow shadow-[0_0_40px_rgba(237,192,30,0.3)]",
    secondary: "bg-lmh-green shadow-[0_0_40px_rgba(105,170,85,0.3)]",
    pink: "bg-lmh-pink shadow-[0_0_40px_rgba(105,170,85,0.3)]",
  };

  return (
    <motion.div
      className="glass rounded-2xl px-5 py-6 text-center items-center "
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        duration: 0.8,
        delay,
        bounce: 0.3,
      }}
    >
      <motion.div
        className={` inline-flex items-center justify-center w-16 h-16 rounded-2xl ${gradientClasses[gradient]} mb-6`}
        initial={{ rotate: -20, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", delay: delay + 0.2, duration: 0.6 }}
      >
        {icon}
      </motion.div>

      {/* <motion.p
        className="text-sm uppercase  tracking-widest text-white mb-2 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {title}
      </motion.p> */}

      <motion.h2
        className="font-display text-5xl md:text-6xl font-bold text-lmh-blue mb-2  "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.4, duration: 0.5 }}
      >
        {/* {value} */}
        <Counter
          end={Number(value)}
          decimals={title.includes("Target") ? 0 : undefined}
          duration={4.0}
        />
        <span className="text-2xl ml-2">{unit}</span>
      </motion.h2>

      {/* {subtitle && (
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          {subtitle}
        </motion.p>
      )} */}
      <motion.p
        className="text-sm   tracking-widest text-white mb-2 font-medium text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {title}
      </motion.p>
    </motion.div>
  );
}
