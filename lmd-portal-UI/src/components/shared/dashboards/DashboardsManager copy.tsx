"use client";
import React, { useMemo, useState, useEffect, useCallback } from "react";
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
  BarChart3,
  Filter,
  SortAsc,
  X,
  Calendar,
  User,
  Zap,
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

import { formatDate } from "@/utils/date-helpers";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { LMH_ProgramCountries } from "@/types";
import EmbeddDashboardModal from "./EmbedDashboardModal";
import {
  dashboardBiToolsOptions,
  dashboardSortOptions,
  dashboardStatusOptions,
  IDashboardData,
} from "@/types/dashboard";
import { parseCountryNameForApi } from "@/utils/parseCountryNameForAPI";
import { InfoContainer } from "@/components/infoContainer/infoContainerComponent";
import { set } from "lodash";
import { getBIToolBadge, getStatusBadge } from "./RecentDashboards";
import PreviewDashboardModal from "./PreviewDashboardModal";
import ReportStatsCard from "../reports/ReportStatsCard";
import { SkeletonGridCard, SkeletonTableRow } from "./DashboardManagerSkeleton";

interface Props {
  program: LMH_ProgramCountries;
  includeCountryFilter?: Boolean;
}

type ViewMode = "list" | "grid";

export default function DashboardsManager({
  program,
  includeCountryFilter = false,
}: Props) {
  const countrySlug = parseCountryNameForApi(program);
  const [dashboards, setDashboards] = useState<IDashboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBiTool, setFilterBiTool] = useState("all");
  const [filterCountry, setFilterCountry] = useState(countrySlug || "all");
  const [sortBy, setSortBy] = useState("updated_desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<IDashboardData>();
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewDashboard, setPreviewDashboard] = useState<IDashboardData>();
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dashboardToEdit, setDashboardToEdit] = useState<IDashboardData | null>(
    null,
  );
  const [editFormData, setEditFormData] = useState<{
    title: string;
    description: string;
    tags: string;
    embed_url: string;
    status: IDashboardData["status"];
    bi_tool: IDashboardData["bi_tool"];
  }>({
    title: "",
    description: "",
    tags: "",
    embed_url: "",
    status: "draft",
    bi_tool: "powerbi",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Duplicate state
  const [isDuplicating, setIsDuplicating] = useState(false);

  const countryOptions = useMemo(() => {
    return [
      { value: "all", label: "All Countries" },
      { value: "liberia", label: "Liberia" },
      { value: "malawi", label: "Malawi" },
      { value: "sierra_leone", label: "Sierra Leone" },
      { value: "ethiopia", label: "Ethiopia" },
    ];
  }, []);

  // Fetch dashboards from API
  const fetchDashboards = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LMD_API}/dashboards`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage =
            errorData?.message ||
            `HTTP ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();

        const dashboardsData = Array.isArray(data)
          ? data
          : data.data || data.dashboards || [];

        setDashboards(dashboardsData);

        if (showRefreshIndicator && !includeCountryFilter) {
          setFilterCountry(countrySlug || "all");
        }

        if (showRefreshIndicator) {
          toast.success("Dashboards refreshed successfully!");
        }
      } catch (error) {
        console.error("Error fetching dashboards:", error);
        setError((error as Error).message);
        toast.error(`Failed to fetch dashboards: ${(error as Error).message}`);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [countrySlug, includeCountryFilter],
  );

  useEffect(() => {
    fetchDashboards();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboards(true);
  };

  const getTagsArray = (tags: string) => {
    if (!tags) return [];
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  const filteredDashboards = useMemo(() => {
    if (isRefreshing) {
      return [];
    }

    let filtered = dashboards.filter((dashboard) => {
      const tagsArray = getTagsArray(dashboard.tags);

      const matchesSearch =
        dashboard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dashboard.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        tagsArray.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesStatus =
        filterStatus === "all" || dashboard.status === filterStatus;
      const matchesBiTool =
        filterBiTool === "all" || dashboard.bi_tool === filterBiTool;
      const matchesCountry =
        filterCountry === "all" ||
        dashboard.country?.toLowerCase() === filterCountry;

      return matchesSearch && matchesStatus && matchesBiTool && matchesCountry;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "updated_desc":
          return (
            new Date(b.last_update_date).getTime() -
            new Date(a.last_update_date).getTime()
          );
        case "created_desc":
          return (
            new Date(b.date_inserted).getTime() -
            new Date(a.date_inserted).getTime()
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
    dashboards,
    searchTerm,
    filterStatus,
    filterBiTool,
    filterCountry,
    sortBy,
    isRefreshing,
  ]);

  const handleDelete = (dashboard: IDashboardData) => {
    setDashboardToDelete(dashboard);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!dashboardToDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMD_API}/dashboards/${dashboardToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete dashboard: ${response.statusText}`);
      }

      setDashboards((prev) =>
        prev.filter((d) => d.id !== dashboardToDelete.id),
      );
      toast.success("Dashboard deleted successfully!");
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      toast.error(`Failed to delete dashboard: ${(error as Error).message}`);
    } finally {
      setDeleteDialogOpen(false);
      setDashboardToDelete(undefined);
    }
  };

  // Duplicate dashboard with API persistence
  const handleDuplicate = async (dashboard: IDashboardData) => {
    setIsDuplicating(true);

    try {
      const duplicateData = {
        title: `${dashboard.title} (Copy)`,
        description: dashboard.description,
        tags: dashboard.tags,
        embed_url: dashboard.embed_url,
        bi_tool: dashboard.bi_tool,
        country: dashboard.country,
        status: "draft",
        created_by: dashboard.created_by,
        slug: `${dashboard.slug}-copy-${Date.now()}`,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMD_API}/dashboards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(duplicateData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to duplicate dashboard: ${response.statusText}`,
        );
      }

      const newDashboard = await response.json();

      // Add the new dashboard to local state
      setDashboards((prev) => [newDashboard, ...prev]);
      toast.success("Dashboard duplicated successfully!");
    } catch (error) {
      console.error("Error duplicating dashboard:", error);
      toast.error(`Failed to duplicate dashboard: ${(error as Error).message}`);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handlePreview = (dashboard: IDashboardData) => {
    setPreviewDashboard(dashboard);
    setPreviewDialogOpen(true);
  };

  // Open edit dialog
  const handleEdit = (dashboard: IDashboardData) => {
    setDashboardToEdit(dashboard);
    setEditFormData({
      title: dashboard.title,
      description: dashboard.description,
      tags: dashboard.tags,
      embed_url: dashboard.embed_url,
      status: dashboard.status,
      bi_tool: dashboard.bi_tool,
    });
    setEditDialogOpen(true);
  };

  // Save edited dashboard
  const handleSaveEdit = async () => {
    if (!dashboardToEdit) return;

    setIsSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMD_API}/dashboards/${dashboardToEdit.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editFormData,
            last_update_date: new Date().toISOString(),
            published_at:
              editFormData.status === "published" &&
              dashboardToEdit.status !== "published"
                ? new Date().toISOString()
                : dashboardToEdit.published_at,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to update dashboard: ${response.statusText}`,
        );
      }

      const updatedDashboard = await response.json();

      // Update local state
      setDashboards((prev) =>
        prev.map((d) =>
          d.id === dashboardToEdit.id
            ? {
                ...d,
                ...editFormData,
                last_update_date: new Date().toISOString(),
                published_at:
                  editFormData.status === "published" &&
                  d.status !== "published"
                    ? new Date().toISOString()
                    : d.published_at,
              }
            : d,
        ),
      );

      toast.success("Dashboard updated successfully!");
      setEditDialogOpen(false);
      setDashboardToEdit(null);
    } catch (error) {
      console.error("Error updating dashboard:", error);
      toast.error(`Failed to update dashboard: ${(error as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (dashboardId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMD_API}/dashboards/${dashboardId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            published_at:
              newStatus === "published" ? new Date().toISOString() : null,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      setDashboards((prev) =>
        prev.map((d) =>
          String(d.id) === dashboardId
            ? {
                ...d,
                status: newStatus as IDashboardData["status"],
                last_update_date: new Date().toISOString(),
                published_at:
                  newStatus === "published"
                    ? new Date().toISOString()
                    : d.published_at,
              }
            : d,
        ),
      );

      toast.success(`Dashboard ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating dashboard status:", error);
      toast.error(`Failed to update status: ${(error as Error).message}`);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterBiTool("all");
    setSortBy("updated_desc");

    if (includeCountryFilter) {
      setFilterCountry("all");
    }
  };

  const hasActiveFilters = includeCountryFilter
    ? searchTerm ||
      filterStatus !== "all" ||
      filterBiTool !== "all" ||
      filterCountry !== "all"
    : searchTerm || filterStatus !== "all" || filterBiTool !== "all";

  const stats = useMemo(() => {
    if (isRefreshing) {
      return { total: 0, published: 0, draft: 0, archived: 0 };
    }

    const dataToAnalyze = includeCountryFilter
      ? dashboards
      : filteredDashboards;

    const total = dataToAnalyze.length;
    const published = dataToAnalyze.filter(
      (d) => d.status === "published",
    ).length;
    const draft = dataToAnalyze.filter((d) => d.status === "draft").length;
    const archived = dataToAnalyze.filter(
      (d) => d.status === "archived",
    ).length;

    return { total, published, draft, archived };
  }, [dashboards, filteredDashboards, includeCountryFilter, isRefreshing]);

  const modernStats = [
    {
      title: "Total Dashboards",
      value: stats.total,
      icon: BarChart3,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Published",
      value: stats.published,
      change:
        stats.total > 0
          ? `${Math.round((stats.published / stats.total) * 100)}% of total`
          : "0% of total",
      icon: Zap,
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

  // Render grid card for a dashboard
  const renderGridCard = (dashboard: IDashboardData) => {
    const tagsArray = getTagsArray(dashboard.tags);
    const statusColors: Record<string, string> = {
      published: "bg-emerald-500",
      draft: "bg-amber-500",
      archived: "bg-gray-400",
    };

    return (
      <Card
        key={dashboard.id}
        className="border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group overflow-hidden"
      >
        <div
          className={`h-1.5 ${statusColors[dashboard.status] || "bg-gray-300"}`}
        />
        <CardContent className="p-5">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {dashboard.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                  {dashboard.description}
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
                    onClick={() => handlePreview(dashboard)}
                  >
                    <Eye className="h-4 w-4" />
                    Preview Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleEdit(dashboard)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleDuplicate(dashboard)}
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
                      href={dashboard.embed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in BI Tool
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer"
                    onClick={() => handleDelete(dashboard)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Dashboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Status and BI Tool badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(dashboard.status)}
              {getBIToolBadge(dashboard.bi_tool)}
            </div>

            {/* Tags */}
            {tagsArray.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tagsArray.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5"
                  >
                    {tag}
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

            {/* Footer */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {dashboard.created_by}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(dashboard.last_update_date)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Show loading state
  //   if (isLoading) {
  //     return (
  //       <div className="h-full flex items-center justify-center">
  //         <div className="text-center">
  //           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
  //           <p className="text-lg font-medium">Loading dashboards...</p>
  //           <p className="text-gray-500">Please wait while we fetch your data</p>
  //         </div>
  //       </div>
  //     );
  //   }

  // Show error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Dashboards
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => fetchDashboards()}
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
    <div className="flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-6 pb-12">
          {/* Modern Stats Grid */}
          <ReportStatsCard
            modernStats={modernStats}
            isRefreshing={isRefreshing}
          />

          {/* Collapsible Filters Section */}
          <Card className="border-0 shadow-sm pt-3 px-0 pb-[1px]">
            <Collapsible
              open={!filtersCollapsed}
              onOpenChange={(open: any) => setFiltersCollapsed(!open)}
            >
              <CardHeader className="pb-4 -mb-2 px-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-lg">Filter & Search</CardTitle>
                    {hasActiveFilters && !isRefreshing && (
                      <Badge variant="secondary" className="text-xs">
                        {filteredDashboards.length} of {dashboards.length}
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
                            ? " shadow-sm"
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
                    <Button
                      size={"sm"}
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
                    <EmbeddDashboardModal program={program} />
                  </div>
                </div>
              </CardHeader>
              <CollapsibleContent className="">
                <CardContent className="pt-0 pb-3 px-3">
                  <div className="flex flex-col lg:flex-row gap-4 ">
                    {/* Search */}
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search dashboards, descriptions, or tags..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10  dark:border-gray-200"
                          disabled={isRefreshing}
                        />
                      </div>
                    </div>

                    {/* Filter dropdowns */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* dashboard status filter */}
                      <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                        disabled={isRefreshing}
                      >
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {dashboardStatusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* BI Tool filter */}
                      <Select
                        value={filterBiTool}
                        onValueChange={setFilterBiTool}
                        disabled={isRefreshing}
                      >
                        <SelectTrigger className="w-full sm:w-[150px] ">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {dashboardBiToolsOptions.map((tool) => (
                            <SelectItem key={tool.value} value={tool.value}>
                              {tool.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Country filter */}
                      {includeCountryFilter && (
                        <Select
                          value={filterCountry}
                          onValueChange={setFilterCountry}
                          disabled={isRefreshing}
                        >
                          <SelectTrigger className="w-full sm:w-[150px] ">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countryOptions.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                {country.label}
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
                        <SelectTrigger className="w-full sm:w-[160px]">
                          <SortAsc className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {dashboardSortOptions.map((option) => (
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

          {/* Content Area - List or Grid View */}
          {viewMode === "list" ? (
            /* Table Container */
            <Card className="border-0 shadow-sm flex-1 flex flex-col overflow-hidden pt-0">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white dark:bg-background border-b sticky top-0 backdrop-blur-sm">
                    <tr>
                      <th className="text-left p-6 font-bold text-[16px]">
                        Dashboard
                        <InfoContainer
                          id={"dashboardTitleInfo"}
                          text={
                            "Title and description of the dashboard, along with associated tags."
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
                                Dashboard that is live and accessible to users.
                              </li>
                              <li>
                                <span className="font-medium underline">
                                  Draft:
                                </span>{" "}
                                Dashboard that is being created or edited but
                                not yet published.
                              </li>
                              <li>
                                <span className="font-medium underline">
                                  Archived:
                                </span>{" "}
                                Dashboard that has been moved to a historical
                                archive.
                              </li>
                            </ul>
                          </div>
                        </InfoContainer>
                      </th>
                      <th className="text-left p-6 font-bold text-[16px]">
                        BI Tool
                      </th>
                      {includeCountryFilter && (
                        <th className="text-left p-6 font-bold text-[16px]">
                          Country
                        </th>
                      )}
                      <th className="text-left p-6 font-bold text-[16px]">
                        Created
                      </th>
                      <th className="text-left p-6 font-bold text-[16px]">
                        Updated
                      </th>
                      <th className="text-left p-6 font-bold text-[16px] w-12">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {isRefreshing ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <SkeletonTableRow key={`skeleton-${index}`} />
                      ))
                    ) : filteredDashboards.length > 0 ? (
                      filteredDashboards.map((dashboard, index) => {
                        const tagsArray = getTagsArray(dashboard.tags);

                        return (
                          <tr
                            key={dashboard.id}
                            className={`border-b border-gray-100 hover:bg-lmh-blue/20 transition-colors group ${
                              index === filteredDashboards.length - 1
                                ? "border-b-0"
                                : ""
                            }`}
                          >
                            <td className="p-6">
                              <div className="space-y-3">
                                <div>
                                  <p className="font-semibold mb-1  transition-colors">
                                    {dashboard.title}
                                  </p>
                                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                    {dashboard.description}
                                  </p>
                                </div>
                                {tagsArray.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {tagsArray.slice(0, 3).map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs bg-amber-200 text-gray-800 border-amber-800 px-2 py-0.5"
                                      >
                                        {tag}
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
                                  Created by {dashboard.created_by}
                                </div>
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="space-y-2">
                                {getStatusBadge(dashboard.status)}
                                {dashboard.status === "published" &&
                                  dashboard.published_at && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                      <Activity className="h-3 w-3" />
                                      Published{" "}
                                      {formatDate(dashboard.published_at)}
                                    </p>
                                  )}
                              </div>
                            </td>
                            <td className="p-6">
                              {getBIToolBadge(dashboard.bi_tool)}
                            </td>
                            {includeCountryFilter && (
                              <td className="p-6">
                                <Badge
                                  variant="outline"
                                  className="bg-gray-50 text-gray-700 border-gray-200"
                                >
                                  {dashboard.country}
                                </Badge>
                              </td>
                            )}
                            <td className="p-6">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {formatDate(dashboard.date_inserted)}
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {formatDate(dashboard.last_update_date)}
                              </div>
                            </td>
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
                                    onClick={() => handlePreview(dashboard)}
                                  >
                                    <Eye className="h-4 w-4" />
                                    Preview Dashboard
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleEdit(dashboard)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleDuplicate(dashboard)}
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
                                      href={dashboard.embed_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Open in BI Tool
                                    </a>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                    <span className="text-sm">
                                      Change Status:
                                    </span>
                                    <Select
                                      value={dashboard.status}
                                      onValueChange={(value) =>
                                        handleStatusChange(
                                          String(dashboard.id),
                                          value,
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
                                    onClick={() => handleDelete(dashboard)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Dashboard
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-16 text-center">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 bg-gray-50 rounded-full">
                              <BarChart3 className="h-12 w-12 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No dashboards found
                              </h3>
                              <p className="text-gray-600 mb-4 max-w-md">
                                {hasActiveFilters
                                  ? "Try adjusting your search criteria or filters to find what you're looking for."
                                  : "Get started by creating your first dashboard to visualize your data."}
                              </p>
                              {!hasActiveFilters && (
                                <EmbeddDashboardModal program={program} />
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
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {isRefreshing ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonGridCard key={`skeleton-grid-${index}`} />
                ))
              ) : filteredDashboards.length > 0 ? (
                filteredDashboards.map((dashboard) => renderGridCard(dashboard))
              ) : (
                <div className="col-span-full">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-16 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-gray-50 rounded-full">
                          <BarChart3 className="h-12 w-12 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No dashboards found
                          </h3>
                          <p className="text-gray-600 mb-4 max-w-md">
                            {hasActiveFilters
                              ? "Try adjusting your search criteria or filters to find what you're looking for."
                              : "Get started by creating your first dashboard to visualize your data."}
                          </p>
                          {!hasActiveFilters && (
                            <EmbeddDashboardModal program={program} />
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              Delete Dashboard
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete{" "}
              <strong>&quot;{dashboardToDelete?.title}&quot;</strong>? This
              action cannot be undone and will permanently remove all associated
              data.
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
              Delete Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dashboard Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Edit className="h-5 w-5 text-blue-600" />
              </div>
              Edit Dashboard
            </DialogTitle>
            <DialogDescription className="pt-2">
              Update the dashboard details below. Changes will be saved to the
              database.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Dashboard title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Dashboard description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={editFormData.tags}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="e.g., health, analytics, 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-embed-url">Embed URL</Label>
              <Input
                id="edit-embed-url"
                value={editFormData.embed_url}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    embed_url: e.target.value,
                  }))
                }
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      status: value as IDashboardData["status"],
                    }))
                  }
                >
                  <SelectTrigger id="edit-status">
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
                <Label htmlFor="edit-bi-tool">BI Tool</Label>
                <Select
                  value={editFormData.bi_tool}
                  onValueChange={(value) =>
                    setEditFormData((prev) => ({ ...prev, bi_tool: value }))
                  }
                >
                  <SelectTrigger id="edit-bi-tool">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dashboardBiToolsOptions
                      .filter((opt) => opt.value !== "all")
                      .map((tool) => (
                        <SelectItem key={tool.value} value={tool.value}>
                          {tool.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setDashboardToEdit(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <PreviewDashboardModal
        previewDialogOpen={previewDialogOpen}
        setPreviewDialogOpen={setPreviewDialogOpen}
        previewDashboard={previewDashboard}
      />
    </div>
  );
}
