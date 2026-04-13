"use client";
import { Carousel } from "antd";
import React, { Suspense, useRef } from "react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { CarouselRef } from "antd/es/carousel";
import { ReloadIcon } from "@radix-ui/react-icons";

// icons
import RightNavIcon from "../../../../../public/assets/icons/navigation/right.svg";
import LeftNavIcon from "../../../../../public/assets/icons/navigation/left.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ISingleProps {
  bgClass: string;
  title: string;
  summary: string;
  href: string;
  actionButtonText?: string;
}

const SingleSlide = ({
  title,
  summary,
  bgClass,
  actionButtonText = "Read More",
  href,
}: ISingleProps) => {
  return (
    <div
      className={`h-[80vh] 2xl:h-[600px] ${bgClass}  bg-cover md:bg-[center_top_0rem] bg-center  bg-no-repeat `}
    >
      <div className="w-full h-full  backdrop-opacity-0   bg-[#888787]/5 web-page-constraints flex flex-col items-center md:items-start justify-center">
        <div className=" w-full md:w-[45%] bg-white p-5 h-fit flex flex-col gap-4 md:ml-[5rem] backdrop-filter backdrop-blur-md bg-opacity-90 rounded-[10px]">
          <h1 className="text-lmh-pink th-font-heavy text-2xl ">{title}</h1>
          <p className="paragraph-text-1">{summary}</p>

          <div className="flex justify-center md:justify-start">
            <Button variant={"dark-blue"} className="hover:text-white">
              <Link href={href} className="hover:text-white ">
                {actionButtonText}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroCarousel = () => {
  const sliderRef = useRef<CarouselRef>(null);
  return (
    <section className="relative">
      <Carousel
        ref={sliderRef}
        arrows={false}
        autoplay
        autoplaySpeed={20000}
        className=" bg-grey-default  "
        rootClassName="container mx-auto max-w-screen-2xl px-0  overflow-hidden "
      >
        <SingleSlide
          title="Last Mile Data Portal 2.0"
          summary={`As Last Mile Health (LMH) mission evolves and expands into more
            countries in Africa, data storage, collection, and reporting needs
            have been evolving and expanding as well.  To accommodate this
            evolution and expansion, the GMERL data systems team has developed a
            next generation data management platform and portal.`}
          bgClass={" bg-[url('/assets/img/bg-landing-hero-2.png')] "}
          href={"/docs/about-lmd2"}
        />

        <SingleSlide
          title="Liberia eCBIS Pilot"
          summary={`The electronic Community-Based Information System (eCBIS) is a digital version 
            of the existing and standardized national community health information systemsIt 
            will harmonize data collection, workflow management, supervision, 
            and supply chain into a single platform for community health workers and their 
            supervisors to coordinate care, collect data, and make data-driven clinical 
            decisions.`}
          bgClass={" bg-[url('/assets/img/bg-landing-hero-1.png')] "}
          href={"/country-programs/liberia"}
          actionButtonText="Visit the Liberia Program"
        />
      </Carousel>
      <div className="absolute  bottom-1/2 place-self-center w-full h-fit  ">
        <div className="flex justify-between web-page-constraints">
          <button
            className="z-20 bg-transparent"
            onClick={() => {
              sliderRef.current?.prev();
            }}
          >
            <LeftNavIcon
              width="50"
              height="50"
              viewBox="0 0 65 65"
              className="carousel-nav"
            />
          </button>

          <button
            onClick={() => {
              sliderRef.current?.prev();
            }}
            className="z-20"
          >
            <RightNavIcon
              width="50"
              height="50"
              viewBox="0 0 65 65"
              className="carousel-nav"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
