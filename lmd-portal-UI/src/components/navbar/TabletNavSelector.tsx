"use client";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { concatClassNames } from "@/utils/helper_functions";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { name: "Home", href: "/home" },
  { name: "KPI Dashboarrd", href: "/kpi-dashboard" },
  { name: "Country Programs", href: "/country-programs" },
  { name: "AFF Dashboard", href: "/aff-dashboard" },
  { name: "Resources", href: "/resources" },
];

export default function TabletNavSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = useState(
    nav.find((item) => pathname.includes(item.href)) || nav[0]
  );

  // console.log(pathname);
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <Listbox.Button
          className={concatClassNames(
            "relative w-full cursor-default  th-font-medium text-md 2xl:text-lg  px-4 pt-[1px] border-b-[4px] h-full",
            "border-lmh-pink th-font-heavy text-lmh-pink",
            "hover:th-font-black",
            "flex justify-between gap-3"
          )}
        >
          {/* <span className="block truncate">{selected.name}</span>
            
            */}
          {selected.name}

          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-0.5 max-h-60 w-fit p-1 overflow-auto rounded-md bg-background border shadow-lg py-1 text-base ring-1 ring-black/5 focus:outline-none sm:text-sm text-foreground">
            {nav.map((navitem, navitemIdx) => (
              <Listbox.Option
                key={navitemIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-1.5 pl-10 pr-4 ${
                    active
                      ? "bg-lmh-light-grey text-primary"
                      : "text-foreground"
                  }`
                }
                value={navitem}
                onClick={() => router.push(navitem.href)}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {navitem.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lmh-pink">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
