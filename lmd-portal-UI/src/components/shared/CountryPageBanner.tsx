import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { cn } from "@/lib/utils";

type Props = {
  countryName: "Liberia" | "Sierra Leone" | "Malawi" | "Ethiopia";
  bgImgClass?: string;
  bannerOverlayClass?: string;
  bannerImg?: {
    URL: string;
    className?: string;
    height?: number;
    width?: number;
  };
};

const CountryPageBanner = ({
  bgImgClass,
  countryName,
  bannerOverlayClass,
  bannerImg,
}: Props) => {
  return (
    <div
      className={clsx(
        // bgImgClass,
        "h-[30vw] -ml-2  bg-no-repeat bg-cover relative  border-none border-primary dark:border-border"
      )}
    >
      {/* <div
        className={clsx(
          bannerOverlayClass!,
          "h-full w-full absolute opacity-0 inset-0 bg-gradient-to-r from-lmh-dark-grey/90 to-primary/40 opacity-50 rounded-lg"
        )}
        aria-hidden
      ></div> */}
      <div className="border w-full h-full border-border absolute">
        <Image
          loading={"eager"}
          src={bannerImg?.URL!}
          // width={bannerImg?.width}
          // height={bannerImg?.height}
          alt={`${countryName}-image`}
          className={cn(
            "border-red-500 object-cover object-[center_center]",
            bannerImg?.className!
          )}
          fill
        />
      </div>
      <div className=" h-full inset-0 p-2 flex flex-col justify-center items-center absolute z-10 w-full ">
        <div className="text-white  p-8  backdrop-blur-sfm bg-lmh-dark-grey/20 text-center ">
          <h1 className="text-2xl th-font-medium">Welcome to</h1>
          <h1 className="text-3xl th-font-heavy">
            {countryName} Country Program
          </h1>
        </div>
      </div>

      <div className="absolute w-full  bottom-0 flex justify-end p-1.5">
        <Image
          src={`/assets/img/country/${countryName
            .toLowerCase()
            .replace(/\s+/g, "-")}-flag.png`}
          width={65}
          height={40}
          alt="liberia flag"
          className="bg-background rounded-[2px] border border-white"
        />
      </div>
    </div>
  );
};

export default CountryPageBanner;
