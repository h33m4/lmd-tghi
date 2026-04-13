import React, { Fragment, useEffect, useRef, useState } from "react";

import {
  AdjustmentsHorizontalIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowUpOnSquareStackIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useRightSidebar } from "@/context/rightSideBarContext";
import UploadSingleRecordModal from "./modals/uploadSingleRecordModal";
import { Menu, Popover, Transition } from "@headlessui/react";
import { BaseModalRef } from "@/components/modals/BaseModal";
import { Tooltip } from "antd";
import { ColDef } from "ag-grid-community";
import { Checkbox } from "@/components/ui/checkbox";
import { ZodObject, ZodTypeAny } from "zod";
import UploadBulkRecordModal from "./modals/uploadBulkRecordModal";
import { isUserAllowed } from "@/utils/isUserAllowed";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

type Props<T> = {
  onExportCSV: () => void;
  // others
  allColumns: ColDef<T, any>[];
  onColumnsChange: (updatedColumns: ColDef<T, any>[]) => void;
  schema: ZodObject<Record<string, ZodTypeAny>>;
  refreshData: () => void;
  activeColumns?: ColDef<T, any>[];
};

function KpiTableOptions<T>({
  onExportCSV,
  allColumns,
  onColumnsChange,
  schema,
  refreshData,
  activeColumns,
}: Props<T>) {
  const session = useSession();
  // const searchParams = useSearchParams();
  const { openFeedback, openComments, isRightSidebarOpen, closeSidebar } =
    useRightSidebar();

  // const tableName = searchParams.get("tablename") || "";

  const uploadSingleRecordModalRef = useRef<BaseModalRef>(null);
  const uploadBulkRecordModalRef = useRef<BaseModalRef>(null);

  const [columns, setColumns] = useState<ColDef[]>(allColumns);

  const handleCheckboxChange = (field: string, checked: boolean) => {
    const updatedColumns = checked
      ? [...columns, allColumns.find((col) => col.field === field)!]
      : columns.filter((col) => col.field !== field);
    setColumns(updatedColumns);
    onColumnsChange(updatedColumns);
  };

  useEffect(() => {
    if (!activeColumns) return;
    setColumns(activeColumns);
  }, [activeColumns]);

  return (
    <>
      <div className=" w-56i  text-right  -mr-[9px]  border-red-700 h-fit">
        <Menu
          as="div"
          className="relative inline-block text-left justify-center"
        >
          <Tooltip title="Table Options" placement={"topLeft"}>
            <Menu.Button className="border border-primary h-[29px] px-1.5 rounded-sm mt-3 bg-white dark:bg-transparent hover:bg-border ">
              <Bars3Icon className=" h-5 w-5" />
            </Menu.Button>
          </Tooltip>

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
                <div className="relative">
                  <Popover>
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`${
                            open ? "bg-primary text-background" : ""
                          } group flex w-full items-center rounded-md px-2 py-[6px] text-sm hover:bg-primary hover:text-background active:bg-primary`}
                        >
                          <AdjustmentsHorizontalIcon
                            className="h-5 w-5 mr-2"
                            aria-hidden="true"
                          />
                          <span className="mt-1">Toggle Dataset Column</span>
                        </Popover.Button>

                        <Popover.Panel className="absolute h-[5vh] right-[225px] top-[-5px] z-10  w-screen max-w-md transform px-4 sm:px-0 ">
                          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-border">
                            <div className=" px-3 pt-2 text-md th-font-medium bg-gray-50 dark:bg-background pb-0.5">
                              Toggle Columns
                            </div>
                            <div className="relative grid lg:grid-cols-2 overflow-y-auto  gap-x-4 gap-y-2 p-3 bg-background  border-t max-h-[30vh]">
                              {allColumns.map((column, _id) => (
                                <div
                                  key={_id}
                                  className="flex items-start gap-2  h-fit "
                                >
                                  <Checkbox
                                    className="mt-0.5"
                                    checked={columns.some(
                                      (col) => col.field === column.field
                                    )}
                                    onCheckedChange={(checked: boolean) =>
                                      handleCheckboxChange(
                                        column.field!,
                                        checked
                                      )
                                    }
                                  />
                                  <span
                                    id={String(_id)}
                                    className="-mb-1 whitespace-;;"
                                  >
                                    {column.headerName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Popover.Panel>
                      </>
                    )}
                  </Popover>
                </div>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        active ? "bg-primary text-white" : "",
                        "disabled:opacity-60 disabled:cursor-not-allowed",
                        "group flex w-full items-center rounded-md px-2 py-[6px] text-sm"
                      )}
                      onClick={onExportCSV}
                    >
                      <ArrowDownOnSquareIcon
                        className="h-5 w-5 mr-2"
                        aria-hidden="true"
                      />
                      <span className="mt-1">Download Dataset</span>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        active ? "bg-primary text-white" : "",
                        "disabled:opacity-60 disabled:cursor-not-allowed",
                        "group flex w-full items-center rounded-md px-2 py-[6px] text-sm"
                      )}
                      onClick={() =>
                        uploadSingleRecordModalRef.current?.openModal()
                      }
                      disabled={
                        !isUserAllowed(session.data!, [
                          "global_publisher",
                          "super_administrator",
                        ])
                      }
                    >
                      <ArrowUpOnSquareIcon
                        className="h-5 w-5 mr-2"
                        aria-hidden="true"
                      />
                      <span className="mt-1">Add Single Record</span>
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        active ? "bg-primary text-white cursor-pointer" : "",
                        "disabled:opacity-60 disabled:cursor-not-allowed",
                        "group flex w-full items-center rounded-md px-2 py-[6px] text-sm"
                      )}
                      onClick={() =>
                        uploadBulkRecordModalRef.current?.openModal()
                      }
                      disabled={
                        !isUserAllowed(session.data!, [
                          "global_publisher",
                          "super_administrator",
                        ])
                      }
                    >
                      <ArrowUpOnSquareStackIcon
                        className="h-5 w-5 mr-2"
                        aria-hidden="true"
                      />
                      <span className="mt-1">Bulk Dataset Upload</span>
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="p-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        active ? "bg-primary text-white" : "",
                        "disabled:opacity-60 disabled:cursor-not-allowed",
                        "group flex w-full items-center rounded-md px-2 py-[6px] text-sm"
                      )}
                      onClick={isRightSidebarOpen ? closeSidebar : openFeedback}
                    >
                      <ChatBubbleLeftRightIcon
                        className="h-5 w-5 mr-2"
                        aria-hidden="true"
                      />
                      <span className="mt-1">Contact Support</span>
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <UploadSingleRecordModal
        modalRef={uploadSingleRecordModalRef}
        schema={schema}
        onAddRecordCallback={refreshData}
      />
      <UploadBulkRecordModal
        modalRef={uploadBulkRecordModalRef}
        schema={schema}
      />
    </>
  );
}

export default KpiTableOptions;
