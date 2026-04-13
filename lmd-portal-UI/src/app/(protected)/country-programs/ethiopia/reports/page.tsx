import AllReportsRenderer from "@/components/shared/reports/UserAllReportsRenderer";
import TopNavBar from "@/components/shared/TopNavBar";
import { metaObject } from "@/config/site.config";
import React from "react";

// seo meta data
export const metadata = {
  ...metaObject("Ethiopia Program | Reports"),
};

function EthiopiaReportPage() {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <>
      <TopNavBar
        country="Ethiopia"
        excludedBreadcrumbPaths={[""]}
        capitalizeWords={[""]}
      />

      <AllReportsRenderer program="Ethiopia" showOnlyPublished={true} />
    </>
  );
}

export default EthiopiaReportPage;
