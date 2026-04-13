"use client";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  FileText,
  RefreshCw,
  Loader2,
  X,
  ExternalLink,
  Download,
} from "lucide-react";

import React, { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LMH_ProgramCountries } from "@/types";
import { Report } from "@/types/report";
import { parseCountryNameForApi } from "@/utils/parseCountryNameForAPI";
import { formatDate } from "@/utils/date-helpers";
import { getGDrivePreviewUrl } from "@/utils/report-helpers";
import AdminSectionComponent from "../program-admin/AdminSectionComponent";
import {
  getStatusBadge,
  ReportCard,
  ReportSkeletonCard,
  reportTypeLabels,
} from "./reportComponents";
import Link from "next/link";

interface Props {
  country: LMH_ProgramCountries;
}

// Preview Modal Component
const PreviewReportModal = ({
  report,
  isOpen,
  onClose,
}: {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!report) return null;

  const tagsArray = report.tags
    ? report.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                {report.title}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base leading-relaxed">
                {report.description}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">{getStatusBadge(report.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Report Type
                </label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {reportTypeLabels[report.type]}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Program
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {report.program || "N/A"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Uploaded By
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {report.uploaded_by}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Uploaded Date
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(report.date_uploaded)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Updated
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(report.date_updated)}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {tagsArray.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tagsArray.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Report Preview/Download */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Report Document
              </label>
              <div className="flex gap-2">
                {report.report_url && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() =>
                        window.open(
                          getGDrivePreviewUrl(report.report_url),
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        // For Google Drive, open the original URL for download
                        window.open(
                          report.report_url,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white">
              {report.report_url ? (
                <iframe
                  src={getGDrivePreviewUrl(report.report_url)}
                  className="w-full h-96 border-0"
                  title={`${report.title} Report`}
                  allow="autoplay"
                />
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-50 text-gray-500">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">No preview available</p>
                    <p className="text-sm">
                      Report URL not configured for this report
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="font-medium text-gray-700">Data Source</label>
              <p className="text-gray-900 mt-1">
                {report.data_source || "Not specified"}
              </p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Project</label>
              <p className="text-gray-900 mt-1">
                {report.project || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ReportCard Component (adapted from second file)

function RecentReports({ country }: Props) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const countrySlug = parseCountryNameForApi(country);

  const fetchReports = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMD_API}/reports`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.status}`);
      }

      const data = await response.json();

      // Filter reports by country
      const filteredData = data.filter((report: Report) => {
        if (!countrySlug) return true;
        if (!report.program) return false;

        const reportCountry = report.program.toLowerCase().replace(/\s+/g, "_");
        const selectedCountry = countrySlug.toLowerCase();

        return reportCountry === selectedCountry;
      });

      setReports(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Sort reports by date to show most recent first
  const recentReports = useMemo(() => {
    return [...reports]
      .sort(
        (a, b) =>
          new Date(b.date_updated).getTime() -
          new Date(a.date_updated).getTime()
      )
      .slice(0, 3);
  }, [reports]);

  const handleRefresh = () => {
    fetchReports(true);
  };

  const handlePreview = (report: Report) => {
    setPreviewReport(report);
    setPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
    setPreviewReport(null);
  };

  useEffect(() => {
    fetchReports();
  }, [countrySlug]);

  return (
    <>
      <AdminSectionComponent
        title={"Reports"}
        description={`Latest report updates and activities for ${country}`}
        HeaderIcon={FileText}
        rightSideHeaderContent={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="dark-blue"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              {refreshing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
            <Link
              href={`/country-programs/${country.toLowerCase()}/admin/reports`}
            >
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        }
      >
        {" "}
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <ReportSkeletonCard key={`skeleton-${index}`} />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-500">Error: {error}</div>
            </div>
          ) : refreshing ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <ReportSkeletonCard key={`skeleton-${index}`} />
              ))}
            </div>
          ) : recentReports.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">
                No reports found for {country}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          )}
        </div>
      </AdminSectionComponent>
    </>
  );
}

export default RecentReports;
