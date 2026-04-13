import React from "react";
import { metaObject } from "@/config/site.config";
import dynamic from "next/dynamic";
import DashboardManagerSkeleton from "@/components/shared/dashboards/DashboardManagerSkeleton";
import { LocalDashboardEntry } from "@/components/shared/dashboards/DashboardsManager";

export const metadata = {
  ...metaObject("Liberia Program | Admin - Dashboards"),
};

const DashboardsManager = dynamic(
  () => import("@/components/shared/dashboards/DashboardsManager"),
  {
    ssr: false,
    loading: () => <DashboardManagerSkeleton />,
  },
);

const localDashboards: LocalDashboardEntry[] = [
  {
    id: "okr-dashboard",
    title: "OKR Dashboard",
    description: "Track and manage Liberia program OKRs and key results.",
    viewHref: "/country-programs/liberia/dashboards/okr-dashboard",
    editHref: "/country-programs/liberia/admin/dashboards/okr-dashboard",
  },
];

export default function page() {
  return (
    <>
      <DashboardsManager program={"Liberia"} localDashboards={localDashboards} />
    </>
  );
}
