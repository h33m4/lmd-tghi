"use client";
import React, { useState } from "react";
import PasswordInput from "../input/PasswordInput";
import PrimaryButton from "../buttons/PrimaryButton";
import Link from "next/link";
import SocialMediaLoginButton from "../buttons/SocialMediaLoginbutton";
import { IButtonStatus } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import EmailInput from "../input/EmailInput";

import FormError from "./FormError";
import ErrorToast from "../toast/ErrorToast";
import { ApiSimulator } from "@/utils/helper_functions";
import { Button } from "../ui/button";
import { signIn } from "@/auth";
import {
  handleSignInWithEmail,
  handleSignInWithGoogle1,
  handleSignInWithGoogle2,
} from "@/lib/actions/auth/handleSignin";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { toast } from "sonner";
import { gtm_trackLogin } from "../analytics/gtm_functions";

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [rememberMe, setRememberMe] = useState(false);
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const [emailInputStatus, setEmailInputStatus] = useState<
    "disabled" | "active"
  >("active");
  const [canNowEnterPassword, setCanNowEnterPassword] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();

  const [formSchema, setFormSchema] = useState({
    email: "",
    password: "",
  });

  const handleFormSchema = (name: string, value: string) => {
    const newFormValue = { ...formSchema, [name]: value };
    setFormSchema(newFormValue);
  };

  const signInHandler = async () => {
    try {
      setButtonStatus("loading");
      setFormError(undefined);

      // Handle email-only check
      if (formSchema.email !== "" && formSchema.password === "") {
        try {
          await ApiSimulator(true, 150);
          setEmailInputStatus("disabled");
          setCanNowEnterPassword(true);
          setButtonStatus("default");
          return;
        } catch (error) {
          setFormError("Email cannot be found, please check and try again");
          setCanNowEnterPassword(false);
          setButtonStatus("default");
          return;
        }
      }

      if (formSchema.password === "") return;

      // Handle full sign-inh
      const response = await handleSignInWithEmail(
        {
          email: formSchema.email,
          password: formSchema.password,
        },
        callbackUrl
      );

      if (response?.error) {
        if (response.error.includes("NEW_PASSWORD_REQUIRED")) {
          toast.error("You need to reset your password");
          return router.push(
            `/auth/forced-resetpassword?email=${formSchema.email}`
          );
        }
        toast.error(response.error);
        setFormError(response.error);
        return;
      }

      if (response?.success && response.redirectTo) {
        if (typeof window !== "undefined") {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "lmd_login",
            user_id: formSchema.email,
            user_email: formSchema.email,
            method: "password",
          });
        }
        gtm_trackLogin({
          user_id: "",
          user_email: formSchema.email,
          method: "password",
        });
        // Full page reload so RootLayout re-runs on the server and SessionProvider
        // is initialised with the real session — prevents the stale-session bug
        // that occurs when using client-side navigation after credentials sign-in.
        window.location.href = response.redirectTo;
        return;
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setFormError("An unexpected error occurred");
      ErrorToast({
        message: "Something went wrong during sign in",
      });
    } finally {
      setButtonStatus("default");
    }
  };

  const resetForm = () => {
    setButtonStatus("default");
    setFormError(undefined);
    setFormSchema({ email: "", password: "" });
    setCanNowEnterPassword(false);
    setEmailInputStatus("active");
  };

  const signInWithGoogleHandler = async () => {
    await handleSignInWithGoogle1(callbackUrl);

    if (typeof window !== undefined) {
      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: "lmd_login",
        user_id: "google user",
        user_email: "",
        method: "google",
      });
    }
    gtm_trackLogin({
      user_id: "google user",
      user_email: "",
      method: "google",
    });
    // const { url, error } = await handleSignInWithGoogle(callbackUrl);

    // if (error) {
    //   console.log("Error", error);
    // }
    // if (url) {
    //   console.log("url here", url);
    //   window.location.href = url;
    // }
  };

  return (
    <div className="web-page-constraints flex flex-col justify-center items-center pb-20">
      <div className="form-constraints">
        <div>
          <h1 className="text-pink th-font-black text-2xl md:text-3xl">
            Sign in
          </h1>
          <h1 className="text-base th-font-roman text-th-text-lmh-dark-blue md:mt-1">
            Welcome back, sign in below to continue!
          </h1>
        </div>

        <form
          className="flex flex-col justify-between gap-4 w-full mt-4"
          action={""}
          method={"POST"}
          onSubmit={(e) => {
            e.preventDefault();
            signInHandler();
          }}
        >
          {/* email input text field */}
          <EmailInput
            labelText="Work Email"
            name={"email"}
            // value={formSchema.email}
            placeholderText="Your work email"
            isRequired={true}
            onInputChange={(email) => {
              handleFormSchema("email", email);
            }}
            disabled={emailInputStatus === "disabled"}
            resetEmailHandler={() => {
              resetForm();
            }}
            resetText={
              canNowEnterPassword ? "Use a different email?" : undefined
            }
          />

          {/* password input field */}
          {canNowEnterPassword && (
            <div className="flex-1">
              <PasswordInput
                labelText="Password"
                placeholderText="Your password"
                name={"password"}
                isRequired={true}
                // value={formSchema.password}
                showResetPassword
                autoComplete={"current-password"}
                onInputChange={(password) => {
                  handleFormSchema("password", password);
                }}
              />
            </div>
          )}

          {/* error */}
          <FormError formError={formError!} />

          {/* button */}
          <div className="flex flex-col mt-2">
            <Button
              type={"submit"}
              variant={"dark-blue"}
              isLoading={buttonStatus === "loading"}
              disabled={buttonStatus === "disabled"}
            >
              {canNowEnterPassword ? "Sign In" : "Continue"}
            </Button>
          </div>

          <div className="flex items-center justify-center my-2 gap-2">
            <hr className="h-[1px] w-full" />
            <p className="text-sm th-font-light">or</p>
            <hr className="h-[1px] w-full" />
          </div>

          {/* social media sign in button */}
          <div className=" flex flex-col">
            <SocialMediaLoginButton
              title="Login with Google"
              onClicked={signInWithGoogleHandler}
            />
          </div>

          <div className="flex flex-col">
            <div className="text-[#A3AED0] text-sm th-font-book mt-2 text-center">
              Don&lsquo;t have access?{" "}
              <Link href={"/auth/request-access"}>
                <span className="th-font-heavy text-lmh-dark-blue hover:underline ml-2">
                  Request Access
                </span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
