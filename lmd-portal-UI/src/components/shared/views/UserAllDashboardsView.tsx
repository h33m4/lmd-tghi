"use client";

import {
  Calendar,
  ChevronDown,
  ExternalLink,
  Search,
  User,
  X,
  RefreshCw,
  Loader2,
} from "lucide-react";
import React, { useState, useMemo, useCallback, useEffect } from "react";

import { toast } from "sonner";
import { ICountryNames, LMH_ProgramCountries } from "@/types";
import { IDashboardData, ILocalCustomDashboardData } from "@/types/dashboard";
import { formatDate } from "@/components/shared/dashboards/RecentDashboards";
import { Button } from "@/components/ui/button";
import { parseCountryNameForApi } from "@/utils/parseCountryNameForAPI";
import { useRouter } from "next/navigation";

const dashboardStatusOptions = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const dashboardBiToolsOptions = [
  { value: "all", label: "All BI Tools" },
  { value: "powerbi", label: "Power BI" },
  { value: "looker_studio", label: "Looker Studio" },
  { value: "tableau", label: "Tableau" },
  { value: "qlik", label: "Qlik" },
  { value: "custom", label: "Custom" },
  { value: "other", label: "Other" },
];

const dashboardSortOptions = [
  { value: "updated_desc", label: "Recently Updated" },
  { value: "created_desc", label: "Recently Created" },
  { value: "title_asc", label: "Title (A-Z)" },
  // { value: "status_asc", label: "Status" },
];

interface UserDashboardProps {
  dashboard: IDashboardData;
  country: LMH_ProgramCountries;
}

const biToolMeta: Record<string, { label: string; icon: string }> = {
  powerbi:       { label: "Power BI",      icon: "⚡" },
  looker_studio: { label: "Looker Studio", icon: "📈" },
  tableau:       { label: "Tableau",       icon: "📊" },
  qlik:          { label: "Qlik",          icon: "🔷" },
  custom:        { label: "Custom",        icon: "🛠" },
  other:         { label: "Other",         icon: "📉" },
};

// Skeleton loader matching the new card structure
const DashboardCardSkeleton = () => (
  <div className="rounded-xl border-2 border-gray-200 overflow-hidden animate-pulse bg-background">
    <div className="h-28 w-full bg-gray-300 dark:bg-gray-700" />
    <div className="px-4 pb-4 pt-3 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      <div className="flex gap-1 pt-1">
        <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-md" />
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
      </div>
      <div className="pt-2 border-t border-gray-100 flex justify-between">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

const UserDashboardCard = ({ dashboard, country }: UserDashboardProps) => {
  const router = useRouter();
  const biTool = biToolMeta[dashboard.bi_tool?.toLowerCase()] ?? biToolMeta.other;
  const tagsArray = dashboard.tags
    ? dashboard.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="group relative rounded-xl border-2 border-gray-200 dark:border-neutral-dark-300 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-lmh-dark-blue/40 cursor-pointer bg-background"
      onClick={() => router.push(`dashboards/${dashboard.slug}?id=${dashboard.id}`)}
    >
      {/* External link — top right */}
      {dashboard.embed_url && (
        <a
          href={dashboard.embed_url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}

      {/* Header — emerald for published */}
      <div className="h-28 w-full bg-gradient-to-br from-emerald-500 to-emerald-600 relative flex flex-col justify-between p-4">
        <div className="flex items-center gap-1.5 self-start">
          <span className="w-2 h-2 rounded-full bg-emerald-300" />
          <span className="text-white/80 text-xs">Published</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{biTool.icon}</span>
          <span className="text-white font-semibold text-sm">{biTool.label}</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-3 space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-lmh-dark-blue transition-colors line-clamp-1">
          {dashboard.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {dashboard.description}
        </p>
        {tagsArray.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tagsArray.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-md">
                {tag}
              </span>
            ))}
            {tagsArray.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-0.5">+{tagsArray.length - 3} more</span>
            )}
          </div>
        )}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
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
    </div>
  );
};

