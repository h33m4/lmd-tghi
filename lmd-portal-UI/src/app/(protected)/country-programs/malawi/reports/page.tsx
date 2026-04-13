import AllReportsRenderer from "@/components/shared/reports/UserAllReportsRenderer";
import TopNavBar from "@/components/shared/TopNavBar";
import { metaObject } from "@/config/site.config";
import React from "react";

// seo meta data
export const metadata = {
  ...metaObject("Malawi Program | Reports"),
};

function MalawiReportPage() {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <>
      <TopNavBar
        country="Malawi"
        excludedBreadcrumbPaths={[""]}
        capitalizeWords={[""]}
      />

      <AllReportsRenderer program="Malawi" showOnlyPublished={true} />
    </>
  );
}

export default MalawiReportPage;
