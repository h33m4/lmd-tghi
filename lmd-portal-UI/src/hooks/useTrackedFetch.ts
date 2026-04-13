import { useAnalytics } from "@/context/analyticContext";
import { useCallback } from "react";

/**
 * A hook that returns a fetch function that automatically tracks API requests
 */
export function useTrackedFetch() {
  const { trackApiRequest } = useAnalytics();

  const trackedFetch = useCallback(
    async (url: string, options?: RequestInit): Promise<Response> => {
      const startTime = performance.now();
      let statusCode = 0;

      try {
        const response = await fetch(url, options);
        statusCode = response.status;

        // Track the API request
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);

        trackApiRequest(url, responseTime, statusCode).catch((err) => {
          console.error("Failed to track API request:", err);
        });

        return response;
      } catch (error) {
        // Track failed requests too
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);

        trackApiRequest(url, responseTime, 0).catch((err) => {
          console.error("Failed to track API request:", err);
        });

        throw error;
      }
    },
    [trackApiRequest]
  );

  return trackedFetch;
}
