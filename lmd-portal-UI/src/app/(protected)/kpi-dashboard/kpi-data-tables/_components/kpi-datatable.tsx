"use client";
import React, { useCallback, useMemo, useState } from "react";

import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  TrashIcon as TrashIconOutline,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import TrashIcon from "@/components/icons/trash";
import { isEqual } from "lodash";
import CustomTableLoader from "@/components/shared/programData/agGridTable/customLoader";
import CustomTableNoDataFound from "@/components/shared/programData/agGridTable/customNoDataFound";
import { cn } from "@/lib/utils";
import KpiTableOptions from "./kpi-table-options_NEW";
import DeleteRecordModal from "./modals/deleteRecordModal";
import { ZodObject, ZodTypeAny } from "zod";
import { useSearchParams } from "next/navigation";
import { Tooltip } from "antd";
import { useSession } from "next-auth/react";
import ViewRecordModal from "./modals/viewRecordModal";
import {
  IUserPermissions,
  useUserPermissions,
} from "@/utils/app-permission-helpers";

import KpiDatasetMetadata from "./kpi-dataset-metadata";
import {
  APPROVAL_STATUS_OPTIONS,
  useKpiDataTable,
} from "@/hooks/useKpiDataTable";

import "@/components/tables/ag-grid/ag-grid-lib";
import { Badge } from "@/components/ui/badge";

// Types and Interfaces
interface IDataFilters {
  keyword?: string;
  dataRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface DefaultColumns {
  [x: string]: any;
  id: number;
  last_update_date: string;
  date_inserted: string;
}

interface IDataTableProps<T extends DefaultColumns> {
  columns: ColDef<T, any>[];
  schema: ZodObject<Record<string, ZodTypeAny>>;
  showToolBar: boolean;
}

// Constants
const SYSTEM_COLUMNS: (permissions: IUserPermissions) => ColDef[] = (
  permissions,
) => [
  {
    field: "id",
    headerName: "ID",
    pinned: "left",
    maxWidth: 75,
    minWidth: 70,
    filter: false,
    valueFormatter: (params) =>
      params.value != null ? params.value.toLocaleString("en-US") : "",
    comparator: (a, b) => {
      if (a == null && b == null) return 0;
      if (a == null) return -1;
      if (b == null) return 1;
      return a - b;
    },
  },
  {
    field: "approval_status",
    colId: "approval_status",
    headerName: "Approval Status",
    pinned: "left",
    maxWidth: 180,
    minWidth: 120,
    singleClickEdit: true,
    editable: permissions.canApprove,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: APPROVAL_STATUS_OPTIONS.map((option) => option.value),
    },
    valueFormatter: (params) => {
      const option = APPROVAL_STATUS_OPTIONS.find(
        (opt) => opt.value === params.value,
      );
      return option ? option.label : params.value || "Pending";
    },
    cellStyle: (params) => {
      switch (params.value) {
        case "approved":
          return { backgroundColor: "#dcfce7", color: "#166534" };
        case "not_approved":
          return { backgroundColor: "#fef2f2", color: "#dc2626" };
        case "pending":
        default:
          return { backgroundColor: "#fef3c7", color: "#d97706" };
      }
    },
    wrapText: false,
    autoHeight: false,
    cellClass: "text-center",
  },
  {
    field: "last_update_date",
    headerName: "Last Update Date",
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleString();
    },
    minWidth: 180,
  },
  {
    field: "date_inserted",
    headerName: "Date Created",
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleString();
    },
    minWidth: 180,
  },
];

const DEFAULT_COL_DEF: ColDef = {
  filter: true,
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
};

const AUTO_SIZE_STRATEGY = {
  type: "fitGridWidth" as const,
  defaultMinWidth: 100,
};

const INITIAL_FILTERS: IDataFilters = {
  keyword: "",
  dataRange: { start: null, end: null },
};

