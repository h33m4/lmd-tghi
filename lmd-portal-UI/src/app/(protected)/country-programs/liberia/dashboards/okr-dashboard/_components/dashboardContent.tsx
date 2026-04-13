"use client";
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import DashboardHeader from "./dashboardHeader";
import { StatsOverview } from "./statusOverview";
import OKRCard7 from "./okrCard7";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { OkrGroup, OkrRecord, OkrStatus } from "@/types/okrTracker";
import { transformDbOkrToRecord } from "@/lib/okr-transform";
import {
  getCurrentMonthYear,
  getOkrDashboardUniqueValues,
} from "@/utils/okr-helpers";
import { toast } from "sonner";
import { getAllOKRs } from "@/lib/actions/okr-dashboard/okr";
import { DashboardSkeleton } from "./skeletons";
import ViewOkrTrackerRecordModal from "./ViewOkrTrackerRecordModal";

export interface OKRFilters {
  status: OkrStatus | "all";
  priority: number | "all";
  objectiveToc: string | "all";
  month: number | "all";
  year: number | "all";
  searchText: string;
}

interface DashboardContentProps {
  month?: number;
  year?: number;
}

// Group OKRs by objectiveId — stable even if TOC/objective text is renamed
function groupOkrsByObjective(okrs: OkrRecord[]): OkrGroup[] {
  const grouped = new Map<string, OkrRecord[]>();

  okrs.forEach((okr) => {
    const key = okr.objectiveId;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(okr);
  });

  return Array.from(grouped.entries()).map(([, groupOkrs], index) => {
    const groupId = parseInt(groupOkrs[0].okrId.split(".")[0]) || index + 1;
    return {
      okrGroupId: groupId,
      okrGroupToc: groupOkrs[0].objectiveToc,
      okrGroupObjective: groupOkrs[0].objective,
    };
  });
}

const DEFAULT_FILTERS: OKRFilters = {
  status: "all",
  priority: "all",
  objectiveToc: "all",
  month: "all",
  year: "all",
  searchText: "",
};

