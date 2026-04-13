import { Metadata } from "next";
import React from "react";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
import LiberiaTableComponent from "../_components/LiberiaTableComponent";

export const metadata: Metadata = {
  title: "LMD 2.0 - Liberia | Program Data",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

export default function ProgramDataPage({
  params,
}: {
  params: { programCode: string };
}) {
  return (
    <>
      <LiberiaTableComponent programCode={params.programCode} />
    </>
  );
}
