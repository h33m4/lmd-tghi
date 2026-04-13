"use client";

import { LmhPrograms } from "@/types";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Share2,
  Workflow,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export type AdminIconKey =
  | "dashboard"
  | "barchart"
  | "reports"
  | "workflow"
  | "share";

interface AdminNavTabsProps {
  program: LmhPrograms;
  tabs: AdminNavTab[];
}

export interface AdminNavTab {
  label: string;
  href: string;
  icon: AdminIconKey;
}

const ICON_MAP: Record<AdminIconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  barchart: BarChart3,
  reports: FileText,
  workflow: Workflow,
  share: Share2,
};

function AdminNavTabs({ program, tabs }: AdminNavTabsProps) {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  const programSlug = program.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [pathname]);

  return (
    <div className="border-b-2  w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="inline-flex min-w-full">
        {tabs.map((tab) => {
          const Icon = ICON_MAP[tab.icon];
          const fullHref = `/country-programs/${programSlug}/admin${tab.href}`;
          const isActive =
            tab.href === ""
              ? pathname === fullHref
              : pathname === fullHref || pathname.startsWith(fullHref + "/");

          return (
            <nav key={tab.href || "overview"} className="flex-shrink-0">
              <Link
                prefetch
                ref={isActive ? activeRef : null}
                href={fullHref}
                className={cn(
                  "flex items-center gap-2 px-4 lg:px-8 pb-1 pt-2 rounded-t-xl text-[15px] font-normal transition-all border-b-[2px]   whitespace-nowrap",
                  "hover:text-gray-900 hover:bg-gray-500/10",
                  isActive
                    ? "border-b-lmh-pink  text-lmh-pink shadow-sm font-bold hover:text-lmh-pink"
                    : "text-gray-600 border-b-transparent",
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </Link>
            </nav>
          );
        })}
      </div>
    </div>
  );
}

export default AdminNavTabs;
