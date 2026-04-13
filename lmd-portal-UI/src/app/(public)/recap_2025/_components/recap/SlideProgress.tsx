import { motion } from "framer-motion";

interface SlideProgressProps {
  current: number;
  total: number;
}

export function SlideProgress({ current, total }: SlideProgressProps) {
  return (
    <div className="fixed top-[5rem] md:top-[7rem] left-1/2 -translate-x-1/2 z-50 flex gap-2  border-red-600">
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            index === current
              ? "w-8 bg-gradient-primary"
              : index < current
              ? "w-3 bg-primary/60 "
              : "w-3 bg-muted dark:bg-gray-200"
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05 }}
        />
      ))}
    </div>
  );
}
