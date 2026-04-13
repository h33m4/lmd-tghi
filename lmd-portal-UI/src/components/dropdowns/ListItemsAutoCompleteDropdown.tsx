"use client";
import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type DataItem<T> = T & { id: string; name: string };

interface Props<T> {
  data: DataItem<T>[];
  onChange: (value: DataItem<T>) => void;
  labelText?: string;
  disabled?: boolean;
  isRequired?: boolean;
  value?: string;
}

export default function ListItemsAutoCompleteDropdown<T>({
  data,
  disabled,
  isRequired = false,
  labelText,
  onChange,
  value,
}: Props<T>) {
  const passedSelectedItem: DataItem<T> = data.find(
    (item) => item.name === value
  )!;
  const [selected, setSelected] = useState<DataItem<T>>(
    passedSelectedItem || data[0]
  );
  const [query, setQuery] = useState<string>("");

  const handleSelectedChange = (value: DataItem<T>) => {
    setSelected(value);
    onChange(value);
  };

  // default selected value return by defaul
  useEffect(() => {
    onChange(selected);
  }, [onChange, selected]);

  const filteredData: DataItem<T>[] =
    query === ""
      ? data
      : data.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="w-full flex flex-col gap-[3px]">
      <label
        className={`text-dark-grey text-sm md:text-sm th-font-roman ${
          disabled && "text-th-text-disabled"
        }`}
      >
        {labelText}
        {isRequired ? (
          <span
            className={`ml-1 text-red-600 th-font-heavy ${
              disabled && "text-th-text-disabled"
            }`}
          >
            *
          </span>
        ) : (
          ""
        )}
      </label>
      <Combobox value={selected} onChange={handleSelectedChange}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg text-input">
            <Combobox.Input
              className="w-full border-none py-2 pl-0 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(item: DataItem<T>) => item.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-48 w-full overflow-auto rounded-lg bg-background p-1.5 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10  ">
              {filteredData.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredData.map((item) => (
                  <Combobox.Option
                    key={item.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4  rounded-md ${
                        active ? "bg-primary text-white" : "text-gray-900"
                      }`
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
                          {item.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-lmh-dark-blue"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
