import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "LMD 2.0 - Settings | Integrations",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const SampleCard = () => {
  return (
    <div className="w-full bg-background h-[15rem] border-primary border-[0.5px] rounded-md"></div>
  );
};

const IntegrationsSettingsPage = () => {
  return (
    <>
      <SampleCard />
      <SampleCard />
      <SampleCard />
      <SampleCard />
      <SampleCard />
      <SampleCard />
    </>
  );
};

export default IntegrationsSettingsPage;
