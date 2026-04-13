import { metaObject } from "@/config/site.config";
import React from "react";
import ActionsButtons from "./actionButtons";
export const metadata = {
  ...metaObject("Auth Error"),
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessages: { [key: string]: string } = {
    Configuration:
      "There was an authentication configuration error. Please contact support.",
    AccessDenied: "You don't have permission to access this resource.",
    Verification: "Email verification is required. Please check your inbox.",
    default: "An authentication error occurred. Please try again.",
  };

  const error = searchParams.error || "default";
  const errorMessage = errorMessages[error] || errorMessages.default;

  return (
    <div className=" bg-gray-50 mb-[200px] flex flex-col items-center justify-center p-4">
      <div className="-mt-[120px] max-w-md w-full bg-white shadow-lg rounded-lg">
        <div className="p-6">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error Title */}
          <h2 className="text-center text-xl font-semibold text-gray-900 mb-2">
            Authentication Error
          </h2>

          {/* Error Message */}
          <p className="text-center text-gray-600 mb-6">{errorMessage}</p>

          {/* Action Buttons */}
          <ActionsButtons />
        </div>
      </div>
    </div>
  );
}
