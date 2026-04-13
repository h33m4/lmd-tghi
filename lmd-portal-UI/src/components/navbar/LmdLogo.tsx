import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface Props {
  href?: string;
}

export default function LmdLogo({ href }: Props) {
  //   const { theme } = useTheme();

  return (
    <div className="flex items-center gap-0 ">
      <Link href={href || "/home"}>
        <Image
          width="88"
          height="20"
          src="/assets/brand/lmh-main.svg"
          alt="brand"
          priority
          className="p-[15px] dark:hidden"
        />{" "}
        <Image
          width="88"
          height="20"
          src="/assets/brand/lmh-dark.svg"
          alt="brand"
          priority
          className="p-[15px] hidden dark:block"
        />
        {/* <LmhMainIcon width="59" height="29" viewBox="0 0 59 29" /> */}
      </Link>
      <hr className=" border-[1px] h-7  -ml-0 mr-3" />
      <div className="flex flex-col  items-start justify-center">
        <h1 className="text-lmh-dark-blue dark:text-foreground th-font-heavy text-[15px] 2xl:text-lg ">
          Last Mile Data{" "}
          <span className="text-pretty th-font-medium text-[15px] tracking-tight ">
            (LMD 2.0)
          </span>
        </h1>
        <p className="text-primary th-font-medium -mt-1.5 2xl:-mt-2.5 text-[13px] tracking-wide 2xl:text-base">
          We dig data
        </p>
      </div>
    </div>
  );
}
