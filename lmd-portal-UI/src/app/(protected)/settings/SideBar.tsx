"use client";
import React from "react";
import {
  CogIcon,
  KeyIcon,
  SquaresPlusIcon,
  UserCircleIcon,
  ChartPieIcon,
  SwatchIcon,
  UsersIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  BellAlertIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
  LightBulbIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Disclosure, Transition } from "@headlessui/react";
import { cn } from "@/lib/utils";
import {
  ChevronRightIcon,
  DotFilledIcon,
  DotIcon,
} from "@radix-ui/react-icons";
import { isUserAllowed } from "@/utils/isUserAllowed";

const mainNavigation = [
  { name: "Profile", href: "/", icon: UserCircleIcon, current: true },
  {
    name: "Password",
    href: "/password",
    icon: KeyIcon,
    current: false,
  },
  {
    name: "Appearance",
    href: "/appearance",
    icon: SwatchIcon,
    current: false,
  },
  // {
  //   name: "Notifications",
  //   href: "/notifications",
  //   icon: BellAlertIcon,
  //   current: false,
  // },
];

const publisherNavigation = [
  {
    name: "Dashboards",
    href: "/dashboards",
    icon: ChartPieIcon,
    current: false,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: DocumentChartBarIcon,
    current: false,
  },
  //   {
  //     name: "Integrations",
  //     href: "/integrations",
  //     icon: SquaresPlusIcon,
  //     current: false,
  //   },
];

const adminNavigation = [
  {
    name: "User Management",
    href: "/user-management",
    icon: UserGroupIcon,
    current: false,
    children: [
      { name: "User Groups", href: "/user-management/groups" },
      { name: "All Users", href: "/user-management/users" },
    ],
  },
  {
    name: "Portal Management",
    href: "/portal-management",
    icon: UsersIcon,
    current: false,
  },
  {
    name: "Portal Analytics",
    href: "/portal-analytics",
    icon: PresentationChartLineIcon,
    current: false,
    children: [
      { name: "Dashboard", href: "/portal-analytics/dashboard" },
      { name: "Event Data", href: "/portal-analytics/data" },
    ],
  },
];

const supportNavigation = [
  {
    name: "Tickets",
    href: "/tickets",
    icon: TicketIcon,
    current: false,
  },
  // {
  //   name: "Suggestions",
  //   href: "/suggestions",
  //   icon: LightBulbIcon,
  //   current: false,
  // },
];

