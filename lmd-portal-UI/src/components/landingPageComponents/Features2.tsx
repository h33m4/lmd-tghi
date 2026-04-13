import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const PaintbrushUnderline = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div className="relative inline-block w-fit">
      <span className={cn("relative z-10 ", className)}>{text}</span>
      <Image
        src="/assets/icons/brush.svg"
        alt="underline"
        className="absolute bottom-0 left-0 w-full h-2 z-0 mt-4 "
        fill
      />
    </div>
  );
};

export default function Features2() {
  return (
    <>
      <div className="py-20 ">
        <div className=" web-page-constraints flex flex-col lg:flex-row justify-between h-full gap-2 lg:gap-8 2xl:gap-10">
          <div className=" lg:pl-12 h-[300px] lg:h-[400px] w-full text-center lg:text-left   flex flex-col items-center lg:items-start gap-5 lg:gap-8 2xl:gap-10 justify-center">
            <div className="header-text-1  ">
              Introducing a Richer <br />
              <PaintbrushUnderline
                text="User Experience"
                className="header-text-1 "
              />
            </div>
            <div className="paragraph-text-1 text-center lg:text-left max-w-md lg:max-w-xl">
              LMD 2.0 offers a richer user experience with an intuitive and
              user-friendly interface. Enhanced navigation, responsive design,
              and visually appealing elements ensure that users can easily
              access and interact with the system&apos;s features
            </div>
          </div>
          <div className="  order-first lg:order-last lg:h-[400px]   w-full flex flex-col justify-center items-center">
            <Image
              src={"/assets/icons/data/report-2.svg"}
              alt={""}
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>

      <div className="py-20 bg-background">
        <div className=" web-page-constraints flex flex-col lg:flex-row justify-between h-full gap-2 lg:gap-8 2xl:gap-10">
          <div className="lg:pl-12 h-[300px] lg:h-[400px] w-full text-center lg:text-left   flex flex-col items-center lg:items-start gap-5 lg:gap-8 2xl:gap-10 justify-center">
            <div className="header-text-1  ">
              Highly Interactive <br />
              <PaintbrushUnderline
                text="Reporting & Analytics"
                className="header-text-1 "
              />
            </div>
            <div className="paragraph-text-1 text-center lg:text-left max-w-md lg:max-w-xl">
              LMD 2.0 features highly interactive reporting and analytics tools,
              allowing publishers to build and publish custom reports and
              visualizations in real-time. Advanced data filtering, drill-down
              capabilities, and dynamic dashboards provide deep insights and
              facilitate data-driven decision-making
            </div>
          </div>
          <div className="order-first lg:h-[400px]  w-full flex flex-col justify-center items-center">
            <Image
              src={"/assets/icons/data/report-3.svg"}
              alt={""}
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>

      <div className="py-20 ">
        <div className=" web-page-constraints flex flex-col lg:flex-row justify-between h-full gap-2 lg:gap-8 2xl:gap-10">
          <div className="lg:pl-12 h-[300px] lg:h-[400px] w-full text-center lg:text-left   flex flex-col items-center lg:items-start gap-5 lg:gap-8 2xl:gap-10 justify-center">
            <div className="header-text-1  ">
              Third-Party <br />
              <PaintbrushUnderline
                text="Integration Capabilities"
                className="header-text-1 "
              />
            </div>
            <div className="paragraph-text-1 text-center lg:text-left max-w-md lg:max-w-xl">
              LMD 2.0 supports robust third-party integration capabilities,
              including automated data collection from systems like DHIS2 and
              iCHIS. These integrations streamline workflows and ensure seamless
              data synchronization, enhancing the overall efficiency and
              accuracy of data management processes.
            </div>
          </div>
          <div className=" order-first lg:order-last lg:h-[400px]  w-full flex flex-col justify-center items-center">
            <Image
              src={"/assets/icons/feature-3rdp.png"}
              alt={""}
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>
    </>
  );
}
