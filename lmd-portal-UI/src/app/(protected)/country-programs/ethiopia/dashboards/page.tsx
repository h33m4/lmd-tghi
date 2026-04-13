import TopNavBar from "@/components/shared/TopNavBar";
import { metaObject } from "@/config/site.config";
import React from "react";
import AllDashboardsView from "@/components/shared/views/UserAllDashboardsView";

export const metadata = {
  ...metaObject("Ethiopia Program | Dashboards"),
};

function EthiopiaDashboardsPage() {
  return (
    <>
      <TopNavBar country="Ethiopia" excludedBreadcrumbPaths={[""]} />
      <AllDashboardsView country="Ethiopia" showOnlyPublished={true} />
    </>
  );
}

export default EthiopiaDashboardsPage;
