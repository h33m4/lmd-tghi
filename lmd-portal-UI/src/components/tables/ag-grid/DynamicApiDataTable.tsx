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
  IHeaderParams,
  ColDefField,
  SelectionChangedEvent,
  // themes
  themeAlpine,
  themeBalham,
  themeMaterial,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isEqual } from "lodash";
import { generateFileName } from "@/utils/table-helpers";
import { Tooltip } from "antd";
import { toast } from "sonner";

// Icons
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import TrashIcon from "@/components/icons/trash";

// components
import CustomTableLoader from "@/components/shared/programData/agGridTable/customLoader";
import CustomTableNoDataFound from "@/components/shared/programData/agGridTable/customNoDataFound";
import DataRangePicker from "@/components/shared/programData/agGridTable/date-range-picker";
import ProgramDataTableOptions from "@/components/shared/programData/agGridTable/data-table-options";

import "./ag-grid-lib";

// ============================================================================
// TYPES
// ============================================================================

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DataFilters {
  keyword: string;
  dataRange: DateRange;
}

interface ApiConfig {
  // URL
  apiUrl: string;

  // Request options
  requestMethod?: "GET" | "POST";
  requestHeaders?: Record<string, string>;
  requestBody?: any;

  // Pagination
  page?: number;
  perPage?: number;
  pageSizeOptions?: number[];
}

type ColumnNamingStrategy = "original" | "auto-format" | "mapped";
type ColumnType = "text" | "number" | "date";

// Column name map can now include type: { "field": ["Display Name", "number"] }
type ColumnNameMapValue = string | [string, ColumnType];

interface ColumnConfig<T = any> {
  // Column definitions - if provided, these are used directly
  columns?: ColDef<T>[];

  // Auto-generation settings
  autoGenerateColumns?: boolean; // Default: true if columns not provided

  // Naming strategy
  namingStrategy?: ColumnNamingStrategy; // Default: "auto-format"
  columnNameMap?: Record<string, ColumnNameMapValue>; // Can include type

  // Column features
  enableFilters?: boolean; // Default: true
  enableSorting?: boolean; // Default: true
  enableColumnMenu?: boolean; // Default: true
  enableFloatingFilter?: boolean; // Default: false - shows filter inputs below headers

  // Default column settings
  defaultColumnWidth?: number;
  defaultMinWidth?: number;
}

