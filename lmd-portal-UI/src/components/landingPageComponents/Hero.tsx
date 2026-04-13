/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import Image from "next/image";
import Link from "next/link";

import DataAnimateIcon from "../../../public/assets/icons/data-animate.svg";
import RightNavIcon from "../../../public/assets/icons/navigation/right.svg";
import LeftNavIcon from "../../../public/assets/icons/navigation/left.svg";

const Hero = () => {
  return (
    // h-[90vh]  2xl:h-[60vh]
    <div className="h-[90vh]  2xl:h-[65vh] bg-gradient-to-b md:bg-gradient-to-r from-[#193946] to-[#285162] relative">
      <div className="absolute w-full h-full z-10">
        <div className="web-page-constraints flex flex-col  md:flex-row h-full py-6 lg:px-28 gap-2 md:gap-0">
          <div className=" w-full md:pb-20 text-white  flex flex-col justify-center items-start gap-5 lg:pl-10   mt-10 md:mt-0 ">
            <div className=" w-full text-center md:text-left ">
              {/* <ResponsiveHelper /> */}
              <h1 className="text-2xl th-font-light">Welcome to the new</h1>
              <h2 className="th-font-black text-4xl lg:text-5xl tracking-wide md:tracking-wider animate-charcter">
                LMD 2.0 Portal
              </h2>
            </div>

            <div className="flex flex-col items-center md:items-start  w-full">
              <p className="th-font-book max-w-sm text-xl text-center md:text-left w-full ">
                The programmatic database platform for Last Mile Heath.
              </p>
            </div>

            <div className="hidden md:block mt-6">
              <Link href={"/auth/sign-in"}>
                <PrimaryButton
                  onClicked={() => {}}
                  title="Get Started"
                  variant={"white"}
                />
              </Link>
            </div>
          </div>
          <div
            className="h-full w-full relative flex justify-center sm:order-last  items-center md:p-3
           "
          >
            <img
              src="/assets/icons/data-animate.svg"
              alt="landing page hero graphics"
            />
          </div>

          <div className="flex justify-center md:hidden w-full order-last ">
            <Link href={"/auth/sign-in"}>
              <PrimaryButton
                onClicked={() => {}}
                title="Get Started"
                variant={"white"}
                isWide={true}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute h-[35%] w-full bottom-0 bg-[url('/assets/img/bg-artwork-1.png')] bg-no-repeat bg-left-bottom  bg-contain"></div>
      <div className=" absolute w-full h-full flex flex-col items-center justify-center">
        <div className="web-page-constraints flex justify-between">
          <button
            className="z-20 bg-transparent"
            onClick={() => {
              console.info("clicked left");
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
              console.info("clicked right");
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
    </div>
  );
};

export default Hero;
