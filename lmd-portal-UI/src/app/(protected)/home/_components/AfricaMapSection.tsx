import React from "react";
import AfricanMap from "@public/assets/img/african-map.svg";
import AfricanMap2 from "./svg-african-map2.svg";
import AfricanMapRaw from "raw-loader!./svg-african-map2.raw.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TestAfricaMap from "./testMap";
import { TourWrapper } from "@/context/tourContext";

export default function AfricaMapSection() {
  return (
    <section className="mb-6">
      <div className=" web-page-constraints flex flex-col lg:flex-row items-center justify-between lg:gap-10 ">
        <div className="flex flex-col gap-8 w-full h-full lg:w-[50vw]  lg:-mr-[15vw] text-center lg:text-left justify-center lg:justify-start items-center lg:items-start pb-5 lg:pb-0">
          <h1 className="header-text-1 text-lmh-pink ">Creating Impact</h1>

          <span className="paragraph-text-1 dark:text-foreground">
            We use data to inform and strengthen our work. Our partnerships with
            governments and local implementers expand access to and enhance the
            quality of health services in rural and remote communities
          </span>

          <div>
            <Button variant={"dark-blue"}>
              <Link href="/country-programs">View Country Programs </Link>
            </Button>
          </div>
        </div>
        <div className="w-full mb-0  border-red-600 ">
          {/* <AfricanMap2
            className=" border"
            id="mapsection"
            viewBox="0 0 900 1001"
            width="950px"
            height="901px"
          /> */}
          {/* <AfricanMap
            width="793"
            height="718"
            viewBox="0 0 793 818"
            id="mapsection"
          /> */}

          <TourWrapper tourRef="tour_african_map" className="w-full">
            <TestAfricaMap />
          </TourWrapper>
        </div>
      </div>
    </section>
  );
}
