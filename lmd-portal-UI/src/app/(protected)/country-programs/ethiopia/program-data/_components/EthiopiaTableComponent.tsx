"use client";
import React, { memo, useCallback } from "react";
import DataTable from "@/components/shared/programData/agGridTable/data-table";

import {
  createProgramConfig,
  FilterButton,
  NoDataView,
  ProgramRegistry,
} from "@/components/shared/programData/agGridTable/table-helpers";

// eth_rmnch
import EthRmnchColumns, { IEthRmnch } from "./program-schema/eth_rmnch";
import EthIrtTrainingColumns, {
  IEthIrtTraining,
} from "./program-schema/eth_irt_training";
import EthEchisTrainingColumns, {
  IEthEchisTraining,
} from "./program-schema/eth_echis_training";
import DynamicApiDataTable from "@/components/tables/ag-grid/DynamicApiDataTable";

// Program Registry - Add new programs here
const PROGRAM_REGISTRY: ProgramRegistry = {
  eth_rmnch: createProgramConfig<IEthRmnch>(
    "ethiopia",
    "eth_rmnch",
    EthRmnchColumns
  ),
  eth_blended_irt_training: createProgramConfig<IEthIrtTraining>(
    "ethiopia",
    "eth_blended_irt_training",
    EthIrtTrainingColumns
  ),
  eth_echis_training: createProgramConfig<IEthEchisTraining>(
    "ethiopia",
    "eth_echis_training",
    EthEchisTrainingColumns
  ),
};

type Props = {
  programCode: string;
};

// Export available program codes for type safety
type ProgramCode = keyof typeof PROGRAM_REGISTRY;

const EthiopiaTableComponent = ({ programCode }: Props) => {
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
          // apiUrl: config.apiURL, // `ethiopia/lib_cbis`
          apiUrl: `ethiopia/${programCode}`,
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

export default EthiopiaTableComponent;
