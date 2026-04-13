import React from "react";
import KpiTopNavBar from "../components/KpiTopNavBar";
import SupportButton from "../components/SupportButton";
import FAQtable from "./faq-table";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("KPI Dashboard | FAQs"),
};

const KpiFaqDashboardPage = () => {
  return (
    <>
      <KpiTopNavBar dashboardName="Frequently Asked  Questions" />
      <section className="">
        <div className="container mx-auto">
          <div className="text-center my-[2.5vh]">
            <div className="mb-3 cursor-default">
              <h2 className="text-3xl font-bold relative inline-block z-20">
                Frequently Asked Questions <br /> (FAQs)
                <span className="absolute -top-5 -left-[17px] -start-3 -z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-triangle h-16 w-16 stroke-1 text-lmh-green/50 fill-lmh-green/50 rotate-45"
                  >
                    <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  </svg>
                </span>
              </h2>
            </div>
            {/* <p className="mb-2 -mt-2">for</p> */}
            {/* <h2 className="text-xl/snug font-bold text-gray-900  mx-auto">
                KPI Dashboard for Closing the Distance (FY24-28) Strategy
              </h2> */}
            <p className="th-font-lightOblique my-1">
              Please consider opening a support ticket for any additional
              questions that have not been answered below
            </p>
            <h2 className=" font-bold max-w-lg mx-auto text-base text-gray-500 mt-2">
              Last Updated: November 28, 2023
            </h2>
          </div>
        </div>
      </section>

      <FAQtable />

      <SupportButton />
    </>
  );
};

export default KpiFaqDashboardPage;
