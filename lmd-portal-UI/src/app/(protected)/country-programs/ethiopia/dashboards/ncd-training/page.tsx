import TopNavBar from "@/components/shared/TopNavBar";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "LMD 2.0 - Ethiopia | NCD Dashboard",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

export default async function NCDTrainingDashboard() {
  return (
    <>
      <TopNavBar
        country="Ethiopia"
        pageName="NCD Dashboard"
        capitalizeWords={["NCD"]}
      />
      <EmbedFrame
        title="NCD Training"
        src="https://app.powerbi.com/view?r=eyJrIjoiNzc3MmI1MWEtMDdiZS00YTViLTliM2QtMDE4N2MzNTMyYmIxIiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
    </>
  );
}
