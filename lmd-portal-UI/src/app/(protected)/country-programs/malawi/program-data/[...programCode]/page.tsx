import { Metadata } from "next";
import React from "react";

import MalawiTableComponent from "../_components/MalawiTableComponent";

export const metadata: Metadata = {
  title: "LMD 2.0 - Malawi | Program Data",
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
      <MalawiTableComponent programCode={params.programCode} />
    </>
  );
}
