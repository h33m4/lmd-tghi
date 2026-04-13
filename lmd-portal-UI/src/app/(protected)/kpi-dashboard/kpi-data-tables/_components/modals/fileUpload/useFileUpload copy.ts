import { analytics } from "@/services/analytics";
import { convertFileToJson } from "@/utils/convert-file-to-json-for-loggin";
import { useState } from "react";

export type UploadStatus = "default" | "uploading" | "success" | "failed";

export function useFileUpload(uploadUrl: string, enteredBy?: string) {
  const [status, setStatus] = useState<UploadStatus>("default");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>();
  const [successMsg, setSuccessMsg] = useState<string>();

  const uploadFile = async (file: File) => {
    const uploadStartTime = performance.now();

    const datasetJsonString = await convertFileToJson(file);

    try {
      setStatus("uploading");
      setProgress(0);
      setError(undefined);
      setSuccessMsg(undefined);

      const formData = new FormData();
      formData.append("kpi_file", file, file.name);
      if (enteredBy) {
        formData.append("entered_by", enteredBy);
      }
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      console.log("result", result);

      if (!response.ok) {
        const errorText = result.message;
        console.log("re", result);
        setStatus("failed");
        setError(errorText);

        // Track failed upload
        analytics.trackDatasetUpload(
          file.name,
          file.size,
          uploadUrl,
          String(performance.now() - uploadStartTime),
          "failed",
          errorText,
          datasetJsonString || ""
        );
        return;
      }

      if (result === "No data to upload") {
        const errorText = "No data to upload";
        setStatus("failed");
        setError(errorText);
        return;
      }

      setStatus("success");
      setSuccessMsg("File uploaded successfully!");

      // Track successful upload
      analytics.trackDatasetUpload(
        file.name,
        file.size,
        uploadUrl,
        String(performance.now() - uploadStartTime),
        "success",
        undefined,
        datasetJsonString || ""
      );
    } catch (err: any) {
      setStatus("failed");
      setError(err.message || "Network error occurred");

      analytics.trackDatasetUpload(
        file.name,
        file.size,
        uploadUrl,
        String(performance.now() - uploadStartTime),
        "failed",
        err.message || "Network error occurred",
        datasetJsonString || ""
      );
    }
  };

  return {
    status,
    progress,
    error,
    successMsg,
    uploadFile,
    reset: () => {
      setStatus("default");
      setProgress(0);
      setError(undefined);
      setSuccessMsg(undefined);
    },
  };
}
