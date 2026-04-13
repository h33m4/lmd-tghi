"use client";
import Spinner from "@/components/ui/spinner";
import { ApiSimulator } from "@/utils/helper_functions";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import NoDataFoundIcon from "@public/assets/icons/no-data-found.svg";
import { cn } from "@/lib/utils";
import KpiDataTable from "./kpi-datatable";

// styles for ag-grid
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { CountrySchemaKeys, countrySchemaRegistry } from "./datasets-schema";

export default function KpiDataTableComponent() {
  const searchParams = useSearchParams();
  const tablename = searchParams.get("tablename") as CountrySchemaKeys;

  if (tablename && tablename in countrySchemaRegistry) {
    const { schema, columns, defaultData } = countrySchemaRegistry[tablename];

    return (
      <>
        <KpiDataTable
          columns={columns}
          schema={schema}
          // data={defaultData || []}
          showToolBar={true}
        />
      </>
    );
  }

  return (
    <>
      {/* right tool bar */}
      <div className={cn("absolute -top-[38px] right-[2px] z-100")}>
        {/* <UploadSingleRecordModal /> */}
      </div>
      <div className="p-5 border border-dotted  dark:border-border rounded-lg h-full bg-backgroundk ">
        <div className="h-full flex flex-col items-center justify-center text-center ">
          <NoDataFoundIcon />
          <span className="th-font-mediumOblique text-muted-foreground text-sm">
            No Schema found for{" "}
            <span className="th-font-heavyOblique">{tablename}</span> dataset.
            <br />
            Please check back later or contact support
          </span>
        </div>
      </div>
    </>
  );
}
