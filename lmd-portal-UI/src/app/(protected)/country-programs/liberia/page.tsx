import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import CountrySnapshotStats from "@/components/shared/CountrySnapshotStats";
import CountryPageBanner from "@/components/shared/CountryPageBanner";
import SectionBlock from "@/components/shared/SectionBlock";
import KeyCountryProjects from "@/components/shared/CountryKeyProjects";

// types
import { ICountryStatsData, IKeyCountyProjectData } from "@/types";

// data
import StatsData from "./data/country-stats.json";
import KeyProjectsData from "./data/country-key-projects.json";
import { metaObject } from "@/config/site.config";

// seo meta data
export const metadata = {
  ...metaObject("Liberia Program | Overview"),
};

// export const metadata: Metadata = {
//   title: "LMD 2.0 - Liberia Program",
//   description: "A programmatic data management & reporting platform for Last Mile Health",
// };

const LiberiaPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4  border-primary dark:border-border   h-full  mt-0  rounded-none  overflow-y-scroll px-2 @container bg-background">
        <CountryPageBanner
          countryName={"Liberia"}
          bannerImg={{
            height: 450,
            width: 800,
            URL: "/assets/img/country/liberia-banner.webp",
            className: `object-[center_top]`,
          }}
        />
        <SectionBlock title="Country Snapshot" className="mt-4">
          <p className="prose-md prose-slate w-full mx-1.5 pr-3  h-auto text-clip overflow-hidden ">
            LMH&apos;s partnership with the Liberian Ministry of Health (MOH)
            began in 2007. In 2014, LMH&apos;s efforts shifted from HIV
            treatment to community health when the organization worked with the
            Government of Liberia to pilot a Community Health Worker (CHW)
            program in Konobo District, one of the most financially
            disenfranchised and hardest-to-reach regions in the country.
            Encouraged by early results, clinic-based skilled birth attendance
            increased from 55 percent to 84 percent LMH partnered with the MOH
            to replicate this model across Rivercess County in a pilot for
            nationwide scale up.{" "}
            <span className="hover:underline th-font-book ml-0.5 text-blue-600">
              <Link
                href={
                  "https://lastmilehealth.slite.com/app/docs/vsBEzBdIaSB2A5"
                }
                target="_blank"
              >
                Read more about Liberia on Slite
              </Link>
              .
            </span>
          </p>

          <div className="my-4 px-2">
            <Link
              className="text-blue-600 th-font-medium hover:underline"
              href={"/country-programs/liberia/overview/one-pager"}
            >
              Click to view the one-page summary for Liberia
            </Link>
          </div>

          <hr className="border-[0.5px] w-full my-3 " />
          <CountrySnapshotStats
            data={StatsData as unknown as ICountryStatsData[]}
          />
        </SectionBlock>

        <SectionBlock title="Key Projects" className="w-full @container">
          {/* <p className="my-3 prose-md prose-slate w-full  overflow-hidden ">
            The following are the highest priority projects and activities for
            the Liberia team.
          </p> */}
          <KeyCountryProjects
            className="@2xl:grid-cols-2 @6xl:grid-cols-3 @2xl:gap-14 @6xl:gap-12 4xl:gap-8  p-2"
            introText="The following are the highest priority projects and activities for
              the Liberia team."
            data={KeyProjectsData as IKeyCountyProjectData[]}
          />
        </SectionBlock>

        {/* <SectionBlock title="Another Section">
          <div className="border w-full h-[20rem] rounded-md  bg-green-200"></div>
        </SectionBlock> */}
      </div>
    </>
  );
};

export default LiberiaPage;