function DashboardContent({ month, year }: DashboardContentProps) {
  const [okrs, setOkrs] = useState<OkrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(
    new Set(),
  );
  const [selectedOkr, setSelectedOkr] = useState<OkrRecord | null>(null);
  const [openAddUpdate, setOpenAddUpdate] = useState(false);

  const handleAddUpdateForOkr = useCallback((okr: OkrRecord) => {
    setSelectedOkr(okr);
    setOpenAddUpdate(true);
  }, []);

  const currentDate = useMemo(() => getCurrentMonthYear(), []);
  const currentMonth = month || currentDate.month;
  const currentYear = year || currentDate.year;

  const [filters, setFilters] = useState<OKRFilters>(DEFAULT_FILTERS);

  // Ref for cleanup of the silent-refresh debounce timer
  const silentRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch OKRs function
  const fetchOKRs = useCallback(async (isRefresh = false, silent = false) => {
    try {
      if (!silent) {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
      }

      const result = await getAllOKRs();

      console.log("Raw OKR data from API:", result);

      if (result.success && result.data) {
        const transformedOkrs = result.data.map(transformDbOkrToRecord);
        setOkrs(transformedOkrs);

        console.log("Fetched OKRs:", transformedOkrs);

        if (isRefresh && !silent) {
          toast.success("OKRs refreshed successfully");
        }
      } else {
        if (!silent) {
          toast.error(result.error || "Failed to load OKRs");
        }
      }
    } catch (error) {
      console.error("Error fetching OKRs:", error);
      if (!silent) {
        toast.error("An error occurred while loading OKRs");
      }
    } finally {
      if (!silent) {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchOKRs(false);
  }, [fetchOKRs]);

  // Cancel any pending silent refresh on unmount
  useEffect(() => {
    return () => {
      if (silentRefreshTimer.current) {
        clearTimeout(silentRefreshTimer.current);
      }
    };
  }, []);

  const handleRefresh = useCallback(() => {
    fetchOKRs(true);
  }, [fetchOKRs]);

  const toggleGroup = useCallback((groupId: number) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, []);

  const handleOkrUpdate = useCallback(
    (updatedOkr: OkrRecord) => {
      // Optimistic update
      setOkrs((prevOkrs) =>
        prevOkrs.map((okr) => (okr.id === updatedOkr.id ? updatedOkr : okr)),
      );

      // Debounce the silent background re-fetch
      if (silentRefreshTimer.current) {
        clearTimeout(silentRefreshTimer.current);
      }
      silentRefreshTimer.current = setTimeout(() => {
        fetchOKRs(false, true);
      }, 800);
    },
    [fetchOKRs],
  );

  // Derived state — no separate okrGroups state to get out of sync
  const okrGroups = useMemo(() => groupOkrsByObjective(okrs), [okrs]);

  const uniqueValues = useMemo(() => getOkrDashboardUniqueValues(okrs), [okrs]);

  const filteredOKRs = useMemo(() => {
    return okrs.filter((okr) => {
      if (filters.status !== "all" && okr.status !== filters.status) {
        return false;
      }

      if (filters.priority !== "all" && okr.priority !== filters.priority) {
        return false;
      }

      if (
        filters.objectiveToc !== "all" &&
        okr.objectiveToc !== filters.objectiveToc
      ) {
        return false;
      }

      if (filters.month !== "all" && filters.year !== "all") {
        const hasMonthUpdate = okr.monthlyUpdates.some(
          (update) =>
            update.month === filters.month && update.year === filters.year,
        );
        if (!hasMonthUpdate) {
          return false;
        }
      }

      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesSearch =
          okr.keyResult.toLowerCase().includes(searchLower) ||
          okr.objective.toLowerCase().includes(searchLower) ||
          okr.okrId.toLowerCase().includes(searchLower) ||
          okr.monthlyUpdates.some((update) =>
            update.narrative.toLowerCase().includes(searchLower),
          );
        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    });
  }, [okrs, filters]);

  // Single-pass stat calculation instead of 6 separate .filter() calls
  const stats = useMemo(() => {
    let achieved = 0,
      onTrack = 0,
      delayed = 0,
      atRisk = 0,
      underReview = 0;
    for (const okr of filteredOKRs) {
      if (okr.status === "achieved") achieved++;
      else if (okr.status === "on_track") onTrack++;
      else if (okr.status === "delayed") delayed++;
      else if (okr.status === "at_risk") atRisk++;
      else if (okr.status === "okr_under_review") underReview++;
    }
    return {
      totalKRs: filteredOKRs.length,
      achieved,
      onTrack,
      delayed,
      atRisk,
      underReview,
    };
  }, [filteredOKRs]);

  const activeFilterCount = useMemo(
    () =>
      [
        filters.status !== "all",
        filters.priority !== "all",
        filters.objectiveToc !== "all",
        filters.month !== "all",
        filters.year !== "all",
        filters.searchText !== "",
      ].filter(Boolean).length,
    [filters],
  );

  const filteredGroups = useMemo(() => {
    return okrGroups
      .map((group) => ({
        ...group,
        okrs: filteredOKRs.filter((okr) =>
          okr.okrId.startsWith(`${group.okrGroupId}.`),
        ),
      }))
      .filter((group) => group.okrs.length > 0);
  }, [filteredOKRs, okrGroups]);

  return (
    <>
      {/* Header always rendered — avoids remount on loading→loaded transition */}
      <DashboardHeader
        filters={filters}
        onFilterChange={setFilters}
        uniqueValues={uniqueValues}
        activeFilterCount={activeFilterCount}
        onRefresh={handleRefresh}
        isRefreshing={refreshing || loading}
      />

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="@container/main border-none border-primary dark:border-border h-full bg-transparent rounded-md flex flex-col overflow-y-scroll">
          <main className="w-full max-w-[110rem] mx-auto px-2 sm:px-4 lg:px-4 py-6 space-y-8">
            <StatsOverview
              totalKRs={stats.totalKRs}
              onTrack={stats.onTrack}
              atRisk={stats.atRisk}
              behind={0}
              delayed={stats.delayed}
              achieved={stats.achieved}
              underReview={stats.underReview}
            />

            {filteredOKRs.length === 0 && (
              <div className="bg-gray-50 h-full flex items-center justify-center flex-col dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  No OKRs match your current filters
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {filteredGroups.map((okrGroup) => {
              const isCollapsed = collapsedGroups.has(okrGroup.okrGroupId);

              return (
                <div
                  key={okrGroup.okrGroupId}
                  className="border-b pb-6 space-y-4 border-l-4 border-gray-200"
                >
                  <div
                    className="border p-1 bg-gray-200 dark:bg-gray-700 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => toggleGroup(okrGroup.okrGroupId)}
                  >
                    <div className="py-2 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {isCollapsed ? (
                        <ChevronRight className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                      {okrGroup.okrGroupId}. {okrGroup.okrGroupToc}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {okrGroup.okrGroupObjective}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {okrGroup.okrs?.length || 0} OKR
                        {okrGroup.okrs?.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>

                  {!isCollapsed && okrGroup.okrs && (
                    <div className="grid gap-6 ml-2 lg:ml-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(max(320px, calc(25% - 18px)), 1fr))" }}>
                      {okrGroup.okrs.map((okr) => (
                        <OKRCard7
                          key={okr.id}
                          okr={okr}
                          currentMonth={currentMonth}
                          currentYear={currentYear}
                          onOkrUpdate={handleOkrUpdate}
                          onView={setSelectedOkr}
                          onAddUpdate={handleAddUpdateForOkr}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </main>
        </div>
      )}

      {/* OKR detail slide-over — rendered at top level, outside the card grid */}
      {selectedOkr && (
        <ViewOkrTrackerRecordModal
          okr={selectedOkr}
          isOpen={!!selectedOkr}
          openAddUpdate={openAddUpdate}
          onClose={() => { setSelectedOkr(null); setOpenAddUpdate(false); }}
          onUpdate={(updated) => {
            handleOkrUpdate(updated);
            setSelectedOkr(updated);
          }}
        />
      )}
    </>
  );
}

export default DashboardContent;
