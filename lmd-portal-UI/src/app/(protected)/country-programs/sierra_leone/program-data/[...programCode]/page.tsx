import { Metadata } from "next";
import React from "react";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
import SierraLeoneTableComponent from "../_components/SierraLeoneTableComponent";

export const metadata: Metadata = {
  title: "LMD 2.0 - Sierra Leone | Program Data",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

export default function SierraLeoneProgramDataPage({
  params,
}: {
  params: { programCode: string };
}) {
  return (
    <>
      <SierraLeoneTableComponent programCode={params.programCode} />
    </>
  );
}
