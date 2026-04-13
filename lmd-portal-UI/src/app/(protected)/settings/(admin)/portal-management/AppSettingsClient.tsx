"use client";

import React, { useState, useTransition } from "react";
import { PortalConfig, Banner, BannerType, savePortalConfig, resetBannerSeen } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  MegaphoneIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BellIcon,
  StarIcon,
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// ── Icon registry ─────────────────────────────────────────────────────────────

const ICON_OPTIONS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: "megaphone", label: "Megaphone",    icon: <MegaphoneIcon className="h-4 w-4" /> },
  { id: "info",      label: "Info",         icon: <InformationCircleIcon className="h-4 w-4" /> },
  { id: "warning",   label: "Warning",      icon: <ExclamationTriangleIcon className="h-4 w-4" /> },
  { id: "check",     label: "Check",        icon: <CheckCircleIcon className="h-4 w-4" /> },
  { id: "bell",      label: "Bell",         icon: <BellIcon className="h-4 w-4" /> },
  { id: "star",      label: "Star",         icon: <StarIcon className="h-4 w-4" /> },
  { id: "sparkles",  label: "Sparkles",     icon: <SparklesIcon className="h-4 w-4" /> },
  { id: "bolt",      label: "Bolt",         icon: <BoltIcon className="h-4 w-4" /> },
  { id: "shield",    label: "Shield",       icon: <ShieldCheckIcon className="h-4 w-4" /> },
  { id: "wrench",    label: "Wrench",       icon: <WrenchScrewdriverIcon className="h-4 w-4" /> },
];

function getBannerIcon(iconId?: string): React.ReactNode {
  return ICON_OPTIONS.find((o) => o.id === iconId)?.icon ?? <MegaphoneIcon className="h-4 w-4" />;
}

// ── Banner type presets ───────────────────────────────────────────────────────

const BANNER_TYPES: { value: BannerType; label: string; dot: string; previewClass: string }[] = [
  { value: "info",    label: "Info",    dot: "bg-blue-500",  previewClass: "bg-blue-600 text-white" },
  { value: "warning", label: "Warning", dot: "bg-amber-500", previewClass: "bg-amber-500 text-white" },
  { value: "success", label: "Success", dot: "bg-green-500", previewClass: "bg-green-600 text-white" },
];

// ── Link parser ───────────────────────────────────────────────────────────────

