import TopNavBar from "@/components/shared/TopNavBar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "LMD 2.0 - Liberia | NCHAP Dashboard",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const NCAPScaleDashboard = () => {
  return (
    <>
      <TopNavBar pageName="NCHAP Dashboard" country="Liberia" />
      <div className="border  border-primary dark:border-border  h-full bg-background rounded-md flex items-center justify-center">
        <p>nchpa scale dashboard</p>
      </div>
    </>
  );
};

export default NCAPScaleDashboard;
