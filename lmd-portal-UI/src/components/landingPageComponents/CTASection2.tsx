import Link from "next/link";
import React from "react";

export default function CTASection2() {
  return (
    <div className=" py-[8rem] bg-background">
      <div className="w-full  web-page-constraints  flex-col justify-center items-center gap-20 ">
        <div className="py-12 2xl:py-20 bg-gradient-to-r from-blue-600 to-lmh-green rounded-[32px] flex-col justify-center items-center gap-2 flex ">
          <div className="  flex flex-col items-center justify-center gap-4">
            <div className="  text-center text-white text-2xl lg:text-4xl font-bold  lg:leading-[45px]  max-w-2xl 2xl:max-w-3xl">
              Accelerating analytics and data-driven decision making in LMH
            </div>
            <div className=" paragraph-text-1 max-w-[310px] sm:max-w-2xl 2xl:max-w-3xl text-center  text-muted leading-[27px] ">
              Your information is secure and encrypted, click the button below
              to log-in and start using LMD 2.0 now.
            </div>

            <div className="flex flex-col justify-center items-center mt-6">
              <Link
                href={"/auth/sign-in"}
                className="text-white text-base font-normal  leading-normal px-6 py-3 bg-lmh-pink rounded-[32px] justify-center items-center gap-2 flex hover:bg-gradient-to-r hover:from-blue-600 hover:to-lmh-pink"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
