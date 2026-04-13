"use client";
import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  ColDef,
  GridApi,
  SizeColumnsToContentStrategy,
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

interface DataTableProps<T> {
  columns: ColDef<T>[];
  showToolBar?: boolean;
  data?: T[] | null;
  apiURL: string;
  pageSize?: number;
  onDataChange?: (data: T[]) => void;
  className?: string;
}

interface FetchError {
  message: string;
  status: number;
}

// Constants
const INITIAL_FILTER_STATE: DataFilters = {
  keyword: "",
  dataRange: { start: null, end: null },
};

// Memoized Components
const SearchInput = memo(
  ({
    value,
    onChange,
    disabled,
  }: {
    value: string;
    onChange: (value: string) => void;
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
        disabled={disabled}
      />
      <div className="absolute inset-0 pl-1.5 h-full flex items-center -z-10">
        <MagnifyingGlassIcon className="h-4 w-4 text-muted-lmh-dark-blue" />
      </div>
    </div>
  )
);

SearchInput.displayName = "SearchInput";

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

  const [rowData, setRowData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataFilters, setDataFilters] =
    useState<DataFilters>(INITIAL_FILTER_STATE);

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

  // Data fetching
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMD_API}/program_data/${apiURL}?page=1&per_page=999900`
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      console.log("resss", response);
      const result = await response.json();
      // console.log("response", response);
      // console.log("result", result);
      console.log("result", result);

      const newData = result.data as T[];
      setRowData(newData);
      onDataChange?.(newData);
      // toast.success("Data ")
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
  }, [apiURL, onDataChange]);

  // Grid event handlers
  const onGridReady = useCallback(() => {
    gridApi.current = gridRef.current?.api || null;
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData();
    toast.success("Data refreshed successfully");
  }, [fetchData]);

  const onFilterTextBoxChanged = useCallback((value: string) => {
    gridApi.current?.setGridOption("quickFilterText", value);
  }, []);

  const onColumnChange = useCallback((updatedColumns: ColDef<T>[]) => {
    gridApi.current?.setGridOption("columnDefs", updatedColumns);
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
      const dateString =
        start && end
          ? `${start.toISOString().slice(0, 10)} - ${end
              .toISOString()
              .slice(0, 10)}`
          : "";

      onFilterTextBoxChanged(dateString);
      setDataFilters((prev) => ({
        ...prev,
        dataRange: { start, end },
      }));
    },
    [onFilterTextBoxChanged]
  );

  const resetFilters = useCallback(() => {
    setDataFilters(INITIAL_FILTER_STATE);
    onFilterTextBoxChanged("");
  }, [onFilterTextBoxChanged]);

  return (
    <div className={cn("h-full w-full space-y-2 flex flex-col", className)}>
      {showToolBar && (
        <div className="w-full h-8 border-dotted flex flex-row justify-between">
          <div className="flex gap-4 items-center">
            <SearchInput
              value={dataFilters.keyword}
              onChange={(value) => {
                setDataFilters((prev) => ({ ...prev, keyword: value }));
                onFilterTextBoxChanged(value);
              }}
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
          "w-full ag-theme-quartz rounded-lg h-full",
          isLoading && "opacity-70"
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
          paginationPageSize={pageSize}
          className="rounded-sm"
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
          suppressPaginationPanel={false}
          suppressScrollOnNewData={true}
          suppressMovableColumns={false}
          reactiveCustomComponents={true}
        />
      </div>
    </div>
  );
}
