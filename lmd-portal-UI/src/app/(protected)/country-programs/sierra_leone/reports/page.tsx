import AllReportsRenderer from "@/components/shared/reports/UserAllReportsRenderer";
import TopNavBar from "@/components/shared/TopNavBar";
import { metaObject } from "@/config/site.config";
import React from "react";

// seo meta data
export const metadata = {
  ...metaObject("Sierra Leone Program | Reports"),
};

function SierraLeoneReportPage() {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <>
      <TopNavBar
        country="Sierra Leone"
        excludedBreadcrumbPaths={["dashboards"]}
        capitalizeWords={["chw"]}
      />

      <AllReportsRenderer program={"Sierra_Leone"} showOnlyPublished={true} />
    </>
  );
}

export default SierraLeoneReportPage;
