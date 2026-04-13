import TopNavBar from "@/components/shared/TopNavBar";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { metaObject } from "@/config/site.config";
import React from "react";

export const metadata = {
  ...metaObject("Sierra Leone | EGH Training Dashboard"),
};

const NationalCHWTrainingDashboard = () => {
  return (
    <>
      <TopNavBar pageName="EGH Training Dashboard" country="Sierra Leone" />
      <EmbedFrame
        title="SL EGH Training"
        src="https://app.powerbi.com/view?r=eyJrIjoiZTU4NDUzOTktNzliOS00NDIwLWJmYjItNzczMWQxMGJmNzNhIiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
    </>
  );
};

export default NationalCHWTrainingDashboard;
