"use client";

import React, { useState, useTransition } from "react";
import {
  PortalConfig,
  Announcement,
  AnnouncementType,
  savePortalConfig,
  resetAnnouncementSeen,
} from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  MegaphoneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const TYPE_CONFIG: Record<AnnouncementType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  info: {
    label: "Info",
    icon: <InformationCircleIcon className="h-4 w-4" />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
  },
  update: {
    label: "Update",
    icon: <CheckCircleIcon className="h-4 w-4" />,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
  },
  warning: {
    label: "Warning",
    icon: <ExclamationTriangleIcon className="h-4 w-4" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
  },
  maintenance: {
    label: "Maintenance",
    icon: <WrenchScrewdriverIcon className="h-4 w-4" />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
  },
};

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

const EMPTY_FORM: Omit<Announcement, "id" | "createdAt" | "seenVersion"> = {
  title: "",
  message: "",
  type: "update",
  version: "",
  active: true,
};

export default function AnnouncementsClient({ initialConfig }: { initialConfig: PortalConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();
  const [resettingId, setResettingId] = useState<string | null>(null);

  const saveConfig = (updated: PortalConfig, successMsg: string) => {
    startTransition(async () => {
      const result = await savePortalConfig(updated);
      if (result.ok) {
        toast.success(successMsg);
        setConfig(updated);
      } else {
        toast.error("Save failed", { description: result.message });
      }
    });
  };

  const handleAdd = () => {
    if (!form.title.trim() || !form.message.trim()) {
      toast.error("Title and message are required.");
      return;
    }
    const newAnn: Announcement = {
      ...form,
      id: `ann-${Date.now()}`,
      seenVersion: 1,
      createdAt: new Date().toISOString(),
    };
    const updated = { ...config, announcements: [newAnn, ...config.announcements] };
    saveConfig(updated, "Announcement created.");
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = { ...config, announcements: config.announcements.filter((a) => a.id !== id) };
    saveConfig(updated, "Announcement deleted.");
  };

  const handleToggleActive = (id: string) => {
    const updated = {
      ...config,
      announcements: config.announcements.map((a) =>
        a.id === id ? { ...a, active: !a.active } : a
      ),
    };
    saveConfig(updated, "Announcement updated.");
  };

  const handleResetSeen = (id: string) => {
    setResettingId(id);
    startTransition(async () => {
      const result = await resetAnnouncementSeen(id);
      if (result.ok) {
        toast.success("Dismissed state reset — users will see this announcement again.");
        // Refresh local state
        setConfig((c) => ({
          ...c,
          announcements: c.announcements.map((a) =>
            a.id === id ? { ...a, seenVersion: (a.seenVersion ?? 0) + 1 } : a
          ),
        }));
      } else {
        toast.error("Reset failed");
      }
      setResettingId(null);
    });
  };

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Announcements show as dialogs to all logged-in users. Users can dismiss them. Toggle &quot;Reset dismissed&quot; to make everyone see it again.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          New Announcement
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">Create Announcement</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="LMD Portal 2.1 Released"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Version tag</label>
              <input
                value={form.version}
                onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
                placeholder="v2.1 (optional)"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Message *</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Describe what's new or what users should know..."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Type</label>
            <div className="flex items-center gap-2 flex-wrap">
              {(Object.keys(TYPE_CONFIG) as AnnouncementType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                    form.type === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className={TYPE_CONFIG[t].color}>{TYPE_CONFIG[t].icon}</span>
                  {TYPE_CONFIG[t].label}
                </button>
              ))}
            </div>
          </div>
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
              className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground border border-border hover:border-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {config.announcements.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-md">
          No announcements yet. Create one to notify users about updates.
        </div>
      ) : (
        <div className="space-y-3">
          {config.announcements.map((ann) => {
            const tc = TYPE_CONFIG[ann.type];
            return (
              <div
                key={ann.id}
                className={cn(
                  "rounded-md border p-4 space-y-2",
                  ann.active ? tc.bg : "bg-muted/30 border-border opacity-70"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(tc.color)}>{tc.icon}</span>
                    <span className="text-sm font-semibold text-foreground">{ann.title}</span>
                    {ann.version && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background/60 border border-border text-muted-foreground">
                        {ann.version}
                      </span>
                    )}
                    <span className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                      ann.active ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    )}>
                      {ann.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Toggle checked={ann.active} onChange={() => handleToggleActive(ann.id)} />
                    <button
                      onClick={() => handleResetSeen(ann.id)}
                      disabled={isPending && resettingId === ann.id}
                      title="Reset dismissed — users will see this again"
                      className="p-1.5 rounded hover:bg-background/60 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isPending && resettingId === ann.id
                        ? <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                        : <EyeSlashIcon className="h-3.5 w-3.5" />
                      }
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1.5 rounded hover:bg-background/60 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{ann.message}</p>
                <p className="text-[11px] text-muted-foreground pl-6">
                  Created {new Date(ann.createdAt).toLocaleDateString()} · Seen version {ann.seenVersion}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
