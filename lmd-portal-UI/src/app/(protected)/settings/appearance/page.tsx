import { Metadata } from "next";
import React from "react";
import AppearanceForm from "./AppearanceForm";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Appearance Settings"),
};

const NotificationAppearanceSettingsPage = () => {
  return (
    <>
      <AppearanceForm />
    </>
  );
};

export default NotificationAppearanceSettingsPage;
