"use client";
import { cn } from "@/lib/utils";
import { Combobox, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import Spinner from "@/components/ui/spinner";

import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Tooltip } from "antd";

export interface IGlobalSelectDropdownData {
  name: string;
  label: string;
}

interface Props {
  label?: string;
  placeHolderText: string;
  onSelectItem: (item: IGlobalSelectDropdownData | undefined) => void;
  data: IGlobalSelectDropdownData[];
  wrapperClassName?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  initialSelected?: IGlobalSelectDropdownData | null;
  tooltip?: string;
}

export default function GlobalSelectDropdown({
  label,
  placeHolderText,
  onSelectItem,
  data,
  wrapperClassName,
  onRefresh,
  isLoading = false,
  disabled = false,
  initialSelected,
  tooltip,
}: Props) {
  const [selected, setSelected] = useState<IGlobalSelectDropdownData | null>(
    initialSelected || null
  );
  const [query, setQuery] = useState("");

  const filteredData =
    query === ""
      ? data
      : data.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const handleChange = (sel: IGlobalSelectDropdownData | null) => {
    if (!disabled) {
      setSelected(sel);
      onSelectItem(sel || undefined);
    }
  };

  const handleRefresh = () => {
    if (initialSelected) {
      setSelected(initialSelected);
    }
    if (!disabled) {
      // setSelected(null);
      setQuery("");
      if (onRefresh) {
        onRefresh();
      }
    }
  };

  useEffect(() => {
    setSelected(initialSelected ? initialSelected : null);
  }, [initialSelected]);

  return (
    <div className={cn("w-72 z-20", wrapperClassName)}>
      <Combobox
        nullable
        value={selected}
        onChange={handleChange}
        disabled={disabled}
      >
        {({ open }) => (
          <>
            {label && (
              <Combobox.Label
                className={cn(
                  "text-xs th-font-medium text-muted-foreground",
                  disabled && "opacity-50"
                )}
              >
                {label}
              </Combobox.Label>
            )}
            <div className="relative mt-0.5">
              <div className="pointer-events-none absolute inset-0 z-10"></div>
              <Tooltip title={tooltip}>
                <div className="relative">
                  <Combobox.Button
                    className={cn(
                      "relative h-[32px] flex items-center justify-between px-2 w-full cursor-pointer rounded-md text-left sm:text-sm transition duration-200 hover:border-primary border border-border ring-border bg-background overflow-hidden truncate",
                      disabled &&
                        "opacity-80 cursor-not-allowed hover:border-border"
                    )}
                  >
                    <p>{selected?.label || placeHolderText}</p>
                    <ChevronDownIcon
                      className={cn(
                        "h-5 w-5 text-foreground/50 transition",
                        open ? "rotate-180" : ""
                      )}
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
              </Tooltip>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options
                  static
                  className="absolute z-20 mt-0.5 max-h-60 w-full rounded-md bg-popover text-base shadow-lg text-popover-foreground sm:text-sm border border-border"
                >
                  <div className="flex items-center border-b px-1 pt-1">
                    <div className="w-fit h-full flex items-center pl-1.5">
                      <MagnifyingGlassIcon className="h-4 w-4" />
                    </div>
                    <Combobox.Input
                      className="w-full border-none py-1 pl-2 pr-2 text-sm leading-5 focus:ring-none outline-none flex items-center bg-inherit"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={placeHolderText}
                    />
                    <span className="flex items-center justify-center mr-1">
                      <Button
                        onClick={handleRefresh}
                        className="rounded-full h-6 w-6"
                        variant={"ghost"}
                        size={"icon"}
                        disabled={disabled}
                      >
                        <ArrowPathIcon className="h-4 w-4 text-green-900" />
                      </Button>
                    </span>
                    <span>
                      <Combobox.Option
                        value={null}
                        onClick={() => handleChange(null)}
                      >
                        <XMarkIcon
                          className={cn(
                            "h-5 w-5 p-1 hover:bg-primary/20 rounded-full bg-gray-100 text-lmh-dark-blue",
                            disabled &&
                              "opacity-50 cursor-not-allowed hover:bg-gray-100"
                          )}
                        />
                      </Combobox.Option>
                    </span>
                  </div>
                  <div className="p-1 overflow-auto max-h-[180px]">
                    {isLoading ? (
                      <div className="relative h-[5rem] flex items-center justify-center cursor-default select-none px-4 py-2 th-font-medium">
                        <Spinner />
                      </div>
                    ) : filteredData.length === 0 && query !== "" ? (
                      <div className="relative h-[5rem] flex items-center justify-center cursor-default select-none px-4 py-2 th-font-medium">
                        Nothing found.
                      </div>
                    ) : (
                      filteredData.map((item, _id) => (
                        <Combobox.Option
                          key={_id + item.name}
                          className={({ active }) =>
                            cn(
                              "relative cursor-default select-none py-[5px] pl-2 pr-8 th-font-medium rounded-sm text-sm",
                              active && !disabled
                                ? "bg-primary text-background th-font-medium"
                                : "",
                              disabled && "opacity-50 cursor-not-allowed"
                            )
                          }
                          value={item}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {item.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  <CheckIcon
                                    className="h-3 w-3 text-foreground"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
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
