import React from "react";
import KpiTopNavBar from "../components/KpiTopNavBar";
import SupportButton from "../components/SupportButton";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("KPI Dashboard | Ethiopia"),
};

async function KPIEthiopiaDashboardPage() {
  return (
    <>
      <KpiTopNavBar dashboardName="Ethiopia" />
      <EmbedFrame
        title="Ethiopia KPI Dashboard"
        src="https://app.powerbi.com/view?r=eyJrIjoiYzZjZmRkMmItODM5OS00Nzc4LWFhZTktNDQ1MmI4YjdiNzFkIiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
      <SupportButton />
    </>
  );
}

export default KPIEthiopiaDashboardPage;
