import TopNavBar from "@/components/shared/TopNavBar";
import { metaObject } from "@/config/site.config";
import React from "react";
import AllDashboardsView from "@/components/shared/views/UserAllDashboardsView";

export const metadata = {
  ...metaObject("Malawi Program | Dashboards"),
};

function MalawiDashboardsPage() {
  return (
    <>
      <TopNavBar
        country="Malawi"
        excludedBreadcrumbPaths={["dashboards"]}
        capitalizeWords={["chw"]}
      />
      <AllDashboardsView country="Malawi" showOnlyPublished={true} />
    </>
  );
}

export default MalawiDashboardsPage;
