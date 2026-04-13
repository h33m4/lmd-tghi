import TopNavBar from "@/components/shared/TopNavBar";
import { metaObject } from "@/config/site.config";
import React from "react";

import { IDashboardData, ILocalCustomDashboardData } from "@/types/dashboard";
import UserAllDashboardsView from "@/components/shared/views/UserAllDashboardsView";

export const metadata = {
  ...metaObject("Liberia Program | Dashboards"),
};

const LocalCustomDashboards: ILocalCustomDashboardData[] = [
  {
    id: 1,
    title: "OKR Dashboard",
    description: "Liberia Program OKR Dashboard",
    status: "draft",
    program: "Liberia",
    bi_tool: "Custom",
    page_url: "/country-programs/liberia/dashboards/okr-dashboard",
    embed_url: "/country-programs/liberia/dashboards/okr-dashboard",
    slug: "okr-dashboard",
    tags: "OKR",
    data_source: ["DHIS2", "IFI", "Google sheets"],
    country: "Liberia",
    created_by: "LMD team",
    date_inserted: "",
    published_at: "",
    last_update_date: "",
  },
];

function LiberiaDashboardsPage() {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <>
      <TopNavBar
        country="Liberia"
        excludedBreadcrumbPaths={["dashboards"]}
        capitalizeWords={["chw"]}
      />
      <UserAllDashboardsView
        country="Liberia"
        localCustomDashboards={LocalCustomDashboards}
        showOnlyPublished={true}
      />
    </>
  );
}

export default LiberiaDashboardsPage;
