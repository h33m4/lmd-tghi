"use client";

import {
  Calendar,
  ChevronDown,
  Search,
  X,
  RefreshCw,
  Loader2,
  FileText,
} from "lucide-react";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { LMH_ProgramCountries, LmhPrograms } from "@/types";
import { Report, ReportStatus, ReportType } from "@/types/report";
import { Button } from "@/components/ui/button";
import ReportCard from "./ReportCard";

// Filter Options
const reportStatusOptions = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const reportTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "data_review", label: "Data Review" },
  { value: "donor_report", label: "Donor Report" },
  { value: "impact_report", label: "Impact Report" },
  { value: "quarterly_report", label: "Quarterly Report" },
  { value: "annual_report", label: "Annual Report" },
  { value: "case_study", label: "Case Study" },
  { value: "other", label: "Other" },
];

const programOptions = [
  { value: "all", label: "All Programs" },
  { value: "liberia", label: "Liberia" },
  { value: "malawi", label: "Malawi" },
  { value: "ethiopia", label: "Ethiopia" },
  { value: "sierra_leone", label: "Sierra Leone" },
  { value: "aff", label: "AFF" },
];

const sortOptions = [
  { value: "updated_desc", label: "Recently Updated" },
  { value: "created_desc", label: "Recently Created" },
  { value: "published_desc", label: "Recently Published" },
  { value: "title_asc", label: "Title (A-Z)" },
  // { value: "status_asc", label: "Status" },
];

interface UserAllReportsRendererProps {
  program: LmhPrograms;
  includeProgramFilter?: boolean;
  showOnlyPublished?: boolean;
}

