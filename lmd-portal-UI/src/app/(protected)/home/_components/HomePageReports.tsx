"use client";
import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/emblaCarousel";
import Link from "next/link";
import Image from "next/image";

import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { Tour } from "antd";
import { TourWrapper } from "@/context/tourContext";

const reports = [
  {
    title: "Liberia Data Review Reports",
    country: "Liberia",
    category: "Data Review",
    url: "country-programs/liberia/reports/data-reviews",
    FY: "2024",
    tags: ["Q1", "Q2"],
  },
  // {
  //   title: "Liberia eCBIS Reports",
  //   country: "Liberia",
  //   category: "eCBIS",
  //   url: "country-programs/liberia/reports/data-reviews",
  //   FY: "2024",
  //   tags: ["Q1", "Q2"],
  // },
  {
    title: "Malawi Data Review Reports",
    country: "Malawi",
    category: "Data Review",
    url: "country-programs/malawi/reports/data-reviews",
    FY: "2024",
    tags: ["Q1", "Q2"],
  },
  {
    title: "Ethiopia Data Review Reports",
    country: "Ethiopia",
    category: "Data Review",
    url: "country-programs/ethiopia/reports/data-reviews",
    FY: "2024",
    tags: ["Q1", "Q2"],
  },
  {
    title: "Sierra Leone Data Review Reports",
    country: "Sierra Leone",
    category: "Data Review",
    url: "country-programs/sierra_leone/reports/data-reviews",
    FY: "2024",
    tags: ["Q1", "Q2"],
  },
];

export default function HomePageReports() {
  return (
    <section className="py-[6rem] flex flex-col gap-10  bg-[#ffffff] dark:bg-[#24262b]">
      <div className="web-page-constraintsl ">
        <div className="flex items-center justify-center">
          <TourWrapper tourRef="tour_latest_reports" className="">
            <h1 className="header-text-1 text-lmh-pink text-center">
              Latest Reports
            </h1>
          </TourWrapper>
        </div>

        <p className="th-font-bookOblique text-center">
          Latest Reports from our Program Countries
        </p>
      </div>

      {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[30px] container">
        <ReportCard2 /> <ReportCard2 /> <ReportCard2 /> <ReportCard2 />
      </div> */}

      <div className="w-full  flex flex-col justify-center items-center">
        <Carousel
          className="w-full max-w-screen  border-green-700"
          opts={{
            align: "start",
            loop: false,
          }}
          // plugins={[
          //   Autoplay({
          //     delay: 3000,
          //     stopOnInteraction: true,
          //   }),
          // ]}
        >
          <div className="w-full  border-yellow-400 @container/outer">
            <CarouselContent className=" ml-[5rem] mr-[7rem] @container">
              {reports.map((report, index) => (
                // spacing with the pl-[] and -ml-[] above
                <CarouselItem
                  // md:basis-1/2 lg:basis-1/3
                  key={index}
                  className="pl-[0.5rem] @xl:basis-1/2 @2xl:basis-1/3 @2xl:pl-[1.5rem] @6xl:basis-1/3 @7xl:basis-1/4 @7xl:pl-[1.6rem]  py-2"
                >
                  <ReportCard {...report} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
          <div className="web-page-constraints mt-4 flex  justify-end items-end">
            <div className=" space-x-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
}

interface ReportCardProps {
  title: string;
  country: string;
  category: string;
  url: string;
  tags: string[];
}
function ReportCard({ title, category, url, tags, country }: ReportCardProps) {
  return (
    <div
      className={cn(
        "group hover:bg-background  rounded-sm hover-up  relative  w-full  flex-col justify-start items-start gap-5 block hover-up border-2 border-neutral-300 dark:border-neutral-dark-300 overflow-hidden"
      )}
    >
      <div className="h-[9.5rem] xl:h-[14vw] 2xl:h-[13rem] w-full relative">
        <Image
          alt=""
          src="/assets/img/country/reports-mock-bg.png"
          className=" w-full rounded-sm object-cover absolute"
          placeholder={"blur"}
          blurDataURL="/assets/img/country/reports-mock-bg.png"
          fill
        />
        <div className="absolute text-white  px-6 flex flex-col items-center justify-center  h-full">
          <div className="">
            <h1 className="text-lg">{country} Program</h1>
            <div className="flex">
              <hr className="border-[0.1px] border-gray-500  my-1 w-1/3" />
            </div>
            <span className="text-md th-font-book text-primary">
              {category} Reports
            </span>
          </div>
        </div>
        {/* <div className="absolute bottom-1 right-1">access type</div> */}
      </div>

      <div className="flex-col justify-start items-start gap-3.5 flex pt-4 px-3 pb-4">
        <div className="justify-between items-center gap-5 inline-flex  w-full">
          <Link
            href={url}
            className={cn(
              "px-3 py-[8px]  dark:bg-neutral-dark-200 rounded-3xl  justify-center items-center gap-2.5 flex",
              category === "Data Reviewlll"
                ? "bg-lmh-pink/90 text-white  dark:text-neutral-100"
                : "bg-neutral-200 text-neutral-900 dark:text-neutral-dark-950"
            )}
          >
            <div className={cn(" text-xs font-medium leading-none")}>
              {category}
            </div>
          </Link>
          <div className="justify-start items-center gap-2 flex">
            <div className="text-neutral-700 text-sm font-medium leading-none dark:text-neutral-dark-700">
              {/* June 8, 2024 */}
            </div>
          </div>
        </div>
        <h3>
          <Link
            className="text-neutral-950 dark:text-white/70 text-base font-bold leading-snug item-link"
            href={url}
          >
            {country} Program {category} Reports
          </Link>
        </h3>
      </div>
    </div>
  );
}
