import React from "react";
import KpiTopNavBar from "../components/KpiTopNavBar";
import SupportButton from "../components/SupportButton";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("KPI Dashboard | KPI Progress Summary"),
};

const KPIProgressPage = () => {
  return (
    <>
      <KpiTopNavBar dashboardName="LMH's KPI & Targets for the Closing the Distance Strategy (FY24-28)" />
      <EmbedFrame
        title="KPI Progress Summary Dashboard"
        src="https://app.powerbi.com/view?r=eyJrIjoiNmJiMjdjOTItYjE4NS00OGI3LTg5ZWMtZmFkMDBmODNlOWVmIiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
      <SupportButton />
    </>
  );
};

export default KPIProgressPage;
