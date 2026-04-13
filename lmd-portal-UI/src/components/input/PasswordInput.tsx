"use client";
import React, { useRef, useState } from "react";

// svg
import EyeIcon from "../../../public/assets/icons/fi_eye.svg";
import EyeOffIcon from "../../../public/assets/icons/fi_eye-off.svg";
import Link from "next/link";

type Props = {
  isRequired?: boolean;
  onInputChange: (value: any) => void;
  labelText?: string;
  placeholderText?: string;
  value?: string | null;
  isWide?: boolean;
  validationRegex?: RegExp;
  disabled?: boolean;
  name?: string;
  showResetPassword?: boolean;
  autoComplete?: string;
};

const PasswordInput = ({
  labelText,
  isRequired,
  disabled,
  placeholderText,
  onInputChange,
  name = "password",
  showResetPassword = false,
  value,
  autoComplete,
}: Props) => {
  //   const inputRef = useRef<HTMLInputElement>(null);
  const [viewPass, setViewPass] = useState(false);

  function inputHandler(inputValue: string) {
    // Validate email with Regex
    if (inputValue) {
      onInputChange(inputValue);
    }
  }
  const isWide: boolean = true;

  return (
    <div className={`w-full flex flex-col gap-[4px]`}>
      <label className="text-grey-dark text-sm md:text-sm th-font-roman flex justify-between ">
        <div className="w-full">
          {labelText}
          {isRequired && (
            <span className="ml-1 text-red-600 th-font-heavy">*</span>
          )}
        </div>
        {showResetPassword && (
          <div className=" w-full text-right">
            <Link href="/auth/forgot-password">
              <p className="text-pink hover:underline-offset-1 hover:underline w-full text-right text-sm mt-0.5">
                Forgot Password?
              </p>
            </Link>
          </div>
        )}
      </label>
      <div className="w-full h-[38px] md:h-[35px] relative">
        <input
          name={name}
          required={isRequired}
          value={value!}
          type={viewPass ? "text" : "password"}
          className={`text-input absolute  ${
            disabled
              ? "bg-[#f7f7f7] cursor-not-allowed"
              : "bg-th-background-surface"
          }`}
          placeholder={placeholderText}
          disabled={disabled}
          onChange={(event) => {
            inputHandler(event.target.value);
          }}
          autoComplete={autoComplete}
        />
        <div className=" absolute h-full boder border-red-500 flex items-center right-2">
          <button
            className="px-1 bg-transparent"
            type="button"
            onClick={() => setViewPass((prev) => !prev)}
          >
            {viewPass ? (
              <EyeIcon width="18" height="18" viewBox="0 0 24 24" />
            ) : (
              <EyeOffIcon width="18" height="18" viewBox="0 0 24 24" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
