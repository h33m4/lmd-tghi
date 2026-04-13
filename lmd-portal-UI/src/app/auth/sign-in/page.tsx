import React from "react";
import SignInForm from "@/components/forms/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LMD 2.0 - Sign In",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const SignInPage = () => {
  return (
    <>
      <SignInForm />
    </>
  );
};

export default SignInPage;
