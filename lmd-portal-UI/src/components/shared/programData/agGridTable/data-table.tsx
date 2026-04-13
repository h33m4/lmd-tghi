"use client";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ColDef,
  GridApi,
  SizeColumnsToContentStrategy,
  PaginationChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isEqual } from "lodash";
import { generateFileName } from "@/utils/table-helpers";
import { Tooltip } from "antd";
import { toast } from "sonner";

// Components
import CustomTableNoDataFound from "./customNoDataFound";
import CustomTableLoader from "./customLoader";
import DataRangePicker from "./date-range-picker";
import ProgramDataTableOptions from "./data-table-options";

// Icons
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import TrashIcon from "@/components/icons/trash";

// Types
interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DataFilters {
  keyword: string;
  dataRange: DateRange;
}

interface ApiParams {
  // url
  apiUrl: string;

  // Request options
  requestMethod?: "GET" | "POST";
  requestHeaders?: Record<string, string>;
  requestBody?: any;

  // Pagination
  page?: number;
  perPage?: number;
  pageSizeOptions?: number[];
  //   [key: string]: string | number | boolean | undefined;
}

interface DataTableProps<T> {
  columns: ColDef<T>[];
  showToolBar?: boolean;
  data?: T[] | null;
  apiURL: string;
  pageSize?: number;
  onDataChange?: (data: T[]) => void;
  className?: string;
}

interface PaginationState {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface ApiResponse<T> {
  data: T[];
  currentPage: number;
  perPage: number;
  totalPages: number;
  nextPage: number | null;
  previousPage: number | null;
}

// Constants
const INITIAL_FILTER_STATE: DataFilters = {
  keyword: "",
  dataRange: { start: null, end: null },
};

const INITIAL_PAGINATION_STATE: PaginationState = {
  page: 1,
  perPage: 20,
  totalItems: 0,
  totalPages: 0,
};

// Memoized Components
const SearchInput = memo(
  ({
    value,
    onChange,
    onSearch,
    disabled,
  }: {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    disabled?: boolean;
  }) => (
    <div className="w-72 relative">
      <Input
        id="filter-text-box"
        className="h-8 pl-7 py-1 flex items-center"
        type="search"
        placeholder="Search by anything"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
        disabled={disabled}
      />
      <div className="absolute inset-0 pl-1.5 h-full flex items-center -z-10">
        <MagnifyingGlassIcon className="h-4 w-4 text-muted-lmh-dark-blue" />
      </div>
    </div>
  )
);

SearchInput.displayName = "SearchInput";

// Pagination Controls Component
const PaginationControls = memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
  }) => {
    // Calculate which page numbers to show
    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxPagesToShow = 5;

      if (totalPages <= maxPagesToShow) {
        // Show all pages if there are fewer than maxPagesToShow
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Always show first page
        pageNumbers.push(1);

        // Calculate middle pages
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Adjust if we're near the beginning
        if (currentPage <= 3) {
          endPage = Math.min(maxPagesToShow - 1, totalPages - 1);
        }

        // Adjust if we're near the end
        if (currentPage >= totalPages - 2) {
          startPage = Math.max(2, totalPages - maxPagesToShow + 2);
        }

        // Add ellipsis after first page if needed
        if (startPage > 2) {
          pageNumbers.push("...");
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }

        // Always show last page
        if (totalPages > 1) {
          pageNumbers.push(totalPages);
        }
      }

      return pageNumbers;
    };

    return (
      <div className="flex items-center justify-center space-x-1 sm:space-x-2 flex-nowrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="h-8 px-2 border border-gray-300 flex-shrink-0"
          title="Previous Page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="ml-1">Prev</span>
        </Button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-1 flex-shrink-0">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(Number(page))}
                disabled={isLoading}
                className={cn(
                  "w-8 h-8 p-0 font-medium flex-shrink-0",
                  currentPage === page
                    ? "bg-lmh-dark-blue hover:bg-lmh-dark-blue/90 text-white hover:font-semibold"
                    : "border border-gray-300"
                )}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="h-8 px-2 border border-gray-300 flex-shrink-0"
          title="Next Page"
        >
          <span className="mr-1">Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);

PaginationControls.displayName = "PaginationControls";

