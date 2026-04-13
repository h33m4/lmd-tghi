"use client";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ColDef, GridApi } from "ag-grid-community";
import EventColumns, { IEvents } from "./events";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isEqual } from "lodash";
import { Tooltip } from "antd";
import { toast } from "sonner";

import "@/components/tables/ag-grid/ag-grid-lib";

// Components
import CustomTableLoader from "@/components/shared/programData/agGridTable/customLoader";
import CustomTableNoDataFound from "@/components/shared/programData/agGridTable/customNoDataFound";
import ProgramDataTableOptions from "@/components/shared/programData/agGridTable/data-table-options";

// Icons
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import TrashIcon from "@/components/icons/trash";
import {
  DateRangePicker,
  EventTypeFilter,
  LimitInput,
  PaginationControls,
} from "./_components";

// Types
interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DataFilters {
  keyword: string;
  dateRange: DateRange;
  eventType: string | null;
  limit: number;
  sortOrder: "asc" | "desc";
}

interface DataTableProps {
  showToolBar?: boolean;
  pageSize?: number;
  onDataChange?: (data: IEvents[]) => void;
  className?: string;
  apiEndpoint?: string;
}

interface PaginationState {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

// Constants
const DEFAULT_FETCH_LIMIT = 500; // records pulled from API per request

const INITIAL_FILTER_STATE: DataFilters = {
  keyword: "",
  dateRange: { start: null, end: null },
  eventType: null,
  limit: DEFAULT_FETCH_LIMIT,
  sortOrder: "desc",
};

const INITIAL_PAGINATION_STATE: PaginationState = {
  page: 1,
  perPage: 20,
  totalItems: 0,
  totalPages: 0,
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const API_BASE_URL = process.env.NEXT_PUBLIC_LMD_API || "";

// Utility function to generate filename
const generateFileName = (prefix: string): string => {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
  return `${prefix}_export_${dateStr}.csv`;
};

export default function EventsDataTable({
  showToolBar = true,
  pageSize = 20,
  onDataChange,
  className,
  apiEndpoint = "/portal_events",
}: DataTableProps): JSX.Element {
  const columns: ColDef<IEvents>[] = EventColumns;
  const gridRef = useRef<AgGridReact>(null);
  const gridApiRef = useRef<GridApi | null>(null);

  const [rowData, setRowData] = useState<IEvents[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // limit = records fetched from API; perPage = rows shown per grid page — keep separate
  const [dataFilters, setDataFilters] =
    useState<DataFilters>(INITIAL_FILTER_STATE);
  const [pagination, setPagination] = useState<PaginationState>({
    ...INITIAL_PAGINATION_STATE,
    perPage: pageSize,
  });

  // No auto-size strategy — each column uses its minWidth and the grid scrolls horizontally.
  const autoSizeStrategy = undefined;

  const DEFAULT_COL_DEF: ColDef = {
    filter: true,
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    autoHeight: false,
    wrapText: false,
    // Truncate overflowing text — without this long values bleed into adjacent cells
    cellStyle: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      display: "block",
      lineHeight: "35px",
    },
    // Show full value on hover for truncated cells
    tooltipValueGetter: (p) => {
      const v = p.value;
      return v != null && String(v).length > 40 ? String(v) : undefined;
    },
    initialHide: false,
  };

  // Building query parameters
  const buildQueryParams = useCallback(
    (_page: number, _perPage: number, filters: DataFilters) => {
      const queryParams = new URLSearchParams({
        limit: filters.limit.toString(),
        sort_order: filters.sortOrder,
      });

      if (filters.keyword.trim()) {
        queryParams.append("search", filters.keyword.trim());
      }

      if (filters.dateRange.start) {
        queryParams.append(
          "start_date",
          filters.dateRange.start.toISOString().slice(0, 10),
        );
      }
      if (filters.dateRange.end) {
        queryParams.append(
          "end_date",
          filters.dateRange.end.toISOString().slice(0, 10),
        );
      }

      if (filters.eventType) {
        queryParams.append("event_type", filters.eventType);
      }

      return queryParams;
    },
    [],
  );

  // Skip initial fetch in dependency array since we only want to fetch when buttons are clicked
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = useCallback(
    async (page = pagination.page, perPage = pagination.perPage) => {
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const queryParams = buildQueryParams(page, perPage, dataFilters);
        const url = `${API_BASE_URL}${apiEndpoint}?${queryParams.toString()}`;

        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`,
          );
        }

        const result = await response.json();

        if (result.events) {
          setRowData(result.events);
          onDataChange?.(result.events);

          // Calculate total pages based on count if available
          const totalItems = result.count || result.events.length;
          const totalPages = Math.ceil(totalItems / perPage);

          setPagination({
            page,
            perPage,
            totalItems,
            totalPages,
          });

          // Update AG Grid's pagination model
          if (gridApiRef.current) {
            gridApiRef.current.updateGridOptions({
              paginationPageSize: perPage,
            });
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Error fetching data:", err);
          const errorMessage =
            err instanceof Error ? err.message : "Failed to fetch data";
          setError(errorMessage);
          toast.error(errorMessage);
          setRowData([]);
        }
      } finally {
        setIsLoading(false);
      }

      return () => controller.abort();
    },
    [
      apiEndpoint,
      buildQueryParams,
      dataFilters,
      onDataChange,
      pagination.page,
      pagination.perPage,
    ],
  );

  // Initial data load - only on component mount
  useEffect(() => {
    const abortFetch = fetchData();
    return () => {
      if (typeof abortFetch === "function") {
        abortFetch;
      }
    };
    // Only run on component mount, not when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Grid event handlers
  const onGridReady = useCallback((params: { api: GridApi }) => {
    gridApiRef.current = params.api;
  }, []);

  // Copy selected rows to clipboard as tab-separated values (pastes into Excel/Sheets)
  const onCopySelectedRows = useCallback(() => {
    const api = gridApiRef.current;
    if (!api) return;

    const selectedRows = api.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.info("Select at least one row to copy");
      return;
    }

    const cols = (api.getAllDisplayedColumns() ?? [])
      .map((c) => c.getColDef().field ?? c.getColDef().headerName ?? "")
      .filter(Boolean);

    const header = cols.join("\t");
    const rows = selectedRows.map((row) =>
      cols.map((col) => row[col] ?? "").join("\t"),
    );

    navigator.clipboard
      .writeText([header, ...rows].join("\n"))
      .then(() =>
        toast.success(`${selectedRows.length} row(s) copied to clipboard`),
      )
      .catch(() => toast.error("Clipboard access denied"));
  }, []);

  // Export to CSV
  const onExportCSV = useCallback(() => {
    if (!gridApiRef.current) return;

    const fileName = generateFileName(apiEndpoint.split("/").pop() || "events");
    gridApiRef.current.exportDataAsCsv({
      fileName,
      processHeaderCallback: (params) =>
        params.column.getColDef().field ||
        params.column.getColDef().headerName ||
        "",
    });

    toast.success(`Exported data to ${fileName}`);
  }, [apiEndpoint]);

  // Column management
  const onColumnChange = useCallback((updatedColumns: ColDef<IEvents>[]) => {
    if (gridApiRef.current) {
      gridApiRef.current.setGridOption("columnDefs", updatedColumns);
    }
  }, []);

  // Handle manual page change
  const handlePageChange = useCallback(
    (page: number) => {
      if (page !== pagination.page && !isLoading) {
        fetchData(page, pagination.perPage);
      }
    },
    [fetchData, pagination.page, pagination.perPage, isLoading],
  );

  // Handle date range changes
  const handleStartDateChange = useCallback((date: Date | null) => {
    setDataFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        start: date,
      },
    }));
  }, []);

  const handleEndDateChange = useCallback((date: Date | null) => {
    setDataFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        end: date,
      },
    }));
  }, []);

  // Handle grid display page size change — does NOT re-fetch from API
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      if (newPageSize !== pagination.perPage && !isLoading) {
        setPagination((prev) => ({ ...prev, perPage: newPageSize, page: 1 }));
        if (gridApiRef.current) {
          gridApiRef.current.updateGridOptions({
            paginationPageSize: newPageSize,
          });
        }
      }
    },
    [pagination.perPage, isLoading],
  );

  // Refresh data
  const refreshData = useCallback(() => {
    fetchData(1, pagination.perPage);
    toast.success("Data refreshed successfully");
  }, [fetchData, pagination.perPage]);

  // Filter handlers
  const handleFilterChange = useCallback((updates: Partial<DataFilters>) => {
    setDataFilters((prev) => ({ ...prev, ...updates }));
    // We don't fetch data here anymore, only store the filter changes
  }, []);

  //   handle limit filters
  const handleLimitChange = useCallback((newLimit: number) => {
    setDataFilters((prev) => ({
      ...prev,
      limit: newLimit,
    }));
  }, []);

  // Apply filters - only fetch when this function is called
  const applyFilters = useCallback(() => {
    if (!isLoading) {
      fetchData(1, pagination.perPage); // Reset to page 1 when applying filters
    }
  }, [fetchData, pagination.perPage, isLoading]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setDataFilters(INITIAL_FILTER_STATE);
    fetchData(1, pagination.perPage);
  }, [fetchData, pagination.perPage]);

  // Memoize the pagination summary information
  const paginationSummary = useMemo(() => {
    if (!pagination.totalPages || pagination.totalPages <= 0) return null;

    // Calculate display values
    const startItem = (pagination.page - 1) * pagination.perPage + 1;
    const endItem = Math.min(
      pagination.page * pagination.perPage,
      pagination.totalItems,
    );

    return (
      <div className="text-[0.8rem] font-medium whitespace-nowrap flex-shrink-0">
        Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of{" "}
        {pagination.totalItems.toLocaleString()} records | Page{" "}
        {pagination.page} of {pagination.totalPages}
      </div>
    );
  }, [pagination]);

  // Custom page size selector
  const pageSizeSelector = useMemo(
    () => (
      <div className="flex items-center space-x-2 flex-shrink-0">
        <span className="text-sm text-gray-600 whitespace-nowrap">
          Per Page:
        </span>
        <select
          className="h-6 rounded border px-2 text-sm w-16"
          value={pagination.perPage}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          disabled={isLoading}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    ),
    [pagination.perPage, handlePageSizeChange, isLoading],
  );

  //   console.log("datafilters", dataFilters);

  return (
    <div className={cn("h-full w-full space-y-0 flex flex-col", className)}>
      {showToolBar && (
        <div className=" mb-3  border-red-600 flex justify-between items-end">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-end ">
            <DateRangePicker
              startDate={dataFilters.dateRange.start}
              endDate={dataFilters.dateRange.end}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onApply={applyFilters}
              disabled={isLoading}
            />

            <EventTypeFilter
              value={dataFilters.eventType}
              onChange={(value) => handleFilterChange({ eventType: value })}
              disabled={isLoading}
            />

            <LimitInput
              value={dataFilters.limit}
              onChange={handleLimitChange}
              onApply={applyFilters}
              disabled={isLoading}
            />

            {!isEqual(dataFilters, INITIAL_FILTER_STATE) && (
              <Button
                className="h-[30px] flex items-center gap-1.5"
                variant="ghost2"
                size="sm"
                onClick={resetFilters}
                disabled={isLoading}
              >
                <TrashIcon className="h-4 w-4" />
                Clear
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={applyFilters}
              disabled={
                isLoading ||
                (!dataFilters.dateRange.start &&
                  !dataFilters.dateRange.end &&
                  !dataFilters.keyword &&
                  !dataFilters.eventType &&
                  !dataFilters.limit)
              }
              className="px-6"
            >
              Apply
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-2">
            <Tooltip title="Copy selected rows to clipboard (paste into Excel/Sheets)">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopySelectedRows}
                disabled={isLoading}
                className="flex items-center gap-2 h-[29px] border"
              >
                Copy Rows
              </Button>
            </Tooltip>

            <Tooltip title="Refresh data">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 h-[29px] "
              >
                <ArrowPathIcon
                  className={cn("h-4 w-4", isLoading && "animate-spin")}
                />
                Refresh
              </Button>
            </Tooltip>

            <div className="flex items-end  -mb-2 pr-1">
              <ProgramDataTableOptions<IEvents>
                onExportCSV={onExportCSV}
                allColumns={columns}
                onColumnsChange={onColumnChange}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          "w-full ag-theme-quartz rounded-none ag-theme-kpi-data-table flex-grow min-h-0",
          isLoading && "opacity-50",
        )}
      >
        <AgGridReact
          ref={gridRef}
          theme={"legacy"}
          headerHeight={38}
          rowHeight={35}
          rowData={rowData}
          columnDefs={columns}
          autoSizeStrategy={autoSizeStrategy}
          defaultColDef={DEFAULT_COL_DEF}
          onGridReady={onGridReady}
          loadingOverlayComponent={CustomTableLoader}
          noRowsOverlayComponent={CustomTableNoDataFound}
          pagination
          paginationPageSize={pagination.perPage}
          className="rounded-none"
          loadingOverlayComponentParams={{
            loadingMessage: "Loading data...",
          }}
          overlayLoadingTemplate={
            isLoading
              ? '<span class="ag-overlay-loading-center">Loading...</span>'
              : ""
          }
          overlayNoRowsTemplate={
            error
              ? `<span class="ag-overlay-no-rows-center">${error}</span>`
              : '<span class="ag-overlay-no-rows-center">No data found</span>'
          }
          animateRows={true}
          rowSelection="multiple"
          enableCellTextSelection={true}
          suppressCellFocus={false}
          suppressScrollOnNewData={true}
          suppressMovableColumns={false}
          suppressPaginationPanel={true}
          domLayout="normal"
        />
      </div>

      {/* Horizontal scrolling pagination footer */}
      <div className="min-h-[3.1rem] text-sm -mt-4 border-b border-l border-r border-[#dcdddd] bg-background rounded-b-sm flex items-center justify-between px-2 sm:px-4 py-2 gap-2 overflow-x-auto whitespace-nowrap">
        <div>{pageSizeSelector}</div>

        <div className="flex-shrink-0">
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>

        <div className="text-right">{paginationSummary}</div>
      </div>
    </div>
  );
}
