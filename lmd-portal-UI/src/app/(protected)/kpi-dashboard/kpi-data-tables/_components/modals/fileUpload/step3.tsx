"use client";
import React, { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ErrorBanner from "@/components/ui/banner/ErrorBanner";
import SuccessBanner from "@/components/ui/banner/SuccessBanner";
import { useFileUpload } from "./useFileUpload";
import {
  formatFileSize,
  getReadableTimeForFile,
} from "@/utils/helper_functions";
import UploadProgressBar, {
  UploadProgressBarNew,
} from "@/components/modals/uploadProgramModal/uploadProgressBar";
import { useSession } from "next-auth/react";
import {
  CheckCircleIcon,
  CloudArrowUpIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/date-helpers";

interface Step3UploadProps {
  file: File;
  country: string | null;
  tablename: string | null;
  fileError?: string;
  setFileError: (err?: string) => void;
  onUploadSuccess?: () => void;
  setUploadComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Step3Upload({
  file,
  country,
  tablename,
  fileError,
  onUploadSuccess,
  setFileError,
  setUploadComplete,
}: Step3UploadProps) {
  const uploadUrl = `/proxy/kpi_data/upload/${country}/${tablename}`;
  const { data: sessionData } = useSession();

  const {
    status,
    progress,
    error,
    successMsg,
    uploadFile,
    reset,
    retryCount,
    isUploading,
    isFailed,
    isSuccess,
    cancelUpload,
  } = useFileUpload(uploadUrl, sessionData?.user.email!);

  // Sync error with parent
  useEffect(() => {
    setFileError(error);
  }, [error, setFileError]);

  // Notify parent on success
  useEffect(() => {
    if (isSuccess) {
      onUploadSuccess?.();
    }
  }, [isSuccess, onUploadSuccess]);

  const handleUpload = useCallback(async () => {
    if (isFailed) {
      reset();
    }
    await uploadFile(file);
  }, [file, isFailed, reset, uploadFile]);

  const handleReset = useCallback(() => {
    reset();
    setFileError(undefined);
  }, [reset, setFileError]);

  // setFileError(error);

  return (
    <div className="px-6 flex flex-col gap-5">
      {/* Status Banner */}
      {isFailed && error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-red-800 dark:text-red-200">
              Upload Failed
            </h4>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
              {error}
              {retryCount > 0 && ` (Failed after ${retryCount + 1} attempts)`}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-red-500 hover:text-red-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {isSuccess && successMsg && (
        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-green-800 dark:text-green-200">
              Upload Successful
            </h4>
            <p className="text-sm text-green-600 dark:text-green-300 mt-1">
              {successMsg}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-green-500 hover:text-green-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* File Info Card */}
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <CloudArrowUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {file.name}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
              <span>{formatFileSize(file.size)}</span>
              <span>Modified: {formatDate(file.lastModified)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {(isUploading || isFailed || isSuccess) && (
          <div className="mt-4">
            <UploadProgressBarNew
              new_progress={progress}
              status={status}
              retryCount={retryCount}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleUpload}
          disabled={isSuccess || isUploading}
          className={cn(
            "flex-1",
            isSuccess && "bg-green-600 hover:bg-green-600",
            isFailed && "bg-red-600 hover:bg-red-700",
          )}
        >
          {isUploading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {isUploading && `Uploading... ${progress.percentage}%`}
          {isSuccess && "Upload Complete"}
          {isFailed && "Retry Upload"}
          {status === "default" && "Upload Dataset"}
        </Button>

        {isUploading && (
          <Button variant="outline" onClick={cancelUpload}>
            Cancel
          </Button>
        )}
      </div>

      {/* Upload Tips */}
      {status === "default" && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Large files may take several minutes to upload</p>
          <p>• The upload will automatically retry up to 3 times if it fails</p>
          <p>• You can cancel the upload at any time</p>
        </div>
      )}
    </div>
  );
}
