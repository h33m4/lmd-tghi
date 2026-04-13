"use client";

import { cn } from "@/lib/utils";
import { FunnelIcon } from "@heroicons/react/24/outline";
import React, { memo, useCallback } from "react";
import NoDataFoundIcon from "@public/assets/icons/no-data-found.svg";
import DataTable from "@/components/shared/programData/agGridTable/data-table";
import { ColDef } from "ag-grid-community";

// Base interface for program schemas
export interface BaseProgramSchema<T> {
  code: string;
  columns: ColDef<T>[];
  apiURL: string;
}

// Registry type
export type ProgramRegistry = {
  [key: string]: BaseProgramSchema<any>;
};

// Function to create a program configuration
export function createProgramConfig<T>(
  country: string,
  code: string,
  columns: ColDef<T>[]
): BaseProgramSchema<T> {
  return {
    code,
    columns,
    apiURL: `${country}/${code}`,
  };
}

export const FilterButton = memo(
  ({ showToolBar, onClick }: { showToolBar: boolean; onClick: () => void }) => (
    <button
      className={cn(
        "px-4 flex items-center gap-2 py-1 h-7 rounded-sm text-sm",
        showToolBar && "border-dotted",
        "border text-lmh-dark-blue dark:text-white hover:border-primary hover:text-accent-foreground bg-transparent"
      )}
      onClick={onClick}
    >
      <FunnelIcon className="h-5 w-4" />
      <span>{showToolBar ? "Hide" : "Show"} Filters</span>
    </button>
  )
);

FilterButton.displayName = "FilterButton";

export const NoDataView = memo(({ programCode }: { programCode: string }) => (
  <div className="border border-primary border-dashed bg-transparent rounded-md w-full h-full flex flex-col items-center justify-center">
    <NoDataFoundIcon />
    <span className="th-font-mediumOblique text-muted-foreground text-sm">
      No Data found for {programCode}, please select a program data above
    </span>
  </div>
));

NoDataView.displayName = "NoDataView";
