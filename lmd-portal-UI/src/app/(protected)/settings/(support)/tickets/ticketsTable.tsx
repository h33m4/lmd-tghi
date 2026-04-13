"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ColDef,
  GridReadyEvent,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from "ag-grid-community";
import { ITicketInfo } from "@/types";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import TrashIcon from "@/components/icons/trash";
import { AgGridReact } from "ag-grid-react";
import CustomTableLoader from "@/components/shared/programData/agGridTable/customLoader";
import CustomTableNoDataFound from "@/components/shared/programData/agGridTable/customNoDataFound";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DocumentPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { BaseModalRef } from "@/components/modals/BaseModal";
import OpenFeedbackModal from "@/components/portalFeebdack/feedBackModal/OpenFeedbackModal";

interface IDataFilters {
  keyword?: string;
  dataRange: {
    start: Date | null;
    end: Date | null;
  };
}

const initialFilterState: IDataFilters = {
  keyword: "",
  dataRange: {
    start: null,
    end: null,
  },
};

// ITicketInfo;
const TicketColumns: ColDef<ITicketInfo, any>[] = [
  { field: "id", headerName: "Ticket ID", tooltipField: "id" },
  { field: "category", headerName: "Category" },
  { field: "priority", headerName: "Priority" },
  { field: "title", headerName: "Title", cellDataType: "text" },
  { field: "description", headerName: "Description", cellDataType: "text" },
  { field: "status", headerName: "Status" },
  { field: "comments", headerName: "Comments", cellDataType: "text" },
  { field: "openedBy", headerName: "Opened By" },
  { field: "dateOpened", headerName: "Date Opened" },
  { field: "lastUpdatedAt", headerName: "Date Last Updated" },
];

const extendedTicketColumns: ColDef<ITicketInfo, any>[] = [
  ...TicketColumns,
  {
    field: "actionButton",
    headerName: "Action",
    cellRenderer: <></>,
    pinned: "right",
    cellDataType: false,
    maxWidth: 100,
  },
];

function TicketsTable() {
  //   hooks and ref
  const gridRef = useRef<AgGridReact>(null);
  const OpenFeedbackModalmodalRef = useRef<BaseModalRef>(null);

  // states
  const [rowData, setRowData] = useState<ITicketInfo[]>([]);
  const [filters, setFilters] = useState<string>("");
  const [gridReady, setGridReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnDefs, setColumnDefs] = useState<ColDef<ITicketInfo>[]>(
    extendedTicketColumns
  );
  const [dataFilters, setDataFilters] =
    useState<IDataFilters>(initialFilterState);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: false,
      filter: true,
    };
  }, []);

  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => {
    return {
      type: "fitCellContents",
    };
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return CustomTableLoader;
  }, []);
  const noRowsOverlayComponent = useMemo(() => {
    return () =>
      CustomTableNoDataFound({
        displayText: "No record found, please revise your query",
      });
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    // setRowData(kpiChangeLogData);
    setGridReady(true);
  }, []);

  // Callback functions
  const onFilterTextBoxChanged = useCallback((value: string) => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("quickFilterText", value);
    }
  }, []);

  return (
    <>
      <div className="h-full flex flex-col justify-between gap-2">
        <div className="flex justify-between ">
          <div>
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
          </div>
          {/* add new ticket modal */}
          <Button
            className="h-8 flex items-center"
            onClick={() => OpenFeedbackModalmodalRef.current?.openModal()}
          >
            <DocumentPlusIcon className="h-4 w-4 mr-1" />
            New Support Ticket
          </Button>
        </div>
        {rowData ? (
          <div
            className={cn(
              "ag-theme-quartz ag-theme-kpi-data-table rounded-sm h-[calc(100vh-300px)]",
              "",
              isLoading && "opacity-70"
            )}
          >
            <AgGridReact
              ref={gridRef}
              headerHeight={38}
              rowHeight={35}
              rowData={rowData}
              columnDefs={columnDefs}
              autoSizeStrategy={autoSizeStrategy}
              defaultColDef={defaultColDef}
              loadingOverlayComponent={loadingOverlayComponent}
              noRowsOverlayComponent={noRowsOverlayComponent}
              pagination
              paginationPageSize={20}
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
              // Additional AG Grid options
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
        ) : (
          <div className="rounded-lg h-[calc(100vh-170px)] border border-primary flex flex-col justify-center items-center">
            <Spinner />
          </div>
        )}
      </div>

      <OpenFeedbackModal modalRef={OpenFeedbackModalmodalRef} />
    </>
  );
}

export default TicketsTable;
