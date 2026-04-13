import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SlideProgress } from "./SlideProgress";

import { OverviewSlide } from "./slides/OverviewSlide";
import { DepartmentsSlide } from "./slides/DepartmentSlide";
import { DevicesSlide } from "./slides/DeviceSlide";
import { FinalSlide } from "./slides/FinalSlide";
import { Focus2026Slide } from "./slides/Focus2026Slide";
import { GeographySlide } from "./slides/GeographySlide";
import { MonthlySlide } from "./slides/MonthlySlide";
import { ProgramCountriesSlide } from "./slides/ProgramSlide";
import { TimelineSlide } from "./slides/TimelineSlide";
import { TopPagesSlide } from "./slides/TopPagesSlide";
import { TopUsersSlide } from "./slides/TopUsersSlide";
import { YearStats } from "../statsData";

interface RecapSlideshowProps {
  stats: YearStats;
  onRestart: () => void;
}

export function RecapSlideshow({ stats, onRestart }: RecapSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    <OverviewSlide key="overview" stats={stats} />,
    <TimelineSlide key="timeline" />,
    <DepartmentsSlide key="departments" />,
    <ProgramCountriesSlide key="countries" stats={stats} />,
    <GeographySlide key="geography" stats={stats} />,
    <TopPagesSlide key="pages" stats={stats} />,
    <MonthlySlide key="monthly" stats={stats} />,
    <TopUsersSlide key="users" stats={stats} />,
    <DevicesSlide key="devices" stats={stats} />,
    <Focus2026Slide key="focus2026" />,
    <FinalSlide key="final" stats={stats} onRestart={onRestart} />,
  ];

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative h-fit overflow-hidden   ">
      <SlideProgress current={currentSlide} total={slides.length} />

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          {slides[currentSlide]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 ">
        {currentSlide > 0 && (
          <motion.button
            onClick={prevSlide}
            className="p-4 rounded-full glass hover:bg-muted/50 transition-colors border bg-lmh-dark-blue text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        )}

        {currentSlide < slides.length - 1 && (
          <motion.button
            onClick={nextSlide}
            className="px-8 py-4 rounded-full bg-gradient-primary text-white font-display font-bold shadow-glow-primary hover:scale-105 transition-transform flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Keyboard hint */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 text-xs text-muted-foreground hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Press <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd> to
        continue
      </motion.div>
    </div>
  );
}
