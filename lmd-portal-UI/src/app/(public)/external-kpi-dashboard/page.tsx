import { metaObject } from "@/config/site.config";
import React from "react";

export const metadata = {
  ...metaObject("External KPI Dashboard"),
};

export default function Page() {
  return (
    <div className="border-none border-red-500 w-full h-[calc(100vh-80px)] 2xl:h-[calc(100vh-90px)] flex flex-col overflow-auto  ">
      <iframe
        title="external_kpi_dashboard"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/view?r=eyJrIjoiODc5MDgyN2MtZjMwNC00N2EwLThhNGYtNmU0ZTkwMWExOGUyIiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
}
