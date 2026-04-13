"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { analytics, AnalyticsService } from "../services/analytics";

interface AnalyticsContextType {
  trackLogin: (loginType: "google" | "password") => Promise<void>;
  trackPageView: (pageUrl: string, loadTime?: number) => Promise<void>;
  trackDatasetUpload: (
    datasetName: string,
    datasetSize: number,
    uploadEndpoint: string
  ) => Promise<void>;
  trackSearch: (searchQuery: string, resultsCount: number) => Promise<void>;
  trackSession: (
    sessionStartTime: string,
    sessionEndTime: string,
    sessionDuration: number,
    deviceInfo: string,
    browserInfo: string
  ) => Promise<void>;
  trackApiRequest: (
    endpointUrl: string,
    responseTime: number,
    statusCode: number
  ) => Promise<void>;
  initUser: (userId: string, userEmail: string) => void;
  resetUser: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

// Track page views with debounce (minimum 30 seconds between events for the same path)
const PAGE_TRACKING_DEBOUNCE = 30 * 1000; // 30 seconds

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageLoadTime, setPageLoadTime] = useState<number | undefined>(
    undefined
  );
  const { data: session, status } = useSession();

  // Store last tracked page/time to prevent duplicate events
  const lastTrackedPage = useRef<string | null>(null);
  const lastTrackedTime = useRef<number>(0);

  // Initialize page load time measurement
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Use Navigation Timing API to get page load time
      const getPageLoadTime = () => {
        if (window.performance && window.performance.timing) {
          const { navigationStart, loadEventEnd } = window.performance.timing;
          const loadTime = loadEventEnd - navigationStart;
          return loadTime > 0 ? loadTime : undefined;
        }
        return undefined;
      };

      // Set the page load time once the page has fully loaded
      window.addEventListener("load", () => {
        setPageLoadTime(getPageLoadTime());
      });

      // Cleanup
      return () => {
        window.removeEventListener("load", () => {
          setPageLoadTime(getPageLoadTime());
        });
      };
    }
  }, []);

  // Keep the client-side analytics singleton in sync with the session.
  // The signIn server event only runs once; after a page reload the singleton
  // has no userInfo, so we re-initialise it here whenever the session is ready.
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id && session?.user?.email) {
      analytics.init(session.user.id as string, session.user.email);
    }
  }, [session, status]);

  // Track page views once when pathname changes, respecting debounce
  useEffect(() => {
    if (!pathname || status !== "authenticated" || !session?.user) return;

    const fullUrl = `${window.location.origin}${pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const currentTime = Date.now();

    // Check if this is a new page or if debounce period has passed
    const isDifferentPage = lastTrackedPage.current !== pathname;
    const isDebounceExpired =
      currentTime - lastTrackedTime.current > PAGE_TRACKING_DEBOUNCE;

    // Only track if it's a different page or debounce period has passed
    if (isDifferentPage || isDebounceExpired) {
      // Update last tracked info
      lastTrackedPage.current = pathname;
      lastTrackedTime.current = currentTime;

      // Small delay to allow page load time to be measured
      setTimeout(() => {
        analytics.trackPageView(fullUrl, pageLoadTime);
      }, 100);
    }
  }, [pathname, searchParams, pageLoadTime, status, session]);

  const value: AnalyticsContextType = {
    trackLogin: (loginType) => analytics.trackLogin(loginType),
    trackPageView: (pageUrl, loadTime) =>
      analytics.trackPageView(pageUrl, loadTime),
    trackDatasetUpload: (datasetName, datasetSize, uploadEndpoint) =>
      analytics.trackDatasetUpload(datasetName, datasetSize, uploadEndpoint),
    trackSearch: (searchQuery, resultsCount) =>
      analytics.trackSearch(searchQuery, resultsCount),
    trackSession: (
      sessionStartTime,
      sessionEndTime,
      sessionDuration,
      deviceInfo,
      browserInfo
    ) =>
      analytics.trackSession(
        sessionStartTime,
        sessionEndTime,
        sessionDuration,
        deviceInfo,
        browserInfo
      ),
    trackApiRequest: (endpointUrl, responseTime, statusCode) =>
      analytics.trackApiRequest(endpointUrl, responseTime, statusCode),
    initUser: (userId, userEmail) => {
      analytics.init(userId, userEmail);
    },
    resetUser: () => {
      analytics.reset();
    },
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}
