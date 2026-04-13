"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
  LegacyRef,
} from "react";
import { Tour } from "antd";
import type { TourProps } from "antd";
import { cn } from "@/lib/utils";

interface TourStep {
  title: string;
  description: string;
  target: () => HTMLElement | null;
  cover?: React.ReactNode;
}

interface TourContextType {
  refs: Record<string, React.RefObject<any>>;
  registerRef: (key: string, ref: React.RefObject<any>) => void;
  resetTour: () => void;
  showTour: () => void;
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
}

const TourContext = createContext<TourContextType | null>(null);

export const useTourContext = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTourContext must be used within a TourProvider");
  }
  return context;
};

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
  const refs = useRef<Record<string, React.RefObject<any>>>({});
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Check localStorage on initial mount
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("lmd_tour_completed");
    if (!hasSeenTour) {
      setIsTourOpen(true);
    }
  }, []);

  const registerRef = (key: string, ref: React.RefObject<any>) => {
    refs.current[key] = ref;
  };

  const resetTour = () => {
    localStorage.removeItem("lmd_tour_completed");
    setIsTourOpen(true);
  };

  const showTour = () => {
    setIsTourOpen(true);
  };

  return (
    <TourContext.Provider
      value={{
        refs: refs.current,
        registerRef,
        resetTour,
        showTour,
        isTourOpen,
        setIsTourOpen,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTourRef = (key: string) => {
  //   const ref = useRef<HTMLElement>(null);
  const ref = useRef<HTMLAnchorElement>(null);
  const { registerRef } = useTourContext();

  useEffect(() => {
    registerRef(key, ref);
  }, [key, registerRef]);

  return ref;
};

type TourWrapperProps = {
  children: ReactNode;
  tourRef?: string;
  className?: string;
};

// export function TourWrapper({ children, tourRef }: TourWrapperProps) {
//   const ref = tourRef
//     ? (useTourRef(tourRef) as unknown as LegacyRef<HTMLDivElement>)
//     : null;
//   return <div ref={ref}>{children}</div>;
// }

export function TourWrapper({
  children,
  tourRef,
  className,
}: TourWrapperProps) {
  // Only initialize the ref if tourRef is provided
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const { registerRef } = useTourContext();

  useEffect(() => {
    if (tourRef) {
      registerRef(tourRef, wrapperRef as React.RefObject<HTMLElement>);
    }
  }, [tourRef, registerRef]);

  return (
    <div ref={wrapperRef} className={cn(className)}>
      {children}
    </div>
  );
}
