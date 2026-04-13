import TopNavBar from "@/components/shared/TopNavBar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "LMD 2.0 - Liberia | ECBIS Reports",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const ECBISReports = () => {
  return (
    <>
      <TopNavBar pageName="ECBIS Reports" country="Liberia" />
      <div className="border  border-primary dark:border-border  h-full bg-background rounded-md flex items-center justify-center">
        <p>ECBIS Reports</p>
      </div>
    </>
  );
};

export default ECBISReports;
