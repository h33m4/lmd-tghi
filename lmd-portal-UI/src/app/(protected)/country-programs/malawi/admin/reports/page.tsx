import DashboardManagerSkeleton from "@/components/shared/dashboards/DashboardManagerSkeleton";

import { metaObject } from "@/config/site.config";
import dynamic from "next/dynamic";
import React from "react";

export const metadata = {
  ...metaObject("Malawi Program | Admin - Reports"),
};

const ReportsManager = dynamic(
  () => import("@/components/shared/reports/ReportsManager"),
  {
    ssr: false,
    loading: () => <DashboardManagerSkeleton />,
  },
);

export default function page() {
  return (
    <>
      {/* <TopNavBar country="Malawi" /> */}
      {/* <ReportsHeader program={"Malawi"} /> */}
      <ReportsManager program={"Malawi"} />
    </>
  );
}
