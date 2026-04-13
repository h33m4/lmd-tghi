"use client";
import { IButtonStatus } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import EmailInput from "../input/EmailInput";
import PrimaryButton from "../buttons/PrimaryButton";
import Link from "next/link";
import { handleSendResetToken } from "@/lib/actions";
import FormError from "./FormError";
import SuccessToast from "../toast/SuccessToast";
import { Button } from "../ui/button";
import handleSendResetPasswordToken from "@/lib/actions/auth/handleSendResetPasswordToken";
import { toast } from "sonner";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");
  const [email, setEmail] = useState<string | undefined>(
    userEmail ? userEmail : ""
  );
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("disabled");
  const [formError, setFormError] = useState<string | undefined>();

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setFormError(undefined);
    setButtonStatus("loading");

    // send reset token
    handleSendResetPasswordToken(email)
      .then((res) => {
        console.log("res", res);
        if (res?.error) {
          setFormError(res.error);
          toast.error(res.error);
          return;
        }

        if (res?.success) {
          SuccessToast({
            title: "Success",
            message: res.success,
            duration: 6000,
          });
          router.push(`/auth/reset-password?email=${email}`);
        }
        // setFormError("Recovery code sent to " + email);
        // SuccessToast({
        //   title: "Success",
        //   message: `Reset code successfully sent to ${email}`,
        //   duration: 6000,
        // });
        // router.push(`/auth/reset-password?email=${email}`);
      })
      .catch(() => {})
      .finally(() => {
        setButtonStatus("default");
      });
  };

  useEffect(() => {
    if (email && email.length > 2) {
      setButtonStatus("default");
    } else {
      setButtonStatus("disabled");
    }
  }, [email]);

  return (
    <div className="web-page-constraints flex flex-col justify-center items-center pb-20">
      <div className="form-constraints">
        <div>
          <h1 className="text-pink th-font-black text-2xl md:text-3xl">
            Confirm Email
          </h1>
          <p className="text-sm th-font-roman text-th-text-lmh-dark-blue w-full md:mt-1 leading-[1.4rem]">
            Please enter the email associated with your account and we will send
            you a detailed instruction to reset your password.
          </p>
        </div>

        <form
          action=""
          className="flex flex-col   justify-between gap-5 w-full mt-4"
          onSubmit={formSubmitHandler}
        >
          <EmailInput
            onInputChange={(email) => {
              setEmail(email);
            }}
            labelText="Email"
            name="email"
            placeholderText="Your email"
            isRequired={true}
            value={email}
          />
          <FormError formError={formError!} />

          <div className="flex flex-col mt-4">
            <Button
              type={"submit"}
              variant={"dark-blue"}
              isLoading={buttonStatus === "loading"}
              disabled={buttonStatus === "disabled"}
            >
              {buttonStatus === "loading"
                ? "Sending Reset Token"
                : "Send Reset Token"}
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

export default ForgotPasswordForm;
