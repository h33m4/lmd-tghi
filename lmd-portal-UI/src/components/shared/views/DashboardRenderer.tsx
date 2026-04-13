"use client";

import { IDashboardData } from "@/types/dashboard";
import { Maximize2, Minimize2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type DashboardRendererProps = {
  dashboardId?: string;
};

// Skeleton Components
export function DashboardHeaderSkeleton() {
  return (
    <div className="p-4 border-b border-primary/20 dark:border-border animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
      <div className="flex gap-4">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  );
}

export function DashboardContentSkeleton() {
  return (
    <div className="flex-1 p-4 animate-pulse">
      <div className="w-full h-full min-h-[500px] bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

// Iframe component with loading state and fullscreen support
function IframeWithLoading({ src, title }: { src: string; title: string }) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px]">
      {iframeLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">
              Loading dashboard...
            </p>
          </div>
        </div>
      )}
      <iframe
        title={title}
        width="100%"
        height="100%"
        className="rounded-md min-h-[500px]"
        src={src}
        frameBorder="0"
        allowFullScreen
        onLoad={() => setIframeLoading(false)}
        style={{ display: iframeLoading ? "none" : "block" }}
      />
      {!iframeLoading && (
        <>
          {isFullscreen && (
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/60 backdrop-blur-sm">
              <span className="text-xs font-bold text-white tracking-wide">LMD</span>
              <span className="text-[10px] font-semibold text-primary bg-white/15 px-1 py-0.5 rounded">2.0</span>
            </div>
          )}
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-sm transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            {isFullscreen ? "Exit" : "Fullscreen"}
          </button>
        </>
      )}
    </div>
  );
}

async function fetchDashboardData(
  dashboardId: string
): Promise<IDashboardData | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LMD_API}/dashboards/${dashboardId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any required authentication headers here
          // "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch dashboard: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

function DashboardRenderer({ dashboardId }: DashboardRendererProps) {
  const [dashboardData, setDashboardData] = useState<IDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      if (!dashboardId) {
        return; // Don't show error if no dashboardId, just return empty
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardData(dashboardId);

        if (!data) {
          setError(`Dashboard not found for ID: ${dashboardId}`);
        } else {
          setDashboardData(data);
        }
      } catch (err) {
        setError("An unexpected error occurred while loading the dashboard.");
        console.error("Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [dashboardId]);

  // No dashboard ID provided
  if (!dashboardId) {
    return (
      <div className="border border-primary dark:border-border h-full bg-background rounded-md flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No Dashboard Selected</h3>
          <p className="text-muted-foreground">
            Please select a dashboard to view its content.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="border border-primary dark:border-border h-full bg-background rounded-md flex flex-col">
        <DashboardHeaderSkeleton />
        <DashboardContentSkeleton />
      </div>
    );
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <div className="border border-primary dark:border-border h-full bg-background rounded-md flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Dashboard Not Found</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Handle archived or unpublished dashboards
  if (dashboardData.status === "archived" || !dashboardData.embed_url) {
    return (
      <div className="border border-primary dark:border-border h-full bg-background rounded-md flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">{dashboardData.title}</h3>
          <p className="text-muted-foreground mb-4">
            {dashboardData.description}
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            {dashboardData.status === "archived"
              ? "This dashboard has been archived and is no longer available."
              : "This dashboard is not yet published."}
          </p>
        </div>
      </div>
    );
  }

  // Success state - render dashboard with metadata
  return (
    <div className="border border-primary dark:border-border h-full bg-background rounded-md flex flex-col">
      {/* Dashboard Header with Metadata */}
      {/* <div className="p-4 border-b border-primary/20 dark:border-border">
        <h1 className="text-lg font-semibold text-foreground mb-1">
          {dashboardData.title}
        </h1>
        {dashboardData.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {dashboardData.description}
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Program: {dashboardData.program}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            BI Tool: {dashboardData.bi_tool}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Country: {dashboardData.country}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Updated:{" "}
            {new Date(dashboardData.last_update_date).toLocaleDateString()}
          </span>
        </div>
        {dashboardData.tags && (
          <div className="flex gap-1 mt-2">
            {dashboardData.tags.split(",").map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div> */}

      {/* Dashboard Embed with Loading State */}
      <div className="flex-1 p-0">
        <IframeWithLoading
          src={dashboardData.embed_url}
          title={dashboardData.title}
        />
      </div>
    </div>
  );
}

export default DashboardRenderer;
