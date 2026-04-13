"use client";

import React, { useState, useTransition } from "react";
import { PortalConfig, NavBadge, NavBadgeType, NavBadgeColor, savePortalConfig, resetNavBadgeSeen } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const TOP_LEVEL_ROUTES: { label: string; href: string }[] = [
  { label: "Home",                href: "/home" },
  { label: "KPI Dashboard",       href: "/kpi-dashboard" },
  { label: "Country Programs",    href: "/country-programs" },
  { label: "AFF Dashboard",       href: "/aff-dashboard" },
  { label: "Ext. KPI Dashboard",  href: "/external-kpi-dashboard" },
  { label: "Learning Agenda",     href: "/learning-agenda" },
];

const BADGE_TYPES: { value: NavBadgeType; label: string; defaultLabel: string }[] = [
  { value: "new",     label: "New",     defaultLabel: "NEW" },
  { value: "updated", label: "Updated", defaultLabel: "UPDATED" },
  { value: "custom",  label: "Custom",  defaultLabel: "" },
];

const PRESET_COLORS: { value: NavBadgeColor; label: string; tw: string }[] = [
  { value: "green",  label: "Green",  tw: "bg-green-500" },
  { value: "blue",   label: "Blue",   tw: "bg-blue-500" },
  { value: "amber",  label: "Amber",  tw: "bg-amber-400" },
  { value: "red",    label: "Red",    tw: "bg-red-500" },
  { value: "purple", label: "Purple", tw: "bg-purple-500" },
  { value: "pink",   label: "Pink",   tw: "bg-pink-500" },
  { value: "teal",   label: "Teal",   tw: "bg-teal-500" },
];

const PRESET_MAP: Record<string, string> = {
  green: "#22c55e", blue: "#3b82f6", amber: "#fbbf24",
  red: "#ef4444", purple: "#a855f7", pink: "#ec4899", teal: "#14b8a6",
};

function BadgePill({ label, color }: { label: string; color: string }) {
  const preset = PRESET_COLORS.find((p) => p.value === color);
  return (
    <span
      className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide text-white", preset ? preset.tw : "")}
      style={preset ? undefined : { backgroundColor: color }}
    >
      {label || "BADGE"}
    </span>
  );
}

type FormState = { route: string; label: string; type: NavBadgeType; color: string; customColor: string };

const EMPTY_FORM: FormState = { route: "", label: "NEW", type: "new", color: "green", customColor: "#6366f1" };

export default function NavBadgesClient({ initialConfig }: { initialConfig: PortalConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();

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

  const handleTypeChange = (type: NavBadgeType) => {
    const def = BADGE_TYPES.find((t) => t.value === type);
    setForm((f) => ({
      ...f,
      type,
      label: type !== "custom" && !f.label ? (def?.defaultLabel ?? "") : type === "new" ? "NEW" : type === "updated" ? "UPDATED" : f.label,
    }));
  };

  const effectiveColor = form.color === "custom" ? form.customColor : form.color;

  const handleAddOrUpdate = () => {
    if (!form.route.trim()) { toast.error("Route is required."); return; }
    if (!form.label.trim()) { toast.error("Label is required."); return; }

    const color = form.color === "custom" ? form.customColor : form.color;

    if (editingId) {
      const updated = {
        ...config,
        navBadges: config.navBadges.map((b) =>
          b.id === editingId ? { ...b, route: form.route.trim(), label: form.label, type: form.type, color } : b
        ),
      };
      saveConfig(updated, "Badge updated.");
      setEditingId(null);
    } else {
      if (config.navBadges.some((b) => b.route === form.route.trim())) {
        toast.error("A badge for this route already exists.");
        return;
      }
      const newBadge: NavBadge = { id: `nb-${Date.now()}`, route: form.route.trim(), label: form.label, type: form.type, color, seenVersion: 1 };
      const updated = { ...config, navBadges: [...config.navBadges, newBadge] };
      saveConfig(updated, "Badge added.");
    }
    setShowForm(false);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (badge: NavBadge) => {
    const isPreset = PRESET_COLORS.some((p) => p.value === badge.color);
    setForm({
      route: badge.route,
      label: badge.label,
      type: badge.type,
      color: isPreset ? badge.color : "custom",
      customColor: isPreset ? "#6366f1" : badge.color,
    });
    setEditingId(badge.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const updated = { ...config, navBadges: config.navBadges.filter((b) => b.id !== id) };
    saveConfig(updated, "Badge removed.");
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Add badges (NEW, UPDATED, or custom) to sidebar nav items by route path.
        </p>
        <button
          onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Add Badge
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-4 space-y-4">
          <p className="text-sm font-semibold">{editingId ? "Edit Badge" : "New Badge"}</p>

          {/* Route */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Nav Item *</label>
            <select
              value={form.route}
              onChange={(e) => setForm((f) => ({ ...f, route: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="" disabled>Select a nav item...</option>
              {TOP_LEVEL_ROUTES.map((r) => (
                <option key={r.href} value={r.href}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Type</label>
            <div className="flex items-center gap-2">
              {BADGE_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleTypeChange(t.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                    form.type === t.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Label text *</label>
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="NEW"
              maxLength={12}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary uppercase font-bold tracking-wide"
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                  title={c.label}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 transition-all",
                    c.tw,
                    form.color === c.value ? "border-foreground scale-110" : "border-transparent"
                  )}
                />
              ))}
              {/* Custom color */}
              <button
                onClick={() => setForm((f) => ({ ...f, color: "custom" }))}
                className={cn(
                  "w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center text-[10px] font-bold",
                  form.color === "custom" ? "border-foreground scale-110" : "border-transparent border-border border",
                )}
                style={{ background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }}
                title="Custom hex"
              />
              {form.color === "custom" && (
                <input
                  type="color"
                  value={form.customColor}
                  onChange={(e) => setForm((f) => ({ ...f, customColor: e.target.value }))}
                  className="w-8 h-7 rounded cursor-pointer border border-border"
                />
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Preview:</span>
            <span className="text-sm text-foreground">Nav Item</span>
            <BadgePill label={form.label || "BADGE"} color={effectiveColor} />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAddOrUpdate}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {isPending ? <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" /> : <CheckIcon className="h-3.5 w-3.5" />}
              {editingId ? "Update" : "Add"}
            </button>
            <button onClick={cancelForm} className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground border border-border transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Badge list */}
      {config.navBadges.length === 0 && !showForm ? (
        <div className="text-center py-10 text-sm text-muted-foreground border border-dashed border-border rounded-md">
          No badges configured. Add one to highlight a nav item.
        </div>
      ) : (
        <div className="rounded-md border border-border bg-background overflow-hidden">
          <div className="divide-y divide-border">
            {config.navBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 px-4 py-3">
                <BadgePill label={badge.label} color={badge.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {TOP_LEVEL_ROUTES.find((r) => r.href === badge.route)?.label ?? badge.route}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">{badge.route}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={async () => {
                      const result = await resetNavBadgeSeen(badge.id);
                      if (result.ok) {
                        toast.success(result.message);
                        // Reflect incremented seenVersion in local state
                        setConfig((prev) => ({
                          ...prev,
                          navBadges: prev.navBadges.map((b) =>
                            b.id === badge.id ? { ...b, seenVersion: (b.seenVersion ?? 1) + 1 } : b
                          ),
                        }));
                      } else {
                        toast.error(result.message);
                      }
                    }}
                    title="Re-show to all users"
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-blue-500 transition-colors"
                  >
                    <ArrowPathIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleEdit(badge)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(badge.id)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
