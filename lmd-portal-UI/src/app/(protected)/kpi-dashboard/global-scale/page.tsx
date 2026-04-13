import React from "react";
import KpiTopNavBar from "../components/KpiTopNavBar";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("KPI Dashboard | Global Scale"),
};

const KPIGlobalScalePage = () => {
  return (
    <>
      <KpiTopNavBar dashboardName="KPI Global Scale dashboard" />
      <EmbedFrame
        title="Global Scale KPI Dashboard"
        src="https://app.powerbi.com/view?r=eyJrIjoiOTBjZmI5ZmQtYzBlYi00MWVjLWIyNDctMDA4MGIzM2QzNDk4IiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
    </>
  );
};

export default KPIGlobalScalePage;
