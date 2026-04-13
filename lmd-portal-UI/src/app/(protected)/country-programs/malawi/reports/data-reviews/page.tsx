import TopNavBar from "@/components/shared/TopNavBar";
import { Metadata } from "next";
import React from "react";

import { IReportData } from "@/components/shared/reports-old/ReportCard";
import Allreports from "@/components/shared/reports-old/Allreports";

import reportdata from "./reportsdata.json";
import { metaObject } from "@/config/site.config";

// seo meta data
export const metadata = {
  ...metaObject("Malawi Program | Data Review Reports"),
};

const MalawiReportsPage = () => {
  return (
    <>
      <TopNavBar country="Malawi" pageName="Program Reports" />
      <Allreports reportsdata={reportdata as IReportData[]} />
    </>
  );
};

export default MalawiReportsPage;
