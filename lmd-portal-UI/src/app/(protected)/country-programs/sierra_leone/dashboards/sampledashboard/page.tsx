import DefaultDashboard from "@/components/shared/NoEmbeddedDashboard";
import TopNavBar from "@/components/shared/TopNavBar";
import Spinner from "@/components/ui/spinner";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "LMD 2.0 - Sierra Leone | Sample Dashboard",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

export default async function SampleDashboard() {
  return (
    <>
      <TopNavBar country="Sierra Leone" pageName="Sample dashboard" />
      <div className="border  border-primary dark:border-border  h-full bg-background rounded-md flex items-center justify-center">
        <DefaultDashboard />
      </div>
    </>
  );
}
