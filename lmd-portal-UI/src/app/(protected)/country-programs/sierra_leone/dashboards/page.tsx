import TopNavBar from "@/components/shared/TopNavBar";
import { metaObject } from "@/config/site.config";
import React from "react";
import AllDashboardsView from "@/components/shared/views/UserAllDashboardsView";

export const metadata = {
  ...metaObject("Sierra Leone Program | Dashboards"),
};

function SierraLeoneDashboardsPage() {
  return (
    <>
      <TopNavBar
        country="Sierra Leone"
        excludedBreadcrumbPaths={["dashboards"]}
        capitalizeWords={["chw"]}
      />
      <AllDashboardsView country="Sierra_Leone" showOnlyPublished={true} />
    </>
  );
}

export default SierraLeoneDashboardsPage;
