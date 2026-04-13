"use client";
import React, { useState } from "react";
import InfographicCard from "./InfographicCard";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TourWrapper } from "@/context/tourContext";

type IResultsTabs =
  | "Global"
  | "Liberia"
  | "Malawi"
  | "Ethiopia"
  | "Sierra Leone";

interface ITabProps {
  title: IResultsTabs;
  active?: boolean;
  id: number;
  setCurrentTab: React.Dispatch<React.SetStateAction<IResultsTabs>>;
}

interface IResultData {
  country: IResultsTabs;
  indicator2: {
    cumulative: number | string;
    targetAchieved: number;
    annual: number;
  };
  indicator1: {
    cumulative: number | string;
    targetAchieved: number;
    annual: number;
  };
}

interface ITab {
  id: number;
  title: IResultsTabs;
}

const Tab = ({ title, id, active = false, setCurrentTab }: ITabProps) => {
  return (
    <button
      className={`border px-10 py-1 flex  
      items-center justify-center leading-1 
      rounded-lg border-primary 
      text-base th-font-medium whitespace-nowrap  ${
        active
          ? "bg-primary  text-white"
          : "hover:bg-primary/60 text-lmh-dark-blue hover:text-white dark:text-white"
      }`}
      onClick={() => {
        setCurrentTab(title);
      }}
    >
      {title}
    </button>
  );
};

const tabs: ITab[] = [
  { id: 1, title: "Global" },
  { id: 2, title: "Ethiopia" },
  { id: 3, title: "Liberia" },
  { id: 4, title: "Malawi" },
  { id: 5, title: "Sierra Leone" },
];

const data: IResultData[] = [
  {
    country: "Global",
    indicator1: {
      cumulative: 19358,
      targetAchieved: 109,
      annual: 10715,
    },
    indicator2: {
      cumulative: 24622324,
      targetAchieved: 118,
      annual: 10788086,
    },
  },
  {
    country: "Ethiopia",
    indicator1: {
      cumulative: 8965,
      targetAchieved: 116,
      annual: 2609,
    },
    indicator2: {
      cumulative: 17587500,
      targetAchieved: 112,
      annual: 5680000,
    },
  },
  {
    country: "Liberia",
    indicator1: {
      cumulative: "N/A",
      targetAchieved: 99.8,
      annual: 5358,
    },
    indicator2: {
      cumulative: "N/A",
      targetAchieved: 99.8,
      annual: 1131995,
    },
  },
  {
    country: "Malawi",
    indicator1: {
      cumulative: 3464,
      targetAchieved: 120,
      annual: 2167,
    },
    indicator2: {
      cumulative: 5258993,
      targetAchieved: 137,
      annual: 3708341,
    },
  },

  {
    country: "Sierra Leone",
    indicator1: {
      cumulative: 1571,
      targetAchieved: 157,
      annual: 581,
    },
    indicator2: {
      cumulative: 643836,
      targetAchieved: 116,
      annual: 267750,
    },
  },
];
const ResultsAtGlance = () => {
  const [currentTab, setCurrentTab] = useState<IResultsTabs>("Global");
  return (
    <section className="  py-[8rem]">
      <div className="web-page-constraints flex flex-col gap-10">
        <div className="flex items-center flex-col">
          <TourWrapper tourRef="tour_results_at_glance">
            <h1 className="header-text-1 text-lmh-pink">
              Last Mile Health Reach at a Glance
            </h1>
          </TourWrapper>
          <p className="th-font-bookOblique">
            As of December 31, 2024 (FY25, Q2)
          </p>
        </div>

        <div className="border border-primary rounded-[20px] pb-5 relative">
          <div className="border bg-[#BFEAF6] dark:bg-background border-primary rounded-xl p-1  items-center w-fit max-w-full  absolute -top-5">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  id={tab.id}
                  title={tab.title}
                  active={tab.title === currentTab}
                  setCurrentTab={setCurrentTab}
                />
              ))}
            </div>
          </div>

          {data.map(
            (data, _x) =>
              currentTab === data.country && (
                <div
                  key={_x}
                  className="flex flex-col md:flex-row gap-5 md:gap-10 xl:gap-12 2xl:gap-20 px-4 mt-[4rem] md:mt-[3.5rem]"
                >
                  <InfographicCard
                    fy="FY 25, as of Q2"
                    indictorType={"Number of CHW"}
                    targetAchieved={data.indicator1.targetAchieved}
                    annual={data.indicator1.annual}
                    cummulative={data.indicator1.cumulative}
                  />

                  <InfographicCard
                    fy="FY 25, as of Q2"
                    indictorType={"Peopled Served"}
                    targetAchieved={data.indicator2.targetAchieved}
                    annual={data.indicator2.annual}
                    cummulative={data.indicator2.cumulative}
                  />
                </div>
              )
          )}
        </div>
        <div>
          <Button variant={"dark-blue"}>
            <Link href="/kpi-dashboard">View Our KPI Dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResultsAtGlance;