interface DataTableProps<T> {
  apiConfig: ApiConfig;
  columnConfig?: ColumnConfig<T>;
  enableRowSelection?: boolean; // Default: false - when true, enables multi-row selection with checkboxes
  showToolBar?: boolean;
  onDataChange?: (data: T[]) => void;
  onRowSelectionChange?: (selectedRows: T[]) => void;
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

// ============================================================================
// CONSTANTS
// ============================================================================

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

const DEFAULT_COLUMN_CONFIG: Required<
  Omit<ColumnConfig, "columns" | "columnNameMap">
> = {
  autoGenerateColumns: true,
  namingStrategy: "auto-format",
  enableFilters: true,
  enableSorting: true,
  enableColumnMenu: true,
  enableFloatingFilter: false,
  defaultColumnWidth: 150,
  defaultMinWidth: 100,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Formats a column name from snake_case/underscore format to a readable format
 */
function autoFormatColumnName(fieldName: string): string {
  return fieldName
    .split("_")
    .map((word) => {
      if (/^\d+$/.test(word) || /^[A-Z]+$/.test(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Detects the column type from sample values
 */
function detectColumnType(values: any[]): ColumnType {
  // Filter out null/undefined
  const validValues = values.filter((v) => v != null && v !== "");
  if (validValues.length === 0) return "text";

  // Check if all values are numbers
  const allNumbers = validValues.every((v) => {
    const num = Number(v);
    return !isNaN(num) && isFinite(num);
  });
  if (allNumbers) return "number";

  // Check if values look like dates
  const allDates = validValues.every((v) => {
    if (typeof v === "string" || v instanceof Date) {
      const date = new Date(v);
      return !isNaN(date.getTime());
    }
    return false;
  });
  if (allDates) return "date";

  return "text";
}

/**
 * Gets the filter type based on column type
 */
function getFilterType(columnType: ColumnType): string | boolean {
  switch (columnType) {
    case "number":
      return "agNumberColumnFilter";
    case "date":
      return "agDateColumnFilter";
    case "text":
    default:
      return "agTextColumnFilter";
  }
}

/**
 * Parses column name map value to get display name and type
 */
function parseColumnNameMapValue(
  value: ColumnNameMapValue
): [string, ColumnType | null] {
  if (typeof value === "string") {
    return [value, null];
  }
  // Array format: ["Display Name", "number"]
  return [value[0], value[1]];
}

/**
 * Gets the display name for a column based on the naming strategy
 */
function getColumnDisplayName(
  fieldName: string,
  namingStrategy: ColumnNamingStrategy,
  columnNameMap?: Record<string, ColumnNameMapValue>
): string {
  switch (namingStrategy) {
    case "original":
      return fieldName;
    case "mapped":
      if (columnNameMap?.[fieldName]) {
        const [displayName] = parseColumnNameMapValue(columnNameMap[fieldName]);
        return displayName;
      }
      return fieldName;
    case "auto-format":
    default:
      return autoFormatColumnName(fieldName);
  }
}

/**
 * Gets the column type from map or auto-detects
 */
function getColumnType(
  fieldName: string,
  data: any[],
  columnNameMap?: Record<string, ColumnNameMapValue>
): ColumnType {
  // Check if type is specified in map
  if (columnNameMap?.[fieldName]) {
    const [, type] = parseColumnNameMapValue(columnNameMap[fieldName]);
    if (type) return type;
  }

  // Auto-detect from data
  const values = data.map((row) => row[fieldName]).slice(0, 100); // Sample first 100
  return detectColumnType(values);
}

/**
 * Auto-generates column definitions from the first row of data with type detection
 * Note: In v35, checkbox selection is controlled by rowSelection object, not column-level properties
 */
function generateColumnsFromData<T extends Record<string, any>>(
  data: T[],
  config: Required<Omit<ColumnConfig<T>, "columns" | "columnNameMap">> & {
    columnNameMap?: Record<string, ColumnNameMapValue>;
  }
): ColDef<T>[] {
  if (!data || data.length === 0) return [];

  const firstRow = data[0];
  const fields = Object.keys(firstRow) as Array<keyof T>;

  return fields.map((field, index) => {
    const fieldStr = field as string;
    const columnType = getColumnType(fieldStr, data, config.columnNameMap);
    const filterType = config.enableFilters ? getFilterType(columnType) : false;

    return {
      field: field as ColDefField<T>,
      headerName: getColumnDisplayName(
        fieldStr,
        config.namingStrategy,
        config.columnNameMap
      ),
      filter: filterType,
      floatingFilter: config.enableFloatingFilter,
      sortable: config.enableSorting,
      resizable: true,
      minWidth: config.defaultMinWidth,
      width: config.defaultColumnWidth,
      menuTabs: config.enableColumnMenu
        ? ["generalMenuTab", "columnsMenuTab"]
        : [],
      // v35: checkboxSelection removed - controlled by rowSelection object
    };
  });
}

// ============================================================================
// MEMOIZED COMPONENTS
// ============================================================================

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
    const getPageNumbers = () => {
      const pageNumbers: (number | string)[] = [];
      const maxPagesToShow = 5;

      if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 3) {
          endPage = Math.min(maxPagesToShow - 1, totalPages - 1);
        }

        if (currentPage >= totalPages - 2) {
          startPage = Math.max(2, totalPages - maxPagesToShow + 2);
        }

        if (startPage > 2) {
          pageNumbers.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }

        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }

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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DynamicApiDataTable<T extends Record<string, any>>({
  apiConfig,
  columnConfig,
  enableRowSelection = false,
  showToolBar = true,
  onDataChange,
  onRowSelectionChange,
  className,
}: DataTableProps<T>): JSX.Element {
  const gridRef = useRef<AgGridReact>(null);
  const gridApi = useRef<GridApi | null>(null);

  // Merge column config with defaults
  const mergedColumnConfig = useMemo(
    () => ({
      ...DEFAULT_COLUMN_CONFIG,
      ...columnConfig,
    }),
    [columnConfig]
  );

  const [rowData, setRowData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataFilters, setDataFilters] =
    useState<DataFilters>(INITIAL_FILTER_STATE);
  const [pagination, setPagination] = useState<PaginationState>({
    ...INITIAL_PAGINATION_STATE,
    perPage: apiConfig.perPage || 20,
  });

  // Generate or use provided columns
  const columns = useMemo(() => {
    // If columns are explicitly provided, use them
    if (columnConfig?.columns && columnConfig.columns.length > 0) {
      return columnConfig.columns;
    }

    // Auto-generate from data if available
    if (
      mergedColumnConfig.autoGenerateColumns &&
      rowData &&
      rowData.length > 0
    ) {
      return generateColumnsFromData(rowData, mergedColumnConfig);
    }

    return [];
  }, [columnConfig?.columns, rowData, mergedColumnConfig]);

  // Memoized AG Grid configs
  const loadingOverlayComponent = useMemo(() => CustomTableLoader, []);
  const noRowsOverlayComponent = useMemo(() => CustomTableNoDataFound, []);
  const autoSizeStrategy = useMemo<SizeColumnsToContentStrategy>(
    () => ({
      type: "fitCellContents",
      defaultMinWidth: mergedColumnConfig.defaultMinWidth,
    }),
    [mergedColumnConfig.defaultMinWidth]
  );

  // Default column definition
  const defaultColDef = useMemo<ColDef>(
    () => ({
      filter: mergedColumnConfig.enableFilters ? "agTextColumnFilter" : false,
      floatingFilter: mergedColumnConfig.enableFloatingFilter,
      sortable: mergedColumnConfig.enableSorting,
      resizable: true,
      minWidth: mergedColumnConfig.defaultMinWidth,
      menuTabs: mergedColumnConfig.enableColumnMenu
        ? ["generalMenuTab", "columnsMenuTab"]
        : [],
    }),
    [mergedColumnConfig]
  );

  // Row selection configuration (v35 format)
  // When enableRowSelection is true, automatically enable multi-row selection with all features
  const rowSelection = useMemo(() => {
    if (!enableRowSelection) return undefined;

    return {
      mode: "multiRow",
      checkboxes: true,
      headerCheckbox: true,
      enableClickSelection: true,
      selectAll: "filtered",
    };
  }, [enableRowSelection]);

  // Build query parameters
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
        const method = apiConfig.requestMethod || "GET";
        const headers = {
          "Content-Type": "application/json",
          ...apiConfig.requestHeaders,
        };

        const url = `${process.env.NEXT_PUBLIC_LMD_API}/program_data/${
          apiConfig.apiUrl
        }?${queryParams.toString()}`;

        console.log("Fetching data from URL:", url);

        const fetchOptions: RequestInit = {
          method,
          headers,
        };

        if (method === "POST" && apiConfig.requestBody) {
          fetchOptions.body = JSON.stringify(apiConfig.requestBody);
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = (await response.json()) as ApiResponse<T>;

        setRowData(result.data);
        onDataChange?.(result.data);

        setPagination({
          page: result.currentPage,
          perPage: result.perPage,
          totalItems: result.totalPages * result.perPage,
          totalPages: result.totalPages,
        });

        // v35 pagination API - use updateGridOptions
        if (gridApi.current) {
          gridApi.current.updateGridOptions({
            paginationPageSize: result.perPage,
          });
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
      apiConfig,
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

  const onPaginationChanged = useCallback(
    (event: PaginationChangedEvent) => {
      if (event.newPage === true && gridApi.current && !isLoading) {
        const currentPage = gridApi.current.paginationGetCurrentPage() + 1;
        const currentPageSize = gridApi.current.paginationGetPageSize();

        if (
          currentPage !== pagination.page ||
          currentPageSize !== pagination.perPage
        ) {
          fetchData(currentPage, currentPageSize);
        }
      }
    },
    [fetchData, pagination.page, pagination.perPage, isLoading]
  );

  // Handle row selection changes
  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      if (!gridApi.current || !onRowSelectionChange) return;

      const selectedRows = gridApi.current.getSelectedRows() as T[];
      onRowSelectionChange(selectedRows);
    },
    [onRowSelectionChange]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page !== pagination.page && !isLoading) {
        fetchData(page, pagination.perPage);
      }
    },
    [fetchData, pagination.page, pagination.perPage, isLoading]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      if (newPageSize !== pagination.perPage && !isLoading) {
        fetchData(1, newPageSize);
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
      fetchData(1, pagination.perPage);
    }
  }, [fetchData, pagination.perPage, isLoading]);

  const onColumnChange = useCallback((updatedColumns: ColDef<T>[]) => {
    if (gridApi.current) {
      gridApi.current.updateGridOptions({ columnDefs: updatedColumns });
    }
  }, []);

  const onExportCSV = useCallback(() => {
    if (!gridApi.current) return;

    const fileName = generateFileName(apiConfig.apiUrl.split("/")[1]);
    gridApi.current.exportDataAsCsv({
      fileName,
      processHeaderCallback: (params) =>
        params.column.getColDef().field ||
        params.column.getColDef().headerName ||
        "",
    });
  }, [apiConfig.apiUrl]);

  const handleDateRangeChange = useCallback(
    (dates: [Date | null, Date | null]) => {
      const [start, end] = dates;
      setDataFilters((prev) => ({
        ...prev,
        dataRange: { start, end },
      }));

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

  // Pagination summary
  const PaginationSummary = useMemo(() => {
    if (!pagination.totalPages || pagination.totalPages <= 0) return null;

    const startItem = (pagination.page - 1) * pagination.perPage + 1;
    const endItem = Math.min(
      pagination.page * pagination.perPage,
      rowData?.length
        ? (pagination.page - 1) * pagination.perPage + rowData.length
        : pagination.page * pagination.perPage
    );

    return (
      <div className="text-[0.8rem] font-medium whitespace-nowrap flex-shrink-0">
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

  // Page size selector
  const PageSizeSelector = useMemo(() => {
    const pageSizeOptions = apiConfig.pageSizeOptions || [10, 20, 50, 100];

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
  }, [
    pagination.perPage,
    handlePageSizeChange,
    isLoading,
    apiConfig.pageSizeOptions,
  ]);

  const myTheme = themeQuartz.withParams({
    browserColorScheme: "inherit",
    cellHorizontalPaddingScale: 0.7568973214,
    fontSize: 15,
    headerBackgroundColor: "#193946",
    headerFontSize: 14,
    headerFontWeight: 600,
    headerTextColor: "#FFFFFF",
    headerVerticalPaddingScale: 1.0753794643,
    oddRowBackgroundColor: "#F5F5F5",
    rowVerticalPaddingScale: 0.9074553571,
    inputHeight: 28,
    columnBorder: true,
    headerColumnBorder: true,
  });

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
          "w-full rounded-none  flex-grow h-full",
          isLoading && "opacity-50"
        )}
      >
        <AgGridReact
          ref={gridRef}
          theme={myTheme}
          // themeMode="dark-blue"
          // theme="legacy" // Use legacy theme if you have ag-grid.css
          columnHoverHighlight={true}
          headerHeight={38}
          rowHeight={35}
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          autoSizeStrategy={autoSizeStrategy}
          onGridReady={onGridReady}
          loadingOverlayComponent={loadingOverlayComponent}
          noRowsOverlayComponent={noRowsOverlayComponent}
          pagination
          paginationPageSize={pagination.perPage}
          onPaginationChanged={onPaginationChanged}
          // stubbon row selection props
          // rowSelection={rowSelection}
          rowSelection={"multiple"}
          onSelectionChanged={onSelectionChanged}
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
          suppressScrollOnNewData={true}
          suppressMovableColumns={false}
          reactiveCustomComponents={true}
          suppressPaginationPanel={true}
          domLayout="normal"
        />
      </div>

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
