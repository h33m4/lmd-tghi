import DefaultDashboard from "@/components/shared/NoEmbeddedDashboard";
import { metaObject } from "@/config/site.config";
import { Metadata } from "next";
import React from "react";

export const metadata = {
  ...metaObject("Settings | Portal Analytics"),
};

const SampleCard = () => {
  return (
    <div className="w-full bg-background h-[15rem] border-primary border-[0.5px] rounded-md"></div>
  );
};

const PortalAnalyticsSettingsPage = () => {
  return (
    <>
      <div className="h-[82vh] mt-6 border rounded-md flex items-center justify-center">
        {/* <DefaultDashboard
          title="No Portal Analytics Found"
          message="Portal analytics integrations not completed. Please check back later"
        /> */}
        <iframe
          title="LMD Analytics"
          width="100%"
          height="100%"
          className="bg-background rounded-lg"
          // src="https://app.powerbi.com/view?r=eyJrIjoiNzQyNGU5NDktYjBjNi00YWU3LTg0ODgtYzU2OTg5MTM1NGVjIiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
          frameBorder="0"
          src="https://app.powerbi.com/view?r=eyJrIjoiYmVlNzRlNzAtMjg0NS00Nzk1LWIzODctM2U3MWIxN2I0NTRjIiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
};

export default PortalAnalyticsSettingsPage;
