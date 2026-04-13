import Footer from "@/components/footer/Footer";
import { metaObject } from "@/config/site.config";
import React from "react";
import ReportRenderer from "./reportRenderer";

export const metadata = {
  ...metaObject("LMH Statistics Reference Guide"),
};

export default function LMHSTATSPage() {
  return (
    <>
      <div className=" w-full flex flex-1 overflow-hidden">
        <div className="w-full h-[calc(100vh-80px)] 2xl:h-[calc(100vh-90px)] flex flex-col overflow-auto  px-2 py-2">
          <ReportRenderer />
        </div>
      </div>
    </>
  );
}
