import React from "react";
import KpiTopNavBar from "../components/KpiTopNavBar";
import SupportButton from "../components/SupportButton";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("KPI Dashboard | Liberia"),
};

const Page = () => {
  return (
    <>
      <KpiTopNavBar dashboardName={"Liberia"} />
      <EmbedFrame
        title="Liberia KPI Dashboard"
        src="https://app.powerbi.com/view?r=eyJrIjoiNzQyNGU5NDktYjBjNi00YWU3LTg0ODgtYzU2OTg5MTM1NGVjIiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
      <SupportButton />
    </>
  );
};
export default Page;
