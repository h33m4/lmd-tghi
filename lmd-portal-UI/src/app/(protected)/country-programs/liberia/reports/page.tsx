import AllReportsRenderer from "@/components/shared/reports/UserAllReportsRenderer";
import TopNavBar from "@/components/shared/TopNavBar";
import { metaObject } from "@/config/site.config";
import React from "react";

// seo meta data
export const metadata = {
  ...metaObject("Liberia Program | Reports"),
};

function LiberiaReportPage() {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <>
      <TopNavBar
        country="Liberia"
        excludedBreadcrumbPaths={["dashboards"]}
        capitalizeWords={["chw"]}
      />

      <AllReportsRenderer program="Liberia" showOnlyPublished={true} />
    </>
  );
}

export default LiberiaReportPage;
