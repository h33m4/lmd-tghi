"use client";
import React, { memo, useCallback, useState } from "react";
import DataTable from "@/components/shared/programData/agGridTable/data-table";

import {
  createProgramConfig,
  FilterButton,
  NoDataView,
  ProgramRegistry,
} from "@/components/shared/programData/agGridTable/table-helpers";
import SlEghTrainingColumns, {
  ISlEghTraining,
} from "./program-schema/sl_egh_training";
import DynamicApiDataTable from "@/components/tables/ag-grid/DynamicApiDataTable";

// import program schema

const PROGRAM_REGISTRY: ProgramRegistry = {
  sl_egh_training: createProgramConfig<ISlEghTraining>(
    "sierra_leone",
    "sl_egh_training",
    SlEghTrainingColumns
  ),
};

// Export available program codes for type safety
type ProgramCode = keyof typeof PROGRAM_REGISTRY;

type Props = {
  programCode: string;
};

const SierraLeoneTableComponent = ({ programCode }: Props) => {
  const [showToolBar, setShowToolBar] = React.useState(false);

  const toggleToolBar = useCallback(() => {
    setShowToolBar((prev) => !prev);
  }, []);

  const config = PROGRAM_REGISTRY[programCode as ProgramCode];

  // if (!config) {
  //   return <NoDataView programCode={programCode} />;
  // }

  return (
    <>
      <div className="absolute -top-[40px] right-[2px] z-100 border-none border-red-500">
        <FilterButton showToolBar={showToolBar} onClick={toggleToolBar} />
      </div>
      {/* <DataTable
        columns={config.columns}
        data={null}
        showToolBar={showToolBar}
        apiURL={config.apiURL}
      /> */}

      <DynamicApiDataTable
        apiConfig={{
          // apiUrl: config.apiURL, // `sierra_leone/lib_cbis`
          apiUrl: `sierra_leone/${programCode}`,
          perPage: 500,
          pageSizeOptions: [100, 500, 1000, 5000],
        }}
        columnConfig={{
          // columns: config.columns,
          autoGenerateColumns: true,
          namingStrategy: "mapped",
          enableColumnMenu: true,
          enableFilters: true,

          enableSorting: true,
          enableFloatingFilter: true,
          columnNameMap: {
            "1_2b_births_home_chss": "Births at Home CHSS",
            "1_2c_births_health_facility": [
              "Births at Health Facility",
              "number",
            ],
          },
        }}
        enableRowSelection={true}
        showToolBar={showToolBar}

        // onRowSelectionChange={(rows) => console.log("selected rows", rows)}
        // onDataChange={(data) => {
        //   console.log("data", data);
        // }}
      />
    </>
  );
};

export default SierraLeoneTableComponent;
