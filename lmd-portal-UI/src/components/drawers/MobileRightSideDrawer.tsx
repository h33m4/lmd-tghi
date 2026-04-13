"use client";
import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

import {
  Bars3Icon,
  CalendarIcon,
  HomeIcon,
  MagnifyingGlassCircleIcon,
  MegaphoneIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import UserAvatar from "../ui/UserAvatar";
import LogOutButton from "../buttons/LogOutButton";
import { concatClassNames } from "@/utils/helper_functions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/chat-helpers";

const MobileRightSideDrawer = () => {
  const { data: session, update } = useSession();
  const user = session?.user;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: "Home",
      href: "/home",
      icon: HomeIcon,
      current: pathname === "/home" ? true : false,
    },
    {
      name: "KPI Dashboard",
      href: "/kpi-dashboard",
      icon: CalendarIcon,
      current: pathname === "/kpi-dashboard",
    },
    {
      name: "Country Programs",
      href: "/country-programs",
      icon: UserGroupIcon,
      current: pathname === "/country-programs",
    },
    {
      name: "AFF Dashboard",
      href: "/aff-dashboard",
      icon: MagnifyingGlassCircleIcon,
      current: pathname === "/aff-dashboard",
    },
    {
      name: "Resouces",
      href: "/resources",
      icon: MegaphoneIcon,
      current: pathname === "/resources",
    },
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon
          className="h-8 w-8 text-lmh-dark-blue hover:text-pink focus:ring-primary focus:ring-2 ring-offset-2"
          aria-hidden="true"
        />
      </button>
      <Transition.Root show={sidebarOpen} as={Fragment} appear>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0  z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-sm flex-1 flex-col bg-background focus:outline-none">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12  pt-2 ">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 overflow-y-auto pt-0 pb-4">
                  <div className="border-primary border-b-[4px] py-0.5 flex items-center px-2 h-[54px] md:h-[45px] ">
                    <Link href={"/"}>
                      <Image
                        width="165"
                        height="40"
                        src="/assets/brand/lmh-lmd.png"
                        alt="brand"
                        priority
                        className="p-1"
                      />
                    </Link>
                  </div>
                  <nav aria-label="Sidebar" className="mt-5 ">
                    <div className="space-y-1 px-2 flex-1 ">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={concatClassNames(
                            item.current
                              ? "bg-gray-100 text-primary th-font-heavy"
                              : "text-gray-600 hover:bg-gray-50 hover:text-primary",
                            "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                          )}
                        >
                          <item.icon
                            className={concatClassNames(
                              item.current
                                ? "text-primary th-font-heavy"
                                : "text-gray-400 group-hover:text-primary",
                              "mr-4 h-6 w-6"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-10 pt-5 px-2">
                      <LogOutButton active={false} />
                    </div>
                  </nav>
                </div>
                <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                  <Link href="/settings" className="group block flex-shrink-0">
                    <div className="flex items-center">
                      <div>
                        {/* <UserAvatar size={"large"} /> */}
                        <Avatar className=" h-[8rem] w-[8rem]  2xl:mb-1 cursor-pointer bg-lmh-dark-blue flex flex-col items-center justify-center border active:border-2 hover:border-primary">
                          <AvatarImage
                            src={session?.user.image as string}
                            alt={`${session?.user.name}`}
                          />
                          <AvatarFallback className="2xl:text-sm text-[13px] th-font-medium tracking-wide">
                            {getInitials(
                              session?.user!.name!,
                              session?.user.email!
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-3">
                        <Link
                          href={"/settings"}
                          className="text-base th-font-medium text-gray-dark group-hover:text-gray-900"
                        >
                          {session?.user.name || "No Name"}
                        </Link>
                        <p className="text-sm th-font-book text-primary  group-hover:text-gray-700">
                          {session?.user.email}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MobileRightSideDrawer;
