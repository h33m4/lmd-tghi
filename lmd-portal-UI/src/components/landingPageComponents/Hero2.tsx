import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Hero2() {
  return (
    <section className="relative flex min-h-[600px] w-full items-center justify-start bg-gradient-to-b from-[#043873] to-[#285162] py-12 md:min-h-[600px] md:bg-gradient-to-l lg:min-h-[700px] 2xl:min-h-[800px]">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 bg-[url('/assets/img/bg-wave.svg')] bg-auto bg-center bg-no-repeat opacity-30"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="web-page-constraints z-10 flex w-full flex-col items-center justify-between gap-8 px-4 md:flex-row md:gap-12 lg:px-28">
        {/* Text Content */}
        <div className="flex w-full max-w-xl flex-col items-center gap-6 text-white md:items-start">
          {/* Headings */}
          <div className="w-full text-center md:text-left">
            <h1 className="th-font-light text-2xl md:text-3xl 2xl:text-4xl">
              Welcome to the new
            </h1>
            <h2 className="th-font-black animate-charcter text-4xl tracking-wide md:text-5xl md:tracking-wider lg:text-5xl 2xl:text-6xl">
              LMD 2.0 Portal
            </h2>
          </div>

          {/* Description */}
          <p className="th-font-book w-full max-w-sm text-center text-xl md:text-left">
            The programmatic data management & reporting platform for Last Mile
            Health.
          </p>

          {/* CTA Button */}
          <Link href="/auth/sign-in">
            <Button size="lg" className="mt-2 px-8 py-3 md:mt-4">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="w-full max-w-xl px-4 md:px-0">
          <Image
            src="/assets/icons/data-animate.svg"
            alt="Data visualization illustration"
            width={550}
            height={550}
            priority
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
