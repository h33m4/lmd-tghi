import DefaultDashboard from "@/components/shared/NoEmbeddedDashboard";
import TopNavBar from "@/components/shared/TopNavBar";
import Spinner from "@/components/ui/spinner";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "LMD 2.0 - Ethiopia | Program Maps",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

export default async function Maps() {
  return (
    <>
      <TopNavBar country="Ethiopia" pageName="Program Maps" />
      <div className="border  border-primary dark:border-border  h-full bg-background rounded-md flex items-center justify-center">
        <DefaultDashboard />
      </div>
    </>
  );
}
