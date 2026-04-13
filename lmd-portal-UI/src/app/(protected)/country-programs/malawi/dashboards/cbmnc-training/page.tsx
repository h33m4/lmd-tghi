import DefaultDashboard from "@/components/shared/NoEmbeddedDashboard";
import TopNavBar from "@/components/shared/TopNavBar";
import { Metadata } from "next";
import React from "react";
// import EmbeddedDashboard from "./EmbeddedDashboard";

export const metadata: Metadata = {
  title: "LMD 2.0 - Malawi | CBMNC Training Dashboard",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const CBMNCTrainingDashboard = () => {
  return (
    <>
      <TopNavBar pageName="CBMNC Training Dashboard" country="Malawi" />
      <div className="border  border-primary dark:border-border  h-full bg-background rounded-md flex items-center justify-center">
        <DefaultDashboard />
      </div>
    </>
  );
};

export default CBMNCTrainingDashboard;