// Skeleton Loader Component
const ReportCardSkeleton = () => {
  return (
    <div className="bg-background rounded-xl shadow-sm border overflow-hidden animate-pulse">
      {/* Header */}
      <div className="h-[9.5rem] xl:h-[14vw] 2xl:h-[13rem] w-full bg-gray-200"></div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
          <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
        <div className="flex gap-1">
          <div className="w-16 h-6 bg-gray-200 rounded-md"></div>
          <div className="w-20 h-6 bg-gray-200 rounded-md"></div>
        </div>
        <div className="pt-2 border-t space-y-2">
          <div className="w-full h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

function UserAllReportsRenderer({
  program,
  includeProgramFilter = false,
  showOnlyPublished = false,
}: UserAllReportsRendererProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("published");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>(
    program?.toLowerCase() || "all"
  );
  const [sortBy, setSortBy] = useState("updated_desc");

  // Fetch reports from API
  const fetchReports = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMD_API}/reports`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const reportsData = Array.isArray(data)
        ? data
        : data.data || data.reports || [];

      setReports(reportsData);

      if (showRefreshIndicator) {
        toast.success("Reports refreshed successfully!");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError((error as Error).message);
      toast.error(`Failed to fetch reports: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handle refresh
  const handleRefresh = () => {
    fetchReports(true);
  };

  // Get tags array for filtering
  const getTagsArray = (tags: string) => {
    if (!tags) return [];
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  // Filter by program if provided
  const programFilteredReports = useMemo(() => {
    if (!program) return reports;
    return reports.filter(
      (report) => report.program.toLowerCase() === program.toLowerCase()
    );
  }, [reports, program]);

  // Filtered and sorted reports
  const filteredReports = useMemo(() => {
    if (isRefreshing) return [];

    let filtered = programFilteredReports.filter((report) => {
      const tagsArray = getTagsArray(report.tags);

      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tagsArray.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Force published status when showOnlyPublished is true
      const matchesStatus = showOnlyPublished
        ? report.status === "published"
        : statusFilter === "all" || report.status === statusFilter;

      const matchesType = typeFilter === "all" || report.type === typeFilter;
      const matchesProgram =
        !includeProgramFilter ||
        programFilter === "all" ||
        report.program.toLowerCase() === programFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType && matchesProgram;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "updated_desc":
          return (
            new Date(b.date_updated).getTime() -
            new Date(a.date_updated).getTime()
          );
        case "created_desc":
          return (
            new Date(b.date_uploaded).getTime() -
            new Date(a.date_uploaded).getTime()
          );
        case "published_desc":
          if (!a.date_published && !b.date_published) return 0;
          if (!a.date_published) return 1;
          if (!b.date_published) return -1;
          return (
            new Date(b.date_published).getTime() -
            new Date(a.date_published).getTime()
          );
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "status_asc":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    isRefreshing,
    programFilteredReports,
    searchTerm,
    showOnlyPublished,
    statusFilter,
    typeFilter,
    includeProgramFilter,
    programFilter,
    sortBy,
  ]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    if (!showOnlyPublished) {
      setStatusFilter("all");
    }

    setTypeFilter("all");
    setSortBy("updated_desc");
    if (includeProgramFilter) {
      setProgramFilter("all");
    }
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm !== "" ||
    (!showOnlyPublished && statusFilter !== "all") ||
    typeFilter !== "all" ||
    (includeProgramFilter && programFilter !== "all");

  return (
    <>
      {/* Filters Section */}
      <div className="flex-shrink-0 bg-gradient-to-b from-transparent to-background border-b px-4 py-2">
        <div className="flex gap-4 items-end flex-wrap justify-between">
          <div className="flex items-end gap-2 flex-wrap">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px] max-w-sm">
              {/* <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label> */}
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search reports..."
                  disabled={isRefreshing}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            {!showOnlyPublished && (
              <div className="min-w-[120px]">
                {/* <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label> */}
                <div className="relative">
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none border border-gray-300 rounded-md px-3 py-2 pr-8 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isRefreshing}
                  >
                    {reportStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Type Filter */}
            <div className="min-w-[140px]">
              {/* <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Report Type
              </label> */}
              <div className="relative">
                <select
                  id="type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-md px-3 py-2 pr-8 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isRefreshing}
                >
                  {reportTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Program Filter (conditional) */}
            {includeProgramFilter && (
              <div className="min-w-[140px]">
                {/* <label
                  htmlFor="program"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Program
                </label> */}
                <div className="relative">
                  <select
                    id="program"
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="appearance-none border border-gray-300 rounded-md px-3 py-2 pr-8 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isRefreshing}
                  >
                    {programOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Sort Filter */}
            <div className="min-w-[140px]">
              {/* <label
                htmlFor="sort"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sort By
              </label> */}
              <div className="relative">
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-md px-3 py-2 pr-8 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isRefreshing}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors"
                  disabled={isRefreshing}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <div>
            <Button
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              {isRefreshing ? (
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
          </div>
        </div>

        {/* Results Count and Active Filters */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          {/* <div>
            {showOnlyPublished ? (
              <>Showing {filteredReports.length} reports</>
            ) : (
              <>
                Showing {filteredReports.length} of{" "}
                {programFilteredReports.length} reports
              </>
            )}
          </div> */}

          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Search: &quot;{searchTerm}&quot;
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {statusFilter !== "all" && !showOnlyPublished && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 hover:text-green-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {typeFilter !== "all" && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  Type:{" "}
                  {reportTypeOptions.find((opt) => opt.value === typeFilter)
                    ?.label || typeFilter}
                  <button
                    onClick={() => setTypeFilter("all")}
                    className="ml-1 hover:text-purple-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {includeProgramFilter && programFilter !== "all" && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                  Program:{" "}
                  {programOptions.find((opt) => opt.value === programFilter)
                    ?.label || programFilter}
                  <button
                    onClick={() => setProgramFilter("all")}
                    className="ml-1 hover:text-orange-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-8">
          {/* Loading State */}
          {(isLoading || isRefreshing) && (
            <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))" }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <ReportCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          )}

          {/* Reports Grid */}
          {!isLoading && !isRefreshing && filteredReports.length > 0 && (
            <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))" }}>
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} program={program} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isRefreshing && filteredReports.length === 0 && (
            <div className="flex h-full  flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium  mb-2">No reports found</h3>
              <p className="text-gray-500 mb-4 max-w-sm">
                No reports match your current search criteria. Try adjusting
                your filters or search terms.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Failed to load reports
              </h3>
              <p className="text-gray-500 mb-4 max-w-sm">{error}</p>
              <button
                onClick={() => fetchReports()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserAllReportsRenderer;
