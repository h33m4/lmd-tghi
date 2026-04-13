import DashboardManagerSkeleton from "@/components/shared/dashboards/DashboardManagerSkeleton";
import ReportsHeader from "@/components/shared/reports/ReportsHeader";
// import ReportsManager from "@/components/shared/reports/ReportsManager";

import { metaObject } from "@/config/site.config";
import dynamic from "next/dynamic";
import React from "react";

export const metadata = {
  ...metaObject("Ethiopia Program | Admin - Reports"),
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
      {/* <TopNavBar country="Ethiopia" /> */}
      {/* <ReportsHeader program={"Ethiopia"} /> */}
      <ReportsManager program={"Ethiopia"} />
    </>
  );
}
