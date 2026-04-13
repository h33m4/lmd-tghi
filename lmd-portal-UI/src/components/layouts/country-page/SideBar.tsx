// Updated SideBar component with permission-based admin tools
"use client";

import {
  ChevronRightIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";
import { concatClassNames } from "@/utils/helper_functions";
import { Disclosure, Transition } from "@headlessui/react";
import {
  MalawiNavigation,
  LiberiaNavigation,
  EthiopiaNavigation,
  SierraLeoneNavigation,
} from "./navigationData";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { Popover, Tooltip } from "antd";
import Link from "next/link";
import { ICountryNames, ISideBarNavigationData } from "@/types";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { DotFilledIcon, DotIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { isUserAllowed } from "@/utils/isUserAllowed";
import { cn } from "@/lib/utils";
import NavBadge from "@/components/shared/NavBadge";

const SideBar = ({
  isCollapsed,
  country,
}: {
  isCollapsed: boolean;
  country: ICountryNames;
}) => {
  const session = useSession();
  const pathname = usePathname();

  let path = pathname.split(`/${country.toLowerCase()}`)[1] || "/";
  const isMobile = useMediaQuery({ maxWidth: 991 });
  let NavigtionData: ISideBarNavigationData[] = [];

  const minimizeSidebar = isCollapsed;

  // Helper function to get country-specific admin role
  const getCountryAdminRole = (countryName: ICountryNames): string[] => {
    switch (countryName) {
      case "Malawi":
        return ["malawi_administrator", "malawi_publisher"];
      case "Liberia":
        return ["liberia_administrator", "liberia_publisher"];
      case "Ethiopia":
        return ["ethiopia_administrator", "ethiopia_publisher"];
      case "Sierra_Leone":
        return ["sierra_leone_administrator", "sierra_leone_publisher"];
      default:
        return [];
    }
  };

  // Check if user has admin access for this country
  const hasCountryAdminAccess = () => {
    const countryAdminRole = getCountryAdminRole(country);
    return isUserAllowed(session.data!, [
      "super_administrator",
      "global_publisher",
      ...countryAdminRole,
    ]);
  };

  switch (country) {
    case "Malawi":
      NavigtionData = MalawiNavigation;
      break;
    case "Liberia":
      NavigtionData = LiberiaNavigation;
      break;
    case "Ethiopia":
      NavigtionData = EthiopiaNavigation;
      break;
    case "Sierra_Leone":
      NavigtionData = SierraLeoneNavigation;
    default:
      break;
  }

  const basePath = `/country-programs/${country.toLowerCase()}`;

  return (
    <aside
      className={concatClassNames(
        "border-r-[0.5px] bg-cyan-700 dark:bg-background border-grey-default shadow-md   md:flex flex-grow overflow-y-auto   flex-col gap-1.5 h-[calc(100vh-80px)] 2xl:h-[calc(100vh-88px)] w-full",
        minimizeSidebar ? "p-[2px]" : "p-[8px]",
      )}
    >
      {NavigtionData ? (
        <>
          <nav
            className={concatClassNames(
              "flex-1 mt-1 px-0.5",
              minimizeSidebar ? "space-y-2" : "space-y-2",
            )}
            aria-label="Sidebar"
          >
            {NavigtionData.map((item, _x) => {
              const isDropdownOpen = pathname.includes(item.href);
              return !item.children ? (
                <Link
                  key={_x}
                  href={`${basePath}${item.href}`}
                  className={concatClassNames(
                    (
                      item.name === "Overview"
                        ? pathname === basePath ||
                          pathname.includes(`${basePath}/overview`)
                        : pathname.includes(`${basePath}${item.href}`)
                    )
                      ? "bg-lmh-dark-blue text-white th-th-font-medium"
                      : "text-cyan-100 dark:text-foreground hover:bg-cyan-600 hover:text-white",
                    "group w-full flex py-1.5 text-sm th-font-roman rounded-md",
                    minimizeSidebar
                      ? "items-center justify-center pl-2"
                      : " items-center pl-2",
                    "",
                  )}
                >
                  <Tooltip
                    placement={"right"}
                    title={item.name}
                    className="flex w-full"
                  >
                    <item.icon
                      className={concatClassNames(
                        pathname === `${basePath}${item.href}`
                          ? "text-white"
                          : "text-cyan-200 ",
                        "mr-3 flex-shrink-0",
                        minimizeSidebar ? "h-[25px] w-[25px]" : "h-5 w-5",
                      )}
                      aria-hidden="true"
                    />
                    {!minimizeSidebar && (
                      <span className="flex items-center gap-1.5 flex-1">
                        {item.name}
                        <NavBadge route={`${basePath}${item.href}`} />
                      </span>
                    )}
                  </Tooltip>
                </Link>
              ) : (
                <Disclosure
                  as="div"
                  key={item.name}
                  className="space-y-0"
                  defaultOpen={pathname.includes(item.href)}
                >
                  {({ open }) => (
                    <>
                      {minimizeSidebar ? (
                        <Popover
                          placement={"right"}
                          title={item.name}
                          trigger="hover"
                          content={
                            <div className="flex flex-col  items-start w-full">
                              {item.children &&
                                item.children.map((subItem, _id) => (
                                  <Link
                                    key={item.name + subItem.name + _id}
                                    href={`/country-programs/${country.toLowerCase()}${
                                      subItem.href
                                    }`}
                                  >
                                    <Button variant={"link"} size={"sm"}>
                                      {subItem.name}
                                    </Button>
                                  </Link>
                                ))}
                            </div>
                          }
                        >
                          <Disclosure.Button
                            className={concatClassNames(
                              pathname.includes(`${basePath}${item.href}`)
                                ? "bg-lmh-dark-blue text-white th-font-medium"
                                : " text-cyan-100 dark:text-foreground hover:bg-cyan-600 hover:text-white",
                              "group w-full flex  px-2  py-1.5 text-left text-sm th-font-medium rounded-md focus:outline-none focus:bg-primary/10",
                              minimizeSidebar
                                ? " items-center pl-4 justify-center "
                                : " items-center pl-2",
                            )}
                          >
                            <item.icon
                              className={concatClassNames(
                                pathname === `${basePath}${item.href}`
                                  ? "text-white"
                                  : "text-cyan-200",
                                "mr-2 flex-shrink-0  ",
                                minimizeSidebar ? "h-6 w-6" : "h-5 w-5",
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                        </Popover>
                      ) : (
                        <Disclosure.Button
                          className={concatClassNames(
                            pathname.includes(`${basePath}${item.href}`)
                              ? "bg-lmh-dark-blue text-white th-font-medium"
                              : `text-cyan-100 dark:text-foreground hover:bg-cyan-600 hover:text-white ${
                                  open && "bg-[#167a97]"
                                }`,
                            "group w-full flex  px-2  py-1.5 text-left text-sm th-font-medium rounded-md focus:outline-none ",
                            minimizeSidebar
                              ? " items-center pl-4 justify-center "
                              : " items-center pl-2",
                          )}
                        >
                          <item.icon
                            className={concatClassNames(
                              pathname === `${basePath}${item.href}`
                                ? "text-white"
                                : "text-cyan-200",
                              "mr-3 flex-shrink-0  ",
                              minimizeSidebar ? "h-6 w-6" : "h-5 w-5",
                            )}
                            aria-hidden="true"
                          />
                          <span className="flex-1 flex items-center gap-1.5">
                            {item.name}
                            <NavBadge route={`${basePath}${item.href}`} />
                          </span>

                          <ChevronRightIcon
                            className={concatClassNames(
                              open ? "text-white rotate-90 " : "text-white ",
                              " h-4 w-4  flex-0 transition",
                            )}
                          />
                        </Disclosure.Button>
                      )}
                      {!minimizeSidebar && (
                        <Transition
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Disclosure.Panel className="space-y-1 pt-1.5 -mt-0.5 rounded-b-lg pl-1.5 pr-1.5 pb-1 text-xs">
                            {item.children &&
                              item.children.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={`${basePath}${subItem.href}`}
                                  className={concatClassNames(
                                    "group flex w-full  items-start rounded-md py-1.5 pl-4  text-xs th-font-book tracking-normal  cursor-pointer",
                                    pathname === `${basePath}${subItem.href}`
                                      ? "text-cyan-100  th-font-black tracking-wide"
                                      : "text-cyan-200  hover:bg-cyan-600 hover:text-white text-xs",
                                  )}
                                >
                                  <span className="mr-2.5 flex items-center">
                                    {pathname ===
                                    `${basePath}${subItem.href}` ? (
                                      <DotFilledIcon className="text-white" />
                                    ) : (
                                      <DotIcon />
                                    )}
                                  </span>
                                  {subItem.name}
                                </Link>
                              ))}
                          </Disclosure.Panel>
                        </Transition>
                      )}
                    </>
                  )}
                </Disclosure>
              );
            })}
          </nav>

          {/* Admin Tools Section - Only show if user has permission */}
          {hasCountryAdminAccess() && (
            <div className="pb-2">
              {minimizeSidebar ? (
                <Link href={`${basePath}/admin`}>
                  <Tooltip title="Admin Tools" placement="right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={concatClassNames(
                        "w-full justify-center text-cyan-100 hover:bg-cyan-600 hover:text-white",
                        pathname.includes(`${basePath}/admin`)
                          ? "bg-lmh-dark-blue text-white"
                          : "",
                      )}
                    >
                      <Cog8ToothIcon className="h-[25px] w-[25px]" />
                    </Button>
                  </Tooltip>
                </Link>
              ) : (
                <Tooltip placement={"right"} title="Admin Tools">
                  <Link href={`${basePath}/admin`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={concatClassNames(
                        "w-full justify-start text-cyan-100 hover:bg-cyan-600 hover:text-white",
                        pathname.includes(`${basePath}/admin`)
                          ? "bg-lmh-dark-blue text-white"
                          : "",
                      )}
                    >
                      <Cog8ToothIcon
                        className={cn(
                          "mr-3 flex-shrink-0",
                          minimizeSidebar ? "h-[25px] w-[25px]" : "h-5 w-5",
                        )}
                      />
                      Admin Tools
                    </Button>
                  </Link>
                </Tooltip>
              )}
            </div>
          )}
        </>
      ) : (
        <Spinner className="text-background dark:text-white" />
      )}
    </aside>
  );
};

export default SideBar;
