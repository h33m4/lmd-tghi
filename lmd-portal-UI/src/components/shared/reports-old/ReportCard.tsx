"use client";
import React from "react";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatDateForReport } from "@/utils/date-helpers";

export type IReportAccessType = "External" | "Internal" | "All";

export type IReportType = "Presentation" | "Document" | "Spreadsheets";

export interface IReportData {
  id: string;
  title: string;
  category: string;
  url: string;
  accessType: IReportAccessType;
  FY: string;
  quarter: string[];
  country?: string;
  type?: IReportType;
  dateCreated: string; // month/day/year
}

interface ReportCardProps {
  report: IReportData;
}

const ReportCard = ({ report }: ReportCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  //   console.log(pathname);
  const reporturl = report.url.split("google.com")[1];

  // const url = `${pathname}${reporturl}`;
  //   console.log(report.url);

  const url = `${pathname}/${report.id}`;
  return (
    <div
      // href={url}
      key={report.id}
      onClick={() => router.push(url)}
      className={cn(
        "group hover:bg-background hover:cursor-pointer rounded-sm hover-up  relative  w-full  flex-col justify-start items-start gap-5 block hover-up border-2 border-neutral-300 dark:border-neutral-dark-300 overflow-hidden"
      )}
    >
      <div className="h-[9.5rem] xl:h-[14vw] 2xl:h-[13rem] w-full relative">
        <Image
          alt=""
          src="/assets/img/country/reports-mock-bg.png"
          className=" w-full rounded-none object-cover absolute"
          placeholder={"blur"}
          blurDataURL="/assets/img/country/reports-mock-bg.png"
          fill
          priority
        />
        <div className="absolute text-white  px-6 flex flex-col items-center justify-center  h-full">
          <div className="">
            {/* <h1 className="text-lg">{report.country} Program</h1> */}
            <h1 className="text-lg">{report.title}</h1>
            <div className="flex">
              <hr className="border-[0.1px] border-gray-500  my-1 w-1/3" />
            </div>
            <span className="text-md th-font-book text-primary">
              {report.category} Reports
            </span>
          </div>
        </div>
        {/* <div className="absolute bottom-1 right-1">access type</div> */}
      </div>

      <div className="flex-col justify-start items-start gap-3.5 flex pt-4 px-3 pb-4">
        <div className="justify-between items-center gap-5 inline-flex  w-full">
          <div className="flex gap-2">
            <div
              className={cn(
                "px-3 pb-[4px] pt-[6px]  dark:bg-neutral-dark-200 rounded-3xl  justify-center items-center gap-2.5 flex",
                "bg-lmh-blue text-white  dark:text-neutral-dark-950"
              )}
            >
              <div
                className={cn(" text-xs font-medium leading-none text-center")}
              >
                FY {report.FY}
              </div>
            </div>
            <div
              className={cn(
                "px-3 pb-[4px] pt-[6px]  dark:bg-neutral-dark-200 rounded-3xl  justify-center items-center gap-2.5 flex",
                "bg-lmh-pink/90 text-white  dark:text-neutral-100"
              )}
            >
              <div
                className={cn(" text-xs font-medium leading-none flex gap-1")}
              >
                {report.quarter.map((q, _x) => (
                  <p key={_x}>{q}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="justify-start items-center gap-2 flex">
            <div className="text-neutral-700 text-sm font-medium leading-none dark:text-neutral-dark-700">
              {formatDateForReport(new Date(report.dateCreated))}
            </div>
          </div>
        </div>
        <h3>
          <Link
            className="text-neutral-950 dark:text-white/70 text-base font-bold leading-snug item-link"
            href={url}
          >
            {report.title}
            {/* {report.country} {report.category} Reports */}
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default ReportCard;
