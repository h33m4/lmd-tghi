import React from "react";
import Toolbar from "./_components/toolbar";
import { metaObject } from "@/config/site.config";
import KpiTopNavBar from "../components/KpiTopNavBar";

interface Props {
  children: React.ReactNode;
}

export const metadata = {
  ...metaObject("KPI Dashboard | KPI Data Table"),
};

export default function KpiDataTableLayout({ children }: Props) {
  return (
    <>
      <KpiTopNavBar dashboardName="Data Tables" />

      <Toolbar />
      <div className="mt-2 border-green-400 w-full h-full relative">
        {children}
      </div>
      {/* <SupportButton /> */}
    </>
  );
}
