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
  ...metaObject("Malawi Program | Home"),
};

const MalawiPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4  border-primary dark:border-border   h-full  mt-0 bg-transparent rounded-none  overflow-y-scroll px-2 @container ">
        <CountryPageBanner
          countryName={"Malawi"}
          bannerImg={{ URL: "/assets/img/country/malawi2.jpg" }}
        />
        <SectionBlock title="Country Snapshot" className="mt-4">
          <p className="prose-md prose-slate w-full mx-1.5 pr-3  h-auto text-clip overflow-hidden ">
            One-tenth of Malawi&apos;s rural population is situated more than
            eight kilometers from the nearest health facility. Building on the
            National Community Health Strategy (2017-2022) which aligns with
            HSSP III, Last Mile Health will continue to support the Government
            of Malawi in implementing the newly launched National Community
            Health Framework (2023-2030), we are supporting them to ensure the
            program delivers essential primary health services to every person -
            no matter where they live.
            <span className="hover:underline th-font-book ml-0.5 text-blue-600">
              <Link
                href={
                  "https://lastmilehealth.slite.com/app/docs/cEDDLi3j51-GAc"
                }
                target="_blank"
              >
                Read more about Malawi on Slite
              </Link>
              .
            </span>
          </p>

          <div className="my-4 px-2">
            <Link
              className="text-blue-600 th-font-medium hover:underline"
              href={"/country-programs/malawi/overview/one-pager"}
            >
              Click to view the one-page summary for Malawi
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
              the Malawi team."
            data={KeyProjectsData as IKeyCountyProjectData[]}
          />
        </SectionBlock>
      </div>
    </>
  );
};

export default MalawiPage;
