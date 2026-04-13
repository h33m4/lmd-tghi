import TopNavBar from "@/components/shared/TopNavBar";
import React from "react";

import DashboardContent from "./_components/dashboardContent";

function LibOkrDashboard() {
  return (
    <>
      <TopNavBar
        country="Liberia"
        excludedBreadcrumbPaths={[""]}
        capitalizeWords={["OKR"]}
      />

      <DashboardContent />
    </>
  );
}

export default LibOkrDashboard;
