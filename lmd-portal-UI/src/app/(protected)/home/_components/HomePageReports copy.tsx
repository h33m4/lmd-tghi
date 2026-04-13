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

const reports = [
  {
    title: "Liberia Data Review Reports",
    country: "Liberia",
    category: "Data Review",
    url: "country-programs/liberia/reports/data-reviews",
    FY: "2024",
    tags: ["Q1", "Q2"],
  },
  {
    title: "Liberia eCBIS Reports",
    country: "Liberia",
    category: "eCBIS",
    url: "country-programs/liberia/reports/data-reviews",
    FY: "2024",
    tags: ["Q1", "Q2"],
  },
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
    <section className="py-[6rem] flex flex-col gap-10 border bg-[#ffffff] dark:bg-[#24262b]">
      <div className="web-page-constraintsl ">
        <h1 className="header-text-1 text-lmh-pink text-center">
          Latest Reports
        </h1>
        <p className="th-font-bookOblique text-center">
          Latest Reports from our Program Countries
        </p>
      </div>

      <div className="w-full  flex flex-col justify-center items-center">
        <Carousel
          className="w-full max-w-screen  border-green-700"
          opts={{
            align: "start",
            loop: false,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: true,
            }),
          ]}
        >
          <div className="w-full  border-yellow-400 @container/outer">
            <CarouselContent className=" ml-[5rem] mr-[7rem] @container">
              {reports.map((report, index) => (
                // spacing with the pl-[] and -ml-[] above
                <CarouselItem
                  // md:basis-1/2 lg:basis-1/3
                  key={index}
                  className="pl-[0.5rem] @xl:basis-1/2 @2xl:basis-1/3 @2xl:pl-[1.5rem] @6xl:basis-1/3 @7xl:basis-1/4 @7xl:pl-[1.6rem]"
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
    <Link
      href={url}
      className={cn(
        "block group hover:bg-background hover:shadow-md hover:border-primary rounded-sm p-2 shadow-sm  relative border w-full"
      )}
    >
      <div className="h-[9.5rem] xl:h-[14vw] 2xl:h-[13rem] w-full relative">
        <Image
          alt=""
          src="/assets/img/country/liberia-mock-bg.png"
          className=" w-full rounded-md object-cover absolute"
          placeholder={"blur"}
          blurDataURL="/assets/img/country/data-review-mock.png"
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
        <div className="absolute bottom-1 right-1">access type</div>
      </div>

      <div className=" pt-2 px-[4px]">
        <dl>
          <div>
            <dt className="sr-only">tags</dt>

            <dd className="text-sm text-gray-500 flex justify-between ">
              {/* <p>{report.category}</p> */}
              {category}
            </dd>
          </div>

          <div>
            <dt className="sr-only">Title</dt>

            {/* <dd className="th-font-medium text-lmh-pink">{title}</dd> */}
            <dd className="th-font-medium text-sm text-lmh-pink opacity-0 group-hover:opacity-100 duration-300">
              Click to view all {country} Program {category} Reports
            </dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
