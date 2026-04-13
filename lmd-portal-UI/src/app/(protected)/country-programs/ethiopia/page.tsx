import { Metadata } from "next";
import React from "react";
import Spinner from "@/components/ui/spinner";
import CountryPageBanner from "@/components/shared/CountryPageBanner";
import SectionBlock from "@/components/shared/SectionBlock";
import Link from "next/link";
import CountrySnapshotStats from "@/components/shared/CountrySnapshotStats";
import KeyCountryProjects from "@/components/shared/CountryKeyProjects";

// types
import { ICountryStatsData, IKeyCountyProjectData } from "@/types";

// data
import StatsData from "./data/country-stats.json";
import KeyProjectsData from "./data/country-key-projects.json";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Ethiopia Program | Home"),
};

const EthiopiaPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4  border-primary dark:border-border   h-full  mt-0 bg-transparent rounded-none  overflow-y-scroll px-2 @container ">
        <CountryPageBanner
          countryName={"Ethiopia"}
          bgImgClass={`bg-[url('/assets/img/country/ethiopia-banner.png')] bg-[center_top_-1vw] `}
          bannerImg={{
            URL: "/assets/img/country/ethiopia-banner.png",
            className: `object-[center_top]`,
            height: 400,
            width: 800,
          }}
        />
        <SectionBlock title="Country Snapshot" className="mt-4">
          <p className="prose-md prose-slate w-full mx-1.5 pr-3  h-auto text-clip overflow-hidden ">
            Ethiopia is Africa’s second most populous country. Over the past two
            decades, the government has improved health outcomes for women and
            children and built a stronger health workforce. Our work in Ethiopia
            is focused on building community health workers’ skills. Together
            with the Ministry of Health, we’re transforming the way that tens of
            thousands of community health workers are trained.
            <span className="hover:underline th-font-book ml-0.5 text-blue-600">
              <Link
                href={
                  "https://lastmilehealth.slite.com/app/docs/6vLCAz7CmxDIuE"
                }
                target="_blank"
              >
                Read more about Ethiopia on Slite
              </Link>
              .
            </span>
          </p>

          <div className="my-4 px-2">
            <Link
              className="text-blue-600 th-font-medium hover:underline"
              href={"/country-programs/ethiopia/overview/one-pager"}
            >
              Click to view the one-page summary for Ethiopia
            </Link>
          </div>
          <hr className="border-[0.5px] w-full my-3 " />
          <CountrySnapshotStats
            data={StatsData as unknown as ICountryStatsData[]}
          />
        </SectionBlock>

        <SectionBlock title="Key Projects" className="w-full @container">
          <KeyCountryProjects
            className="@2xl:grid-cols-2 @6xl:grid-cols-3 @2xl:gap-14 @6xl:gap-12 4xl:gap-8  p-2"
            introText="The following are the highest priority projects and activities for
              the Ethiopia team."
            data={KeyProjectsData as IKeyCountyProjectData[]}
          />
        </SectionBlock>
      </div>
    </>
  );
};

export default EthiopiaPage;
