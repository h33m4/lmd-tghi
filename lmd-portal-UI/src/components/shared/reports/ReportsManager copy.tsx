"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  ExternalLink,
  Trash2,
  FileText,
  Filter,
  SortAsc,
  X,
  Calendar,
  User,
  Activity,
  TrendingUp,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  LayoutGrid,
  List,
  Save,
  Download,
  Tag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  detectReportTypeFromUrl,
  getGoogleDriveEmbedUrl,
  getTagsArray,
} from "@/utils/report-helpers";
import { formatDate } from "@/utils/date-helpers";
import { LmhPrograms } from "@/types";
import { Report, ReportStatus, ReportType } from "@/types/report";
import { InfoContainer } from "@/components/infoContainer/infoContainerComponent";
import {
  getProgramBadge,
  getReportTypeBadge,
  getStatusBadge,
} from "./reportComponents";
import ReportStatsCard from "./ReportStatsCard";
import EmbeddReportModal from "./embedReportModal";

interface ReportsManagerProps {
  program?: LmhPrograms;
  includeProgramFilter?: boolean;
}

type ViewMode = "list" | "grid";

// Badge Components

// Skeleton Components
const SkeletonTableRow = () => (
  <tr className="border-b border-gray-100">
    <td className="p-6">
      <div className="space-y-3">
        <div>
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-1"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse w-12"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>
    </td>
    <td className="p-6">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
    </td>
    <td className="p-6">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
    </td>
    <td className="p-6">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
    </td>
    <td className="p-6">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
    </td>
    <td className="p-6">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
    </td>
    <td className="p-6">
      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
    </td>
  </tr>
);

const SkeletonGridCard = () => (
  <Card className="border border-gray-200 overflow-hidden">
    <div className="h-2 bg-gray-200 animate-pulse" />
    <CardContent className="p-5">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-14"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse w-12"></div>
        </div>
        <div className="pt-3 border-t border-gray-100 flex justify-between">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Filter Options
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

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
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
  { value: "title_asc", label: "Title (A-Z)" },
  { value: "status_asc", label: "Status" },
];

