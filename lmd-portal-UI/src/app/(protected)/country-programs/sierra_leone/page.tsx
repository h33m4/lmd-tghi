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
  ...metaObject("Sierra Leone Program | Home"),
};

const SierraLeonePage = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4  border-primary dark:border-border   h-full  mt-0 bg-transparent rounded-none  overflow-y-scroll px-2 @container ">
        <CountryPageBanner
          countryName={"Sierra Leone"}
          bgImgClass={`bg-[url('/assets/img/country/sierra-leone.jpeg')] bg-center`}
          bannerImg={{ URL: "/assets/img/country/sierra-leone.jpeg" }}
        />
        <SectionBlock title="Country Snapshot" className="mt-4">
          <p className="prose-md prose-slate w-full mx-1.5 pr-3  h-auto text-clip overflow-hidden ">
            Over the last 2 years, we have built a strong foundation by
            partnering with the Ministry of Health to reach over 500 CHWs with
            COVID-19 information, designing and implementing high quality
            education for health systems leaders in partnership with the school
            of nursing and the Freetown City Council, and playing a lead role in
            working with the CHW hub to ensure that strong monitoring and
            evaluation processes are used in the rollout of the new CHW
            training.
            <span className="hover:underline th-font-book ml-0.5 text-blue-600">
              <Link
                href={
                  "https://lastmilehealth.slite.com/app/docs/EahK-7r0FUhH2L"
                }
                target="_blank"
              >
                Read more about Sierra Leone on Slite
              </Link>
              .
            </span>
          </p>

          <div className="my-4 px-2">
            <Link
              className="text-blue-600 th-font-medium hover:underline"
              href={"/country-programs/sierra_leone/overview/one-pager"}
            >
              Click to view the one-page summary for Sierra Leone
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
            introText=" The following are the highest priority projects and activities for
            the Sierra Leone team."
            data={KeyProjectsData as IKeyCountyProjectData[]}
          />
        </SectionBlock>
      </div>
    </>
  );
};

export default SierraLeonePage;
