"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import PrimaryButton from "../buttons/PrimaryButton";

import TextInput from "../input/TextInput";
import EmailInput from "../input/EmailInput";
import TextBoxInput from "../input/TextBoxInput";
import { IButtonStatus } from "@/types";
import Link from "next/link";
import { ApiSimulator } from "@/utils/helper_functions";
import { Button } from "../ui/button";

const RequestAccessForm = () => {
  const router = useRouter();
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");

  // Form data state
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    reason: "",
  });

  // Handle input changes
  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const requestSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Log form data to console
    console.log("Form Data Submitted:", formData);

    setButtonStatus("loading");
    await ApiSimulator(true)
      .then(() => {
        // Success request
        console.log("Form submission successful!");
        setButtonStatus("default"); // Reset to allow resubmission
        // Optional: Clear form after submission
        // setFormData({ fullname: "", email: "", reason: "" });

        // Uncomment below to redirect after submission
        // setButtonStatus("disabled");
        // router.push("/auth/sign-in");
      })
      .catch((error) => {
        console.error("Form submission failed:", error);
        setButtonStatus("default");
      })
      .finally(() => {
        // Additional cleanup if needed
      });
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
