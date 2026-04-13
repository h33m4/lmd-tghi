"use client";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

// Define a generic type for the data with required id and name fields
type DataItem<T> = T & { id: string; name: string };

interface Props<T> {
  data: DataItem<T>[];
  onChange: (value: DataItem<T>) => void;
  labelText?: string;
  disabled?: boolean;
  isRequired?: boolean;
  value?: string;
}

export default function ListItemsDropdown<T>({
  data,
  onChange,
  labelText,
  disabled,
  isRequired = false,
  value,
}: Props<T>) {
  const passedSelectedItem: DataItem<T> = data.find(
    (item) => item.name === value
  )!;
  const [selected, setSelected] = useState<DataItem<T>>(
    passedSelectedItem || data[0]
  );

  const handleSelectedChange = (value: DataItem<T>) => {
    setSelected(value);
    onChange(value);
  };

  // default selected value return by defaul
  useEffect(() => {
    onChange(selected);
  }, [onChange, selected]);
  return (
    <div className=" w-full flex flex-col gap-[3px]">
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
      <Listbox value={selected} onChange={handleSelectedChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg text-input text-sm flex justify-between items-center th-font-book">
            <span className="block truncate text-sm">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-background text-xs shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm p-1.5">
              {data.map((item, itemIDx) => (
                <Listbox.Option
                  key={itemIDx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-1.5 pl-10 pr-4 rounded-md th-font-roman ${
                      active ? "bg-primary text-white" : "text-gray-900"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lmh-dark-blue hover:text-white">
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
    </div>
  );
}
