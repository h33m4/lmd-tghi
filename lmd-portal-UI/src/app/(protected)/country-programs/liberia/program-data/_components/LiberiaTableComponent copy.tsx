"use client";
import React, { memo, useCallback } from "react";
import DataTable from "@/components/shared/programData/agGridTable/data-table";

// Import all program schemas
import LibCbisColumns, { ILibCbis } from "./program-schema/lib_cbis";
import LibChwMasterListColumns, {
  ILibChwMasterList,
} from "./program-schema/lib_chw_master_list";
import {
  createProgramConfig,
  FilterButton,
  NoDataView,
  ProgramRegistry,
} from "@/components/shared/programData/agGridTable/table-helpers";

// Program Registry - Add new programs here
const PROGRAM_REGISTRY: ProgramRegistry = {
  lib_cbis: createProgramConfig<ILibCbis>(
    "liberia",
    "lib_cbis",
    LibCbisColumns
  ),
  lib_chw_master_list: createProgramConfig<ILibChwMasterList>(
    "liberia",
    "lib_chw_master_list",
    LibChwMasterListColumns
  ),
};

// Export available program codes for type safety
type ProgramCode = keyof typeof PROGRAM_REGISTRY;

interface Props {
  programCode: string;
}

const LiberiaTableComponent = ({ programCode }: Props) => {
  const [showToolBar, setShowToolBar] = React.useState(false);

  const toggleToolBar = useCallback(() => {
    setShowToolBar((prev) => !prev);
  }, []);

  const config = PROGRAM_REGISTRY[programCode as ProgramCode];

  if (!config) {
    return <NoDataView programCode={programCode} />;
  }

  return (
    <>
      <div className="absolute -top-[40px] right-[2px] z-100 border-none border-red-500">
        <FilterButton showToolBar={showToolBar} onClick={toggleToolBar} />
      </div>
      <DataTable
        columns={config.columns}
        data={null}
        showToolBar={showToolBar}
        apiURL={config.apiURL}
      />
    </>
  );
};

export default memo(LiberiaTableComponent);
