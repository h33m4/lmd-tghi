import { useState, useCallback, useRef, useEffect } from "react";
import axios, { AxiosError, CancelTokenSource } from "axios";
import Papa from "papaparse";
import uploadClient from "@/lib/uploadClient";
import { analytics } from "@/services/analytics";

export type UploadStatus = "default" | "uploading" | "success" | "failed";

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  remainingTime: number; // seconds
}

interface UploadOptions {
  timeout?: number;
  onProgress?: (progress: UploadProgress) => void;
}

interface UploadState {
  status: UploadStatus;
  progress: UploadProgress;
  error: string | undefined;
  successMsg: string | undefined;
  retryCount: number;
}

const DEFAULT_PROGRESS: UploadProgress = {
  loaded: 0,
  total: 0,
  percentage: 0,
  speed: 0,
  remainingTime: 0,
};

const DEFAULT_OPTIONS: UploadOptions = {
  timeout: 120000, // 2 minutes
};

/** Parse a CSV file fully — returns row count, column names, and all rows as a JSON string. */
async function extractCsvMetadata(
  file: File
): Promise<{ rowCount: number; columnNames: string[]; datasetJson: string }> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const columnNames: string[] = results.meta.fields ?? [];
        const rowCount = results.data.length;
        let datasetJson = "";
        try {
          datasetJson = JSON.stringify(results.data);
        } catch {
          // ignore serialisation errors — analytics will just omit the field
        }
        resolve({ rowCount, columnNames, datasetJson });
      },
      error: () => resolve({ rowCount: 0, columnNames: [], datasetJson: "" }),
    });
  });
}

/** Parse tablename out of the upload URL.
 *  Expects either /proxy/kpi_data/upload/{country}/{tablename}
 *  or {base}/kpi_data/upload/{country}/{tablename}
 */
function parseTablename(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "unknown";
}

