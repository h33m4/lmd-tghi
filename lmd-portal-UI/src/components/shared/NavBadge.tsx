"use client";

import React from "react";
import { usePortalConfig } from "@/context/PortalConfigContext";
import { cn } from "@/lib/utils";

const PRESET: Record<string, string> = {
  green:  "bg-green-500 text-white",
  blue:   "bg-blue-500 text-white",
  amber:  "bg-amber-400 text-white",
  red:    "bg-red-500 text-white",
  purple: "bg-purple-500 text-white",
  pink:   "bg-pink-500 text-white",
  teal:   "bg-teal-500 text-white",
};

export default function NavBadge({ route }: { route: string }) {
  const { navBadges } = usePortalConfig();
  const badge = navBadges.find((b) => b.route === route);
  if (!badge) return null;

  const isPreset = !!PRESET[badge.color];

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide leading-none shrink-0",
        isPreset ? PRESET[badge.color] : "text-white"
      )}
      style={isPreset ? undefined : { backgroundColor: badge.color }}
    >
      {badge.label}
    </span>
  );
}
