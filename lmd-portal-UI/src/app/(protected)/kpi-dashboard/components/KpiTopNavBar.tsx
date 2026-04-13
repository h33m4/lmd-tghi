import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { ReactNode } from "react";

type Props = {
  dashboardName: string;
  children?: ReactNode;
};

const KpiTopNavBar = ({ dashboardName, children }: Props) => {
  return (
    <div className="h-[30px] border-b border-border mb-1.5 flex justify-between items-center  -mt-1 2xl:-mt-0">
      <div className="">
        <Button
          variant={"link"}
          className="text-lmh-dark-blue-foreground th-font-heavy text-md -mx-4 -my-2"
        >
          <Link href={"/kpi-dashboard"} className="">
            KPI Dashboard
          </Link>
        </Button>
        <span className="pr-1">/</span>
        {dashboardName}
      </div>
      <div className="items-end flex justify-end">{children}</div>
    </div>
  );
};

export default KpiTopNavBar;
