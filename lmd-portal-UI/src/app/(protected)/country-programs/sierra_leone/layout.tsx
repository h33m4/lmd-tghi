import React from "react";
import { cookies } from "next/headers";
import CountryPageLayout from "@/components/layouts/country-page/layout";

interface Props {
  children: React.ReactNode;
}

export default async function SierraLeonePageLayout({ children }: Props) {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : false;

  return (
    <CountryPageLayout
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
      country={"Sierra_Leone"}
    >
      {children}
    </CountryPageLayout>
  );
}
