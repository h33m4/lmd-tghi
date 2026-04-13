"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import TextInput from "../input/TextInput";
import EmailInput from "../input/EmailInput";
import TextBoxInput from "../input/TextBoxInput";
import { IButtonStatus } from "@/types";
import Link from "next/link";
import { Button } from "../ui/button";
import Banner from "../ui/banner/banner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const RequestAccessForm = () => {
  const router = useRouter();
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const [submitError, setSubmitError] = useState<string>();
  const [submitSuccess, setSubmitSuccess] = useState<string>();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    reason: "",
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (submitError) setSubmitError(undefined);
  };

  const requestSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // recapture
    if (!executeRecaptcha) {
      setSubmitError("reCAPTCHA not loaded");
      return;
    }

    // Basic validation
    if (!formData.fullname.trim() || !formData.email.trim()) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setButtonStatus("loading");
    setSubmitError(undefined);
    setSubmitSuccess(undefined);

    try {
      // get token
      const captchaToken = await executeRecaptcha("request_access");

      const requestData = {
        ...formData,
        requestedOn: new Date().toISOString(),
        captchaToken, //just added this for ecpature
      };

      // Call the API endpoint
      const response = await fetch("/api/slack/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request");
      }

      // Show success or redirect
      // router.push("/auth/request-success");
      setSubmitSuccess(
        "Requests successfully submitted. Check your email for a response within the next 24 hours",
      );
      setButtonStatus("disabled");
    } catch (error: any) {
      setSubmitError(
        error.message || "Failed to submit request. Please try again later.",
      );
      setButtonStatus("default");
    }
  };

  return (
    <div className="web-page-constraints flex flex-col justify-center items-center pb-20">
      <div className="form-constraints ">
        <div>
          <h1 className="text-pink th-font-black text-2xl md:text-3xl">
            Request Access
          </h1>
          <h1 className="text-base th-font-roman text-th-text-lmh-dark-blue md:mt-1">
            Fill the form below to request an access!
          </h1>
        </div>

        {/* <Banner variant="info" title="test" description="test" /> */}

        <Banner variant="error" title="Error" description={submitError} />

        <Banner
          variant={"success"}
          title="Success"
          description={submitSuccess}
        />

        <form
          className="flex flex-col justify-between gap-5 w-full mt-4"
          onSubmit={requestSubmitHandler}
        >
          <TextInput
            labelText="Full Name"
            name="fullname"
            placeholderText="Your fullname"
            onInputChange={(value) => handleInputChange("fullname", value)}
            isRequired={true}
            value={formData.fullname}
          />

          <EmailInput
            labelText="Email"
            name="email"
            placeholderText="Your email"
            onInputChange={(value) => handleInputChange("email", value)}
            isRequired={true}
            value={formData.email}
          />

          <TextBoxInput
            labelText="Reason"
            name="reason"
            placeholderText="Any note to aid your request?"
            onInputChange={(value) => handleInputChange("reason", value)}
            isRequired={false}
            value={formData.reason}
          />

          <div className="flex flex-col mt-3">
            <Button
              title="Request Access"
              type={"submit"}
              variant={"dark-blue"}
              isLoading={buttonStatus === "loading"}
              disabled={buttonStatus === "disabled"}
            >
              {buttonStatus === "loading"
                ? "Requesting Access"
                : "Request Access"}
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

export default RequestAccessForm;
