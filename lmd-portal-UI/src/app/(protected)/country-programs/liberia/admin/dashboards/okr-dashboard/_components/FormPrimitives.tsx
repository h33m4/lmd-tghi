"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { InfoContainer } from "@/components/infoContainer/infoContainerComponent";

// ─── Field ────────────────────────────────────────────────────────────────────

export const Field = ({
  label,
  required = false,
  info,
  id,
  children,
}: {
  label: string;
  required?: boolean;
  info?: string;
  id?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-0.5">
      <label className="text-[11px] font-semibold text-lmh-dark-blue/60 dark:text-primary/70 uppercase tracking-widest">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {info && (
        <InfoContainer
          id={id || `field-${label}`}
          text={info}
          placement="top"
        />
      )}
    </div>
    {children}
  </div>
);

// ─── StyledSelect ─────────────────────────────────────────────────────────────

export const StyledSelect = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <select
    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

// ─── Section ──────────────────────────────────────────────────────────────────

export function Section({
  title,
  icon,
  accent,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  accent?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 transition-colors text-left group"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex items-center gap-2.5">
          {accent && <span className={`w-1.5 h-5 rounded-full ${accent}`} />}
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="text-primary">{icon}</span>
            {title}
          </span>
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </button>
      {open && (
        <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background">
          {children}
        </div>
      )}
    </div>
  );
}
