"use client";
import { UploadProgress } from "@/app/(protected)/kpi-dashboard/kpi-data-tables/_components/modals/fileUpload/useFileUpload";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/utils/helper_functions";
import React from "react";

type Props = {
  progress: number;
};

type NewProps = {
  new_progress: UploadProgress;
  status?: "default" | "uploading" | "success" | "failed";
  retryCount?: number;
};

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "--:--";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  if (mins > 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  }

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function UploadProgressBar({ progress }: Props) {
  return (
    <>
      <div className="w-full    mt-2">
        <div className="bg-border dark:bg-dark-3 relative h-4 w-full rounded-md ">
          <div
            className={cn(
              "bg-lmh-green absolute top-0 left-0 h-full rounded-2xl ",
              progress < 100 ? "animate-pulse" : "animate-none"
            )}
            style={{ width: `${progress}%` }}
          >
            {progress > 0 && (
              <span className="bg-lmh-green absolute -right-4 bottom-[20px] mb-2 rounded-sm px-3.5 py-1 text-sm text-background th-font-medium  border-red-600 z-20 animate-none">
                <span className="h-4 w-4 bg-lmh-green absolute bottom-[-4px] left-1/2 right-1/2 rotate-45 -translate-x-1/2 -z-10"></span>
                {progress}%
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function UploadProgressBarNew({
  new_progress,
  status,
  retryCount = 0,
}: NewProps) {
  const { percentage, loaded, total, speed, remainingTime } =
    new_progress || {};
  return (
    <>
      {new_progress && (
        <div className="space-y-2">
          {/* Progress Bar */}
          <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 ease-out rounded-full",
                status === "success" && "bg-green-500",
                status === "failed" && "bg-red-500",
                status === "uploading" && "bg-blue-500",
                status === "default" && "bg-gray-400"
              )}
              style={{ width: `${percentage}%` }}
            />

            {/* Animated shine effect during upload */}
            {status === "uploading" && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </div>

          {/* Progress Details */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium">{percentage}%</span>
              {typeof total === "number" && total > 0 && (
                <span>
                  {formatFileSize(loaded!)} / {formatFileSize(total)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {status === "uploading" && (
                <>
                  {speed! > 0 && <span>{formatFileSize(speed!)}/s</span>}
                  {remainingTime! > 0 && (
                    <span>~{formatTime(remainingTime!)} remaining</span>
                  )}
                </>
              )}

              {retryCount > 0 && (
                <span className="text-amber-500">Retry #{retryCount}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
