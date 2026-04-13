"use client";

import { Button } from "@/components/ui/button";
import { Select } from "antd";
import React, { useState, useEffect, useCallback } from "react";
import ReportCard, { IReportAccessType, IReportData } from "./ReportCard";
interface IAllreportsProps {
  reportsdata: IReportData[];
}

const Allreports = ({ reportsdata }: IAllreportsProps) => {
  //   console.log(reportdata);
  const [reports, setReports] = useState<IReportData[]>(
    reportsdata as IReportData[]
  );
  const [filteredReports, setFilteredReports] = useState<IReportData[]>(
    reportsdata as IReportData[]
  );

  const [reportName, setReportName] = useState("");
  const [accessType, setAccessType] = useState<IReportAccessType>("All");
  const [fy, setFY] = useState<string[]>([]);

  // Filtering function
  const filterReports = useCallback(
    (
      reportName: string,
      accessType: IReportAccessType,
      fiscalYear: string[]
    ): IReportData[] => {
      return reports.filter((report) => {
        if (
          reportName &&
          !report.title.toLowerCase().includes(reportName.toLowerCase())
        ) {
          return false;
        }
        if (fiscalYear.length > 0 && !fiscalYear.includes(report.FY)) {
          return false;
        }
        if (
          accessType &&
          accessType !== "All" &&
          report.accessType !== accessType
        ) {
          return false;
        }
        return true;
      });
    },
    [reports]
  );

  useEffect(() => {
    // Filter reports based on current filter criteria whenever they change
    const filteredReports = filterReports(reportName, accessType, fy);

    setFilteredReports(filteredReports);
  }, [reportName, accessType, fy, filterReports]);

  //   console.log(filteredReports);
  //   console.log(fy);

  return (
    <>
      {/* filters */}
      <div className="my-2 px-0 flex gap-2">
        <div className="flex-1">
          <label htmlFor="Search"></label>
          <input
            className="text-input w-full max-w-sm"
            type={"search"}
            placeholder="Search report name"
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>

        <div className="flex-1 flex gap-4">
          <Select
            onChange={(value) => {
              setAccessType(value);
            }}
            placeholder="Select Access Type"
            style={{ flex: 1 }}
            className="h-8"
            options={[
              { value: "All", label: "All" },
              { value: "External", label: "External" },
              { value: "Internal", label: "Internal" },
            ]}
          />
          <Select
            onChange={(value) => {
              setFY(value);
            }}
            placeholder="Select Fiscal Year"
            style={{ flex: 2 }}
            mode={"multiple"}
            className="h-8"
            options={[
              { value: "2024", label: "FY 2024" },
              { value: "2023", label: "FY 2023" },
              { value: "2022", label: "FY 2022" },
            ]}
          />
        </div>
      </div>

      {/* <div className="border  border-primary dark:border-border h-full  rounded-md flex items-center justify-center"></div> */}
      <div className="h-full overflow-y-scroll mt-2.5 pt-1 border-t ">
        <div className="  justify-between gap-8  w-full px-2 py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredReports ? (
            filteredReports.map((report, _id) => (
              <ReportCard key={_id} report={report} />
            ))
          ) : (
            <div>Loading</div>
          )}
        </div>
      </div>
      <div className="flex gap-3 pt-2 flex-end justify-end ">
        <Button size={"sm"} variant={"outline"} className="h-6 px-6 rounded-sm">
          Prev
        </Button>
        <Button size={"sm"} variant={"outline"} className="h-6 px-6 rounded-sm">
          Next
        </Button>
      </div>
    </>
  );
};

export default Allreports;
