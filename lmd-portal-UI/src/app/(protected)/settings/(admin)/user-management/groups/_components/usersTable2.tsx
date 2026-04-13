"use client";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ColDef,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from "ag-grid-community";
import { Button } from "@/components/ui/button";
import TrashIcon from "@/components/icons/trash";
import BadgeButton from "../../components/BadgeButton";

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

const CustomUserStatusComponent = (
  props: CustomCellRendererProps<IUserRowData>
) => {
  const status = props.data?.UserStatus;
  if (status === "CONFIRMED")
    return <BadgeButton value="Confirmed" variant="green" />;
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

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Pending", value: "FORCE_CHANGE_PASSWORD" },
  { label: "External", value: "EXTERNAL_PROVIDER" },
];

const ENABLED_FILTERS: { label: string; value: EnabledFilter }[] = [
  { label: "All", value: "all" },
  { label: "Enabled", value: "enabled" },
  { label: "Disabled", value: "disabled" },
];

const UsersTable2 = ({ userData }: { userData: IUserRowData[] }) => {
  const gridRef = useRef<AgGridReact>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [enabledFilter, setEnabledFilter] = useState<EnabledFilter>("all");

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return userData.filter((row) => {
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
  }, [userData, search, statusFilter, enabledFilter]);

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
        minWidth: 160,
        width: 220,
        cellDataType: "text",
      },
      {
        headerName: "Email",
        field: "Username",
        valueGetter: (p) => attr(p.data!, "email"),
        minWidth: 160,
        width: 220,
      },
      {
        headerName: "Full Name",
        field: "Username",
        valueGetter: (p) => attr(p.data!, "name"),
        minWidth: 140,
        width: 180,
      },
      {
        field: "UserStatus",
        headerName: "Status",
        minWidth: 140,
        width: 160,
        cellDataType: "text",
        cellRenderer: CustomUserStatusComponent,
      },
      {
        field: "Enabled",
        headerName: "Account",
        width: 120,
        minWidth: 100,
        cellDataType: false,
        cellRenderer: CustomUserAccountStatusComponent,
      },
      {
        field: "UserCreateDate",
        headerName: "Date Created",
        minWidth: 140,
        width: 180,
        cellDataType: "date",
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
    <div className="h-full w-full flex flex-col gap-2">

      {/* Row 1: search */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-input h-[30px] w-[18rem]"
        />
        {isFiltered && (
          <Button
            variant="ghost2"
            size="sm"
            className="h-[30px] flex items-center gap-1.5 text-xs"
            onClick={clearAllFilters}
          >
            Clear all
            <TrashIcon className="h-3.5 w-3.5" />
          </Button>
        )}
        {isFiltered && (
          <span className="text-xs text-th-text-muted">
            {filteredData.length} of {userData.length}
          </span>
        )}
      </div>

      {/* Row 2: filter pills */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-xs text-th-text-muted mr-1">Status</span>
          {STATUS_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={statusFilter === f.value ? "dark-blue" : "outline"}
              size="sm"
              className="h-[24px] text-xs px-2"
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-th-text-muted mr-1">Account</span>
          {ENABLED_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={enabledFilter === f.value ? "dark-blue" : "outline"}
              size="sm"
              className="h-[24px] text-xs px-2"
              onClick={() => setEnabledFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="ag-theme-quartz rounded-lg h-[calc(70vh-230px)]">
        <AgGridReact
          ref={gridRef}
          headerHeight={37}
          rowHeight={37}
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 20]}
          className="th-font-book"
          autoSizeStrategy={autoSizeStrategy}
          overlayNoRowsTemplate="<span class='text-sm text-gray-400'>No users match the current filters</span>"
        />
      </div>
    </div>
  );
};

export default UsersTable2;
