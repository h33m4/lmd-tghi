"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { Fragment, useRef } from "react";
import {
  AvatarIcon,
  ChatBubbleIcon,
  ChevronDownIcon,
  GearIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "../ui/button";
import { Bars3Icon, SquaresPlusIcon } from "@heroicons/react/24/outline";
import { SendFeedBackComponent } from "./sendFeedBackComponent";
import { Menu, Transition } from "@headlessui/react";
import { Tooltip } from "antd";
import { cn } from "@/lib/utils";
import OpenFeedbackModal from "../portalFeebdack/feedBackModal/OpenFeedbackModal";
import { BaseModalRef } from "../modals/BaseModal";
import { usePathname } from "next/navigation";
import { useRightSidebar } from "@/context/rightSideBarContext";
import { TourWrapper } from "@/context/tourContext";

type Props = {
  tourRef?: string;
};

function HelpDropDown({ tourRef }: Props) {
  const OpenFeedbackModalmodalRef = useRef<BaseModalRef>(null);

  const pathname = usePathname();
  const isKpiPath = pathname.includes("/kpi-dashboard");
  const isCountryPagePath =
    /\/country-programs\/(malawi|liberia|ethiopia|sierra_leone)/.test(pathname);

  const { openFeedback, openComments, isRightSidebarOpen, closeSidebar } =
    useRightSidebar();

  return (
    <>
      <div>
        <Menu
          as="div"
          className="relative inline-block text-left justify-center"
        >
          <TourWrapper tourRef={tourRef}>
            <Tooltip title="Help function" placement={"left"}>
              <Menu.Button
                className={cn(
                  "mt-1 h-[1.8rem] w-[1.8rem] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors  ",
                  "bg-transparent rounded-full hover:bg-border hover:text-accent-foreground"
                )}
              >
                <QuestionMarkCircledIcon className="h-[1.4rem] w-[1.4rem]  2xl:h-5 2xl:w-5" />
              </Menu.Button>
            </Tooltip>
          </TourWrapper>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-[-2px] w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-background shadow-lg ring-1 ring-black/5 focus:outline-none border">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/resources"
                      // className="w-full flex cursor-pointer"
                      className={cn(
                        active ? "bg-border " : "",
                        "disabled:opacity-60 disabled:cursor-not-allowed",
                        "group flex w-full items-center rounded-md px-2 py-[6px] text-sm"
                      )}
                    >
                      <SquaresPlusIcon className="h-4 w-4 mr-2" />
                      Resources
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/docs"
                      className={cn(
                        active ? "bg-border " : "",
                        "disabled:opacity-60 disabled:cursor-not-allowed",
                        "group flex w-full items-center rounded-md px-2 py-[6px] text-sm"
                      )}
                    >
                      <SquaresPlusIcon className="h-4 w-4 mr-2" />
                      Documentations
                    </Link>
                  )}
                </Menu.Item>
                <div className="pt-1 border-t mt-1">
                  {
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={cn(
                            active ? "bg-border " : "",
                            "disabled:opacity-60 disabled:cursor-not-allowed",
                            "group flex w-full items-center rounded-md px-2 py-[6px] text-sm"
                          )}
                          onClick={
                            isRightSidebarOpen ? closeSidebar : openFeedback
                          }
                        >
                          {isRightSidebarOpen
                            ? "Close Feedback Form"
                            : "Send Feedback"}
                        </button>
                      )}
                    </Menu.Item>
                  }
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <OpenFeedbackModal modalRef={OpenFeedbackModalmodalRef} />
    </>
  );
}

export default HelpDropDown;
