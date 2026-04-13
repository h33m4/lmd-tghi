import DefaultDashboard from "@/components/shared/NoEmbeddedDashboard";
import { metaObject } from "@/config/site.config";
import React from "react";

export const metadata = {
  ...metaObject("Settings | Reports"),
};

const SampleCard = () => {
  return (
    <div className="w-full bg-background h-[15rem] border-primary border-[0.5px] rounded-md"></div>
  );
};

const ReportsSettingsPage = () => {
  return (
    <>
      <div className="h-[80vh] mt-6 border rounded-md flex items-center justify-center">
        <DefaultDashboard
          title="No Report Found "
          message="You have not submitted any report for embedding"
        />
      </div>
    </>
  );
};

export default ReportsSettingsPage;
