import React from "react";
import KpiTopNavBar from "../components/KpiTopNavBar";
import SupportButton from "../components/SupportButton";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("KPI Dashboard | Malawi"),
};

const Page = () => {
  return (
    <>
      <KpiTopNavBar dashboardName={"Malawi"} />
      <EmbedFrame
        title="Malawi KPI Dashboard"
        src="https://app.powerbi.com/view?r=eyJrIjoiZDUxNmM3ZjQtZDBlZC00MjhjLWJlMWMtMWVjM2U2Y2M1NTBmIiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
      <SupportButton />
    </>
  );
};
export default Page;
