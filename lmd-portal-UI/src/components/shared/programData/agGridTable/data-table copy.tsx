"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";

import {
  ColDef,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ProcessHeaderForExportParams,
} from "ag-grid-community";

import { AgGridReact } from "ag-grid-react";

// import { ClientSideRowModelModule } from "ag-grid-react/client-side-row-model";
// import { ModuleRegistry } from "ag-grid-react";
// ModuleRegistry.registerModules([ClientSideRowModelModule]);

import CustomTableNoDataFound from "./customNoDataFound";
import { Button } from "@/components/ui/button";
import { FolderArrowDownIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import ColumsToggler from "./colums-toggler";
import { Input } from "@/components/ui/input";
import TrashIcon from "@/components/icons/trash";
import { isEqual } from "lodash";
import CustomTableLoader from "./customLoader";
import DataRangePicker from "./date-range-picker";
import { generateFileName } from "@/utils/table-helpers";

interface IDataFilters {
  keyword?: string;
  dataRange: {
    start: Date | null;
    end: Date | null;
  };
}
const initialFilterState: IDataFilters = {
  keyword: undefined,
  dataRange: {
    start: null,
    end: null,
  },
};

interface IDataTableProps<T> {
  columns: ColDef<T, any>[];
  data: T[] | null;
  showToolBar: boolean;
  isLoading?: boolean;
  apiURL?: string;
}

/**
 * A component for toggling columns visibility in a popover menu.
 *
 * @template T - The type or interface defining the column structure.
 * @param {IDataTableProps<T>} props - The props for the DataTable component.
 * @returns {JSX.Element} - The rendered ColumnsToggler component.
 */
export default function DataTable<T>({
  columns,
  data,
  showToolBar,
  isLoading = false,
  apiURL,
}: IDataTableProps<T>): JSX.Element {
  const loadingOverlayComponent = useMemo(() => {
    return CustomTableLoader;
  }, []);
  const noRowsOverlayComponent = useMemo(() => {
    return CustomTableNoDataFound;
  }, []);

  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<T[] | null>(null);
  const [columnDefs, setColumnDefs] = useState<ColDef<T>[]>(columns);

  // filters
  const [dataFilters, setDataFilters] =
    useState<IDataFilters>(initialFilterState);

  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => {
    return {
      type: "fitCellContents",
      // type: "fitGridWidth",
      defaultMinWidth: 150,
    };
  }, []);

  // search
  const onFilterTextBoxChanged = useCallback((val: string) => {
    gridRef.current!.api.setGridOption("quickFilterText", val);
    // console.log("runing this for the filter values", val);
  }, []);

  // columns toggler
  const onCulumnChange = useCallback((updatedColumns: ColDef<T>[]) => {
    gridRef.current!.api.setGridOption("columnDefs", updatedColumns);
  }, []);

  const onGridReady = useCallback(() => {
    fetch(
      `https://ew3wppicpv.us-east-1.awsapprunner.com/api/program_data/${apiURL}?page=1&per_page=999900`
    )
      .then((resp) => resp.json())
      .then((data: any) => {
        console.log("data->", data);
        setRowData(data.data as T[]);
      });
    // setTimeout(() => {
    //   setRowData(data as T[]);
    // }, 5000); // 5000 milliseconds = 5 seconds
  }, [apiURL]);

  const onExportCSV = useCallback(() => {
    console.log("exporting as csv");

    // const now = new Date();
    // const year = now.getFullYear();
    // const month = now.getMonth() + 1; // getMonth() returns 0-11
    // const day = now.getDate();

    // console.log("fileee", apiURL?.split("/")[1]);

    // const fileName = `${apiURL?.split("/")[1]}_
    // ${month < 10 ? "0" + month : month}_
    // ${day < 10 ? "0" + day : day}_${year}.csv`;

    const fileName = generateFileName(`${apiURL?.split("/")[1]}`);

    gridRef.current!.api.exportDataAsCsv({
      fileName: fileName,
      processHeaderCallback: (params) => {
        // Provide a default value in case field or headerName is undefined
        return (
          params.column.getColDef().field ||
          params.column.getColDef().headerName ||
          ""
        );
      },
    });
  }, [apiURL]);

  return (
    <div className="h-full w-full  space-y-2 flex flex-col">
      {/* toolbar */}
      {showToolBar && (
        <div className="w-full h-8   border-dotted flex flex-row justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-72 relative">
              <Input
                id="filter-text-box"
                className="h-8 pl-7 py-1 flex items-center"
                type="search"
                placeholder="Search by anything"
                value={dataFilters?.keyword || ""}
                onChange={(e) => {
                  setDataFilters((prev) => ({
                    ...prev,
                    keyword: String(e.target.value),
                  }));
                  onFilterTextBoxChanged(e.target.value);
                }}
              />
              <div className="absolute inset-0 pl-1.5 h-full flex items-center -z-10 ">
                <MagnifyingGlassIcon className="h-4 w-4 text-muted-lmh-dark-blue" />
              </div>
            </div>
            <DataRangePicker
              // [start, end]
              rangeValues={[
                dataFilters.dataRange.start,
                dataFilters.dataRange.end,
              ]}
              onRangeChange={(dates) => {
                const [start, end] = dates;
                onFilterTextBoxChanged(
                  `${start?.toISOString().slice(0, 10) || ""} - ${
                    end?.toISOString().slice(0, 10) || ""
                  }`
                );
                setDataFilters((prev) => ({
                  ...prev,
                  dataRange: {
                    start,
                    end,
                  },
                }));
              }}
            />
            {!isEqual(dataFilters, initialFilterState) && (
              <Button
                className="h-[30px] flex items-center gap-1.5"
                variant={"ghost2"}
                size={"sm"}
                onClick={() => {
                  setDataFilters(initialFilterState);
                  onFilterTextBoxChanged("");
                }}
              >
                <TrashIcon className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 h-8">
            <ColumsToggler<T>
              allColumns={columns}
              onColumnsChange={(cols) => onCulumnChange(cols)}
            />
            <Button
              className="px-4 flex items-center gap-2 py-1  "
              variant={"outline2"}
              size={"sm"}
              onClick={onExportCSV}
            >
              <FolderArrowDownIcon className="h-5 w-4" />
              <span className="-mb-0.5">Download Dataset</span>
            </Button>
          </div>
        </div>
      )}

      {/* main table */}
      <div className={cn("w-full ag-theme-quartz   rounded-lg h-full")}>
        <AgGridReact
          headerHeight={38}
          rowHeight={35}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          autoSizeStrategy={autoSizeStrategy}
          onGridReady={onGridReady}
          loadingOverlayComponent={loadingOverlayComponent}
          noRowsOverlayComponent={noRowsOverlayComponent}
          reactiveCustomComponents
          pagination
          className=" rounded-lg"
        />
      </div>
    </div>
  );
}
