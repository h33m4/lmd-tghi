"use client";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import FormError from "@/components/forms/FormError";
import PasswordInput from "@/components/input/PasswordInput";
import ErrorBanner from "@/components/ui/banner/ErrorBanner";
import InfoBanner from "@/components/ui/banner/InfoBanner";
import { Button } from "@/components/ui/button";
import handleAuthResetPassword, {
  ISignedInUserResetPasswordData,
} from "@/lib/actions/auth/handleAuthResetPassword";
import handleSignOut from "@/lib/actions/auth/handleSignOut";
import { IButtonStatus } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner";

const PasswordResetForm = () => {
  const [formData, setFormData] = useState<ISignedInUserResetPasswordData>();
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const [formError, setFormError] = useState<string | undefined>();

  const handleFormDataChange = (
    name: "currentPassword" | "newPassword" | "confirmPassword",
    value: string
  ) => {
    const newFormValue = {
      ...formData,
      [name]: value,
    } as ISignedInUserResetPasswordData;
    setFormData(newFormValue);
  };

  const onFormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(undefined);
    setButtonStatus("loading");
    if (!formData) return;
    if (formData.confirmPassword != formData.newPassword) {
      toast.error("Confirm password do not match");
      setFormError("Confirm password do not match");
      setButtonStatus("default");
      return;
    }

    // server action
    handleAuthResetPassword(formData)
      .then((response) => {
        if (response?.error) {
          // ErrorToast({ message: response.error });
          setFormError(response.error);
          toast.error(response.error || "Error resetting password");
        } else if (response.success) {
          // SuccessToast({ message: response.success });
          toast.success(response.success || "Password reset successfully");
          handleSignOut();
        }
      })
      .catch((err) => {})
      .finally(() => {
        setButtonStatus("default");
      });
  };

  return (
    <>
      <div className="mt-5">
        <InfoBanner
          setFormInfo={() => {}}
          title="Quick Notice"
          description="If you log in using a password, you can update it at any time here. However, if you log in via a social Identity Provider (e.g., Google), password changes must be managed through your IDP settings. Please consider opening a support ticket if you require any help"
          className="mb-4"
        />
        <div className="border-b border-border mb-8 pb-2 pt-4">
          <h1 className="text-2xl th-font-roman mb-2">Password Reset</h1>
          <p className="text-sm">
            Please enter your current and new passwords to initiate the password
            reset process.
          </p>
        </div>
        <div className="mt-6 flex ">
          <form
            className="w-full lg:w-2/3 xl:w-1/2 flex flex-col gap-4"
            onSubmit={(e) => onFormSubmitHandler(e)}
          >
            {/* error component */}
            <ErrorBanner message={formError} setFormError={setFormError} />
            <PasswordInput
              onInputChange={(value) =>
                handleFormDataChange("currentPassword", value)
              }
              labelText="Current Password"
              name="current-password"
              autoComplete="current-password"
              isRequired
            />

            <PasswordInput
              onInputChange={(value) =>
                handleFormDataChange("newPassword", value)
              }
              labelText="New Password"
              name="new-password"
              autoComplete="new-password"
              isRequired
            />

            <PasswordInput
              onInputChange={(value) =>
                handleFormDataChange("confirmPassword", value)
              }
              labelText="Confirm New Password"
              name="new-password"
              autoComplete="new-password"
              isRequired
            />
            {formError && <FormError formError={formError} />}

            <div>
              <Button
                variant={"dark-blue"}
                title="Submit"
                className="mt-6 w-full"
                type="submit"
                isLoading={buttonStatus === "loading"}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordResetForm;
