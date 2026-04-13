import TopNavBar from "@/components/shared/TopNavBar";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { metaObject } from "@/config/site.config";
import React from "react";

export const metadata = {
  ...metaObject(
    "Sierra Leone | National pre-service Training for CHWs Dashboard"
  ),
};

const NationalCHWTrainingDashboard = () => {
  return (
    <>
      <TopNavBar
        pageName="National Pre-service Training for CHWs Dashboard"
        country="Sierra Leone"
      />
      <EmbedFrame
        title="National Pre-service Training for CHWs"
        src="https://app.powerbi.com/view?r=eyJrIjoiMDNkMjU5ZGMtODg5OS00YmQ3LWE3ODYtNGFlMWY0YzFmN2U3IiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
    </>
  );
};

export default NationalCHWTrainingDashboard;
