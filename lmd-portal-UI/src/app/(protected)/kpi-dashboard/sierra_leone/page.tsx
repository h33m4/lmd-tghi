import React from "react";
import KpiTopNavBar from "../components/KpiTopNavBar";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("KPI Dashboard | Sierra Leone"),
};

const KPISierraLeoneDashboardPage = () => {
  return (
    <>
      <KpiTopNavBar dashboardName="Sierra Leone" />
      <EmbedFrame
        title="Sierra Leone KPI Dashboard"
        src="https://app.powerbi.com/view?r=eyJrIjoiMzNmMjM1OTItNWRiMS00ZmI0LTkzNTMtZWUxY2FiODM3OTA4IiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
    </>
  );
};

export default KPISierraLeoneDashboardPage;
