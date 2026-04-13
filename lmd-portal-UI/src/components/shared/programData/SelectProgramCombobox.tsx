"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";
import { ICountryProgram } from "@/types";
import Link from "next/link";
import getProgramData from "@/lib/actions/program-data/getProgramData";
import ErrorToast from "@/components/toast/ErrorToast";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { InfoContainer } from "@/components/infoContainer/infoContainerComponent";

export default function SelectProgramCombobox2({
  className,
  country,
  label = "Select Program",
}: {
  className?: string;
  country: string;
  label?: string;
}) {
  const [selected, setSelected] = useState<ICountryProgram>();
  const [query, setQuery] = useState("");
  const [programs, setPrograms] = useState<ICountryProgram[]>();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    getProgramData(country)
      .then((response) => {
        if (response.error) {
          console.error("Error:", response.error);
          toast.error("Error", { description: response.error });
        } else {
          setPrograms(response.data);

          // Extract program code from URL
          const programCode = pathname.split("/").pop();

          // Find and set the default selected program
          if (programCode && response.data) {
            const defaultProgram = response.data.find(
              (program: ICountryProgram) => program.code === programCode
            );
            if (defaultProgram) {
              setSelected(defaultProgram);
            }
          }

          if (response.data.length === 0) {
            toast.info("Info", {
              description: `No programs found for ${country}`,
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
  }, [country, pathname]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredPrograms =
    query === ""
      ? programs
      : programs?.filter((program: ICountryProgram) =>
          program.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className={cn("w-72 z-20", className)}>
      <Combobox
        value={selected || ""}
        onChange={(sel: ICountryProgram) => {
          setSelected(sel);
        }}
      >
        {({ open }) => (
          <>
            <Combobox.Label className="text-xs th-font-medium text-muted-foreground">
              {label}
              <InfoContainer id={""} placement="right">
                <div className="text-sm">
                  The dropdown below displays all available project datasets for{" "}
                  {country
                    ?.toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                  in the LMD warehouse. Selecting a dataset will load and
                  display its data
                </div>
              </InfoContainer>
            </Combobox.Label>
            <div className="relative mt-0.5">
              <Combobox.Button className="relative h-[32px] flex items-center justify-between px-2 w-full cursor-pointer overflow-hidden rounded-md text-left sm:text-sm transition duration-200 hover:border-primary [&.is-focus]:ring-[0.8px] ring-[0.6px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary [&_input::placeholder]:opacity-60 border border-border ring-border bg-background">
                {selected ? (
                  <span className="th-font-medium">{selected.name}</span>
                ) : (
                  <span>No program selected</span>
                )}
                <ChevronDownIcon
                  className={cn(
                    "h-5 w-5 text-foreground/50 transition",
                    open ? "rotate-180" : ""
                  )}
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options className="absolute z-20 mt-0.5 max-h-60 w-full overflow-auto rounded-md bg-popover text-base shadow-lg text-popover-foreground sm:text-sm border border-border">
                  <div className="flex items-center border-b px-1 pt-1">
                    <div className="w-fit h-full flex items-center pl-1.5">
                      <MagnifyingGlassIcon className="h-4 w-4" />
                    </div>
                    <Combobox.Input
                      className="w-full border-none py-1 pl-2 pr-2 text-sm leading-5 focus:ring-none outline-none flex items-center bg-inherit"
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
                        as={Link}
                        href={`/country-programs/${country}/program-data`}
                        value=""
                        onClick={() => setSelected(undefined)}
                      >
                        <XMarkIcon className="h-6 w-6 p-1 hover:bg-primary/20 rounded-full text-lmh-dark-blue" />
                      </Combobox.Option>
                    </span>
                  </div>
                  <div className="p-1 flex flex-col">
                    {isLoading ? (
                      <div className="relative h-[5rem] flex items-center justify-center cursor-default select-none px-4 py-2 th-font-medium">
                        <Spinner />
                      </div>
                    ) : programs?.length === 0 ? (
                      <div className="relative text-muted-foreground h-[5rem] flex flex-col items-center justify-center cursor-default select-none px-4 py-2 th-font-medium">
                        No programs found for {country}
                      </div>
                    ) : filteredPrograms?.length === 0 && query !== "" ? (
                      <div className="relative h-[5rem] flex items-center justify-center cursor-default select-none px-4 py-2 th-font-medium">
                        Nothing found.
                      </div>
                    ) : (
                      filteredPrograms?.map(
                        (program: ICountryProgram, index: number) => (
                          <Combobox.Option
                            key={index}
                            as={Link}
                            href={`/country-programs/${country}/program-data/${program.code}`}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-[5px] pl-2 pr-8 th-font-medium rounded-sm text-sm ${
                                active
                                  ? "bg-primary text-background th-font-medium"
                                  : ""
                              }`
                            }
                            value={program}
                          >
                            {({ selected, active }) => <>{program.name}</>}
                          </Combobox.Option>
                        )
                      )
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
