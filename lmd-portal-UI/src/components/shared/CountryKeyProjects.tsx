"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

import { IKeyCountyProjectData, ITocPillar } from "@/types";
import Spinner from "../ui/spinner";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import GloabalSelectDropdown, {
  IGlobalSelectDropdownData,
} from "@/app/(protected)/kpi-dashboard/kpi-change-log/globalSelectDropdown";
// import GloabalSelectDropdown, {
//   IGlobalSelectDropdownData,
// } from "@/app/(protected)/kpi-dashboard/(admin)/kpi-change-log/globalSelectDropdown";

type IReportData = {
  title: string;
  description: string;
  readMoreUrl: string;
  tocPillar?: ITocPillar;
};

function ProjectCard({
  title,
  description,
  readMoreUrl,
  tocPillar,
}: IReportData) {
  return (
    <div
      className={cn(
        "bg-[#eff2f6] dark:bg-lmh-dark-blue/50 rounded-3xl  flex flex-col gap-[3rem] justify-between p-4 group  hover:border-[#BFEAF6] hover:shadow-[0_0px_14px_2px_rgba(75,183,214,0.80)] relative"
      )}
    >
      <div className="mt-3 px-1  h-full flex flex-col justify-between gap-2">
        <h1 className="text-md th-font-heavy mb-2 text-lmh-pink h-1/4  ">
          {title}
        </h1>

        <div className="h-full text-sm mb-2 ">
          <p className="  mb-1 ">{description}</p>
        </div>
      </div>

      <button className="h-8 mx-2 -mt-3 flex flex-col items-start justify-center">
        <Link
          href={readMoreUrl}
          target={"_blank"}
          className="flex  items-center justify-center gap-3"
        >
          <span className="flex-1 th-font-medium text-md hidden group-hover:block">
            See Project Hub for more information
          </span>
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </button>

      <span
        className={cn(
          "absolute top-0 right-0 rounded-tr-3xl",
          "border px-6 py-1   text-white text-xs th-font-medium",
          tocPillar === "Deliver" && "bg-lmh-dark-blue",
          tocPillar === "Upskill" && "bg-lmh-pink",
          tocPillar === "Strengthen" && "bg-primary"
        )}
      >
        {tocPillar}
      </span>
    </div>
  );
}

export default function KeyCountryProjects({
  className,
  data,
  introText,
}: {
  className?: string;
  data?: IKeyCountyProjectData[];
  introText: string;
}) {
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );

  // Handle filtering of the data by the selected tocPillar
  const filteredData = selectedFilter
    ? data?.filter((project) => project.tocPillar === selectedFilter)
    : data;

  // Handle selection change from the dropdown
  const handleSelectionChange = (
    selected: IGlobalSelectDropdownData | undefined
  ) => {
    setSelectedFilter(selected?.name);
  };

  return (
    <>
      {data ? (
        <div>
          <div className="flex">
            <p className="my-3 prose-md prose-slate w-full overflow-hidden">
              {introText}
            </p>

            <GloabalSelectDropdown
              placeHolderText={"Filter by TOC Pillar"}
              onSelectItem={handleSelectionChange}
              data={[
                { name: "Deliver", label: "Deliver" },
                { name: "Upskill", label: "Upskill" },
                { name: "Strengthen", label: "Strengthen" },
              ]}
            />
          </div>

          {filteredData && filteredData.length === 0 ? (
            <div className="h-[20vh] w-full flex flex-col  items-center justify-center">
              <p className=" text-muted-foreground">
                No projects match the selected TOC Pillar
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "w-full grid grid-cols-1 gap-8  3xl:gap-8 4xl:gap-9 ",
                className
              )}
            >
              {filteredData &&
                filteredData.map((project, _x) => (
                  <ProjectCard
                    key={_x}
                    title={project.title}
                    description={project.description}
                    readMoreUrl={project.readMoreUrl}
                    tocPillar={project.tocPillar}
                  />
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full border-dashed rounded-md h-24">
          <Spinner />
        </div>
      )}
    </>
  );
}
