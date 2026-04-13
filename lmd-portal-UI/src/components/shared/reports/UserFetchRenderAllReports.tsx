"use client";

import ReportRenderer from "@/components/shared/reports/ReportRenderer2";
import {
  DashboardContentSkeleton,
  DashboardHeaderSkeleton,
} from "@/components/shared/views/DashboardRenderer";
import { Report } from "@/types/report";
import { useCallback, useEffect, useState } from "react";

interface UserFetchRenderAllReportProps {
  reportId?: string;
  reportSlug: string;
}

export default function UserFetchRenderAllReport({
  reportId,
  reportSlug,
}: UserFetchRenderAllReportProps) {
  const [report, setReport] = useState<Report>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(reportId, reportSlug);

  const fetchReport = useCallback(async () => {
    if (!reportId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMD_API}/reports/${reportId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch report (${response.status})`);
      }

      const data = await response.json();

      setReport(data.data ?? data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (!reportId) {
    return <div>No report selected.</div>;
  }

  console.log("err", error);

  if (isLoading) {
    return (
      <div className="border border-primary dark:border-border h-full bg-background rounded-md flex flex-col">
        <DashboardHeaderSkeleton />
        <DashboardContentSkeleton />
      </div>
    );
  }

  if (!report || error) {
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
          <h3 className="text-lg font-medium mb-2">
            Report with id {reportId} not Found
          </h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-primary dark:border-border h-full bg-background rounded-md flex flex-col">
      <ReportRenderer report={report} />
    </div>
  );
}
