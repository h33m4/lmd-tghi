"use client";

import React, { useState, useTransition } from "react";
import { PortalConfig, TourStep, savePortalConfig } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  EyeSlashIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        checked ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
      )}
    >
      <span className={cn(
        "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform",
        checked ? "translate-x-4" : "translate-x-0"
      )} />
    </button>
  );
}

const EMPTY_STEP: Omit<TourStep, "id"> = { title: "", description: "", emoji: "" };

export default function WelcomeTourClient({ initialConfig }: { initialConfig: PortalConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [isResetting, setIsResetting] = useState(false);

  const tour = config.welcomeTour ?? { enabled: false, seenVersion: 1, title: "", subtitle: "", steps: [] };

  const saveConfig = (updated: PortalConfig, msg: string) => {
    startTransition(async () => {
      const result = await savePortalConfig(updated);
      if (result.ok) {
        toast.success(msg);
        setConfig(updated);
      } else {
        toast.error("Save failed", { description: result.message });
      }
    });
  };

  const updateTour = (patch: Partial<typeof tour>) => {
    const updated = { ...config, welcomeTour: { ...tour, ...patch } };
    saveConfig(updated, "Tour updated.");
  };

  const addStep = () => {
    const newStep: TourStep = { ...EMPTY_STEP, id: `step-${Date.now()}` };
    updateTour({ steps: [...tour.steps, newStep] });
  };

  const updateStep = (id: string, patch: Partial<TourStep>) => {
    const updated = { ...config, welcomeTour: { ...tour, steps: tour.steps.map((s) => s.id === id ? { ...s, ...patch } : s) } };
    // Don't auto-save on every keystroke — use local state
    setConfig(updated);
  };

  const saveSteps = () => {
    saveConfig(config, "Steps saved.");
  };

  const deleteStep = (id: string) => {
    updateTour({ steps: tour.steps.filter((s) => s.id !== id) });
  };

  const moveStep = (id: string, dir: -1 | 1) => {
    const steps = [...tour.steps];
    const idx = steps.findIndex((s) => s.id === id);
    if (idx + dir < 0 || idx + dir >= steps.length) return;
    [steps[idx], steps[idx + dir]] = [steps[idx + dir], steps[idx]];
    updateTour({ steps });
  };

  const handleResetSeen = () => {
    setIsResetting(true);
    startTransition(async () => {
      const updated = { ...config, welcomeTour: { ...tour, seenVersion: (tour.seenVersion ?? 1) + 1 } };
      const result = await savePortalConfig(updated);
      if (result.ok) {
        toast.success("Tour reset — all users will see the welcome tour again.");
        setConfig(updated);
      } else {
        toast.error("Reset failed");
      }
      setIsResetting(false);
    });
  };

  return (
    <div className="space-y-5">
      {/* Tour header */}
      <div className="rounded-md border border-border bg-background overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
          <SparklesIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Welcome Tour</span>
          <div className="ml-auto flex items-center gap-2">
            {tour.enabled && (
              <button
                onClick={handleResetSeen}
                disabled={isPending || isResetting}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1 transition-colors"
              >
                {isResetting ? <ArrowPathIcon className="h-3 w-3 animate-spin" /> : <EyeSlashIcon className="h-3 w-3" />}
                Reset dismissed
              </button>
            )}
            <Toggle checked={tour.enabled} onChange={(v) => updateTour({ enabled: v })} />
          </div>
        </div>

        <div className={cn("px-4 py-4 space-y-3 transition-opacity", !tour.enabled && "opacity-50 pointer-events-none")}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Dialog title</label>
              <input
                value={tour.title}
                onChange={(e) => setConfig({ ...config, welcomeTour: { ...tour, title: e.target.value } })}
                onBlur={() => saveConfig(config, "Tour title saved.")}
                placeholder="Welcome to LMD Portal 2.0"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Subtitle</label>
              <input
                value={tour.subtitle ?? ""}
                onChange={(e) => setConfig({ ...config, welcomeTour: { ...tour, subtitle: e.target.value } })}
                onBlur={() => saveConfig(config, "Tour subtitle saved.")}
                placeholder="A quick tour of what's new"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Seen version: {tour.seenVersion ?? 1} · The tour shows once per user. Use &quot;Reset dismissed&quot; to re-show it to everyone.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Tour Steps</span>
          <div className="flex items-center gap-2">
            {tour.steps.length > 0 && (
              <button
                onClick={saveSteps}
                disabled={isPending}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                {isPending ? <ArrowPathIcon className="h-3 w-3 animate-spin" /> : null}
                Save steps
              </button>
            )}
            <button
              onClick={addStep}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Add Step
            </button>
          </div>
        </div>

        {tour.steps.length === 0 ? (
          <div className="text-center py-10 text-sm text-muted-foreground border border-dashed border-border rounded-md">
            No steps yet. Add steps to create a guided tour for new users.
          </div>
        ) : (
          <div className="space-y-3">
            {tour.steps.map((step, idx) => (
              <div key={step.id} className="rounded-md border border-border bg-background overflow-hidden">
                <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium text-foreground flex-1 truncate">
                    {step.title || "Untitled step"}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveStep(step.id, -1)} disabled={idx === 0} className="p-1 rounded hover:bg-muted disabled:opacity-30 text-muted-foreground">
                      <ArrowUpIcon className="h-3 w-3" />
                    </button>
                    <button onClick={() => moveStep(step.id, 1)} disabled={idx === tour.steps.length - 1} className="p-1 rounded hover:bg-muted disabled:opacity-30 text-muted-foreground">
                      <ArrowDownIcon className="h-3 w-3" />
                    </button>
                    <button onClick={() => deleteStep(step.id)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="px-4 py-3 grid grid-cols-[auto_1fr] gap-3">
                  <div className="flex flex-col gap-1.5 w-[60px]">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Emoji</label>
                    <input
                      value={step.emoji ?? ""}
                      onChange={(e) => updateStep(step.id, { emoji: e.target.value })}
                      placeholder="🚀"
                      className="w-full px-2 py-2 text-center text-lg rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Title *</label>
                      <input
                        value={step.title}
                        onChange={(e) => updateStep(step.id, { title: e.target.value })}
                        placeholder="Step title"
                        className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Description *</label>
                      <textarea
                        value={step.description}
                        onChange={(e) => updateStep(step.id, { description: e.target.value })}
                        placeholder="Describe this feature or what the user should know..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
