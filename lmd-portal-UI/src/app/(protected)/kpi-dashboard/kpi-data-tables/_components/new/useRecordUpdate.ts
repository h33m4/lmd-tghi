import { useState, useCallback } from "react";
import { BaseRecord, ButtonStatus } from "./types";
import { apiService } from "./api.service";
import { toast } from "sonner";

interface UseRecordUpdateOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useRecordUpdate = <T extends BaseRecord>(
  options?: UseRecordUpdateOptions
) => {
  const [status, setStatus] = useState<ButtonStatus>("default");
  const [error, setError] = useState<string | null>(null);

  const updateRecord = useCallback(
    async (
      country: string,
      tablename: string,
      recordId: string | number,
      data: Partial<T>
    ) => {
      try {
        setStatus("loading");
        setError(null);

        const result = await apiService.updateRecord<T>(
          country,
          tablename,
          recordId,
          data
        );

        setStatus("success");
        toast.success("Record updated successfully");
        options?.onSuccess?.();

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Update failed");
        setStatus("error");
        setError(error.message);
        toast.error(error.message);
        options?.onError?.(error);
        throw error;
      } finally {
        // Reset status after a delay
        setTimeout(() => setStatus("default"), 2000);
      }
    },
    [options]
  );

  return {
    updateRecord,
    status,
    error,
    isLoading: status === "loading",
  };
};