function parseBannerMessage(message: string): React.ReactNode[] {
  const parts = message.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return <span key={i} className="underline font-semibold cursor-pointer">{match[1]}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Toggle ────────────────────────────────────────────────────────────────────

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

// ── Empty form ────────────────────────────────────────────────────────────────

type FormState = {
  message: string;
  type: BannerType;
  icon: string;
  customColor: string;
};

const EMPTY_FORM: FormState = {
  message: "",
  type: "info",
  icon: "megaphone",
  customColor: "",
};

// ── Main component ────────────────────────────────────────────────────────────

export default function AppSettingsClient({ initialConfig }: { initialConfig: PortalConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();
  const [resettingId, setResettingId] = useState<string | null>(null);

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

  const handleAdd = () => {
    if (!form.message.trim()) {
      toast.error("Message is required.");
      return;
    }
    const newBanner: Banner = {
      id: `banner-${Date.now()}`,
      message: form.message.trim(),
      type: form.type,
      icon: form.icon,
      customColor: form.customColor,
      enabled: true,
      seenVersion: 1,
      createdAt: new Date().toISOString(),
    };
    saveConfig({ ...config, banners: [newBanner, ...(config.banners ?? [])] }, "Banner created.");
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    saveConfig({ ...config, banners: config.banners.filter((b) => b.id !== id) }, "Banner deleted.");
  };

  const handleToggle = (id: string) => {
    saveConfig({
      ...config,
      banners: config.banners.map((b) => b.id === id ? { ...b, enabled: !b.enabled } : b),
    }, "Banner updated.");
  };

  const handleResetSeen = (id: string) => {
    setResettingId(id);
    startTransition(async () => {
      const result = await resetBannerSeen(id);
      if (result.ok) {
        toast.success("Banner reset — all users will see it again.");
        setConfig((c) => ({
          ...c,
          banners: c.banners.map((b) => b.id === id ? { ...b, seenVersion: (b.seenVersion ?? 1) + 1 } : b),
        }));
      } else {
        toast.error("Reset failed");
      }
      setResettingId(null);
    });
  };

  const useCustomColor = !!form.customColor;
  const previewBgClass = useCustomColor
    ? ""
    : (BANNER_TYPES.find((t) => t.value === form.type)?.previewClass ?? "bg-blue-600 text-white");

  const banners = config.banners ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Banners appear as a stripe at the top of every page. Multiple banners stack. Users can dismiss each one.
        </p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          New Banner
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-4 space-y-4">
          <p className="text-sm font-semibold text-foreground">Create Banner</p>

          {/* Message */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Message *</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="e.g. Portal update live — check out the [KPI Dashboard](/kpi-dashboard)"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Embed links using <code className="font-mono bg-muted px-1 rounded">[text](url)</code>
            </p>
          </div>

          {/* Icon */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Icon</label>
            <div className="flex items-center gap-2 flex-wrap">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setForm((f) => ({ ...f, icon: opt.id }))}
                  title={opt.label}
                  className={cn(
                    "w-8 h-8 rounded-md border flex items-center justify-center transition-colors",
                    form.icon === opt.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                  )}
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {BANNER_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm((f) => ({ ...f, type: t.value, customColor: "" }))}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                    form.type === t.value && !useCustomColor
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", t.dot)} />
                  {t.label}
                </button>
              ))}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setForm((f) => ({ ...f, customColor: f.customColor || "#6366f1" }))}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                    useCustomColor ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-border"
                    style={{ background: form.customColor || "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }}
                  />
                  Custom
                </button>
                {useCustomColor && (
                  <input
                    type="color"
                    value={form.customColor}
                    onChange={(e) => setForm((f) => ({ ...f, customColor: e.target.value }))}
                    className="w-8 h-7 rounded cursor-pointer border border-border"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          {form.message && (
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Preview</label>
              <div
                className={cn("px-4 py-2.5 rounded-md text-sm flex items-center gap-2 flex-wrap text-white", previewBgClass)}
                style={useCustomColor ? { backgroundColor: form.customColor } : undefined}
              >
                {getBannerIcon(form.icon)}
                {parseBannerMessage(form.message)}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAdd}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {isPending && <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />}
              Create
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
              className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground border border-border transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Banner list */}
      {banners.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-md">
          No banners yet. Create one to show a message at the top of every page.
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => {
            const presetClass = BANNER_TYPES.find((t) => t.value === banner.type)?.previewClass ?? "bg-blue-600 text-white";
            return (
              <div
                key={banner.id}
                className={cn(
                  "rounded-md border p-4 space-y-2",
                  banner.enabled ? "border-border" : "border-border opacity-60"
                )}
              >
                {/* Banner preview stripe */}
                <div
                  className={cn("px-3 py-2 rounded text-sm flex items-center gap-2 text-white", banner.customColor ? "" : presetClass)}
                  style={banner.customColor ? { backgroundColor: banner.customColor } : undefined}
                >
                  {getBannerIcon(banner.icon)}
                  <span className="flex-1 text-xs">{banner.message}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                      banner.enabled
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    )}>
                      {banner.enabled ? "ACTIVE" : "INACTIVE"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Created {new Date(banner.createdAt).toLocaleDateString()} · Seen v{banner.seenVersion}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Toggle checked={banner.enabled} onChange={() => handleToggle(banner.id)} />
                    <button
                      onClick={() => handleResetSeen(banner.id)}
                      disabled={isPending && resettingId === banner.id}
                      title="Reset dismissed — users will see this banner again"
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isPending && resettingId === banner.id
                        ? <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                        : <EyeSlashIcon className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
