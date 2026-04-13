import DashboardManagerSkeleton from "@/components/shared/dashboards/DashboardManagerSkeleton";
// import ReportsManager from "@/components/shared/reports/ReportsManager";

import { metaObject } from "@/config/site.config";
import dynamic from "next/dynamic";
import React from "react";

const ReportsManager = dynamic(
  () => import("@/components/shared/reports/ReportsManager"),
  {
    ssr: false,
    loading: () => <DashboardManagerSkeleton />,
  },
);

export const metadata = {
  ...metaObject("Sierra Leone Program | Admin - Reports"),
};

export default function page() {
  return <ReportsManager program={"Sierra_Leone"} />;
}
