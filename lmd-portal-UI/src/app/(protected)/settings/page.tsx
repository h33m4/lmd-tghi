import ProfileCard from "@/components/settings/ProfileCard";
import { metaObject } from "@/config/site.config";
import { Metadata } from "next";
import React from "react";

export const metadata = {
  ...metaObject("Settings "),
};

const SettingsPage = () => {
  return (
    <>
      <ProfileCard />
    </>
  );
};

export default SettingsPage;
