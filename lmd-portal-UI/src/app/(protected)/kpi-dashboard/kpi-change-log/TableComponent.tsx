"use client";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import KPIChangeLogColumns, { IKPIChangeLog } from "./data";
import { cn } from "@/lib/utils";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef, GridReadyEvent } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Tooltip } from "antd";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import UpdateKPIChangeLogModal from "./updateKPIChangeLogModal";
import AddNewKpiChangeLogModal from "./addNewKpiChangeLogModal";
import GloabalSelectDropdown from "./globalSelectDropdown";
import CustomTableLoader from "@/components/shared/programData/agGridTable/customLoader";
import CustomTableNoDataFound from "@/components/shared/programData/agGridTable/customNoDataFound";
import DeleteRecordModal from "./deleteRecordModal";

import "@/components/tables/ag-grid/ag-grid-lib";

const API_URL = `${process.env.NEXT_PUBLIC_LMD_API}/kpi_data/changelogs`;

interface CustomActionButtonComponentProps
  extends CustomCellRendererProps<IKPIChangeLog> {
  onRefresh: () => void;
}

const CustomActionButtonComponent = ({
  onRefresh,
  ...props
}: CustomActionButtonComponentProps) => (
  <div className="flex justify-center gap-3 items-center">
    <DeleteRecordModal props={props} />
    <UpdateKPIChangeLogModal props={props} onAddRecordCallback={onRefresh} />
  </div>
);

// const columns: ColDef<IKPIChangeLog>[] = [
//   ...KPIChangeLogColumns,
//   {
//     field: "actionButton",
//     headerName: "Action",
//     cellRenderer: CustomActionButtonComponent,
//     pinned: "right",
//     maxWidth: 100,
//   },
// ];

const filters = {
  countries: [
    { name: "Liberia", label: "Liberia" },
    { name: "Malawi", label: "Malawi" },
    { name: "Ethiopia", label: "Ethiopia" },
    { name: "Sierra leone", label: "Sierra Leone" },
  ],
  toc: [
    { name: "Cross-Cutting", label: "Cross-Cutting" },
    { name: "Upskill", label: "Upskill" },
    { name: "Deliver", label: "Deliver" },
    { name: "Strengthen", label: "Strengthen" },
  ],
};

export default function TableComponent() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<IKPIChangeLog[] | null>(null);
  const [countryFilter, setCountryFilter] = useState("");
  const [tocFilter, setTocFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      editable: false,
      filter: true,
      sortable: true,
    }),
    []
  );

  const fetchData = useCallback(async (refresh = false) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?page=1&per_page=99999999`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRowData(data);

      if (refresh) toast.success("Data refreshed successfully");
      if (data.length === 0) toast.info("No records found");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch data";
      toast.error(message);
      setRowData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!gridRef.current?.api) return;

    const api = gridRef.current.api;
    api.setFilterModel({
      country: countryFilter
        ? { type: "contains", filter: countryFilter }
        : null,
      tocpillar: tocFilter ? { type: "contains", filter: tocFilter } : null,
    });
    api.onFilterChanged();
  }, [countryFilter, tocFilter]);

  const actionColumn: ColDef<IKPIChangeLog> = {
    field: "actionButton",
    headerName: "Action",
    cellRenderer: (props: CustomCellRendererProps<IKPIChangeLog>) => (
      <CustomActionButtonComponent
        {...props}
        onRefresh={() => fetchData(true)}
      />
    ),
    pinned: "right",
    maxWidth: 100,
  };

  const columns: ColDef<IKPIChangeLog>[] = [
    ...KPIChangeLogColumns,
    actionColumn,
  ];

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex justify-between items-center ">
        <div className="flex gap-4">
          <GloabalSelectDropdown
            wrapperClassName="w-[14vw] min-w-24"
            data={filters.countries}
            placeHolderText="Select Country"
            onSelectItem={(item) => setCountryFilter(item?.name || "")}
          />
          <GloabalSelectDropdown
            wrapperClassName="w-[14vw] min-w-24"
            data={filters.toc}
            placeHolderText="Select TOC Pillar"
            onSelectItem={(item) => setTocFilter(item?.name || "")}
          />
        </div>
        <div className="flex items-center gap-2">
          <Tooltip title="Refresh data">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchData(true)}
              disabled={isLoading}
              className="flex items-center gap-2 h-8 border"
            >
              <RefreshCcw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
              Refresh
            </Button>
          </Tooltip>
          <AddNewKpiChangeLogModal
            onAddRecordCallback={() => fetchData(true)}
          />
        </div>
      </div>

      <div className="ag-theme-quartz h-full ag-theme-quartz ag-theme-custom-kpi-changelog-table rounded-none">
        <AgGridReact
          theme={"legacy"}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          pagination
          paginationAutoPageSize
          loadingOverlayComponent={CustomTableLoader}
          noRowsOverlayComponent={CustomTableNoDataFound}
          // overlayLoadingTemplate={isLoading}
        />
      </div>
    </div>
  );
}
