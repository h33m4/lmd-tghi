import TopNavBar from "@/components/shared/TopNavBar";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { metaObject } from "@/config/site.config";
import React from "react";

export const metadata = {
  ...metaObject("Malawi | ICHIS Training Dashboard"),
};

const ICHISTrainingDashboard = () => {
  return (
    <>
      <TopNavBar pageName="ICHIS Training Dashboard" country="Malawi" />
      <EmbedFrame
        title="iCHIS Training"
        src="https://app.powerbi.com/view?r=eyJrIjoiNmNlYzA2MDUtM2RkOC00ZjZjLTg0OGUtYjA3YWYzMWVkNTA2IiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
    </>
  );
};

export default ICHISTrainingDashboard;
