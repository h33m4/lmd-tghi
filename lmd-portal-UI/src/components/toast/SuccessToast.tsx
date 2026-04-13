import React, { useState } from "react";
import toast from "react-hot-toast";
import CloseIcon from "../../../public/assets/icons/close.svg";
import ToastSuccessIcon from "../../../public/assets/icons/toast_success.svg";

type Props = {
  isLoading?: boolean;
  retryAction?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  title?: string;
  message: string;
  duration?: number;
};

function SuccessToast({
  isLoading = false,
  retryAction,
  message,
  title = "Success",
  duration = 4000,
}: Props) {
  function delayFunc() {
    setTimeout(() => {
      return true;
    }, 300);
  }

  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible
            ? "delay-300 opacity-100 scale-100 "
            : "opacity-0 scale-95 delay-0"
        } max-w-md w-full bg-[#f7f8fc] shadow-lg transition-all duration-200
          rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#dcfce7] sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-base th-font-heavy text-lmh-green">{title}</p>
              <p className="mt-1 text-sm  th-font-roman  text-lmh-dark-blue">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center pr-4">
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            type="button"
            className="flex flex-col justify-center items-center w-7 h-7 
              rounded-full bg-background border-[0.5px] border-border"
          >
            <CloseIcon
              width="7"
              height="7"
              viewBox="0 0 7 7"
              className="default-icon"
            />
          </button>
        </div>
      </div>
    ),
    {
      duration: duration,
    }
  );
}

export default SuccessToast;
