"use client";

import { Popover, Transition } from "@headlessui/react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { ColDef } from "ag-grid-community";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Tooltip } from "antd";

interface ColumnsTogglerProps<T> {
  allColumns: ColDef<T, any>[];
  onColumnsChange: (updatedColumns: ColDef<T, any>[]) => void;
}

/**
 * A component for toggling columns visibility in a popover menu.
 *
 * @template T - The type or interface defining the column structure.
 * @param {ColumnsTogglerProps<T>} props - The props for the ColumnsToggler component.
 * @returns {JSX.Element} - The rendered ColumnsToggler component.
 */
export default function ColumsToggler<T>({
  allColumns,
  onColumnsChange,
}: ColumnsTogglerProps<T>): JSX.Element {
  const [columns, setColumns] = useState<ColDef[]>(allColumns);

  const handleCheckboxChange = (field: string, checked: boolean) => {
    const updatedColumns = checked
      ? [...columns, allColumns.find((col) => col.field === field)!]
      : columns.filter((col) => col.field !== field);
    setColumns(updatedColumns);
    onColumnsChange(updatedColumns);
  };

  return (
    <div className=" border-red-400 h-full">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Tooltip title="Columns Toggler">
              <Popover.Button
                className={cn(
                  "px-2  h-8 bg-background border rounded-md border-border text-lmh-dark-blue dark:text-white shadow-sm  hover:border-primary hover:text-accent-foreground"
                )}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </Popover.Button>
            </Tooltip>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute h-[5vh] right-0 z-10 mt-1 w-screen max-w-md transform px-4 sm:px-0 ">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-border">
                  <div className=" px-3 pt-2 text-md th-font-medium bg-gray-50 dark:bg-background pb-0.5">
                    Toggle Columns
                  </div>
                  <div className="relative grid lg:grid-cols-2 overflow-y-auto  gap-x-4 gap-y-2 p-3 bg-background  border-t max-h-[30vh]">
                    {allColumns.map((column, _id) => (
                      <div key={_id} className="flex items-start gap-2  h-fit ">
                        <Checkbox
                          className="mt-0.5"
                          checked={columns.some(
                            (col) => col.field === column.field
                          )}
                          onCheckedChange={(checked: boolean) =>
                            handleCheckboxChange(column.field!, checked)
                          }
                        />
                        <span id={String(_id)} className="-mb-1 whitespace-;;">
                          {column.headerName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
