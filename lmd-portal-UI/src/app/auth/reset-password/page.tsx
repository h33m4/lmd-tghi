import React from "react";
import { Metadata } from "next";

import ResetPasswordForm from "@/components/forms/ResetPasswordForm";

export const metadata: Metadata = {
  title: "LMD 2.0 - Reset Password",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const ResetPasswordPage = () => {
  return (
    <>
      <ResetPasswordForm />
    </>
  );
};

export default ResetPasswordPage;
