import React from "react";
import { Metadata } from "next";

import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "LMD 2.0 - Forgot Password",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const ForgotPasswordPage = () => {
  return (
    <>
      <ForgotPasswordForm />
    </>
  );
};

export default ForgotPasswordPage;
