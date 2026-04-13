import { Metadata } from "next";
import React from "react";
import NoDataFoundIcon from "@public/assets/icons/no-data-found.svg";

export const metadata: Metadata = {
  title: "LMD 2.0 - Liberia | Program Data",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

export default async function LiberiaProgramDB() {
  return (
    <>
      <div className="border border-primary border-dashed bg-transparent rounded-md w-full h-full flex flex-col items-center justify-center">
        <NoDataFoundIcon />
        <span className="th-font-mediumOblique text-muted-foreground text-sm">
          No Data found, please select a program data above
        </span>
      </div>
    </>
  );
}
