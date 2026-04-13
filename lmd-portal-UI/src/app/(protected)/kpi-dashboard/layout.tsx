import React from "react";
import { cookies } from "next/headers";
import KPIDashboardLayout from "@/components/layouts/kpi-dashboard/layout";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");
  const defaultLayout = layout ? JSON.parse(layout.value) : [15, 85];
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : false;

  return (
    <>
      <KPIDashboardLayout
        // defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
      >
        {children}
      </KPIDashboardLayout>
    </>
  );
}
