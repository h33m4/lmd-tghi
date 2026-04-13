import TopNavBar from "@/components/shared/TopNavBar";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "LMD 2.0 - Ethiopia | Blended IRT Dashboard",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

export default async function ICHISDashboard() {
  return (
    <>
      <TopNavBar
        country="Ethiopia"
        pageName="Blended IRT Dashboard"
        capitalizeWords={["IRT"]}
      />
      <EmbedFrame
        title="Blended IRT Training"
        src="https://app.powerbi.com/view?r=eyJrIjoiNzc3MmI1MWEtMDdiZS00YTViLTliM2QtMDE4N2MzNTMyYmIxIiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
    </>
  );
}
