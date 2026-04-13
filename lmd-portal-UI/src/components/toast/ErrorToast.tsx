import React, { useState } from "react";
import toast from "react-hot-toast";
import CloseIcon from "../../../public/assets/icons/close.svg";
import ToastErrorIcon from "../../../public/assets/icons/toast_error.svg";

type Props = {
  isLoading?: boolean;
  retryAction?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  title?: string;
  message: string;
  duration?: number;
};

function ErrorToast({
  isLoading = false,
  retryAction,
  message,
  title = "Error",
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
        } max-w-md w-full bg-background shadow-lg transition-all duration-200
rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-destructive`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-base th-font-heavy text-red-500 ">{title}</p>
              <p className="mt-1 text-sm  th-font-roman text-th-text-lmh-dark-blue ">
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
rounded-full bg-background border-[0.5px] border-th-stroke-primary"
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

export default ErrorToast;
