import React from "react";
import { Metadata } from "next";

import ForcedResetPasswordForm from "@/components/forms/ForcedResetPasswordForm";

export const metadata: Metadata = {
  title: "LMD 2.0 - Forced Reset Password",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const ForgotPasswordPage = () => {
  return (
    <>
      <ForcedResetPasswordForm />
    </>
  );
};

export default ForgotPasswordPage;