export default function DataTable<T>({
  columns,
  showToolBar = true,
  apiURL,
  pageSize = 20,
  onDataChange,
  className,
}: DataTableProps<T>): JSX.Element {
  const gridRef = useRef<AgGridReact>(null);
  const gridApi = useRef<GridApi | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const [rowData, setRowData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataFilters, setDataFilters] =
    useState<DataFilters>(INITIAL_FILTER_STATE);
  const [pagination, setPagination] = useState<PaginationState>({
    ...INITIAL_PAGINATION_STATE,
    perPage: pageSize,
  });

  // We're keeping windowWidth for minimal responsive adjustments
  // but using horizontal scrolling as the primary responsive strategy
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Memoized values
  const loadingOverlayComponent = useMemo(() => CustomTableLoader, []);
  const noRowsOverlayComponent = useMemo(() => CustomTableNoDataFound, []);
  const autoSizeStrategy = useMemo<SizeColumnsToContentStrategy>(
    () => ({
      type: "fitCellContents",
      defaultMinWidth: 150,
    }),
    []
  );

  // Building query parameters
  const buildQueryParams = useCallback(
    (page: number, perPage: number) => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });

      if (dataFilters.keyword.trim()) {
        queryParams.append("search", dataFilters.keyword.trim());
      }

      if (dataFilters.dataRange.start && dataFilters.dataRange.end) {
        queryParams.append(
          "date_start",
          dataFilters.dataRange.start.toISOString().slice(0, 10)
        );
        queryParams.append(
          "date_end",
          dataFilters.dataRange.end.toISOString().slice(0, 10)
        );
      }

      return queryParams;
    },
    [dataFilters]
  );

  // Data fetching
  const fetchData = useCallback(
    async (page = pagination.page, perPage = pagination.perPage) => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = buildQueryParams(page, perPage);
        const url = `${
          process.env.NEXT_PUBLIC_LMD_API
        }/program_data/${apiURL}?${queryParams.toString()}`;

        // console.log("Fetching data from:", url);
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = (await response.json()) as ApiResponse<T>;
        // console.log("API response:", result);

        setRowData(result.data);
        onDataChange?.(result.data);

        // Update pagination state based on the API response format
        setPagination({
          page: result.currentPage,
          perPage: result.perPage,
          totalItems: result.totalPages * result.perPage, // Estimate total items
          totalPages: result.totalPages,
        });

        // Update AG Grid's pagination model without triggering a new fetch
        if (gridApi.current) {
          // We're manually setting the pagination state
          gridApi.current.updateGridOptions({
            paginationPageSize: result.perPage,
          });
          // AG Grid's page is 0-based
          gridApi.current.paginationGoToPage(result.currentPage - 1);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch data";
        setError(errorMessage);
        toast.error(errorMessage);
        setRowData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      apiURL,
      onDataChange,
      buildQueryParams,
      pagination.page,
      pagination.perPage,
    ]
  );

  // Grid event handlers
  const onGridReady = useCallback(() => {
    gridApi.current = gridRef.current?.api || null;
    fetchData(1, pagination.perPage);
  }, [fetchData, pagination.perPage]);

  // Handle manual page change from both our custom pagination and the grid
  const onPaginationChanged = useCallback(
    (event: PaginationChangedEvent) => {
      if (event.newPage === true && gridApi.current && !isLoading) {
        const currentPage = gridApi.current.paginationGetCurrentPage() + 1; // AG Grid is 0-based
        const currentPageSize = gridApi.current.paginationGetPageSize();

        // Only fetch if the page or size has changed
        if (
          currentPage !== pagination.page ||
          currentPageSize !== pagination.perPage
        ) {
          // console.log(
          //   `Page changed to ${currentPage}, size: ${currentPageSize}`
          // );
          fetchData(currentPage, currentPageSize);
        }
      }
    },
    [fetchData, pagination.page, pagination.perPage, isLoading]
  );

  // Handle manual page change from our custom pagination controls
  const handlePageChange = useCallback(
    (page: number) => {
      if (page !== pagination.page && !isLoading) {
        fetchData(page, pagination.perPage);
      }
    },
    [fetchData, pagination.page, pagination.perPage, isLoading]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      if (newPageSize !== pagination.perPage && !isLoading) {
        fetchData(1, newPageSize); // Reset to page 1 when changing page size
      }
    },
    [fetchData, pagination.perPage, isLoading]
  );

  const refreshData = useCallback(() => {
    fetchData(1, pagination.perPage);
    toast.success("Data refreshed successfully");
  }, [fetchData, pagination.perPage]);

  const onFilterTextBoxChanged = useCallback((value: string) => {
    setDataFilters((prev) => ({ ...prev, keyword: value }));
  }, []);

  const applySearch = useCallback(() => {
    if (!isLoading) {
      fetchData(1, pagination.perPage); // Reset to page 1 when searching
    }
  }, [fetchData, pagination.perPage, isLoading]);

  const onColumnChange = useCallback((updatedColumns: ColDef<T>[]) => {
    if (gridApi.current) {
      gridApi.current.setGridOption("columnDefs", updatedColumns);
    }
  }, []);

  const onExportCSV = useCallback(() => {
    if (!gridApi.current) return;

    const fileName = generateFileName(apiURL.split("/")[1]);
    gridApi.current.exportDataAsCsv({
      fileName,
      processHeaderCallback: (params) =>
        params.column.getColDef().field ||
        params.column.getColDef().headerName ||
        "",
    });
  }, [apiURL]);

  const handleDateRangeChange = useCallback(
    (dates: [Date | null, Date | null]) => {
      const [start, end] = dates;
      setDataFilters((prev) => ({
        ...prev,
        dataRange: { start, end },
      }));

      // Only fetch if we have a complete date range
      if (start && end) {
        fetchData(1, pagination.perPage);
      }
    },
    [fetchData, pagination.perPage]
  );

  const resetFilters = useCallback(() => {
    setDataFilters(INITIAL_FILTER_STATE);
    fetchData(1, pagination.perPage);
  }, [fetchData, pagination.perPage]);

  // Memoize the pagination summary information
  const PaginationSummary = useMemo(() => {
    if (!pagination.totalPages || pagination.totalPages <= 0) return null;

    // Calculate an estimate for display purposes
    const startItem = (pagination.page - 1) * pagination.perPage + 1;
    const endItem = Math.min(
      pagination.page * pagination.perPage,
      rowData?.length
        ? (pagination.page - 1) * pagination.perPage + rowData.length
        : pagination.page * pagination.perPage
    );

    return (
      <div className="text-[0.8rem]  font-medium whitespace-nowrap flex-shrink-0">
        Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of{" "}
        {pagination.totalItems} records | Page {pagination.page} of{" "}
        {pagination.totalPages}
      </div>
    );
  }, [
    pagination.page,
    pagination.perPage,
    pagination.totalPages,
    rowData?.length,
    pagination.totalItems,
  ]);

  // Custom page size selector
  const PageSizeSelector = useMemo(() => {
    const pageSizeOptions = [10, 20, 50, 100];

    return (
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
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    );
  }, [pagination.perPage, handlePageSizeChange, isLoading]);

  return (
    <div className={cn("h-full w-full space-y-0 flex flex-col", className)}>
      {showToolBar && (
        <div className="w-full h-8 border-dotted flex flex-row justify-between mb-2">
          <div className="flex gap-4 items-center">
            <SearchInput
              value={dataFilters.keyword}
              onChange={onFilterTextBoxChanged}
              onSearch={applySearch}
              disabled={isLoading}
            />
            <DataRangePicker
              rangeValues={[
                dataFilters.dataRange.start,
                dataFilters.dataRange.end,
              ]}
              onRangeChange={handleDateRangeChange}
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
          </div>

          <div className="flex items-center gap-2 h-8 mr-2">
            <Tooltip title="Refresh data">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 h-[29px] mt-1 border"
              >
                <ArrowPathIcon
                  className={cn("h-4 w-4", isLoading && "animate-spin")}
                />
                Refresh
              </Button>
            </Tooltip>

            <ProgramDataTableOptions<T>
              onExportCSV={onExportCSV}
              allColumns={columns}
              onColumnsChange={onColumnChange}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          "w-full ag-theme-quartz rounded-none ag-theme-kpi-data-table flex-grow h-full",
          isLoading && "opacity-50"
        )}
      >
        <AgGridReact
          ref={gridRef}
          headerHeight={38}
          rowHeight={35}
          rowData={rowData}
          columnDefs={columns}
          autoSizeStrategy={autoSizeStrategy}
          onGridReady={onGridReady}
          loadingOverlayComponent={loadingOverlayComponent}
          noRowsOverlayComponent={noRowsOverlayComponent}
          pagination
          paginationPageSize={pagination.perPage}
          onPaginationChanged={onPaginationChanged}
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
          enableCellTextSelection={true}
          suppressCellFocus={true}
          suppressRowClickSelection={true}
          suppressScrollOnNewData={true}
          suppressMovableColumns={false}
          reactiveCustomComponents={true}
          suppressPaginationPanel={true} // Hide AG Grid's pagination controls
          domLayout="normal"
        />
      </div>

      {/* Horizontal scrolling pagination footer */}
      <div className="min-h-[3.1rem] text-sm -mt-4 border-b border-l border-r border-[#dcdddd] bg-background rounded-b-sm flex items-center justify-between px-2 sm:px-4 py-2 gap-2 overflow-x-auto whitespace-nowrap">
        <div>{PageSizeSelector}</div>

        <div className="flex-shrink-0">
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>

        <div className="text-right">{PaginationSummary}</div>
      </div>
    </div>
  );
}
