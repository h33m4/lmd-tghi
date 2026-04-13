import React from "react";
// import DashboardsManager from "@/components/shared/dashboards/DashboardsManager";

import { metaObject } from "@/config/site.config";
import DashboardManagerSkeleton from "@/components/shared/dashboards/DashboardManagerSkeleton";
import dynamic from "next/dynamic";

export const metadata = {
  ...metaObject("Malawi Program | Admin - Dashboards"),
};

const DashboardsManager = dynamic(
  () => import("@/components/shared/dashboards/DashboardsManager"),
  {
    ssr: false,
    loading: () => <DashboardManagerSkeleton />,
  },
);

export default function page() {
  return (
    <>
      <DashboardsManager program={"Malawi"} />.
    </>
  );
}
