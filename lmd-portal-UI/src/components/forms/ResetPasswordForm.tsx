"use client";
import { IButtonStatus, IResetPassordFormData } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import PasswordInput from "../input/PasswordInput";
import { handleSendResetToken } from "@/lib/actions";
import FormError from "./FormError";
import TextInput from "../input/TextInput";

import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";
import { formatTime, getErrorMessage } from "@/utils/helper_functions";
import { Button } from "../ui/button";
import handleConfirmForgotPassword, {
  IConfirmForgotPasswordRequestData,
} from "@/lib/actions/auth/handleConfirmForgotPassword";

import handleSendResetPasswordToken from "@/lib/actions/auth/handleSendResetPasswordToken";
import ErrorBanner from "../ui/banner/ErrorBanner";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");
  const [formError, setFormError] = useState<string | undefined>();

  const [formData, setFormData] = useState<IConfirmForgotPasswordRequestData>({
    confirmationCode: "",
    newPassword: "",
    confirmNewPassword: "",
    username: userEmail!,
  });

  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("disabled");

  // recovery code states
  const [countdown, setCountdown] = useState(120); // 120 seconds = 2 minutes
  const [canRequestCode, setCanRequestCode] = useState(true);

  const handleFormSchema = (name: string, value: string) => {
    const newFormValue = { ...formData, [name]: value };
    setFormData(newFormValue);
  };

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(undefined);
    if (!userEmail) return;
    console.log(formData);
    if (formData.newPassword !== formData.confirmNewPassword) {
      return setFormError("Confirm password does not match");
    }

    setButtonStatus("loading");
    const reponse = await handleConfirmForgotPassword(formData);
    if (reponse.error) {
      setFormError(reponse.error);
      ErrorToast({ message: reponse.error });
    }
    if (reponse.success) {
      console.log("success", reponse.success);
      SuccessToast({ message: reponse.success });
      router.push("/auth/sign-in");
    }

    setButtonStatus("default");
  };

  const handleRequestCode = async () => {
    // Reset the countdown and disable the button
    await handleSendResetPasswordToken(userEmail!).then((response) => {
      SuccessToast({
        title: "Success",
        message: `Recovery code successfully sent to ${userEmail}`,
      });
    });
    setCountdown(120);
    setCanRequestCode(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      setCanRequestCode(true);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    setFormError(undefined);
  }, [formData]);

  return (
    <div className="web-page-constraints flex flex-col justify-center items-center pb-20">
      <div className="form-constraints">
        <div>
          <h1 className="text-pink th-font-black text-2xl md:text-3xl">
            Reset Password
          </h1>
          <p className="text-sm th-font-roman text-th-text-lmh-dark-blue w-full md:mt-1 leading-[1.4rem]">
            Hi <span className="text-primary">{userEmail}</span>, Kindly check
            your email for the recovery code and enter it together with your new
            password.
          </p>
        </div>

        <form
          action=""
          className="flex flex-col   justify-between gap-5 w-full mt-4"
          onSubmit={formSubmitHandler}
        >
          <ErrorBanner message={formError} setFormError={setFormError} />
          <TextInput
            labelText="Recovery Code"
            placeholderText={"Recovery Code"}
            isRequired={true}
            name="recovery code"
            // value={formData.confirmationCode}
            onInputChange={(recoverCode) => {
              handleFormSchema("confirmationCode", recoverCode);
            }}
          />

          <PasswordInput
            labelText="New Password"
            placeholderText="Your password"
            name={"new-password"}
            isRequired={true}
            // value={formData.newPassword}
            onInputChange={(password: string) => {
              handleFormSchema("newPassword", password);
            }}
            autoComplete="new-password"
          />

          <PasswordInput
            labelText="Confirm New Password"
            placeholderText="Confirm New password"
            name={"new-password"}
            isRequired={true}
            // value={formData.confirmNewPassword}
            onInputChange={(password: string) => {
              handleFormSchema("confirmNewPassword", password);
            }}
            autoComplete="new-password"
          />

          {/* error */}
          <FormError formError={formError!} />

          <div className="text-center text-sm -mb-4 mt-2 text-th-text-lmh-dark-blue">
            <p>Haven&lsquo;t received recovery code?</p>
            <button
              className="hover:underline hover:underline-offset-2 hover:decoration-primary hover:th-font-black"
              onClick={handleRequestCode}
              disabled={!canRequestCode}
              type={"button"}
            >
              Request new code{" "}
              <span className="text-primary">
                {canRequestCode ? "" : `(${formatTime(countdown)}s)`}
              </span>
            </button>
          </div>

          <div className="flex flex-col mt-4">
            <Button
              isLoading={buttonStatus === "loading"}
              type={"submit"}
              variant={"dark-blue"}
            >
              {buttonStatus === "loading" ? (
                <>Resetting Password</>
              ) : (
                <>Reset Password</>
              )}
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

export default ResetPasswordForm;
