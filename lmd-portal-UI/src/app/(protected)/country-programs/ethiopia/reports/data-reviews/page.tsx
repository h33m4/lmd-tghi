import TopNavBar from "@/components/shared/TopNavBar";
import React from "react";

import { IReportData } from "@/components/shared/reports-old/ReportCard";
import Allreports from "@/components/shared/reports-old/Allreports";

import reportdata from "./reportsdata.json";
import { metaObject } from "@/config/site.config";

// seo meta data
export const metadata = {
  ...metaObject("Ethiopia Program | Data Review Reports"),
};

const EthiopiaReportsPage = () => {
  return (
    <>
      <TopNavBar country="Ethiopia" pageName="Program Reports" />
      <Allreports reportsdata={reportdata as IReportData[]} />
    </>
  );
};

export default EthiopiaReportsPage;
