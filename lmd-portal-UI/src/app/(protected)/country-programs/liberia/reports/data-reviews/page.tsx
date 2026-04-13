import TopNavBar from "@/components/shared/TopNavBar";
import React from "react";

import reportdata from "./reportsdata.json";

import { metaObject } from "@/config/site.config";

import { IReportData } from "@/components/shared/reports-old/ReportCard";
import Allreports from "@/components/shared/reports-old/Allreports";

// seo meta data
export const metadata = {
  ...metaObject("Liberia Program | Data Review Reports"),
};

const LiberiaReportsPage = () => {
  return (
    <>
      <TopNavBar country="Liberia" pageName="Program Reports" />
      <Allreports reportsdata={reportdata as IReportData[]} />
    </>
  );
};

export default LiberiaReportsPage;
