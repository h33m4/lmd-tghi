import { Metadata } from "next";
import React from "react";

import EthiopiaTableComponent from "../_components/EthiopiaTableComponent";

export const metadata: Metadata = {
  title: "LMD 2.0 - Ethiopia | Program Data",
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
      <EthiopiaTableComponent programCode={params.programCode} />
    </>
  );
}
