"use client";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronRight,
  Edit,
  Eye,
  Users,
  Zap,
  Database,
  RefreshCw,
  Loader2,
  X,
  ExternalLink,
  BarChart3,
} from "lucide-react";

import React, { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { LMH_ProgramCountries } from "@/types";
import { IDashboardData } from "@/types/dashboard";
import { parseCountryNameForApi } from "@/utils/parseCountryNameForAPI";
import AdminSectionComponent from "../program-admin/AdminSectionComponent";
import { formatDate } from "@/utils/date-helpers";

interface Props {
  country: LMH_ProgramCountries;
}

const getBIToolBadge = (tool: string) => {
  const toolConfig = {
    powerbi: {
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      label: "Power BI",
      icon: "⚡",
    },
    tableau: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Tableau",
      icon: "📊",
    },
    looker_studio: {
      color: "bg-green-50 text-green-700 border-green-200",
      label: "Looker Studio",
      icon: "📈",
    },
    qlik: {
      color: "bg-purple-50 text-purple-700 border-purple-200",
      label: "Qlik",
      icon: "🔷",
    },
    other: {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      label: "Other",
      icon: "🔧",
    },
  };

  const config =
    toolConfig[tool as keyof typeof toolConfig] || toolConfig.other;

  return (
    <Badge
      variant="outline"
      className={`${config.color} text-xs font-medium px-2.5 py-1`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    published: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      icon: Zap,
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
    },
    draft: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
      icon: Edit,
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
    archived: {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      dot: "bg-gray-500",
      icon: Database,
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-200",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.archived;

  return (
    <Badge
      variant="outline"
      className={`${config.color} flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium`}
    >
      <div className={`w-2 h-2 rounded-full ${config.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Skeleton component for dashboard cards
const SkeletonDashboardCard = () => (
  <Card className="border-gray-200 flex flex-col h-full">
    <CardHeader className="pb-4 flex-1">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </CardHeader>

    <CardContent className="pt-0 mt-auto">
      {/* Status and BI Tool Row */}
      <div className="flex justify-between items-center gap-2 mb-3">
        <div className="h-7 bg-gray-200 rounded animate-pulse w-20"></div>
        <div className="h-7 bg-gray-200 rounded animate-pulse w-24"></div>
      </div>

      {/* Bottom Info Row */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
      </div>
    </CardContent>
  </Card>
);

// Preview Modal Component
const PreviewDashboardModal = ({
  dashboard,
  isOpen,
  onClose,
}: {
  dashboard: IDashboardData | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!dashboard) return null;

  const tagsArray = dashboard.tags
    ? dashboard.tags
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
                {dashboard.title}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base leading-relaxed">
                {dashboard.description}
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
          {/* Dashboard Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">{getStatusBadge(dashboard.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  BI Tool
                </label>
                <div className="mt-1">{getBIToolBadge(dashboard.bi_tool)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Country
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {dashboard.country || "N/A"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Created By
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {dashboard.created_by}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Created Date
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(dashboard.date_inserted)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Updated
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(dashboard.last_update_date)}
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

          {/* Dashboard Embed Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Dashboard Preview
              </label>
              {dashboard.embed_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() =>
                    window.open(
                      dashboard.embed_url,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <ExternalLink className="h-3 w-3" />
                  Open in BI Tool
                </Button>
              )}
            </div>

            <div className="border rounded-lg overflow-hidden bg-white">
              {dashboard.embed_url ? (
                <iframe
                  src={dashboard.embed_url}
                  className="w-full h-96 border-0"
                  title={`${dashboard.title} Dashboard`}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-50 text-gray-500">
                  <div className="text-center">
                    <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">No preview available</p>
                    <p className="text-sm">
                      Embed URL not configured for this dashboard
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
                {dashboard.data_source || "Not specified"}
              </p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Program</label>
              <p className="text-gray-900 mt-1">
                {dashboard.program || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DashboardCard = ({
  dashboard,
  onPreview,
}: {
  dashboard: IDashboardData;
  onPreview: (dashboard: IDashboardData) => void;
}) => (
  <Card className="group transition-all duration-200 border-gray-200 hover:border-[#BFEAF6] hover:shadow-[0_0px_14px_2px_rgba(75,183,214,0.80)] flex flex-col h-full">
    <CardHeader className="pb-4 flex-1">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <CardTitle className="text-base font-semibold text-lmh-dark-blue dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {dashboard.title}
          </CardTitle>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {dashboard.description}
          </p>
        </div>
        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onPreview(dashboard)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>

    <CardContent className="pt-0 mt-auto">
      {/* Status and BI Tool Row */}
      <div className="flex justify-between items-center gap-2 mb-3">
        {getStatusBadge(dashboard.status)}
        {getBIToolBadge(dashboard.bi_tool)}
      </div>

      {/* Bottom Info Row */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {dashboard.created_by}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(dashboard.last_update_date)}
        </span>
      </div>
    </CardContent>
  </Card>
);

function RecentDashboards({ country }: Props) {
  const [dashboards, setDashboards] = useState<IDashboardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [previewDashboard, setPreviewDashboard] =
    useState<IDashboardData | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Add country slug for filtering
  const countrySlug = parseCountryNameForApi(country);

  const fetchDashboards = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMD_API}/dashboards`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboards: ${response.status}`);
      }

      const data = await response.json();

      // Filter dashboards by country before setting state
      const filteredData = data.filter((dashboard: IDashboardData) => {
        if (!countrySlug) return true; // If no country specified, show all

        // Handle case where dashboard.country might be null/undefined
        if (!dashboard.country) return false;

        // Convert both values to lowercase for case-insensitive comparison
        const dashboardCountry = dashboard.country
          .toLowerCase()
          .replace(/\s+/g, "_");
        const selectedCountry = countrySlug.toLowerCase();

        return dashboardCountry === selectedCountry;
      });

      setDashboards(filteredData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboards"
      );
      console.error("Error fetching dashboards:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Sort dashboards by last_update_date to show most recent first
  const recentDashboards = useMemo(() => {
    return [...dashboards]
      .sort(
        (a, b) =>
          new Date(b.last_update_date).getTime() -
          new Date(a.last_update_date).getTime()
      )
      .slice(0, 3); // Show only 3 most recent
  }, [dashboards]);

  const handleRefresh = () => {
    fetchDashboards(true);
  };

  const handlePreview = (dashboard: IDashboardData) => {
    setPreviewDashboard(dashboard);
    setPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
    setPreviewDashboard(null);
  };

  // Update useEffect to include countrySlug dependency
  useEffect(() => {
    fetchDashboards();
  }, [countrySlug]);

  return (
    <>
      <AdminSectionComponent
        rightSideHeaderContent={
          <div className="flex items-center gap-2 ">
            <Button
              size="sm"
              variant={"dark-blue"}
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
              href={`/country-programs/${country.toLowerCase()}/admin/dashboards`}
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
        HeaderIcon={BarChart3}
        title="Dashboard"
        description="Latest report updates and activities for Liberia"
      >
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonDashboardCard key={`skeleton-${index}`} />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-500">Error: {error}</div>
            </div>
          ) : refreshing ? (
            // Show skeleton cards when refreshing
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonDashboardCard key={`skeleton-${index}`} />
              ))}
            </div>
          ) : recentDashboards.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">
                No dashboards found for {country}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentDashboards.map((dashboard) => (
                <DashboardCard
                  key={dashboard.id}
                  dashboard={dashboard}
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

export default RecentDashboards;
export {
  RecentDashboards,
  formatDate,
  getStatusBadge,
  getBIToolBadge,
  DashboardCard,
};
