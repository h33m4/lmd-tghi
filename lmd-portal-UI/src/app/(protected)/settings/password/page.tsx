import React from "react";
import PasswordResetForm from "./PasswordResetForm";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Settings | Change Password"),
};

const PasswordSettingsPage = () => {
  return <PasswordResetForm />;
};

export default PasswordSettingsPage;
