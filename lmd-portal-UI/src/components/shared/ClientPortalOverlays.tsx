"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePortalConfig, Announcement } from "@/context/PortalConfigContext";
import {
  XMarkIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  MegaphoneIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BellIcon,
  StarIcon,
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

// ─── Banner ───────────────────────────────────────────────────────────────────

const BANNER_STYLES: Record<string, string> = {
  info:    "bg-blue-600 text-white",
  warning: "bg-amber-500 text-white",
  success: "bg-green-600 text-white",
};

const BANNER_ICONS: Record<string, React.ReactNode> = {
  megaphone: <MegaphoneIcon className="h-4 w-4 shrink-0" />,
  info:      <InformationCircleIcon className="h-4 w-4 shrink-0" />,
  warning:   <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />,
  check:     <CheckCircleIcon className="h-4 w-4 shrink-0" />,
  bell:      <BellIcon className="h-4 w-4 shrink-0" />,
  star:      <StarIcon className="h-4 w-4 shrink-0" />,
  sparkles:  <SparklesIcon className="h-4 w-4 shrink-0" />,
  bolt:      <BoltIcon className="h-4 w-4 shrink-0" />,
  shield:    <ShieldCheckIcon className="h-4 w-4 shrink-0" />,
  wrench:    <WrenchScrewdriverIcon className="h-4 w-4 shrink-0" />,
};

/** Parses [text](url) markdown links in a string and returns a mixed array of strings and <a> elements */
function parseBannerMessage(message: string): React.ReactNode[] {
  const parts = message.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      const [, text, url] = match;
      return (
        <a
          key={i}
          href={url}
          target={url.startsWith("http") ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="underline font-semibold hover:opacity-80 transition-opacity"
        >
          {text}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}


// ─── Announcement dialog ──────────────────────────────────────────────────────

const ANN_STYLES: Record<string, { border: string; icon: React.ReactNode; badge: string }> = {
  info:        { border: "border-blue-300 dark:border-blue-700",   icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,  badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
  update:      { border: "border-green-300 dark:border-green-700", icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,       badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" },
  warning:     { border: "border-amber-300 dark:border-amber-700", icon: <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />, badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
  maintenance: { border: "border-purple-300 dark:border-purple-700", icon: <WrenchScrewdriverIcon className="h-5 w-5 text-purple-500" />, badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" },
};

const ANN_LABELS: Record<string, string> = {
  info: "Info", update: "What's New", warning: "Important Notice", maintenance: "Maintenance",
};

function annKey(id: string, v: number) { return `ann_dismissed_${id}_v${v}`; }
function tourKey(v: number) { return `tour_dismissed_v${v}`; }

// ─── Main component ───────────────────────────────────────────────────────────

export default function ClientPortalOverlays() {
  const config = usePortalConfig();
  const { announcements, welcomeTour } = config;

  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());
  const [activeAnn, setActiveAnn] = useState<Announcement | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Read localStorage only after hydration
  useEffect(() => {
    setHydrated(true);
    // Check banner dismissals
    const dismissed = new Set<string>();
    for (const banner of config.banners ?? []) {
      const key = `banner_${banner.id}_v${banner.seenVersion ?? 1}`;
      if (localStorage.getItem(key)) dismissed.add(key);
    }
    setDismissedBanners(dismissed);

    // Find first active non-dismissed announcement
    const pending = (announcements ?? []).find((ann) => {
      if (!ann.active) return false;
      return !localStorage.getItem(annKey(ann.id, ann.seenVersion ?? 1));
    });
    if (pending) { setActiveAnn(pending); return; } // show announcement first

    // Welcome tour (only if no announcement pending)
    if (welcomeTour?.enabled && welcomeTour.steps?.length > 0) {
      if (!localStorage.getItem(tourKey(welcomeTour.seenVersion ?? 1))) {
        setShowTour(true);
        setTourStep(0);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcements, welcomeTour, config.banners]);

  const dismissBannerById = (id: string, seenVersion: number) => {
    const key = `banner_${id}_v${seenVersion}`;
    localStorage.setItem(key, "1");
    setDismissedBanners((prev) => new Set(Array.from(prev).concat(key)));
  };

  const dismissAnn = () => {
    if (!activeAnn) return;
    localStorage.setItem(annKey(activeAnn.id, activeAnn.seenVersion ?? 1), "1");
    setActiveAnn(null);
    // After ann dismissed, maybe show tour
    if (welcomeTour?.enabled && welcomeTour.steps?.length > 0) {
      if (!localStorage.getItem(tourKey(welcomeTour.seenVersion ?? 1))) {
        setShowTour(true);
        setTourStep(0);
      }
    }
  };

  const dismissTour = () => {
    localStorage.setItem(tourKey(welcomeTour.seenVersion ?? 1), "1");
    setShowTour(false);
  };

  if (!hydrated) return null;

  const steps = welcomeTour?.steps ?? [];
  const currentStep = steps[tourStep];

  return (
    <>
      {/* ── Top Banners ─────────────────────────────────────────────────── */}
      {(config.banners ?? []).filter((b) => b.enabled && !dismissedBanners.has(`banner_${b.id}_v${b.seenVersion ?? 1}`)).map((banner) => (
        <div
          key={banner.id}
          className={cn(
            "w-full px-4 py-2 flex items-center justify-center gap-2 text-sm relative z-50 text-white",
            banner.customColor ? "" : (BANNER_STYLES[banner.type] ?? BANNER_STYLES.info)
          )}
          style={banner.customColor ? { backgroundColor: banner.customColor } : undefined}
        >
          {BANNER_ICONS[banner.icon ?? "megaphone"] ?? BANNER_ICONS.megaphone}
          {parseBannerMessage(banner.message)}
          <button
            onClick={() => dismissBannerById(banner.id, banner.seenVersion ?? 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ))}

      {/* ── Announcement dialog ──────────────────────────────────────────── */}
      {activeAnn && (() => {
        const st = ANN_STYLES[activeAnn.type] ?? ANN_STYLES.info;
        return (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismissAnn} />
            <div className={cn("relative w-full max-w-md rounded-xl border-2 shadow-2xl p-6 bg-background", st.border)}>
              <button onClick={dismissAnn} className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground">
                <XMarkIcon className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-3 mb-4">
                <div className="shrink-0 mt-0.5">{st.icon}</div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wide", st.badge)}>
                      {ANN_LABELS[activeAnn.type] ?? activeAnn.type}
                    </span>
                    {activeAnn.version && (
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        {activeAnn.version}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-foreground">{activeAnn.title}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{activeAnn.message}</p>
              <button onClick={dismissAnn} className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                Got it
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Welcome tour dialog ──────────────────────────────────────────── */}
      {showTour && currentStep && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((tourStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="p-6">
              <button onClick={dismissTour} className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground">
                <XMarkIcon className="h-4 w-4" />
              </button>

              {/* Step indicator */}
              <div className="flex items-center gap-1 mb-4">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={cn("h-1.5 rounded-full transition-all", i === tourStep ? "bg-primary w-6" : i < tourStep ? "bg-primary/40 w-3" : "bg-muted w-3")}
                  />
                ))}
                <span className="ml-auto text-xs text-muted-foreground">{tourStep + 1} / {steps.length}</span>
              </div>

              {/* Tour header */}
              {tourStep === 0 && welcomeTour.title && (
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-foreground">{welcomeTour.title}</h2>
                  {welcomeTour.subtitle && <p className="text-sm text-muted-foreground mt-1">{welcomeTour.subtitle}</p>}
                </div>
              )}

              {/* Step content */}
              <div className="text-center py-4">
                {currentStep.emoji && (
                  <div className="text-5xl mb-4">{currentStep.emoji}</div>
                )}
                <h3 className="text-lg font-bold text-foreground mb-2">{currentStep.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{currentStep.description}</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3 mt-6">
                <button
                  onClick={() => setTourStep((s) => s - 1)}
                  disabled={tourStep === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                >
                  <ArrowLeftIcon className="h-3.5 w-3.5" /> Back
                </button>
                {tourStep < steps.length - 1 ? (
                  <button
                    onClick={() => setTourStep((s) => s + 1)}
                    className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Next <ArrowRightIcon className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={dismissTour}
                    className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </button>
                )}
              </div>
              <button onClick={dismissTour} className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                Skip tour
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
