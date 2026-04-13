// components/okr/dashboardHeader.tsx
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  RefreshCcw,
  Filter,
  X,
  Star,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { OKRFilters } from "./dashboardContent";
import { OkrStatus } from "@/types/okrTracker";
import { formatMonthYearDisplay } from "@/utils/okr-helpers";

interface DashboardHeaderProps {
  filters: OKRFilters;
  onFilterChange: (filters: OKRFilters) => void;
  uniqueValues: {
    statuses: OkrStatus[];
    priorities: number[];
    objectiveTocs: string[];
    monthYears: Array<{
      month: number;
      year: number;
      display: string;
      key: string;
    }>;
  };
  activeFilterCount: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const formatStatus = (status: OkrStatus): string => {
  const statusMap: Record<OkrStatus, string> = {
    achieved: "Achieved",
    on_track: "On Track",
    delayed: "Delayed",
    okr_under_review: "Under Review",
    at_risk: "At Risk",
  };
  return statusMap[status];
};

function DashboardHeader({
  filters,
  onFilterChange,
  uniqueValues,
  activeFilterCount,
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    onFilterChange({
      status: "all",
      priority: "all",
      objectiveToc: "all",
      month: "all",
      year: "all",
      searchText: "",
    });
  };

  return (
    <div className="bg-card border-b border-border -mt-[0.5px]">
      <div className="max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-4">
        {/* Top Header Row */}
        <div className="py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-lmh-pink">
                  OKR Dashboard
                </h1>
              </div>
            </div>
            <div className="gap-2 flex items-center">
              {/* Filter Toggle Button */}
              <Button
                variant={isExpanded ? "default" : "outline"}
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                {isExpanded ? "Hide" : "Show"} Filters
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1 min-w-[20px] h-5"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              {/* Clear Filters Button */}
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </Button>
              )}

              {/* Refresh Button */}
              <Button
                className="h-8"
                size="icon"
                variant="dark-blue"
                onClick={onRefresh}
                disabled={isRefreshing}
                title={isRefreshing ? "Refreshing..." : "Refresh OKRs"}
              >
                <RefreshCcw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Expandable Filter Section */}
        {isExpanded && (
          <div className="border-t border-border">
            <div className="py-4 space-y-4">
              {/* Filter Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search Input */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search OKRs..."
                      value={filters.searchText}
                      onChange={(e) =>
                        onFilterChange({
                          ...filters,
                          searchText: e.target.value,
                        })
                      }
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      onFilterChange({
                        ...filters,
                        status: value as OkrStatus | "all",
                      })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {uniqueValues.statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatStatus(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Priority
                  </label>
                  <Select
                    value={String(filters.priority)}
                    onValueChange={(value) =>
                      onFilterChange({
                        ...filters,
                        priority: value === "all" ? "all" : Number(value),
                      })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      {uniqueValues.priorities.map((priority) => (
                        <SelectItem key={priority} value={String(priority)}>
                          <div className="flex items-center gap-2">
                            {priority} Star{priority !== 1 ? "s" : ""}
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: priority }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Objective TOC Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Objective
                  </label>
                  <Select
                    value={filters.objectiveToc}
                    onValueChange={(value) =>
                      onFilterChange({ ...filters, objectiveToc: value })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Objectives" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Objectives</SelectItem>
                      {uniqueValues.objectiveTocs.map((toc) => (
                        <SelectItem key={toc} value={toc}>
                          {toc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Month/Year Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Month
                  </label>
                  <Select
                    value={
                      filters.month !== "all" && filters.year !== "all"
                        ? `${filters.month}_${filters.year}`
                        : "all"
                    }
                    onValueChange={(value) => {
                      if (value === "all") {
                        onFilterChange({
                          ...filters,
                          month: "all",
                          year: "all",
                        });
                      } else {
                        const [month, year] = value.split("_").map(Number);
                        onFilterChange({
                          ...filters,
                          month,
                          year,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Months" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {uniqueValues.monthYears.map((my) => (
                        <SelectItem key={my.key} value={my.key}>
                          {my.display}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Active Filters:
                  </span>
                  {filters.status !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Status: {formatStatus(filters.status as OkrStatus)}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() =>
                          onFilterChange({ ...filters, status: "all" })
                        }
                      />
                    </Badge>
                  )}
                  {filters.priority !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Priority: {filters.priority}★
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() =>
                          onFilterChange({ ...filters, priority: "all" })
                        }
                      />
                    </Badge>
                  )}
                  {filters.objectiveToc !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Objective: {filters.objectiveToc}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() =>
                          onFilterChange({ ...filters, objectiveToc: "all" })
                        }
                      />
                    </Badge>
                  )}
                  {filters.month !== "all" && filters.year !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Month:{" "}
                      {formatMonthYearDisplay(
                        filters.month as number,
                        filters.year as number,
                      )}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() =>
                          onFilterChange({
                            ...filters,
                            month: "all",
                            year: "all",
                          })
                        }
                      />
                    </Badge>
                  )}
                  {filters.searchText && (
                    <Badge variant="secondary" className="gap-1">
                      Search: &quot;{filters.searchText}&quot;
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() =>
                          onFilterChange({ ...filters, searchText: "" })
                        }
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardHeader;
