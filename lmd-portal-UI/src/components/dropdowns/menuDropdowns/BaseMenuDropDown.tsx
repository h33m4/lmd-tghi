"use client";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React from "react";

import { concatClassNames } from "@/utils/helper_functions";

type Props = {
  children: ReactNode;
  buttonComponent: React.ReactElement;
  widthClass?: string;
  buttonClass?: string;
};

export default function BaseMenuDropdown({
  children,
  buttonComponent,
  buttonClass,
  widthClass,
}: Props) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>
          <div
            className={concatClassNames(
              "group inline-flex h-[30px] w-full  justify-center items-center border border-primary rounded-[20px] px-[2px] py-[3px] 2xl:py-[4px]  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 gap-2 text-lmh-dark-blue hover:opacity-90",
              buttonClass!
            )}
          >
            {buttonComponent}
            <ChevronDownIcon
              className=" ml-2 mr-1 h-5 w-5 "
              aria-hidden="true"
            />
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={concatClassNames(
            "absolute right-0 mt-0  origin-top-right border  ring-1 ring-black/5 focus:outline-none rounded-xl  bg-card text-card-foreground shadow",
            "min-w-52",
            widthClass!
          )}
        >
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
