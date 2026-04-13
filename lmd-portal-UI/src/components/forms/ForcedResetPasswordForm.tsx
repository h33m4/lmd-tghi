"use client";
import { IButtonStatus } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import EmailInput from "../input/EmailInput";
import PrimaryButton from "../buttons/PrimaryButton";
import Link from "next/link";
import FormError from "./FormError";
import PasswordInput from "../input/PasswordInput";
import ErrorToast from "../toast/ErrorToast";
import { Button } from "../ui/button";
import { handleSignInWithEmail } from "@/lib/actions/auth/handleSignin";

interface ISignInFormData {
  email: string;
  password: string;
  newPassword?: string;
}

const ForcedResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  const [formData, setFormData] = useState<ISignInFormData>({
    email: userEmail!,
    password: "",
    newPassword: "",
  });

  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const [formError, setFormError] = useState<string | undefined>();

  const handleFormSchema = (name: string, value: string) => {
    const newFormValue = { ...formData, [name]: value };
    setFormData(newFormValue);
  };

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(undefined);
    setButtonStatus("loading");

    try {
      // check to ensure new password isnt the same as temp password
      if (formData.password === formData.newPassword) {
        setFormError("New password must be different from temporary password");
        ErrorToast({
          message: "New password can not be the same as temporary password",
        });
        return;
      }
      // reset password and log in
      const response = await handleSignInWithEmail({
        email: formData.email,
        password: formData.password,
        newPassword: formData.newPassword,
        signInType: "AuthChallengeResponse",
      });

      if (response?.error) {
        if (response.error.includes("Incorrect username or password")) {
          setFormError("Temporary password incorrect.");
          ErrorToast({
            title: "Sign-in Error",
            message:
              "Temporary password entered is incorrect, please check your email and try again",
          });
          return;
        }
        setFormError(response.error);
        ErrorToast({
          title: "Sign-in Error",
          message: response.error,
        });
        return;
      }

      if (response?.success && response.redirectTo) {
        // Full page reload so RootLayout re-runs with the real session
        window.location.href = response.redirectTo;
      }
    } catch (error) {
      console.log("error", error);
      setFormError("An unexpected error occurred. Please try again.");
      ErrorToast({
        title: "Error",
        message: "Failed to reset password. Please try again later.",
      });
    } finally {
      setButtonStatus("default");
    }
  };

  return (
    <div className="web-page-constraints flex flex-col justify-center items-center pb-20">
      <div className="form-constraints">
        <div>
          <h1 className="text-pink th-font-black text-2xl md:text-3xl">
            Reset Password
          </h1>
          <p className="text-sm th-font-roman text-th-text-lmh-dark-blue w-full md:mt-1 leading-[1.4rem]">
            Hi <span className="text-primary">{formData.email}</span>, you need
            to reset your password in order to proceed. Kindly enter your
            temporary password and your new password below to reset it.
          </p>
        </div>

        <form
          action=""
          className="flex flex-col   justify-between gap-5 w-full mt-4"
          onSubmit={formSubmitHandler}
        >
          <EmailInput
            onInputChange={(email) => {}}
            labelText="Email"
            name="email"
            placeholderText="Your email"
            isRequired={true}
            value={formData.email}
            disabled={true}
          />

          <PasswordInput
            labelText="Temporary Password"
            placeholderText="Your temporary password"
            name={"new-password"}
            isRequired={true}
            // value={formData.newPassword}
            onInputChange={(password: string) => {
              handleFormSchema("password", password);
            }}
            autoComplete="new-password"
          />

          <PasswordInput
            labelText="New Password"
            placeholderText="Your new password"
            name={"new-password"}
            isRequired={true}
            // value={formData.newPassword}
            onInputChange={(password: string) => {
              handleFormSchema("newPassword", password);
            }}
            autoComplete="new-password"
          />
          <FormError formError={formError!} />

          <div className="flex flex-col mt-4">
            <Button
              variant={"dark-blue"}
              isLoading={buttonStatus === "loading"}
              disabled={buttonStatus === "disabled"}
            >
              {buttonStatus === "loading" ? "Submitting" : "Submit"}
            </Button>
          </div>

          <div className="text-[#A3AED0] text-sm th-font-book text-center -mt-2">
            Already have access?{" "}
            <Link href={"/auth/sign-in"}>
              <span className="th-font-heavy text-lmh-dark-blue hover:underline ml-2">
                Sign in
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForcedResetPasswordForm;
function handleSignIn(arg0: {
  email: string;
  password: string;
  newPassword: string | undefined;
  signInType: string;
}) {
  throw new Error("Function not implemented.");
}
