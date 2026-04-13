import React from "react";
import Image from "next/image";
import KpiTopNavBar from "../components/KpiTopNavBar";
import SupportButton from "../components/SupportButton";

const KPIProgressPage = () => {
  return (
    <>
      <KpiTopNavBar dashboardName="KPI Progress Summary" />
      <div className=" border border-primary dark:border-border rounded-lg h-full bg-background/50 overflow-y-scroll py-5 px-4 flex flex-col gap-10">
        <div className="px-4  h-[4rem] ">
          <h1 className="text-2xl tracking-normal th-font-heavy  text-lmh-pink mb-2 text-left">
            Last Mile Health&apos;s Key Performance Indicators & Targets for the
            Closing the Distance Strategy (FY24-28)
          </h1>
        </div>

        <Image
          src="/assets/img/kpi-dashboard/progress-summary.png"
          width={1741}
          height={2302}
          alt={""}
          className="px-2  xl:px-0 "
          placeholder={"blur"}
          blurDataURL="/assets/img/kpi-dashboard/progress-summary.png"
          unoptimized
          quality={90}
        />
      </div>

      <SupportButton />
    </>
  );
};

export default KPIProgressPage;
