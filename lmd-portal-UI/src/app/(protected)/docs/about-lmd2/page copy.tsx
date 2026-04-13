import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// import Balancer from "react-wrap-balancer";

export default function AboutPage() {
  return (
    <article className=" w-full py-10">
      <section className="relative mb-2">
        <div className="pb-2">
          <div className="flex flex-col gap-1 items-start justify-start text-left">
            <h1 className="text-2xl lg:text-4xl font-bold text-lmh-dark-blue dark:text-neutral-dark-950 max-w-5xl leading-snug">
              Last Mile Data Portal 2.0
            </h1>
            <p className="text-base md:text-lg font-medium text-neutral-950 dark:text-neutral-dark-950 ">
              A programmatic data management & reporting platform for Last Mile
              Health.
            </p>
          </div>
        </div>
      </section>
      {/* Single Conttent */}
      <div className="single-content text-base font-medium text-neutral-950 dark:text-neutral-dark-950 leading-relaxed flex flex-col gap-10 ">
        <div className="h-[20vh]  md:h-[10rem] lg:h-[12rem]  xl:h-[22rem] w-full relative">
          <Image
            src="/assets/img/bg-landing-hero-2.png"
            className="rounded-3xl mb-8 absolute"
            alt=""
            fill
          />
        </div>

        <div className="space-y-5">
          <p className="mb-4">
            Half of the world’s population lacks access to essential primary
            healthcare, including treatment for diarrhea, malaria, family
            planning, and prenatal care. This gap is particularly acute in
            remote communities, where an estimated two billion people live
            outside the reach of any healthcare services. The healthcare
            workforce shortage, already estimated at nearly 18 million people,
            has been exacerbated by the COVID-19 pandemic.
          </p>
          <p>
            Last Mile Health (LMH) partners with countries to bring high-quality
            primary healthcare to millions of rural people through teams of
            community and frontline health workers. LMH’s work began in
            Liberia’s remote, last mile communities in 2007. To manage the data
            and reporting needs, Last Mile Data Portal (LMD 1.0) was developed
            to track LMH organizational and programmatic efforts over time and
            make data-driven decisions using key performance indicators (KPIs).
          </p>
          <p>
            LMD 1.0 was built on a set of technologies that work well in low
            bandwidth environments, which was a primary requirement at the time.
            However, these technologies require extensive programming for their
            functionality, which is costly in terms of development and support.
          </p>
          <p>
            Over the last several years, LMH has gone global, evolving from a
            small organization directly implementing a community health worker
            (CHW) program in a single health district in remote Liberia to a
            global organization supporting community health systems in a diverse
            set of places (i.e. Ethiopia, Malawi, Sierra Leone, Uganda, etc) and
            contexts. As the organization has evolved, so have its data sources
            and reporting needs. The costs associated with extending LMD 1.0 to
            accommodate these new needs is prohibitive. Also, scalability of the
            current system is s challenge, as the current data warehouse is
            hosted on a private VPS.
          </p>
          <p>
            As LMH’s work has grown beyond Liberia, the number of data sources
            and formats has increased making it difficult to accurately track
            progress of country programs and make better data-driven decisions
            from the collected data. To solve this challenge, LMH has embarked
            on a journey to build a cloud-based next generation data management
            platform and portal (Last Mile Data 2.0 - LMD 2.0) with analytic
            capabilities as a long -term solution to be able to extract
            actionable insights for more precise data-driven decisions.{" "}
          </p>
          <p>
            LMD 2.0 will deliver more functionality, a richer user experience,
            and a more extensible platform that allow developers and analysts to
            rapidly develop and deploy data collection, storage, and reporting
            systems. This work is critical to ensuring high data quality and
            access to data to support our routine monitoring, evaluation, and
            learning activities across our growing programing in multiple
            countries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8"></div>
      </div>
      {/* Single Conttent */}
      <div className="single-bottom mt-16 py-8 border-t border-neutral-300 dark:border-neutral-dark-300 text-lg font-bold text-neutral-950 dark:text-neutral-dark-950 leading-relaxed ">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h6 className="text-lg font-bold mb-4">Popular Tag</h6>
            <div className="flex flex-wrap gap-2">
              <Button className="hover-up px-5 py-2 rounded-full border border-neutral-300 dark:border-neutral-dark-300  text-base font-medium hover:bg-neutral-300  hover:dark:bg-neutral-dark-300 transition-all duration-300">
                LMD 2.0
              </Button>
            </div>
          </div>
          <div>
            <h6 className="text-lg font-bold mb-4">Share:</h6>
            <div className="flex gap-2">
              <div className="size-9 rounded-full flex justify-center items-center border border-neutral-300 dark:border-neutral-dark-300 cursor-pointer hover-up hover:bg-neutral-300 dark:hover:bg-neutral-dark-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={9}
                  height={16}
                  viewBox="0 0 9 16"
                  className="fill-neutral-950 dark:fill-neutral-dark-950"
                >
                  <path d="M8.03125 9H5.6875V16H2.5625V9H0V6.125H2.5625V3.90625C2.5625 1.40625 4.0625 0 6.34375 0C7.4375 0 8.59375 0.21875 8.59375 0.21875V2.6875H7.3125C6.0625 2.6875 5.6875 3.4375 5.6875 4.25V6.125H8.46875L8.03125 9Z" />
                </svg>
              </div>
              <div className="size-9 rounded-full flex justify-center items-center border border-neutral-300 dark:border-neutral-dark-300 cursor-pointer hover-up hover:bg-neutral-300 dark:hover:bg-neutral-dark-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={17}
                  height={16}
                  viewBox="0 0 17 16"
                  className="fill-neutral-950 dark:fill-neutral-dark-950"
                >
                  <g clipPath="url(#clip0_191_5465)">
                    <path d="M10.083 6.77491L15.9113 0H14.5302L9.46951 5.88256L5.42755 0H0.765625L6.87786 8.89547L0.765625 16H2.14682L7.49104 9.78782L11.7596 16H16.4216L10.0827 6.77491H10.083ZM8.1913 8.97384L7.57201 8.08805L2.64448 1.03974H4.76591L8.74248 6.72795L9.36178 7.61374L14.5308 15.0075H12.4094L8.1913 8.97418V8.97384Z" />
                  </g>
                </svg>
              </div>
              <div className="size-9 rounded-full flex justify-center items-center border border-neutral-300 dark:border-neutral-dark-300 cursor-pointer hover-up hover:bg-neutral-300 dark:hover:bg-neutral-dark-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={15}
                  height={14}
                  viewBox="0 0 15 14"
                  className="fill-neutral-950 dark:fill-neutral-dark-950"
                >
                  <path d="M7.60938 3.39062C9.57812 3.39062 11.2031 5.01562 11.2031 6.98438C11.2031 8.98438 9.57812 10.5781 7.60938 10.5781C5.60938 10.5781 4.01562 8.98438 4.01562 6.98438C4.01562 5.01562 5.60938 3.39062 7.60938 3.39062ZM7.60938 9.32812C8.89062 9.32812 9.92188 8.29688 9.92188 6.98438C9.92188 5.70312 8.89062 4.67188 7.60938 4.67188C6.29688 4.67188 5.26562 5.70312 5.26562 6.98438C5.26562 8.29688 6.32812 9.32812 7.60938 9.32812ZM12.1719 3.26562C12.1719 2.79688 11.7969 2.42188 11.3281 2.42188C10.8594 2.42188 10.4844 2.79688 10.4844 3.26562C10.4844 3.73438 10.8594 4.10938 11.3281 4.10938C11.7969 4.10938 12.1719 3.73438 12.1719 3.26562ZM14.5469 4.10938C14.6094 5.26562 14.6094 8.73438 14.5469 9.89062C14.4844 11.0156 14.2344 11.9844 13.4219 12.8281C12.6094 13.6406 11.6094 13.8906 10.4844 13.9531C9.32812 14.0156 5.85938 14.0156 4.70312 13.9531C3.57812 13.8906 2.60938 13.6406 1.76562 12.8281C0.953125 11.9844 0.703125 11.0156 0.640625 9.89062C0.578125 8.73438 0.578125 5.26562 0.640625 4.10938C0.703125 2.98438 0.953125 1.98438 1.76562 1.17188C2.60938 0.359375 3.57812 0.109375 4.70312 0.046875C5.85938 -0.015625 9.32812 -0.015625 10.4844 0.046875C11.6094 0.109375 12.6094 0.359375 13.4219 1.17188C14.2344 1.98438 14.4844 2.98438 14.5469 4.10938ZM13.0469 11.1094C13.4219 10.2031 13.3281 8.01562 13.3281 6.98438C13.3281 5.98438 13.4219 3.79688 13.0469 2.85938C12.7969 2.26562 12.3281 1.76562 11.7344 1.54688C10.7969 1.17188 8.60938 1.26562 7.60938 1.26562C6.57812 1.26562 4.39062 1.17188 3.48438 1.54688C2.85938 1.79688 2.39062 2.26562 2.14062 2.85938C1.76562 3.79688 1.85938 5.98438 1.85938 6.98438C1.85938 8.01562 1.76562 10.2031 2.14062 11.1094C2.39062 11.7344 2.85938 12.2031 3.48438 12.4531C4.39062 12.8281 6.57812 12.7344 7.60938 12.7344C8.60938 12.7344 10.7969 12.8281 11.7344 12.4531C12.3281 12.2031 12.8281 11.7344 13.0469 11.1094Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
