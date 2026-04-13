import React, { Suspense } from "react";
// import DashboardsManager from "@/components/shared/dashboards/DashboardsManager";

import { metaObject } from "@/config/site.config";
import dynamic from "next/dynamic";
import DashboardManagerSkeleton from "@/components/shared/dashboards/DashboardManagerSkeleton";

export const metadata = {
  ...metaObject("Sierra Leone Program | Admin - Dashboards"),
};

const DashboardsManager = dynamic(
  () => import("@/components/shared/dashboards/DashboardsManager"),
  {
    ssr: false,
    loading: () => <DashboardManagerSkeleton />,
  },
);

export default function page() {
  return <DashboardsManager program="Sierra_Leone" />;
}
