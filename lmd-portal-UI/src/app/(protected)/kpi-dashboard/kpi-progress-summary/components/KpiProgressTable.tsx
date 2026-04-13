"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ColDef,
  ColGroupDef,
  GridReadyEvent,
  RowSpanParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  getDummyKpiProgressSummaryData,
  IKpiProgressSummaryData,
} from "./data";
// import GloabalSelectDropdown, {
//   IGlobalSelectDropdownData,
// } from "../../(admin)/kpi-change-log/globalSelectDropdown";
import CustomTableLoader from "@/components/shared/programData/agGridTable/customLoader";
import CustomTableNoDataFound from "@/components/shared/programData/agGridTable/customNoDataFound";
import GloabalSelectDropdown, {
  IGlobalSelectDropdownData,
} from "../../kpi-change-log/globalSelectDropdown";

const CountryData: IGlobalSelectDropdownData[] = [
  {
    name: "All LMH Countries",
    label: "Total (all LMH countries)",
  },
  {
    name: "Liberia",
    label: "Liberia",
  },
  {
    name: "Malawi",
    label: "Malawi",
  },
  {
    name: "Ethiopia",
    label: "Ethiopia",
  },
  {
    name: "Sierra leone",
    label: "Sierra Leone",
  },
];

const TocData: IGlobalSelectDropdownData[] = [
  {
    name: "Cross-Cutting",
    label: "Cross-Cutting",
  },
  {
    name: "Upskill",
    label: "Upskill",
  },
  {
    name: "Deliver",
    label: "Deliver",
  },
  {
    name: "Strengthen",
    label: "Strengthen",
  },
];

const AggregationLevelData: IGlobalSelectDropdownData[] = [
  {
    name: "Annual (FY)",
    label: "Annual (FY)",
  },
  {
    name: "Cumulative (FY24-28)",
    label: "Cumulative (FY24-28)",
  },
  {
    name: "Cumulative (all time)",
    label: "Cumulative (all time)",
  },
];

export default function KpiProgressTable() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<IKpiProgressSummaryData[] | null>(
    getDummyKpiProgressSummaryData()
  );

  const [countryFilters, setCountryFilters] = useState("");
  const [tocFilters, setTocFilters] = useState("");
  const [aggregationLevelFilters, setAggregationLevelFilters] = useState("");
  const [gridReady, setGridReady] = useState<boolean>(false); // Flag to check if the grid is ready

  const KPIProgressSummaryColumns: (
    | ColDef<IKpiProgressSummaryData>
    | ColGroupDef<IKpiProgressSummaryData>
  )[] = [
    {
      field: "country",
      headerName: "Country",
      rowSpan: (params: RowSpanParams<IKpiProgressSummaryData>) => {
        if (!params.data) {
          return 1;
        }

        const country = params.data.country;
        const rowIndex = params.node!.rowIndex;
        let rowSpan = 1;

        while (
          rowData?.[rowIndex! + rowSpan] &&
          rowData?.[rowIndex! + rowSpan].country === country
        ) {
          rowSpan++;
        }

        return rowSpan;
      },
      cellClassRules: {
        "cell-span": "value !== undefined",
      },
      // suppressSizeToFit: true,
    },
    {
      field: "tocPillar",
      headerName: "Theory of Change Pillar",
      wrapHeaderText: true,
    },
    {
      field: "kpi",
      headerName: "Key Performance Indicators by Country",
      headerClass: "",
      autoHeight: true,
      wrapText: true,
      minWidth: 450,
    },
    {
      field: "aggregationLevel",
      // headerName: "Annual (FY),  Cumulative (FY24-28), or Cumulative (all time)",
      // wrapHeaderText: true,
      // autoHeaderHeight: true,
    },
    {
      field: "baselineYear0",
      headerName: "Baseline Year 0 (FY 23)",
      wrapHeaderText: true,
      // autoHeaderHeight: true,
    },
    {
      headerName: "Year 1 (FY24)",
      children: [
        {
          field: "year1Actual",
          headerName: "Actual (as of Q3)",
        },
        {
          field: "year1Target",
          headerName: "Target",
        },
      ],
    },
    {
      field: "year3Target",
      headerName: "Year 3 (FY26)  Target",
    },
    {
      field: "year3Target",
      headerName: "Year 5 (FY28) Target",
    },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: false,
      filter: true,
    };
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return CustomTableLoader;
  }, []);
  const noRowsOverlayComponent = useMemo(() => {
    return CustomTableNoDataFound;
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setRowData(getDummyKpiProgressSummaryData());
    setGridReady(true); // Set the flag to true when the grid is ready
  }, []);

  useEffect(() => {
    if (gridReady && gridRef.current) {
      // Check if the grid is ready
      const api = gridRef.current.api;

      const filterModel = {
        country: countryFilters
          ? { type: "contains", filter: countryFilters }
          : null,
        tocPillar: tocFilters ? { type: "contains", filter: tocFilters } : null,
        aggregationLevel: aggregationLevelFilters
          ? { type: "contains", filter: aggregationLevelFilters }
          : null,
      };

      api.setFilterModel(filterModel);
      api.onFilterChanged();
    }
  }, [countryFilters, tocFilters, aggregationLevelFilters, gridReady]); // Add gridReady to the dependency array

  return (
    <div className="h-full flex flex-col justify-between gap-2 pt-2">
      <div className="w-full flex flex-row gap-[8px]">
        <GloabalSelectDropdown
          wrapperClassName="w-56"
          placeHolderText={"Select Country"}
          onSelectItem={(item) => {
            setCountryFilters(item?.name || "");
          }}
          data={CountryData}
        />

        <GloabalSelectDropdown
          wrapperClassName="w-52"
          placeHolderText={"Select TOC Pillar"}
          onSelectItem={(item) => {
            setTocFilters(item?.name || "");
          }}
          data={TocData}
        />

        <GloabalSelectDropdown
          wrapperClassName="w-56"
          placeHolderText={"Select Aggregation Level"}
          onSelectItem={(item) => {
            setAggregationLevelFilters(item?.name || "");
          }}
          data={AggregationLevelData}
        />
      </div>
      <div
        className={
          "ag-theme-quartz ag-theme-custom-kpi-changelog-table ag-theme-custom-kpi-progress-table h-full rounded-none"
        }
      >
        <AgGridReact
          ref={gridRef}
          defaultColDef={defaultColDef}
          columnDefs={KPIProgressSummaryColumns}
          rowData={rowData}
          onGridReady={onGridReady}
          pagination
          suppressRowTransform={true}
          loadingOverlayComponent={loadingOverlayComponent}
          noRowsOverlayComponent={noRowsOverlayComponent}
          className="border-none border-lmh-pink rounded-none"
        />
      </div>
    </div>
  );
}
