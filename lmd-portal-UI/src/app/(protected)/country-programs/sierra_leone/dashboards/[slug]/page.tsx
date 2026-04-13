import TopNavBar from "@/components/shared/TopNavBar";
import DashboardRenderer from "@/components/shared/views/DashboardRenderer";
import { metaObject } from "@/config/site.config";
import React from "react";

// seo meta data
export const metadata = {
  ...metaObject("Sierra Leone Program | Dashboards"),
};

interface DashboardPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    id?: string;
    [key: string]: string | string[] | undefined;
  };
}

function DashboardPage({ params, searchParams }: DashboardPageProps) {
  //   console.log("Dashboard Page Params:", params);
  //   console.log("Search Params:", searchParams);

  const dashboardSlug = params.slug;
  const dashboardId = searchParams.id;

  return (
    <>
      <TopNavBar
        country="Sierra Leone"
        excludedBreadcrumbPaths={[""]}
        capitalizeWords={["pre", { chws: "CHWs" }]}
      />

      <DashboardRenderer dashboardId={dashboardId} />
    </>
  );
}

export default DashboardPage;
