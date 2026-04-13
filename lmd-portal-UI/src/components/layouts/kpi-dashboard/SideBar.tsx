"use client";
import React from "react";

import { usePathname } from "next/navigation";
import {
  KpiDashboardNavigationData,
  KpiDashboardAdminNavigationData,
} from "./navigationData";
import { useMediaQuery } from "react-responsive";
import { cn } from "@/lib/utils";
import { Tooltip } from "antd";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { isUserAllowed } from "@/utils/isUserAllowed";
import NavBadge from "@/components/shared/NavBadge";

const KpiDashboardSidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const session = useSession();
  const user = session.data?.user;
  const pathname = usePathname();
  let path = pathname.split("/kpi-dashboard")[1] || "/";

  // const [minimizeSidebar, setMinimizeSidebar] = useState(false);
  const minimizeSidebar = isCollapsed;
  const isMobile = useMediaQuery({ maxWidth: 991 });

  // useEffect(() => {
  //   setMinimizeSidebar(isMobile);
  // }, [isMobile]);
  // // console.log(pathname);

  // console.log("minimizeSidebar", minimizeSidebar);
  // console.log("isCollapsed", isCollapsed);

  return (
    <aside
      className={cn(
        "border-r-[0.5px] bg-cyan-700 dark:bg-background border-grey-default shadow-md    flex justify-between overflow-y-auto    flex-col gap-1.5  h-[calc(100vh-80px)] 2xl:h-[calc(100vh-88px)] w-full",
        // minimizeSidebar ? "w-7vw" : "w-[18vw] 2xl:w-[17vw]",
        minimizeSidebar ? "p-[2px]" : "p-[8px]"
      )}
    >
      {/* old code  */}
      {/*    " flex-1 mt-1 px-0.5 overflow-auto", */}
      {/* minimizeSidebar ? "space-y-2" : "space-y-2" */}
      <nav
        className={cn(
          " flex-1 mt-1 px-0.5 overflow-auto  mr-[-4px] pr-2",
          minimizeSidebar ? "space-y-2 mr-[0.01px] pr-1" : "space-y-2"
        )}
        aria-label="Sidebar"
      >
        {KpiDashboardNavigationData.map((item) => (
          <Link
            key={item.name}
            href={`/kpi-dashboard${item.href}`}
            className={cn(
              item.href === path
                ? "bg-lmh-dark-blue text-white th-th-font-medium"
                : "text-cyan-100 dark:text-white  hover:bg-cyan-600 hover:text-white",
              "group w-full flex  py-1.5 text-sm th-font-roman rounded-md ",
              minimizeSidebar
                ? " items-center pl-2 justify-center "
                : " items-center pl-2 ",
              ""
            )}
          >
            <Tooltip
              title={item.name}
              placement="right"
              className={cn("flex w-full", " items-center")}
            >
              <item.icon
                className={cn(
                  item.href === path
                    ? "text-white"
                    : "text-cyan-200 dark:text-white ",
                  "mr-3 flex-shrink-0 ",
                  minimizeSidebar ? "h-[25px] w-[25px]" : "h-5 w-5"
                )}
                aria-hidden="true"
              />
              {!minimizeSidebar && (
                <span className="flex items-center gap-1.5 flex-1">
                  {item.name}
                  <NavBadge route={`/kpi-dashboard${item.href}`} />
                </span>
              )}
            </Tooltip>
          </Link>
        ))}
      </nav>

      {isUserAllowed(session.data!, ["super_administrator"]) && (
        <nav
          className={cn(
            " mt-1 px-0.5 overflow-auto",
            minimizeSidebar ? "space-y-2" : "space-y-2"
          )}
          aria-label="Sidebar"
        >
          <div className="w-full  -mb-2">
            <span className="text-sm text-cyan-50 th-font-medium">Admin</span>
          </div>
          {KpiDashboardAdminNavigationData.map((item) => (
            <Link
              key={item.name}
              href={`/kpi-dashboard${item.href}`}
              className={cn(
                item.href === path
                  ? "bg-lmh-dark-blue text-white th-th-font-medium"
                  : "text-cyan-100 dark:text-white  hover:bg-cyan-600 hover:text-white",
                "group w-full flex  py-1.5 text-sm th-font-roman rounded-md ",
                minimizeSidebar
                  ? " items-center pl-2 justify-center "
                  : " items-center pl-2 ",
                ""
              )}
            >
              <Tooltip
                title={item.name}
                placement="right"
                className={cn("flex w-full", " items-center")}
              >
                <item.icon
                  className={cn(
                    item.href === path
                      ? "text-white"
                      : "text-cyan-200 dark:text-white ",
                    "mr-3 flex-shrink-0 ",
                    minimizeSidebar ? "h-[25px] w-[25px]" : "h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                {!minimizeSidebar && (
                <span className="flex items-center gap-1.5 flex-1">
                  {item.name}
                  <NavBadge route={`/kpi-dashboard${item.href}`} />
                </span>
              )}
              </Tooltip>
            </Link>
          ))}

          <div className="h-[1vh] 2xl:h-[5vh]"></div>
        </nav>
      )}

      {/* <button
        className="border text-white"
        onClick={() => setMinimizeSidebar((prev) => !prev)}
      >
        here
      </button> */}
      {/* {minimizeSidebar ? (
        <div className="h-[3rem] flex items-center justify-center">
          <Tooltip title="Support" placement="right">
            <button className=" rounded-full p-1 bg-lmh-pink animate-blink">
              <BulbSolidIcon className="h-7 w-7  rounded-full p-1 bg-lmh-pink/50 text-white" />
            </button>
          </Tooltip>
        </div>
      ) : (
        <div className="ring-1 ring-ring rounded-lg h-[6rem] 2xl:h-[8rem] w-full relative p-2 mt-6 flex flex-col justify-between z-10 bg-gray-500/50">
          <div className="absolute inset-0  -top-6 flex flex-col items-center -z-10">
            <div className=" rounded-full p-1 bg-lmh-pink animate-blink">
              <BulbSolidIcon className="h-9 w-9  rounded-full p-1 bg-lmh-pink/50 text-white" />
            </div>
          </div>
          <span className="text-sm mt-2 2xl:mt-4 text-center  ">
            Got any data quality concerns?
          </span>
          <div className="flex items-center justify-center">
            <Button
              size={"sm"}
              className="h-6 2xl:h-8 px-5 flex items-center justify-center"
            >
              Open Support
            </Button>
          </div>
        </div>
      )} */}
    </aside>
  );
};

export default KpiDashboardSidebar;