const LocalDashboardCard = ({ local }: { local: ILocalCustomDashboardData }) => {
  const router = useRouter();
  return (
    <div
      className="group relative rounded-xl border-2 border-lmh-dark-blue/30 dark:border-neutral-dark-300 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-lmh-dark-blue/60 cursor-pointer bg-background"
      onClick={() => router.push(local.page_url)}
    >
      {/* Header — dark-blue→cyan for custom */}
      <div className="h-28 w-full bg-gradient-to-br from-lmh-dark-blue to-cyan-700 relative flex flex-col justify-between p-4">
        <div className="flex items-center gap-1.5 self-start">
          <span className="w-2 h-2 rounded-full bg-cyan-300" />
          <span className="text-white/80 text-xs">Custom</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛠</span>
          <span className="text-white font-semibold text-sm">Local Dashboard</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-3 space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-lmh-dark-blue transition-colors line-clamp-1">
          {local.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {local.description}
        </p>
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-lmh-dark-blue/10 text-lmh-dark-blue font-medium">Local</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 font-medium">Custom</span>
        </div>
      </div>
    </div>
  );
};

interface UserAllDashboardsViewProps {
  country: LMH_ProgramCountries;
  localCustomDashboards?: ILocalCustomDashboardData[];
  showOnlyPublished?: boolean;
}

function UserAllDashboardsView({
  country,
  localCustomDashboards = [],
  showOnlyPublished,
}: UserAllDashboardsViewProps) {
  const countrySlug = parseCountryNameForApi(country);
  const [dashboards, setDashboards] = useState<IDashboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [biToolFilter, setBiToolFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState(countrySlug || "all");
  const [sortBy, setSortBy] = useState("updated_desc");

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
              // Add any required authentication headers here
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

        // Handle both array response and paginated response
        const dashboardsData = Array.isArray(data)
          ? data
          : data.data || data.dashboards || [];

        setDashboards(dashboardsData);

        if (showRefreshIndicator) {
          setCountryFilter(countrySlug || "all");
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
    [countrySlug],
  );

  // Initial fetch on component mount
  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboards(true);
  };

  // Convert tags string to array for filtering
  const getTagsArray = (tags: string) => {
    if (!tags) return [];
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  // Only API dashboards go through filters; local custom dashboards are always shown
  const allDashboards = useMemo(() => dashboards, [dashboards]);

  // Filtered and sorted dashboards
  const filteredDashboards = useMemo(() => {
    // When refreshing, return empty array
    if (isRefreshing) {
      return [];
    }

    let filtered = allDashboards.filter((dashboard) => {
      const tagsArray = getTagsArray(dashboard.tags);

      const matchesSearch =
        dashboard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dashboard.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        tagsArray.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      // force publised status when showOnlyPublised is true
      const matchesStatus = showOnlyPublished
        ? dashboard.status === "published"
        : statusFilter === "all" || dashboard.status === statusFilter;
      const matchesBiTool =
        biToolFilter === "all" || dashboard.bi_tool === biToolFilter;
      const matchesCountry = (() => {
        // Always filter by the country prop - never show "all" countries
        if (!countrySlug) return true; // If no country specified, show all

        // Handle case where dashboard.country might be null/undefined
        if (!dashboard.country) return false;

        // Convert both values to lowercase for case-insensitive comparison
        const dashboardCountry = dashboard.country
          .toLowerCase()
          .replace(/\s+/g, "_");
        const selectedCountry = countrySlug.toLowerCase();

        return dashboardCountry === selectedCountry;
      })();

      return matchesSearch && matchesStatus && matchesBiTool && matchesCountry;
    });

    // Sort dashboards
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
    isRefreshing,
    allDashboards,
    searchTerm,
    statusFilter,
    biToolFilter,
    countrySlug,
    sortBy,
    showOnlyPublished,
  ]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    if (!showOnlyPublished) {
      setStatusFilter("all");
    }
    setBiToolFilter("all");
    setSortBy("updated_desc");
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm !== "" ||
    (!showOnlyPublished && statusFilter !== "all") ||
    biToolFilter !== "all";

  useEffect(() => {
    // Ensure country filter is always set to the prop value
    setCountryFilter(countrySlug || "all");
  }, [countrySlug]);

  const countrySpecificDashboards = useMemo(() => {
    if (!countrySlug) return allDashboards;

    return allDashboards.filter((dashboard) => {
      if (!dashboard.country) return false;
      const dashboardCountry = dashboard.country
        .toLowerCase()
        .replace(/\s+/g, "_");
      const selectedCountry = countrySlug.toLowerCase();
      return dashboardCountry === selectedCountry;
    });
  }, [countrySlug, allDashboards]);

  return (
    <div className="h-full flex flex-col">
      {/* Static Filters Section */}
      <div className="flex-shrink-0 bg-gradient-to-b from-transparent to-background border-b  px-4 py-2">
        <div className="flex gap-4 items-end flex-wrap  justify-between">
          <div className=" flex  items-end gap-2">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px] max-w-sm">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-input"
                  placeholder="Search dashboards..."
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
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none border border-gray-300 rounded-md px-3 py-2 pr-8 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-input"
                  >
                    {dashboardStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* BI Tool Filter */}
            <div className="min-w-[140px]">
              <label
                htmlFor="bitool"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                BI Tool
              </label>
              <div className="relative">
                <select
                  id="bitool"
                  value={biToolFilter}
                  onChange={(e) => setBiToolFilter(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-md px-3 py-2 pr-8 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-input"
                >
                  {dashboardBiToolsOptions.map((tool) => (
                    <option key={tool.value} value={tool.value}>
                      {tool.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Sort Filter */}
            <div className="min-w-[140px]">
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sort By
              </label>
              <div className="relative">
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-md px-3 py-2 pr-8 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-input"
                >
                  {dashboardSortOptions.map((option) => (
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
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          <div>
            <Button
              size="sm"
              variant={"dark-blue"}
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
          <div>
            {showOnlyPublished ? (
              <>Showing {filteredDashboards.length} reports</>
            ) : (
              <>
                {" "}
                Showing {filteredDashboards.length} of{" "}
                {countrySpecificDashboards.length} dashboards
              </>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
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
              {biToolFilter !== "all" && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  Tool:{" "}
                  {dashboardBiToolsOptions.find(
                    (tool) => tool.value === biToolFilter,
                  )?.label || biToolFilter}
                  <button
                    onClick={() => setBiToolFilter("all")}
                    className="ml-1 hover:text-purple-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {sortBy !== "updated_desc" && (
                <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                  Sort:{" "}
                  {dashboardSortOptions.find((sort) => sort.value === sortBy)
                    ?.label || sortBy}
                  <button
                    onClick={() => setSortBy("updated_desc")}
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

      {/* Scrollable Dashboards Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-8">
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))" }}>
            {/* Local custom dashboards — always shown immediately, no loading state */}
            {localCustomDashboards.map((local) => (
              <LocalDashboardCard key={`local-${local.id}`} local={local} />
            ))}

            {/* API dashboards or skeletons while loading/refreshing */}
            {(isLoading || isRefreshing)
              ? Array.from({ length: 4 }).map((_, index) => (
                  <DashboardCardSkeleton key={`skeleton-${index}`} />
                ))
              : filteredDashboards.map((dashboard) => (
                  <UserDashboardCard
                    key={dashboard.id}
                    dashboard={dashboard}
                    country={country}
                  />
                ))
            }
          </div>

          {filteredDashboards.length === 0 && localCustomDashboards.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No dashboards found
              </h3>
              <p className="text-gray-500 mb-4 max-w-sm">
                No dashboards match your current search criteria. Try adjusting
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
        </div>
      </div>
    </div>
  );
}

export default UserAllDashboardsView;
