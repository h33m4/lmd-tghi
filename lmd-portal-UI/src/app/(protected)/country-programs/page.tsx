import { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Footer from "@/components/footer/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LMD 2.0 - Country Programs",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const CountryCard = ({
  title,
  imgURL,
  href,
  description = "A short summary of the country program here; Or any related and important information you want users to see. Remember it must be very short",
}: {
  title: string;
  description?: string;
  href: string;
  imgURL: string;
}) => {
  return (
    <Link
      href={href}
      className="group hover:cursor-pointer h-[18rem] w-full max-w-[23rem] border border-primary rounded-[10px] bg-lmh-dark-blue py-[10px] relative"
    >
      <div className="h-full w-full relative  transition ease-in-out delay-300 duration-300 group-hover:hidden  ">
        <Image
          src={imgURL}
          alt={""}
          fill
          blurDataURL={imgURL}
          placeholder={"blur"}
        />
      </div>

      <div className="h-full w-full absolute inset-0">
        <div className="countrycard-box h-full w-full flex items-end justify-center">
          <span className="text text-white text-center w-full text-2xl th-font-heavy mb-5 group-hover:text-3xl ">
            {title}
            <p className="text-sm th-font-book text-th-text-disabled  w-full hidden group-hover:block   px-3 py-2 text-center">
              {description}
            </p>
          </span>
        </div>
      </div>
    </Link>
  );
};

const CountryProgramsPage = () => {
  return (
    <>
      <div className="  w-full web-page-constraints pt-20 pb-32">
        <div className=" w-full flex flex-col items-center justify-center">
          <h1 className="max-w-[33rem] text-3xl text-center text-lmh-dark-blue dark:text-white th-font-medium">
            {/* Select a Program Country below to view Country Specific Dashboards */}
            Select a Program Country below to view Country-Specific Results and
            Dashboards
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-y-20 gap-x-[3rem] lg:gap-x-[5rem] xl:gap-[7rem] 2xl:gap-[8rem] mt-20 w-full">
          <CountryCard
            title="Ethiopia"
            href="/country-programs/ethiopia"
            imgURL={"/assets/img/country/ethiopia.jpeg"}
            description="LMH has
worked in Ethiopia since 2020. Our work in Ethiopia is focused on building community
health workers’ skills. Together with the MOH, we’re
transforming the way that tens of thousands of community health
workers are trained."
          />

          <CountryCard
            title="Liberia"
            href="/country-programs/liberia"
            imgURL={"/assets/img/country/liberia2.jpeg"}
            description="LMH has worked in Liberia since 2007. To close the health equity gap at Liberia’s last mile, we
worked with the Ministry of Health to develop a national community
health worker program that brings care directly to patients’ doorsteps."
          />
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-y-20 gap-x-[3rem] lg:gap-x-[5rem] xl:gap-[7rem] 2xl:gap-[8rem] mt-20 w-full">
          <CountryCard
            title="Malawi"
            href="/country-programs/malawi"
            imgURL={"/assets/img/country/malawi2.jpg"}
            description="LMH has
worked in Malawi since 2019. We’re working alongside the MOH to build
a new digital health information system, improve training and
supervision for community health workers, and strengthen
community health financing through planning and advocacy."
          />
          <CountryCard
            title="Sierra Leone"
            href="/country-programs/sierra_leone"
            imgURL={"/assets/img/country/sierra-leone.jpeg"}
            description="LMH has
worked in Sierra Leone since 2021. We are accompanying the government of Sierra Leone to
improve the quality of their community health worker program and
establish systems for evidence-based program management."
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CountryProgramsPage;
` `;
