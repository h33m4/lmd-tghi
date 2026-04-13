"use client";
import ShipWithContainer from "@/components/icons/ship-with-container";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  ChildMortalityIcon,
  HIVPrevalenceIcon,
  HealthWorkerCoverageIcon,
  MaternalMortalityIcon,
  PopulationIcon,
  VaccineIcon,
} from "@/components/icons/country-indicator";
import { useScrollableSlider } from "@/hooks/use-scrollable-slider";
import { Button } from "@/components/ui/button";

import statsvalues from "../../app/(protected)/country-programs/liberia/data/country-stats.json";
import { ICountryStatsData } from "@/types";
import Spinner from "../ui/spinner";
import { useEffect, useState } from "react";
import Link from "next/link";

type StatType = {
  id: number;
  count?: number | string;
  icon: React.ReactNode;
  label: string;
  countDescription?: string;
};

interface IndexProps {
  className?: string;
  data: ICountryStatsData[];
}

export default function CountrySnapshotStats({ className, data }: IndexProps) {
  const {
    sliderEl,
    sliderPrevBtn,
    sliderNextBtn,
    scrollToTheRight,
    scrollToTheLeft,
  } = useScrollableSlider();

  const [dataa, setDataa] = useState<StatType[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      setDataa([
        {
          id: 1,
          count: data[0]["Rural Population"] || 0,
          icon: <PopulationIcon className="text-lmh-pink fill:lmh-pink" />,
          label: "Rural Population",
        },
        {
          id: 2,
          count: data[1]["Child Mortality"] || 0,
          icon: <ChildMortalityIcon />,
          label: "Child Mortality",
          countDescription: "PER 1,000 Live Births",
        },
        {
          id: 3,
          count: data[2]["Maternal Mortality"] || 0,
          icon: <MaternalMortalityIcon />,
          label: "Maternal Mortality",
          countDescription: "PER 100,000 Live Births",
        },
        // {
        //   id: 4,
        //   count: data[3]["Basic Vaccine Coverage"] || 0,
        //   icon: <VaccineIcon />,
        //   label: "Basic Vaccine Coverage",
        // },
        // {
        //   id: 5,
        //   count: data[4]["HIV Prevalence"] || 0,
        //   icon: <HIVPrevalenceIcon />,
        //   label: "HIV Prevalence",
        // },
        {
          id: 6,
          count: data[5]["Health Worker Coverage"] || 0,
          icon: <HealthWorkerCoverageIcon />,
          label: "Health Worker Coverage",
          countDescription: "Doctors PER 1,000 People",
        },
      ]);
    } else {
      setDataa([]);
    }
  }, [data]);

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative flex w-full items-center overflow-hidden ",
          className
        )}
      >
        <Button
          title="Prev"
          variant="ghost"
          ref={sliderPrevBtn}
          onClick={() => scrollToTheLeft()}
          className="!absolute left-0 top-0 z-10 !h-full w-8 !justify-start rounded-none bg-gradient-to-r from-[#f7f8fc]  via-[#f7f8fc]  to-transparent px-0 text-gray-500 hover:text-foreground dark:from-[#0e1117] dark:via-[#0e1117] 3xl:hidden"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <div className="w-full overflow-hidden">
          <div
            ref={sliderEl}
            className="custom-scrollbar-x  grid grid-flow-col gap-5 overflow-x-auto scroll-smooth 2xl:gap-6 3xl:gap-8 pb-2  my-2"
          >
            {data ? (
              dataa.map((item) => <CountryStat key={item.id} {...item} />)
            ) : (
              <div className="h-[3rem]">
                <Spinner />
              </div>
            )}
          </div>
        </div>
        <Button
          title="Next"
          variant="ghost"
          ref={sliderNextBtn}
          onClick={() => scrollToTheRight()}
          className="!absolute right-0 top-0 z-10 !h-full w-8 !justify-end rounded-none bg-gradient-to-l from-[#f7f8fc]  via-[#f7f8fc]  to-transparent px-0 text-gray-500 hover:text-foreground dark:from-[#0e1117] dark:via-[#0e1117] 3xl:hidden"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-muted-foreground text-sm  text-left">
        <span className="th-font-heavy text-lmh-dark-blue"> * Source:</span>
        <span className="th-font-oblique mx-1">
          <Link
            href={"/lmh-statistics-ref-guide"}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer  hover:underline mr-1"
          >
            LMH Statistics Reference Guide
          </Link>
          <span className="th-font-lightOblique">
            (Last Updated - December, 2024)
          </span>
        </span>
      </p>
    </div>
  );
}

function CountryStat({ count, icon, label, countDescription }: StatType) {
  return (
    <div
      className={cn(
        "w-[20rem] min-w-[292px] flex relative bg-background items-center gap-1 rounded-lg border border-primary px-2.5 pr-2.5 py-3 3xl:w-auto"
      )}
      // style={{ borderColor: bgColor }}
    >
      <div className="w-full">
        <div className="flex justify-start items-end gap-3 border-b mr-2 pb-1">
          <p className="text-3xl font-bold text-primary  flex-1 mb-0">
            {count}
            <span className="text-sm ml-1 th-font-roman text-lmh-green truncate ">
              {countDescription}
            </span>
          </p>
        </div>
        <p className="mt-1 text-sm 2xl:text-md text-lmh-dark-blue dark:text-foreground th-font-medium">
          {label}
        </p>
      </div>
      {/* dark:bg-[#0e1117] bg-[#f7f8fc]  */}
      <figure className=" absolute right-[3px]  pr-0.5 bg-background flex items-center  [&>svg]:h-[3.5rem] [&>svg]:w-[3.5rem]">
        {icon}
      </figure>
    </div>
  );
}
