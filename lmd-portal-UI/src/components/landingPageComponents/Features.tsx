"use client";
import React from "react";
import Image from "next/image";
// icons
import RicherUserExperienceIcon from "../../../public/assets/icons/feature_user.svg";
import MobileFriendlyIcon from "../../../public/assets/icons/feature_mobile.svg";
import ThirdPartyInegrationIcon from "../../../public/assets/icons/feature_3rdp.svg";
import HiglhInteractiveReportingIcon from "../../../public/assets/icons/feature_highly_reporting.svg";

const SingleFeature = ({ text, Icon }: { text: string; Icon: any }) => {
  return (
    <div className="border-[1.3px] rounded-[10px] w-full h-full bg-background flex flex-col items-center p-3 2xl:p-4 gap-4 hover:border-primary shadow-md hover:shadow-lg">
      {Icon}
      <p className="text-pink text-center leading-[1.3rem] th-font-heavy text-sm">
        {text}
      </p>
    </div>
  );
};

const Features = () => {
  return (
    <div className=" py-20 h-full">
      <div className="web-page-constraints flex flex-col lg:flex-row justify-between h-full gap-4 lg:gap-0">
        <div className=" w-full lg:w-5/12 flex flex-col gap-4 h-full ">
          <h1 className="header-text-1 text-pink text-center lg:text-left lg:max-w-[220px]">
            Next Gen Data Portal
          </h1>
          <p className="paragraph-text-1 text-center lg:text-left">
            A cloud-based next generation data management platform and portal
            with analytical capabilities for more precise data-driven decisions
          </p>

          {/* <ResponsiveHelper /> */}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-6">
            <SingleFeature
              text="Richer User Experience"
              Icon={<RicherUserExperienceIcon />}
            />
            <SingleFeature
              text="Mobile Friendly"
              Icon={<MobileFriendlyIcon />}
            />
            <SingleFeature
              text="Third-Party Integrations"
              Icon={<ThirdPartyInegrationIcon />}
            />
            <SingleFeature
              text="Highly Interactive Reporting"
              Icon={<HiglhInteractiveReportingIcon />}
            />
          </div>
        </div>
        <div className="w-full  relative pt-10 lg:pt-24 2xl:pt-20 lg:-mr-[2rem]">
          <Image
            alt="web dashboard mockup"
            src="/assets/img/mock-dashboard.png"
            width={1216}
            height={697}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