export default function KpiDataTable<T extends DefaultColumns>({
  columns,
  showToolBar,
  schema,
}: IDataTableProps<T>): JSX.Element {
  const { data: sessionData } = useSession();

  const searchParams = useSearchParams();
  const countryName = searchParams.get("country") || "";
  const tableName = searchParams.get("tablename") || "";
  const permissions = useUserPermissions(sessionData, countryName);

  // Pending status for bulk change — requires explicit Apply click
  const [pendingBulkStatus, setPendingBulkStatus] = useState<
    "approved" | "pending" | "not_approved" | ""
  >("");

  const {
    gridRef,
    rowData,
    isLoading,
    error,
    dataFilters,
    setDataFilters,
    visibleFields,
    selectedRows,
    onSelectionChanged,
    onCellValueChanged,
    onFilterTextBoxChanged,
    onExportCSV,
    onGridReady,
    refreshData,
    handleToggleColumn,
    handleBulkDownload,
    handleBulkApprove,
    handleBulkDelete,
    handleBulkStatusChange,
    isBulkUpdating,
    INITIAL_FILTERS,
  } = useKpiDataTable<T>({
    countryName,
    tableName,
    userEmail: sessionData?.user.email || "",
    permissions,
  });

  // Memoized components and configurations
  const loadingOverlayComponent = useMemo(() => CustomTableLoader, []);
  const noRowsOverlayComponent = useMemo(() => CustomTableNoDataFound, []);

  // System & action columns are stable
  const systemColumns = useMemo(
    () => SYSTEM_COLUMNS(permissions),
    [permissions],
  );

  // Checkbox selection column
  const checkboxColumn: ColDef<T> = useMemo(
    () => ({
      headerName: "",
      colId: "checkbox",
      pinned: "left",
      maxWidth: 45,
      minWidth: 45,
      sortable: false,
      filter: false,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      cellDataType: false,
      suppressMovable: true,
    }),
    [],
  );

  const actionColumn: ColDef<T> = useMemo(
    () => ({
      headerName: "Actions",
      colId: "actions",
      pinned: "right",
      maxWidth: 120,
      minWidth: 100,
      sortable: false,
      filter: false,
      cellRenderer: (props: CustomCellRendererProps<T>) => (
        <div className="flex justify-center gap-3 items-center">
          {permissions.canDelete && (
            <DeleteRecordModal<T>
              props={props}
              onDeleteCallback={refreshData}
            />
          )}
          <ViewRecordModal
            props={props}
            schema={schema}
            onEditCallback={refreshData}
          />
        </div>
      ),
      cellDataType: false,
    }),
    [permissions, schema, refreshData],
  );

  const extendedColumns = useMemo(
    () => [checkboxColumn, ...columns, ...systemColumns, actionColumn],
    [checkboxColumn, columns, systemColumns, actionColumn],
  );

  // Clear all selections and reset pending status
  const handleClearAllSelections = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.deselectAll();
    setPendingBulkStatus("");
  }, [gridRef]);

  return (
    <div className="h-full w-full space-y-2 flex flex-col">
      <KpiDatasetMetadata tablename={tableName} className="mb-2" />
      {showToolBar && (
        <div className="w-full h-8 flex flex-row justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-72 relative">
              <Input
                id="filter-text-box"
                className="h-8 pl-7 py-1 flex items-center"
                type="search"
                placeholder="Search by anything"
                value={dataFilters.keyword}
                onChange={(e) => {
                  const value = e.target.value;
                  setDataFilters((prev) => ({ ...prev, keyword: value }));
                  onFilterTextBoxChanged(value);
                }}
              />
              <div className="absolute inset-0 pl-1.5 h-full flex items-center -z-10">
                <MagnifyingGlassIcon className="h-4 w-4 text-muted-lmh-dark-blue" />
              </div>
            </div>

            {!isEqual(dataFilters, INITIAL_FILTERS) && (
              <Button
                className="h-[30px] flex items-center gap-1.5"
                variant="ghost2"
                size="sm"
                onClick={() => {
                  setDataFilters(INITIAL_FILTERS);
                  onFilterTextBoxChanged("");
                }}
              >
                <TrashIcon className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 h-7 z-[999]">
            <Tooltip title="Refresh data">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshData}
                disabled={isLoading}
                className={cn(
                  "flex items-center gap-2 h-[29px] mt-1 border",
                  isLoading && "opacity-50 cursor-not-allowed",
                )}
              >
                <ArrowPathIcon
                  className={cn("h-4 w-4", isLoading && "animate-spin")}
                />
                Refresh
              </Button>
            </Tooltip>
            <KpiTableOptions<T>
              onExportCSV={onExportCSV}
              allColumns={[...columns, ...SYSTEM_COLUMNS(permissions)]}
              schema={schema}
              refreshData={refreshData}
              onToggleColumn={handleToggleColumn}
              visibleFields={visibleFields}
              isLoading={isLoading}
              countryName={countryName}
            />
          </div>
        </div>
      )}

      {/* Selection action bar — always rendered, animated in/out */}
      <div
        className={cn(
          "flex items-center gap-3 overflow-hidden transition-all duration-200",
          selectedRows.length > 0
            ? "h-8 opacity-100"
            : "h-0 opacity-0 pointer-events-none",
        )}
      >
        <Badge
          variant={"default"}
          className="bg-gray-500/40 text-black shrink-0"
        >
          <span className="text-xs">selected ({selectedRows.length})</span>
          <button
            onClick={handleClearAllSelections}
            className="hover:bg-red-400 hover:text-white rounded-full p-0.5 transition-colors"
            aria-label="clear selected"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </Badge>

        {permissions.canApprove && (
          <div className="flex items-center gap-2">
            <select
              value={pendingBulkStatus}
              onChange={(e) =>
                setPendingBulkStatus(
                  e.target.value as "approved" | "pending" | "not_approved" | "",
                )
              }
              disabled={isBulkUpdating}
              className="h-6 px-3 py-1 text-xs border border-border rounded-md bg-transparent input-box hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>
                Change Status...
              </option>
              <option value="approved">Mark as Approved</option>
              <option value="pending">Mark as Pending</option>
              <option value="not_approved">Mark as Not Approved</option>
            </select>

            {pendingBulkStatus && (
              <Button
                size="sm"
                variant="outline"
                disabled={isBulkUpdating}
                onClick={() => {
                  handleBulkStatusChange(
                    pendingBulkStatus as "approved" | "pending" | "not_approved",
                  );
                  setPendingBulkStatus("");
                }}
                className="h-6 text-xs bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Apply to {selectedRows.length}
              </Button>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkDownload}
            className="flex items-center gap-1.5 h-6"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download
          </Button>

          {permissions.canDelete && (
            <Tooltip title="Bulk delete coming soon">
              <Button
                size="sm"
                variant="outline"
                disabled
                className="flex items-center gap-1.5 h-6 opacity-40 cursor-not-allowed"
              >
                <TrashIconOutline className="h-4 w-4" />
                Delete
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      <div
        className={cn(
          "w-full ag-theme-quartz ag-theme-kpi-data-table rounded-sm h-full",
          isLoading && "opacity-70",
        )}
      >
        <AgGridReact
          ref={gridRef}
          theme={"legacy"}
          headerHeight={38}
          rowHeight={35}
          rowData={rowData}
          columnDefs={extendedColumns}
          rowSelection={"multiple"}
          onCellValueChanged={onCellValueChanged}
          onSelectionChanged={onSelectionChanged}
          onGridReady={onGridReady}
          autoSizeStrategy={AUTO_SIZE_STRATEGY}
          defaultColDef={DEFAULT_COL_DEF}
          loadingOverlayComponent={loadingOverlayComponent}
          noRowsOverlayComponent={noRowsOverlayComponent}
          pagination
          paginationPageSize={20}
          className="rounded-sm"
          loadingOverlayComponentParams={{
            loadingMessage: "Loading data...",
          }}
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
