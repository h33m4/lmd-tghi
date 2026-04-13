"use client";
import { Fragment, MouseEvent, useCallback, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";
import { ICountryNames, ICountryProgram } from "@/types";

import getProgramData from "@/lib/actions/program-data/getProgramData";
import ErrorToast from "@/components/toast/ErrorToast";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import Spinner from "@/components/ui/spinner";

const liberiaPrograms: ICountryProgram[] = [
  {
    name: "DHIS2 CHSS Monthly Service Report",
    code: "lib_dhis2_chss_msr",
  },
  {
    name: "CHW Masterlist",
    code: "lib_chw_masterlist",
  },
];

interface SelectProgramComboboxProps {
  countryName: ICountryNames;
  disabled?: boolean;
  selectedProgram: (prog: ICountryProgram | undefined) => void;
  selectedd?: ICountryProgram;
  label?: string;
}

export default function SelectProgramCombobox({
  selectedProgram,
  label,
  countryName,
  disabled = false,
  selectedd,
}: SelectProgramComboboxProps) {
  const [selected, setSelected] = useState<ICountryProgram | undefined>(
    selectedd
  );
  const [query, setQuery] = useState("");
  const [programs, setPrograms] = useState<ICountryProgram[]>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    getProgramData(countryName)
      .then((response) => {
        if (response.error) {
          console.error("Error:", response.error);
          // ErrorToast({ title: "", message: response.error });
          toast.error("Error", { description: response.error });
        } else {
          setPrograms(response.data);
          // remember to remove this
          // if (countryName === "Liberia") {
          //   setPrograms(liberiaPrograms);
          // }
          if (response.data.length === 0) {
            //&& countryName != "Liberia"
            toast.info("Info", {
              description: `No programs found for ${countryName}`,
              cancel: {
                label: "Close",
                onClick: () => {},
              },
            });
          }
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        ErrorToast({ title: "", message: err });
      })
      .finally(() => setIsLoading(false));
  }, [countryName]);

  useEffect(() => {
    fetchData();
  }, [countryName, fetchData]);

  useEffect(() => {
    setSelected(selectedd);
  }, [selectedd]);

  const filteredprograms =
    query === ""
      ? programs
      : programs?.filter((program) =>
          program.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="w-72 z-20  ">
      <Combobox
        disabled={disabled}
        nullable
        value={selected ? selected : ""}
        onChange={(sel: ICountryProgram) => {
          setSelected(sel);
          selectedProgram(sel);
        }}
      >
        {({ open }) => (
          <>
            <Combobox.Label
              className={"text-xs th-font-medium text-muted-foreground"}
            >
              {label}
            </Combobox.Label>
            <div className="relative mt-0.5">
              <div className="">
                {/* relative justify-between  cursor-pointer overflow-hidden  text-left shadow-md   sm:text-sm  active:ring-primary focus:ring-primary ll flex items-center peer w-full transition duration-200 hover:border-primary [&.is-focus]:ring-[0.8px] ring-[0.6px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary [&_input::placeholder]:opacity-60 px-3.5 py-2 text-sm rounded-md border border-muted ring-muted bg-transparent h-9 */}
                <Combobox.Button
                  className={cn(
                    "relative h-[32px] flex items-center justify-between px-2 w-full cursor-pointer overflow-hidden rounded-md   text-left  sm:text-sm transition duration-200 hover:border-primary [&.is-focus]:ring-[0.8px] ring-[0.6px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary [&_input::placeholder]:opacity-60 border border-border ring-border bg-background",
                    disabled && "cursor-not-allowed hover:border-border"
                  )}
                >
                  <p className={cn(disabled && "text-muted-foreground")}>
                    {selected?.name || "Select Program"}
                  </p>
                  <div>
                    <ChevronDownIcon
                      className={cn(
                        "h-5 w-5 text-foreground/50 transition",
                        open ? "rotate-180" : ""
                      )}
                      aria-hidden="true"
                    />
                  </div>
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options
                  static
                  className="absolute z-20 mt-0.5 max-h-60 w-full overflow-auto rounded-md bg-popover text-base shadow-lg  text-popover-foreground   sm:text-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border border-border"
                >
                  <div className="flex items-center border-b px-1 pt-1">
                    <div className=" w-fit  h-full flex items-center pl-1.5 ">
                      <MagnifyingGlassIcon className="h-4 w-4" />
                    </div>
                    <Combobox.Input
                      className="w-full border-none py-1 pl-2 pr-2 text-sm leading-5 focus:ring-none outline-none flex items-center bg-inherit"
                      // displayValue={(person: any) => person.name}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Select Program data"
                    />
                    <span className="flex items-center justify-center mr-1">
                      <Button
                        onClick={fetchData}
                        className="rounded-full h-6 w-6"
                        variant={"ghost"}
                        size={"icon"}
                      >
                        <ArrowPathIcon className="h-4 w-4 text-green-900" />
                      </Button>
                    </span>
                    <span>
                      <Combobox.Option
                        value={""}
                        onClick={() => {
                          setSelected(undefined);
                          selectedProgram(undefined);
                        }}
                      >
                        <XMarkIcon className="h-5 w-5 p-1 hover:bg-primary/20 rounded-full bg-gray-100 text-lmh-dark-blue" />
                      </Combobox.Option>
                    </span>
                  </div>
                  <div className="p-1">
                    {isLoading ? (
                      <div className="relative h-[5rem] flex items-center justify-center cursor-default select-none px-4 py-2 th-font-medium">
                        <Spinner />
                      </div>
                    ) : filteredprograms?.length === 0 && query !== "" ? (
                      <div className="relative h-[5rem] flex items-center justify-center cursor-default select-none px-4 py-2 th-font-medium">
                        {/* <NoDataFoundIcon className="h-4 w-4" /> */}
                        Nothing found.
                      </div>
                    ) : (
                      filteredprograms?.map((person, _id) => (
                        <Combobox.Option
                          key={_id + person.name}
                          className={({ active }) =>
                            `relative cursor-default select-none py-[5px] pl-2 pr-8 th-font-medium rounded-sm text-sm ${
                              active
                                ? "bg-primary text-background th-font-medium"
                                : ""
                            }`
                          }
                          value={person}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.name}
                              </span>
                              {selected ? (
                                <span
                                  className={cn(
                                    "absolute inset-y-0 right-0 flex items-center pr-3 "
                                  )}
                                >
                                  <CheckIcon
                                    className={cn("h-3 w-3")}
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </div>
                </Combobox.Options>
              </Transition>
            </div>
          </>
        )}
      </Combobox>
    </div>
  );
}
