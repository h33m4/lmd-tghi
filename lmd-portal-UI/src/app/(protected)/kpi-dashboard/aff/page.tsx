import React from "react";
import KpiTopNavBar from "../components/KpiTopNavBar";
import SupportButton from "../components/SupportButton";
import DefaultDashboard from "@/components/shared/NoEmbeddedDashboard";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("KPI Dashboard | AFF"),
};

const KPIAffDashboardPage = () => {
  return (
    <>
      <KpiTopNavBar dashboardName="Africa Frontline First" />
      <div className=" border border-primary dark:border-border rounded-lg h-full bg-background">
        {/* <h1 className="text-center text-2xl mt-5 h-full flex items-center justify-center text-muted-foreground">
          AFF Dashboard
        </h1> */}
        <DefaultDashboard />
      </div>
      <SupportButton />
    </>
  );
};

export default KPIAffDashboardPage;
