"use client";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ColDef,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from "ag-grid-community";
import CreateUserModal from "./CreateUserModal";
import ViewUserDetailsModal from "./ViewUserDetailsModal";
import BadgeButton from "./BadgeButton";
import { Button } from "@/components/ui/button";
import TrashIcon from "@/components/icons/trash";

import "@/components/tables/ag-grid/ag-grid-lib";

type Attribute = { Name: string; Value: string };

export interface IUserRowData {
  Attributes: Attribute[];
  Enabled: boolean;
  UserCreateDate: Date;
  UserLastModifiedDate: Date;
  UserStatus: "CONFIRMED" | "FORCE_CHANGE_PASSWORD" | "EXTERNAL_PROVIDER" | string;
  Username: string;
  button?: unknown;
}

type StatusFilter = "all" | "CONFIRMED" | "FORCE_CHANGE_PASSWORD" | "EXTERNAL_PROVIDER";
type EnabledFilter = "all" | "enabled" | "disabled";

const attr = (row: IUserRowData, name: string) =>
  row.Attributes.find((a) => a.Name === name)?.Value ?? "";

// ─── Cell renderers (module-level to avoid remount on every render) ───────────

const CustomActionButtonComponent = (
  props: CustomCellRendererProps<IUserRowData>
) => <ViewUserDetailsModal props={props} />;

const CustomUserStatusComponent = (
  props: CustomCellRendererProps<IUserRowData>
) => {
  const status = props.data?.UserStatus;
  if (status === "CONFIRMED")
    return <BadgeButton value="Confirmed" variant="yellow" />;
  if (status === "FORCE_CHANGE_PASSWORD")
    return <BadgeButton value="Pending Setup" variant="red" />;
  if (status === "EXTERNAL_PROVIDER")
    return <BadgeButton value="External / SSO" variant="green" />;
  return <p>{status}</p>;
};

const CustomUserAccountStatusComponent = (
  props: CustomCellRendererProps<IUserRowData>
) => (
  <BadgeButton
    value={props.data?.Enabled ? "Enabled" : "Disabled"}
    showDot
    variant={props.data?.Enabled ? "yellow" : "red"}
  />
);

// ─── Filter pill config ───────────────────────────────────────────────────────

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Pending Setup", value: "FORCE_CHANGE_PASSWORD" },
  { label: "External / SSO", value: "EXTERNAL_PROVIDER" },
];

const ENABLED_FILTERS: { label: string; value: EnabledFilter }[] = [
  { label: "All", value: "all" },
  { label: "Enabled", value: "enabled" },
  { label: "Disabled", value: "disabled" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const UsersTable = ({ userData }: { userData: IUserRowData[] }) => {
  const [allData, setAllData] = useState<IUserRowData[]>(userData);
  const gridRef = useRef<AgGridReact>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [enabledFilter, setEnabledFilter] = useState<EnabledFilter>("all");

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return allData.filter((row) => {
      const matchesSearch =
        !q ||
        attr(row, "email").toLowerCase().includes(q) ||
        attr(row, "name").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || row.UserStatus === statusFilter;

      const matchesEnabled =
        enabledFilter === "all" ||
        (enabledFilter === "enabled" ? row.Enabled : !row.Enabled);

      return matchesSearch && matchesStatus && matchesEnabled;
    });
  }, [allData, search, statusFilter, enabledFilter]);

  const isFiltered =
    search !== "" || statusFilter !== "all" || enabledFilter !== "all";

  const clearAllFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
    setEnabledFilter("all");
  }, []);

  const columnDefs = useMemo<ColDef<IUserRowData>[]>(
    () => [
      {
        headerName: "Username",
        field: "Username",
        minWidth: 200,
        width: 260,
        maxWidth: 360,
        cellDataType: "text",
      },
      {
        headerName: "Email",
        field: "Username",
        valueGetter: (p) => attr(p.data!, "email"),
        minWidth: 200,
        width: 260,
        maxWidth: 360,
      },
      {
        headerName: "Full Name",
        field: "Username",
        valueGetter: (p) => attr(p.data!, "name"),
        minWidth: 160,
        width: 220,
        maxWidth: 300,
      },
      {
        field: "UserStatus",
        headerName: "Status",
        minWidth: 160,
        width: 180,
        maxWidth: 220,
        cellDataType: "text",
        cellRenderer: CustomUserStatusComponent,
      },
      {
        field: "Enabled",
        headerName: "Account",
        width: 140,
        minWidth: 100,
        maxWidth: 160,
        cellDataType: false,
        cellRenderer: CustomUserAccountStatusComponent,
      },
      {
        field: "UserCreateDate",
        headerName: "Date Created",
        minWidth: 160,
        width: 200,
        maxWidth: 260,
        cellDataType: "date",
      },
      {
        field: "button",
        headerName: "Action",
        cellRenderer: CustomActionButtonComponent,
        pinned: "right",
        cellDataType: false,
        maxWidth: 120,
        sortable: false,
        filter: false,
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({ editable: false, filter: true }),
    []
  );

  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => ({ type: "fitCellContents" }), []);

  return (
    <div className="pt-4 flex flex-col gap-2">

      {/* Row 1: search + create */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-input h-[32px] w-[22rem]"
          />
          {isFiltered && (
            <Button
              variant="ghost2"
              size="sm"
              className="h-[32px] flex items-center gap-1.5 text-xs"
              onClick={clearAllFilters}
            >
              Clear all
              <TrashIcon className="h-3.5 w-3.5" />
            </Button>
          )}
          {isFiltered && (
            <span className="text-xs text-th-text-muted">
              {filteredData.length} of {allData.length}
            </span>
          )}
        </div>
        <CreateUserModal
          onCloseModal={(user: IUserRowData) => {
            setAllData((prev) => [user, ...prev]);
          }}
        />
      </div>

      {/* Row 2: filter pills */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-th-text-muted mr-1">Status</span>
          {STATUS_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={statusFilter === f.value ? "dark-blue" : "outline"}
              size="sm"
              className="h-[26px] text-xs px-2.5"
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-th-text-muted mr-1">Account</span>
          {ENABLED_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={enabledFilter === f.value ? "dark-blue" : "outline"}
              size="sm"
              className="h-[26px] text-xs px-2.5"
              onClick={() => setEnabledFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="ag-theme-quartz rounded-lg h-[calc(100vh-210px)]">
        <AgGridReact
          theme="legacy"
          ref={gridRef}
          headerHeight={37}
          rowHeight={37}
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50]}
          className="th-font-book"
          autoSizeStrategy={autoSizeStrategy}
          overlayNoRowsTemplate="<span class='text-sm text-gray-400'>No users match the current filters</span>"
        />
      </div>
    </div>
  );
};

export default UsersTable;