export function useFileUpload(
  uploadUrl: string,
  enteredBy?: string,
  options: UploadOptions = {}
) {
  const { timeout } = { ...DEFAULT_OPTIONS, ...options };

  const [state, setState] = useState<UploadState>({
    status: "default",
    progress: DEFAULT_PROGRESS,
    error: undefined,
    successMsg: undefined,
    retryCount: 0,
  });

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const uploadStartTimeRef = useRef<number>(0);
  const lastLoadedRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Component unmounted");
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Upload reset");
      cancelTokenRef.current = null;
    }
    setState({
      status: "default",
      progress: DEFAULT_PROGRESS,
      error: undefined,
      successMsg: undefined,
      retryCount: 0,
    });
    uploadStartTimeRef.current = 0;
    lastLoadedRef.current = 0;
    lastTimeRef.current = 0;
  }, []);

  const cancelUpload = useCallback(() => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Upload cancelled by user");
      cancelTokenRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      status: "default",
      progress: DEFAULT_PROGRESS,
      error: "Upload cancelled",
    }));
  }, []);

  const calculateProgress = useCallback(
    (loaded: number, total: number): UploadProgress => {
      const now = Date.now();
      const percentage = Math.round((loaded / total) * 100);

      let speed = 0;
      let remainingTime = 0;

      if (lastTimeRef.current > 0) {
        const timeDiff = (now - lastTimeRef.current) / 1000;
        const bytesDiff = loaded - lastLoadedRef.current;

        if (timeDiff > 0) {
          speed = bytesDiff / timeDiff;
          const remainingBytes = total - loaded;
          remainingTime = speed > 0 ? remainingBytes / speed : 0;
        }
      }

      lastLoadedRef.current = loaded;
      lastTimeRef.current = now;

      return { loaded, total, percentage, speed, remainingTime };
    },
    []
  );

  const getErrorMessage = useCallback((err: unknown): string => {
    if (axios.isCancel(err)) return "Upload cancelled";

    const axiosError = err as AxiosError<{
      message?: string;
      error?: string;
      detail?: string;
    }>;

    if (axiosError.response) {
      const data = axiosError.response.data;
      const status = axiosError.response.status;
      const serverMessage =
        data?.message || data?.error || data?.detail || null;

      if (serverMessage) return serverMessage;

      switch (status) {
        case 400:
          return "Invalid file or request format";
        case 401:
          return "Authentication required. Please log in again.";
        case 403:
          return "You don't have permission to upload files";
        case 404:
          return "Upload endpoint not found";
        case 413:
          return "File is too large";
        case 415:
          return "Unsupported file type";
        case 422:
          return "File validation failed. Please check the format.";
        case 429:
          return "Too many requests. Please wait and try again.";
        case 500:
          return "Server error. Please try again later.";
        case 502:
        case 503:
        case 504:
          return "Server is temporarily unavailable. Please try again.";
        default:
          return `Upload failed (Error ${status})`;
      }
    }

    if (axiosError.code === "ECONNABORTED")
      return "Upload timed out. Please check your connection and try again.";
    if (axiosError.code === "ERR_NETWORK")
      return "Network error. Please check your internet connection.";
    if (axiosError.request)
      return "No response from server. Please check your connection.";

    return (axiosError as any).message || "An unexpected error occurred";
  }, []);

  const uploadFile = useCallback(
    async (file: File): Promise<boolean> => {
      cancelTokenRef.current = axios.CancelToken.source();
      uploadStartTimeRef.current = Date.now();
      lastLoadedRef.current = 0;
      lastTimeRef.current = 0;

      setState({
        status: "uploading",
        progress: DEFAULT_PROGRESS,
        error: undefined,
        successMsg: undefined,
        retryCount: 0,
      });

      // Parse CSV upfront to capture metadata and full row data for analytics
      const { rowCount, columnNames, datasetJson } = await extractCsvMetadata(file);
      const tablename = parseTablename(uploadUrl);

      try {
        const formData = new FormData();
        formData.append("kpi_file", file, file.name);
        if (enteredBy) formData.append("entered_by", enteredBy);

        const response = await uploadClient.post(uploadUrl, formData, {
          timeout,
          cancelToken: cancelTokenRef.current.token,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = calculateProgress(
                progressEvent.loaded,
                progressEvent.total
              );
              setState((prev) => ({
                ...prev,
                progress,
                retryCount:
                  (progressEvent as any)["axios-retry"]?.retryCount ??
                  prev.retryCount,
              }));
              options.onProgress?.(progress);
            }
          },
        });

        const result = response.data;
        const uploadDurationMs = Date.now() - uploadStartTimeRef.current;

        if (
          result === "No data to upload" ||
          result?.message === "No data to upload"
        ) {
          throw new Error("No data to upload. Please check your file.");
        }

        setState((prev) => ({
          ...prev,
          status: "success",
          progress: { ...prev.progress, percentage: 100 },
          successMsg: result?.message || "File uploaded successfully!",
        }));

        analytics.trackKpiBulkUpload({
          tablename,
          fileName: file.name,
          fileSizeBytes: file.size,
          rowCount,
          columnNames,
          datasetJson: datasetJson || undefined,
          uploadEndpoint: uploadUrl,
          uploadStatus: "success",
          uploadDurationMs,
          apiStatusCode: response.status,
          apiResponseMessage:
            typeof result === "string"
              ? result
              : result?.message || "Upload successful",
        });

        return true;
      } catch (err) {
        if (axios.isCancel(err)) return false;

        const axiosError = err as AxiosError;
        const uploadDurationMs = Date.now() - uploadStartTimeRef.current;
        const errorMessage = getErrorMessage(err);

        let apiStatusCode: number | undefined = axiosError.response?.status;
        let apiResponseBody: string | undefined;
        try {
          apiResponseBody = axiosError.response?.data
            ? JSON.stringify(axiosError.response.data)
            : undefined;
        } catch {
          // ignore serialisation errors
        }

        setState((prev) => ({
          ...prev,
          status: "failed",
          error: errorMessage,
        }));

        analytics.trackKpiBulkUpload({
          tablename,
          fileName: file.name,
          fileSizeBytes: file.size,
          rowCount,
          columnNames,
          datasetJson: datasetJson || undefined,
          uploadEndpoint: uploadUrl,
          uploadStatus: "failed",
          uploadDurationMs,
          errorMessage,
          apiStatusCode,
          apiResponseBody,
        });

        return false;
      }
    },
    [uploadUrl, enteredBy, timeout, calculateProgress, getErrorMessage, options]
  );

  return {
    ...state,
    uploadFile,
    cancelUpload,
    reset,
    isUploading: state.status === "uploading",
    isSuccess: state.status === "success",
    isFailed: state.status === "failed",
  };
}
