"use client";

import React, { useState, useMemo, useTransition } from "react";
import { ROUTE_CATALOG, CATEGORY_ORDER, RouteEntry } from "@/config/app-routes";
import { savePublicRoutes } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  GlobeAltIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

type Filter = "all" | "public" | "protected";

const CATEGORY_COLORS: Record<string, string> = {
  General: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Documentation: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "KPI Dashboard": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Liberia: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Malawi: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  Ethiopia: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "Sierra Leone": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200",
        checked ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

type Props = {
  initialPublicRoutes: string[];
};

export default function PageVisibilityClient({ initialPublicRoutes }: Props) {
  const [publicRoutes, setPublicRoutes] = useState<Set<string>>(
    new Set(initialPublicRoutes)
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [hasChanges, setHasChanges] = useState(false);

  const toggle = (route: string) => {
    setPublicRoutes((prev) => {
      const next = new Set(prev);
      if (next.has(route)) next.delete(route);
      else next.add(route);
      return next;
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await savePublicRoutes(Array.from(publicRoutes));
      if (result.ok) {
        toast.success("Routes saved", { description: result.message });
        setHasChanges(false);
      } else {
        toast.error("Save failed", { description: result.message });
      }
    });
  };

  const filtered = useMemo(() => {
    return ROUTE_CATALOG.filter((entry) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "public" && publicRoutes.has(entry.route)) ||
        (filter === "protected" && !publicRoutes.has(entry.route));
      const matchesSearch =
        !search ||
        entry.label.toLowerCase().includes(search.toLowerCase()) ||
        entry.route.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, publicRoutes]);

  const grouped = useMemo(() => {
    const map = new Map<string, RouteEntry[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const entry of filtered) {
      const list = map.get(entry.category);
      if (list) list.push(entry);
    }
    return Array.from(map.entries()).filter(([, entries]) => entries.length > 0);
  }, [filtered]);

  const publicCount = Array.from(publicRoutes).filter((r) =>
    ROUTE_CATALOG.some((e) => e.route === r)
  ).length;

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
        <InformationCircleIcon className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-700 dark:text-amber-300">
          <span className="font-semibold">Development note:</span> Changes save to{" "}
          <code className="bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded text-[11px]">
            src/routes.ts
          </code>
          . In development, the server picks this up automatically. In production, a server restart is required for changes to take effect in the middleware.
        </div>
      </div>

      {/* Stats + controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <GlobeAltIcon className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-foreground">{publicCount}</span> public
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <LockClosedIcon className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-foreground">
              {ROUTE_CATALOG.length - publicCount}
            </span>{" "}
            protected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter tabs */}
          <div className="flex items-center rounded-md border border-border bg-background p-0.5 text-xs">
            {(["all", "public", "protected"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-2.5 py-1 rounded capitalize transition-colors",
                  filter === f
                    ? "bg-primary text-white font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search routes..."
              className="pl-7 pr-3 py-1.5 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary w-40"
            />
          </div>
        </div>
      </div>

      {/* Route groups */}
      <div className="space-y-4">
        {grouped.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No routes match your filter.</p>
        ) : (
          grouped.map(([category, entries]) => (
            <div key={category} className="rounded-md border border-border bg-background overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                      CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-600"
                    )}
                  >
                    {category}
                  </span>
                  <span className="text-xs text-muted-foreground">{entries.length} routes</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium">
                    {entries.filter((e) => publicRoutes.has(e.route)).length}
                  </span>
                  <span>/ {entries.length} public</span>
                </div>
              </div>

              <div className="divide-y divide-border">
                {entries.map((entry) => {
                  const isPublic = publicRoutes.has(entry.route);
                  return (
                    <div
                      key={entry.route}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 gap-3 transition-colors",
                        isPublic ? "bg-green-50/50 dark:bg-green-950/10" : ""
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {entry.label}
                          </p>
                          {isPublic ? (
                            <span className="shrink-0 flex items-center gap-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
                              <GlobeAltIcon className="h-3 w-3" />
                              Public
                            </span>
                          ) : (
                            <span className="shrink-0 flex items-center gap-0.5 text-[10px] text-muted-foreground">
                              <LockClosedIcon className="h-3 w-3" />
                              Protected
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {entry.route}
                        </p>
                        {entry.description && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">{entry.description}</p>
                        )}
                      </div>
                      <Toggle checked={isPublic} onChange={() => toggle(entry.route)} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Save bar */}
      <div
        className={cn(
          "sticky bottom-0 -mx-0 px-4 py-3 bg-background/90 backdrop-blur border-t border-border flex items-center justify-between gap-3 transition-all duration-200",
          hasChanges ? "opacity-100" : "opacity-50 pointer-events-none"
        )}
      >
        <span className="text-xs text-muted-foreground">
          {hasChanges ? "You have unsaved changes." : "No changes."}
        </span>
        <button
          onClick={handleSave}
          disabled={isPending || !hasChanges}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {isPending && <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />}
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
