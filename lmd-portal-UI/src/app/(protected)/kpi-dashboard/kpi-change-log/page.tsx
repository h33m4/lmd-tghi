import React from "react";

import TableComponent from "./TableComponent";
import { metaObject } from "@/config/site.config";
import KpiTopNavBar from "../components/KpiTopNavBar";

export const metadata = {
  ...metaObject("KPI Dashboard | KPI Change Log"),
};

const KpiChangeLogDashboardPage = () => {
  return (
    <>
      <KpiTopNavBar dashboardName="KPI Change Log" />
      <div className=" border-none border-primary dark:border-border rounded-lg h-full bg-backgroundj">
        {/* <h1 className="text-center text-2xl mt-5">Welcome to KPI Chnage Log</h1> */}
        <TableComponent />
      </div>
      {/* <SupportButton /> */}
    </>
  );
};

export default KpiChangeLogDashboardPage;
