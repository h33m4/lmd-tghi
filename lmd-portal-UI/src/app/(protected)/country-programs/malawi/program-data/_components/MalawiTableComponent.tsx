"use client";

import React, { useCallback, useState } from "react";
import DataTable from "@/components/shared/programData/agGridTable/data-table";

// import all program schemas
import MlwIchisTrainingColumns, {
  IMlwIchisTraining,
} from "./program-schema/mlw_ichis_training";
import MlwCbmncTrainingColumns, {
  IMlwCbmncTraining,
} from "./program-schema/mlw_cbmnc_training";
import MlwIchisExpansionColumns, {
  IMlwIchisExpansion,
} from "./program-schema/mlw_ichis_expansion";
import {
  createProgramConfig,
  FilterButton,
  NoDataView,
  ProgramRegistry,
} from "@/components/shared/programData/agGridTable/table-helpers";
import DynamicApiDataTable from "@/components/tables/ag-grid/DynamicApiDataTable";

// Program Registry - Add new programs here
const PROGRAM_REGISTRY: ProgramRegistry = {
  mlw_ichis_training: createProgramConfig<IMlwIchisTraining>(
    "malawi",
    "mlw_ichis_training",
    MlwIchisTrainingColumns
  ),
  mlw_cbmnc_training: createProgramConfig<IMlwCbmncTraining>(
    "malawi",
    "mlw_cbmnc_training",
    MlwCbmncTrainingColumns
  ),
  mlw_ichis_expansion: createProgramConfig<IMlwIchisExpansion>(
    "malawi",
    "mlw_ichis_expansion",
    MlwIchisExpansionColumns
  ),
};

// Export available program codes for type safety
export type ProgramCode = keyof typeof PROGRAM_REGISTRY;

interface Props {
  programCode: string;
}

const MalawiTableComponent = ({ programCode }: Props) => {
  const [showToolBar, setShowToolBar] = useState(false);

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
          // apiUrl: config.apiURL, // `malawi/lib_cbis`
          apiUrl: `malawi/${programCode}`,
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

export default MalawiTableComponent;