// Main Component
export default function ReportsManager({
  program,
  includeProgramFilter = false,
}: ReportsManagerProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterProgram, setFilterProgram] = useState(program || "all");
  const [sortBy, setSortBy] = useState("updated_desc");
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reportToEdit, setReportToEdit] = useState<Report | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    report_url: "",
    title: "",
    description: "",
    type: "other" as ReportType,
    tags: "",
    data_source: "",
    program: program || ("Liberia" as LmhPrograms),
    project: "",
    status: "draft" as ReportStatus,
    uploaded_by: "Current User",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Fetch reports
  const fetchReports = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Replace with your API endpoint
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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

  useEffect(() => {
    // Simulate API call with mock data for now
    fetchReports();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchReports(true);
  };

  // Auto-detect report type from URL
  useEffect(() => {
    if (formData.report_url && !reportToEdit) {
      const detectedType = detectReportTypeFromUrl(formData.report_url);
      if (detectedType) {
        setFormData((prev) => ({ ...prev, type: detectedType }));
      }
    }
  }, [formData.report_url, reportToEdit]);

  // Filtered and sorted reports
  const filteredReports = useMemo(() => {
    if (isRefreshing) return [];

    let filtered = reports.filter((report) => {
      const tagsArray = getTagsArray(report.tags);
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tagsArray.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        filterStatus === "all" || report.status === filterStatus;
      const matchesType = filterType === "all" || report.type === filterType;
      const matchesProgram =
        filterProgram === "all" ||
        report.program.toLowerCase() === filterProgram.toLowerCase();

      return matchesSearch && matchesStatus && matchesType && matchesProgram;
    });

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
    reports,
    searchTerm,
    filterStatus,
    filterType,
    filterProgram,
    sortBy,
    isRefreshing,
  ]);

  // Statistics
  const stats = useMemo(() => {
    if (isRefreshing) return { total: 0, published: 0, draft: 0, archived: 0 };

    const dataToAnalyze = includeProgramFilter ? reports : filteredReports;
    const total = dataToAnalyze.length;
    const published = dataToAnalyze.filter(
      (r) => r.status === "published"
    ).length;
    const draft = dataToAnalyze.filter((r) => r.status === "draft").length;
    const archived = dataToAnalyze.filter(
      (r) => r.status === "archived"
    ).length;

    return { total, published, draft, archived };
  }, [reports, filteredReports, includeProgramFilter, isRefreshing]);

  const modernStats = [
    {
      title: "Total Reports",
      value: stats.total,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Published",
      value: stats.published,
      change:
        stats.total > 0
          ? `${Math.round((stats.published / stats.total) * 100)}% of total`
          : "0% of total",
      icon: Activity,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Draft",
      value: stats.draft,
      change:
        stats.total > 0
          ? `${Math.round((stats.draft / stats.total) * 100)}% of total`
          : "0% of total",
      icon: Edit,
      gradient: "from-amber-500 to-amber-600",
    },
    {
      title: "Archived",
      value: stats.archived,
      change:
        stats.total > 0
          ? `${Math.round((stats.archived / stats.total) * 100)}% of total`
          : "0% of total",
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterType("all");
    setSortBy("updated_desc");
    if (includeProgramFilter) {
      setFilterProgram("all");
    }
  };

  const hasActiveFilters = includeProgramFilter
    ? searchTerm ||
      filterStatus !== "all" ||
      filterType !== "all" ||
      filterProgram !== "all"
    : searchTerm || filterStatus !== "all" || filterType !== "all";

  // CRUD Operations
  const handleDelete = (report: Report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;

    try {
      // API call here
      setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
      toast.success("Report deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete report: ${(error as Error).message}`);
    } finally {
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  const handleEdit = (report: Report) => {
    setReportToEdit(report);
    setFormData({
      report_url: report.report_url,
      title: report.title,
      description: report.description,
      type: report.type,
      tags: report.tags,
      data_source: report.data_source,
      program: report.program,
      project: report.project,
      status: report.status,
      uploaded_by: report.uploaded_by,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!reportToEdit) return;
    setIsSaving(true);

    try {
      // API call here
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportToEdit.id
            ? {
                ...r,
                ...formData,
                date_updated: new Date().toISOString(),
                date_published:
                  formData.status === "published" && r.status !== "published"
                    ? new Date().toISOString()
                    : r.date_published,
              }
            : r
        )
      );
      toast.success("Report updated successfully!");
      setEditDialogOpen(false);
      setReportToEdit(null);
    } catch (error) {
      toast.error(`Failed to update report: ${(error as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    setReportToEdit(null);
    setFormData({
      report_url: "",
      title: "",
      description: "",
      type: "other",
      tags: "",
      data_source: "",
      program: program || "Liberia",
      project: "",
      status: "draft",
      uploaded_by: "Current User",
    });
    setAddDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    setIsSaving(true);

    try {
      // API call here
      const newReport: Report = {
        ...formData,
        id: Date.now().toString(),
        date_uploaded: new Date().toISOString(),
        date_updated: new Date().toISOString(),
      };
      setReports((prev) => [newReport, ...prev]);
      toast.success("Report created successfully!");
      setAddDialogOpen(false);
    } catch (error) {
      toast.error(`Failed to create report: ${(error as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async (report: Report) => {
    setIsDuplicating(true);

    try {
      // API call here
      const duplicateData: Report = {
        ...report,
        id: Date.now().toString(),
        title: `${report.title} (Copy)`,
        status: "draft",
        date_uploaded: new Date().toISOString(),
        date_updated: new Date().toISOString(),
        date_published: undefined,
      };
      setReports((prev) => [duplicateData, ...prev]);
      toast.success("Report duplicated successfully!");
    } catch (error) {
      toast.error(`Failed to duplicate report: ${(error as Error).message}`);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handlePreview = (report: Report) => {
    setPreviewReport(report);
    setPreviewDialogOpen(true);
  };

  const handleStatusChange = async (
    reportId: string,
    newStatus: ReportStatus
  ) => {
    try {
      // API call here
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: newStatus,
                date_updated: new Date().toISOString(),
                date_published:
                  newStatus === "published"
                    ? new Date().toISOString()
                    : r.date_published,
              }
            : r
        )
      );
      toast.success(`Report ${newStatus} successfully!`);
    } catch (error) {
      toast.error(`Failed to update status: ${(error as Error).message}`);
    }
  };

  // Render Grid Card
  const renderGridCard = (report: Report) => {
    const tagsArray = getTagsArray(report.tags);
    const statusColors: Record<string, string> = {
      published: "bg-emerald-500",
      draft: "bg-amber-500",
      archived: "bg-gray-400",
    };

    return (
      <Card
        key={report.id}
        className="border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group overflow-hidden "
      >
        <div className={`h-1.5 ${statusColors[report.status]}`} />
        <CardContent className="p-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                  {report.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handlePreview(report)}
                  >
                    <Eye className="h-4 w-4" />
                    Preview Report
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleEdit(report)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleDuplicate(report)}
                    disabled={isDuplicating}
                  >
                    {isDuplicating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <ExternalLink className="h-4 w-4" />
                    <a
                      href={report.report_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google Drive
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer"
                    onClick={() => handleDelete(report)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(report.status)}
              {getReportTypeBadge(report.type)}
              {getProgramBadge(report.program)}
            </div>

            {tagsArray.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tagsArray.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-gray-50 text-gray-700 border-gray-200 px-2 py-0.5"
                  >
                    #{tag}
                  </Badge>
                ))}
                {tagsArray.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                  >
                    +{tagsArray.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {report.uploaded_by}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(report.date_updated)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Loading State
  // if (isLoading) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <div className="text-center">
  //         <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
  //         <p className="text-lg font-medium">Loading reports...</p>
  //         <p className="text-gray-500">Please wait while we fetch your data</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Error State
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Reports
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => fetchReports()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="lex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-6 pb-12">
          {/* Stats Grid */}
          <ReportStatsCard
            modernStats={modernStats}
            isRefreshing={isRefreshing}
          />

          {/* Filters Section */}
          <Card className="border-0 shadow-sm pt-3 px-0 pb-[1px] ">
            <Collapsible
              open={!filtersCollapsed}
              onOpenChange={(open) => setFiltersCollapsed(!open)}
            >
              <CardHeader className="pb-4 -mb-2 px-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-lg">
                      Filter & Search{" "}
                      <InfoContainer
                        id={"programReportsFiltersInfo"}
                        text={
                          "Filters to allow you to search reports by status, type, project, and keywords in the title, description, or tags."
                        }
                      >
                        <div className="text-xs th-font-mediumOblique"></div>
                      </InfoContainer>
                    </CardTitle>
                    {hasActiveFilters && !isRefreshing && (
                      <Badge variant="secondary" className="text-xs">
                        {filteredReports.length} of {reports.length}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* View Mode Toggle */}
                    <div className="flex items-center border border-gray-200 rounded-lg p-0.5 ">
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`h-7 px-2.5 ${
                          viewMode === "list"
                            ? "shadow-sm"
                            : "hover:bg-gray-100"
                        }`}
                        disabled={isRefreshing}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`h-7 px-2.5 ${
                          viewMode === "grid"
                            ? "shadow-sm"
                            : "hover:bg-gray-100"
                        }`}
                        disabled={isRefreshing}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </div>

                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="flex items-center gap-2"
                        disabled={isRefreshing}
                      >
                        <X className="h-3 w-3" />
                        Clear All
                      </Button>
                    )}
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={isRefreshing}
                      >
                        {filtersCollapsed ? (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Show Filters
                          </>
                        ) : (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide Filters
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAdd}
                      className="flex items-center gap-2"
                      disabled={isRefreshing}
                    >
                      <FileText className="h-4 w-4" />
                      New Report
                    </Button> */}

                    <Button
                      size="sm"
                      className="px-3 flex items-center gap-2"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      {isRefreshing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      <span className="hidden lg:block">
                        {isRefreshing ? "Refreshing" : "Refresh"}
                      </span>
                    </Button>
                    <EmbeddReportModal program={program!} />
                  </div>
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="pt-0  pb-3 px-3">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search reports, descriptions, or tags..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10  dark:border-gray-200 "
                          disabled={isRefreshing}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                        disabled={isRefreshing}
                      >
                        <SelectTrigger className="w-full sm:w-[140px]  ">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={filterType}
                        onValueChange={setFilterType}
                        disabled={isRefreshing}
                      >
                        <SelectTrigger className="w-full sm:w-[160px] ">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTypeOptions.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {includeProgramFilter && (
                        <Select
                          value={filterProgram}
                          onValueChange={setFilterProgram}
                          disabled={isRefreshing}
                        >
                          <SelectTrigger className="w-full sm:w-[150px] ">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {programOptions.map((prog) => (
                              <SelectItem key={prog.value} value={prog.value}>
                                {prog.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      <Select
                        value={sortBy}
                        onValueChange={setSortBy}
                        disabled={isRefreshing}
                      >
                        <SelectTrigger className="w-full sm:w-[180px] ">
                          <SortAsc className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Content - List or Grid View */}
          {viewMode === "list" ? (
            <Card className="border-0 shadow-sm flex-1 flex flex-col overflow-hidden pt-0 ">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead className=" bg-white dark:bg-background border-b sticky top-0 backdrop-blur-sm ">
                    <tr>
                      <th className="text-left p-6 font-bold text-[16px]">
                        Report{" "}
                        <InfoContainer
                          id={"reportTitleDescTagsInfo"}
                          text={
                            "Title and description of the report, along with associated tags."
                          }
                        >
                          <div className="text-xs th-font-mediumOblique"></div>
                        </InfoContainer>
                      </th>
                      <th className="text-left p-6 font-bold text-[16px]">
                        Status
                        <InfoContainer
                          id={"reportStatusInfo"}
                          text={
                            "The current status of the report: Published, Draft, or Archived."
                          }
                        >
                          <div className="text-xs th-font-mediumOblique">
                            <ul>
                              <li>
                                <span className="font-medium underline">
                                  Published:
                                </span>{" "}
                                Report that is live and accessible to users.
                              </li>
                              <li>
                                <span className="font-medium underline">
                                  Draft:
                                </span>{" "}
                                Report that is being created or edited but not
                                yet published.
                              </li>
                              <li>
                                <span className="font-medium underline">
                                  Archived:
                                </span>{" "}
                                Report that has been moved to a historical
                                archive.
                              </li>
                            </ul>
                          </div>
                        </InfoContainer>
                      </th>
                      <th className="text-left p-6 font-bold text-[16px]">
                        Type
                      </th>
                      <th className="text-left p-6 font-bold text-[16px]">
                        Program
                      </th>
                      <th className="text-left p-6 font-bold text-[16px]">
                        Created
                      </th>
                      <th className="text-left p-6 font-bold text-[16px]">
                        Updated
                      </th>
                      <th className="text-left p-6 font-bold text-[16px] w-12">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isRefreshing
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <SkeletonTableRow key={`skeleton-${index}`} />
                        ))
                      : filteredReports.length > 0
                      ? filteredReports.map((report, index) => {
                          const tagsArray = getTagsArray(report.tags);
                          return (
                            <tr
                              key={report.id}
                              className={`border-b border-gray-100 hover:bg-lmh-blue/20 transition-colors group ${
                                index === filteredReports.length - 1
                                  ? "border-b-0"
                                  : ""
                              }`}
                            >
                              {/* report */}
                              <td className="p-6">
                                <div className="space-y-3">
                                  <div>
                                    <p className="font-semibold  mb-1  transition-colors">
                                      {report.title}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                      {report.description}
                                    </p>
                                  </div>
                                  {tagsArray.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                      {tagsArray.slice(0, 3).map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant="destructive"
                                          className="text-xs bg-amber-200 text-gray-800 border-amber-800 px-2 py-0.5"
                                        >
                                          #{tag}
                                        </Badge>
                                      ))}
                                      {tagsArray.length > 3 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs bg-amber-200 text-gray-800 border-amber-800 px-2 py-0.5"
                                        >
                                          +{tagsArray.length - 3} more
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <User className="h-3 w-3" />
                                    {report.uploaded_by}
                                  </div>
                                </div>
                              </td>
                              {/* status */}
                              <td className="p-6">
                                <div className="space-y-2">
                                  {getStatusBadge(report.status)}
                                  {report.status === "published" &&
                                    report.date_published && (
                                      <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Activity className="h-3 w-3" />
                                        Published{" "}
                                        {formatDate(report.date_published)}
                                      </p>
                                    )}
                                </div>
                              </td>
                              {/* type */}
                              <td className="p-6">
                                {getReportTypeBadge(report.type)}
                              </td>
                              {/* program */}
                              <td className="p-6">
                                {getProgramBadge(report.program)}
                              </td>
                              {/*  */}
                              <td className="p-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  {formatDate(report.date_uploaded)}
                                </div>
                              </td>
                              {/* updated */}
                              <td className="p-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  {formatDate(report.date_updated)}
                                </div>
                              </td>
                              {/* actions */}
                              <td className="p-6">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-gray-100"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                  >
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 cursor-pointer"
                                      onClick={() => handlePreview(report)}
                                    >
                                      <Eye className="h-4 w-4" />
                                      Preview Report
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 cursor-pointer"
                                      onClick={() => handleEdit(report)}
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 cursor-pointer"
                                      onClick={() => handleDuplicate(report)}
                                      disabled={isDuplicating}
                                    >
                                      {isDuplicating ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                      <ExternalLink className="h-4 w-4" />
                                      <a
                                        href={report.report_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Open in Google Drive
                                      </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                      <Download className="h-4 w-4" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                      <span className="text-sm">
                                        Change Status:
                                      </span>
                                      <Select
                                        value={report.status}
                                        onValueChange={(value) =>
                                          handleStatusChange(
                                            report.id,
                                            value as ReportStatus
                                          )
                                        }
                                      >
                                        <SelectTrigger className="w-[100px] h-6">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="draft">
                                            Draft
                                          </SelectItem>
                                          <SelectItem value="published">
                                            Published
                                          </SelectItem>
                                          <SelectItem value="archived">
                                            Archived
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer"
                                      onClick={() => handleDelete(report)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete Report
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                    {!isRefreshing && filteredReports.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-16 text-center">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 bg-gray-50 rounded-full">
                              <FileText className="h-12 w-12 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No reports found
                              </h3>
                              <p className="text-gray-600 mb-4 max-w-md">
                                {hasActiveFilters
                                  ? "Try adjusting your search criteria or filters."
                                  : "Get started by creating your first report."}
                              </p>
                              {!hasActiveFilters && (
                                <Button
                                  onClick={handleAdd}
                                  className="flex items-center gap-2"
                                >
                                  <FileText className="h-4 w-4" />
                                  Create Report
                                </Button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {isRefreshing
                ? Array.from({ length: 8 }).map((_, index) => (
                    <SkeletonGridCard key={`skeleton-grid-${index}`} />
                  ))
                : filteredReports.length > 0
                ? filteredReports.map((report) => renderGridCard(report))
                : null}
              {!isRefreshing && filteredReports.length === 0 && (
                <div className="col-span-full">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-16 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-gray-50 rounded-full">
                          <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No reports found
                          </h3>
                          <p className="text-gray-600 mb-4 max-w-md">
                            {hasActiveFilters
                              ? "Try adjusting your search criteria or filters."
                              : "Get started by creating your first report."}
                          </p>
                          {!hasActiveFilters && (
                            <Button
                              onClick={handleAdd}
                              className="flex items-center gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              Create Report
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              Delete Report
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete{" "}
              <strong>&quot;{reportToDelete?.title}&quot;</strong>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog
        open={addDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          setEditDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                {reportToEdit ? (
                  <Edit className="h-5 w-5 text-blue-600" />
                ) : (
                  <FileText className="h-5 w-5 text-blue-600" />
                )}
              </div>
              {reportToEdit ? "Edit Report" : "New Report"}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {reportToEdit
                ? "Update the report details below."
                : "Fill in the details to create a new report."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-url">
                Report URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="report-url"
                type="url"
                value={formData.report_url}
                onChange={(e) =>
                  setFormData({ ...formData, report_url: e.target.value })
                }
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs text-gray-500">
                Google Drive link (automatically detects report type)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Q4 2024 Impact Report"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the report..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Report Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as ReportType })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypeOptions
                      .filter((opt) => opt.value !== "all")
                      .map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as ReportStatus })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select
                  value={formData.program}
                  onValueChange={(value) =>
                    setFormData({ ...formData, program: value as LmhPrograms })
                  }
                >
                  <SelectTrigger id="program">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {programOptions
                      .filter((opt) => opt.value !== "all")
                      .map((prog) => (
                        <SelectItem key={prog.value} value={prog.value}>
                          {prog.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-source">Data Source</Label>
                <Input
                  id="data-source"
                  value={formData.data_source}
                  onChange={(e) =>
                    setFormData({ ...formData, data_source: e.target.value })
                  }
                  placeholder="Field Data Collection"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Input
                id="project"
                value={formData.project}
                onChange={(e) =>
                  setFormData({ ...formData, project: e.target.value })
                }
                placeholder="Health Access Initiative"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="impact, quarterly, 2024"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAddDialogOpen(false);
                setEditDialogOpen(false);
                setReportToEdit(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={reportToEdit ? handleSaveEdit : handleSaveAdd}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {reportToEdit ? "Save Changes" : "Create Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-6xl h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {previewReport?.title}
            </DialogTitle>
            <DialogDescription>{previewReport?.description}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {previewReport && (
              <iframe
                src={getGoogleDriveEmbedUrl(previewReport.report_url)}
                className="w-full h-full rounded-lg border border-gray-200"
                allow="autoplay"
              />
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewDialogOpen(false)}
            >
              Close
            </Button>
            {previewReport && (
              <Button asChild>
                <a
                  href={previewReport.report_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Google Drive
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