const SettingsSideBar = () => {
  const pathname = usePathname();
  let path = pathname.split("/settings")[1] || "/";
  const session = useSession();
  const { data } = useSession();
  const user = data?.user;

  return (
    <aside className="hidden md:flex flex-col w-[18rem]  h-[calc(100vh-100px)]  gap-4 overflow-auto  ">
      {/* main nav */}
      <nav className="space-y-1 pt-4 pb-2 border-b">
        <p className="text-th-text-muted text-sm -mb-1">Main</p>
        {mainNavigation.map((item, _id) => (
          <Link
            key={item.name + _id}
            href={`/settings${item.href}`}
            className={cn(
              path === item.href
                ? "th-font-heavy text-primary hover:bg-gray-default border-l-[3px]  bg-primary/10 dark:bg-background  border-primary rounded-none"
                : "text-gray-900 dark:text-foreground hover:text-gray-900 hover:bg-gray-300/50 dark:hover:bg-primary-foreground",
              "group rounded-md px-3 py-[7px] flex items-center text-sm th-font-book"
            )}
            aria-current={path === item.href ? "page" : undefined}
          >
            <item.icon
              className={cn(
                path === item.href
                  ? "text-primary"
                  : "text-gray-400 group-hover:text-gray-500",
                "flex-shrink-0 -ml-1 mr-3 h-5 w-5"
              )}
              aria-hidden="true"
            />
            <span className="truncate">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* support */}
      {isUserAllowed(session.data!, [
        "super_administrator",
        "global_publisher",
        "adminstrator",
      ])}

      {/* publisher navs 
      {isUserAllowed(session.data!, [
        "super_administrator",
        "global_publisher",
      ]) && (
        <nav className="space-y-1 pt-1 pb-2 border-b">
          <p className="text-th-text-muted text-sm -mb-1">Publisher</p>
          {publisherNavigation.map((item, _id) => (
            <Link
              key={item.name + _id}
              href={`/settings${item.href}`}
              className={cn(
                path === item.href
                  ? "th-font-heavy text-primary hover:bg-gray-default border-l-[3px] border-primary rounded-none bg-primary/10 dark:bg-background "
                  : "text-gray-900 dark:text-foreground hover:text-gray-900 hover:bg-gray-300/50 dark:hover:bg-primary-foreground",
                "group rounded-md px-3 py-[7px] flex items-center text-sm th-font-book"
              )}
              aria-current={path === item.href ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  path === item.href
                    ? "text-primary"
                    : "text-gray-400 group-hover:text-gray-500",
                  "flex-shrink-0 -ml-1 mr-3 h-5 w-5"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>
      )} */}

      {/* admin  */}
      {isUserAllowed(session.data!, ["super_administrator"]) && (
        <nav className="space-y-1 pt-1 pb-2 border-b">
          <p className="text-th-text-muted text-sm -mb-1">Admin</p>
          {adminNavigation.map((item, _id) => {
            return item.children ? (
              <React.Fragment key={item.name + _id}>
                <Disclosure
                  as="div"
                  key={item.name + _id}
                  className={"space-y-0"}
                  defaultOpen={path.includes(item.href)}
                >
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        aria-current={
                          path.includes(item.href) ? "page" : undefined
                        }
                        className={cn(
                          path.includes(item.href)
                            ? " hover:bg-gray-default border-l-[3px]   border-primary rounded-none"
                            : "text-gray-900 dark:text-foreground hover:text-gray-900 hover:bg-gray-300/50 dark:hover:bg-primary-foreground",
                          "group w-full  px-3 py-[7px] flex justify-between items-center text-sm th-font-book"
                        )}
                      >
                        <div className="w-full flex items-center justify-start">
                          <item.icon
                            className={cn(
                              path.includes(item.href)
                                ? "text-primary"
                                : "text-gray-400 group-hover:text-gray-500",
                              "flex-shrink-0 -ml-1 mr-3 h-5 w-5"
                            )}
                            aria-hidden="true"
                          />
                          <span
                            className={cn(
                              "truncate",
                              path.includes(item.href)
                                ? "th-font-heavy text-primary"
                                : ""
                            )}
                          >
                            {item.name}
                          </span>
                        </div>

                        <ChevronRightIcon
                          className={cn(
                            open ? "rotate-90 " : "",
                            " h-4 w-4  flex-0 transition"
                          )}
                        />
                      </Disclosure.Button>
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel
                          className={cn("space-y-1 pt-1.5 pb-3 -mt-0.5 ")}
                        >
                          {item.children.map((subItem, _id) => (
                            <Link
                              key={subItem.name + _id}
                              href={`/settings${subItem.href}`}
                              className={cn(
                                "group flex w-full items-start py-1 pl-2 text-sm rounded-sm",
                                path === subItem.href
                                  ? "bg-primary/10 th-font-medium"
                                  : "hover:bg-gray-300/50 "
                              )}
                            >
                              <span className="mr-2.5 flex items-center">
                                {path === `${subItem.href}` ? (
                                  <DotFilledIcon className="h-5 w-5 text-primary" />
                                ) : (
                                  <DotIcon className="h-5 w-5" />
                                )}
                              </span>
                              {subItem.name}
                            </Link>
                          ))}
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              </React.Fragment>
            ) : (
              <Link
                key={item.name}
                href={`/settings${item.href}`}
                className={cn(
                  path === item.href
                    ? "th-font-heavy text-primary hover:bg-gray-default border-l-[3px] border-primary rounded-none bg-primary/10 dark:bg-background "
                    : "text-gray-900 dark:text-foreground hover:text-gray-900 hover:bg-gray-300/50 dark:hover:bg-primary-foreground",
                  "group rounded-md px-3 py-[7px] flex items-center text-sm th-font-book"
                )}
                aria-current={path === item.href ? "page" : undefined}
              >
                <item.icon
                  className={cn(
                    path === item.href
                      ? "text-primary"
                      : "text-gray-400 group-hover:text-gray-500",
                    "flex-shrink-0 -ml-1 mr-3 h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </aside>
  );
};

export default SettingsSideBar;
