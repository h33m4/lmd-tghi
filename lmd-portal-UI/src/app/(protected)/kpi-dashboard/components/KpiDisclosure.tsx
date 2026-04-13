"use client";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@radix-ui/react-icons";
import React from "react";

export interface ICriteriaDataType {
  title: string;
  items: string[];
  notes?: string;
}

const KpiDisclosure = ({ data }: { data: ICriteriaDataType[] }) => {
  return (
    <div className="mx-auto w-full  rounded-2xl bg-background space-y-4 ">
      {data &&
        data.map((data, _id) => (
          <div key={_id} className=" rounded-md bg-lmh-pink/10">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-md bg-lmh-pink  px-4 py-2 text-left text-sm font-medium text-background dark:text-white hover:bg-lmh-pink/90 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                    <span>{data.title}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-background`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pb-2 pt-3 text-sm text-gray-500  dark:text-gray-300 ">
                    <ol className="list-decimal space-y-0.5 px-4">
                      {data.items.map((item, _id) => (
                        <li key={_id}>{item}</li>
                      ))}
                    </ol>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
    </div>
  );
};

export default KpiDisclosure;
