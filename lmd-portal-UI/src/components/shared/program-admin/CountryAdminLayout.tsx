import React from "react";
import Image from "next/image";
import AdminNavTabs, { AdminNavTab } from "./AdminNavTabs";
import { LmhPrograms } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const DEFAULT_TABS: AdminNavTab[] = [
  { label: "Overview", href: "", icon: "dashboard" },
  { label: "Dashboards", href: "/dashboards", icon: "barchart" },
  { label: "Reports", href: "/reports", icon: "reports" },
  { label: "Data Pipelines", href: "/data-sources", icon: "workflow" },
  { label: "BI Connectors", href: "/bi-connectors", icon: "share" },
];

type Props = {
  program: LmhPrograms;
  flagSrc: string;
  children: React.ReactNode;
  tabs?: AdminNavTab[];
};

export default async function CountryAdminLayout({
  program,
  flagSrc,
  children,
  tabs = DEFAULT_TABS,
}: Props) {
  const session = await auth();
  const groups = session?.user?.groups ?? [];

  // Normalise "Sierra Leone" → "sierra_leone" to match group naming
  const countryKey = program.toLowerCase().replace(/\s+/g, "_");

  const allowedGroups = [
    "super_administrator",
    "administrator",
    "global_publisher",
    `${countryKey}_administrator`,
    `${countryKey}_publisher`,
  ];

  const hasAccess = groups.some((g) => allowedGroups.includes(g));
  if (!hasAccess) {
    redirect("/unauthorized");
  }

  const displayName = program.replace(/_/g, " ");

  return (
    <div className="h-full flex flex-col justify-between px-2 lg:px-4">
      <div className="space-y-1">
        <div className="border-b-[2px] border-grey-dark/10 mb-0 h-[41px] flex items-center gap-2 -mt-2">
          <Image
            src={flagSrc}
            width={40}
            height={20}
            alt={`${displayName} flag`}
            className="bg-background rounded-none border border-white"
          />
          <div className="flex flex-col items-start justify-center gap-0">
            <p className="text-lmh-pink text-xs th-font-black tracking-wide">
              {displayName} <span className="ml-0">/</span>
            </p>
            <h1 className="-mt-1 text-lmh-dark-blue-foreground th-font-heavy text-sm flex items-center">
              Admin Tools
            </h1>
          </div>
        </div>
        <AdminNavTabs program={program} tabs={tabs} />
      </div>
      <div className="flex-1 overflow-y-auto space-y-6 pt-3 pb-1 pr-2">
        {children}
      </div>
    </div>
  );
}
