"use client";
import React from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import Link from "next/link";
import { Button } from "../ui/button";

const CTASection = () => {
  return (
    <div className="h-[350px] 2xl:h-[380px] bg-background border-red-600 bg-[url('/assets/img/bg-pattern-1.svg')] bg-[center_top_10rem] bg-cover bg-no-repeat  md:bg-[url('/assets/img/bg-african-map.png')] md:bg-no-repeat md:bg-right-bottom  md:bg-contain ">
      <div className="web-page-constraints flex flex-col h-full justify-center items-center gap-3 sm:gap-4">
        <h1 className="header-text-1 text-pink text-center max-w-[250px] sm:max-w-fit">
          Start using LMD 2.0 now
        </h1>
        <p className="paragraph-text-1 max-w-[310px] sm:max-w-xl text-center">
          Your information is secure and encrypted, click the button below to
          log-in and start using LMD 2.0 now.
        </p>

        <div className="mt-8 sm:mt-10">
          <Button variant={"dark-blue"} size={"lg"}>
            <Link href="/auth/sign-in">Log in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
