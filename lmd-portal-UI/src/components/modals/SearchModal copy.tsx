"use client";
import { Dialog, Transition } from "@headlessui/react";
import {
  Fragment,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "../ui/input";
import { FileTextIcon } from "@radix-ui/react-icons";

import SearchIcon from "@public/assets/icons/search.svg";

import { Button } from "../ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";

import NotFoundIcon from "@public/assets/icons/no-data-found.svg";

import { cn } from "@/lib/utils";
import Link from "next/link";
import pageRoutes from "@/config/routes";
import { TourWrapper } from "@/context/tourContext";

export default function SearchModal() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState("");

  const groupByLabel = (routes: any[]) => {
    return routes.reduce(
      (acc: { [x: string]: any[] }, route: { label: string | number }) => {
        if (!acc[route.label]) {
          acc[route.label] = [];
        }
        acc[route.label].push(route);
        return acc;
      },
      {}
    );
  };

  const filterRoutes = (routes: any[], searchText: string) => {
    if (searchText.length === 0) return groupByLabel(routes);

    const filteredRoutes = routes.filter((item: { href: string }) => {
      let label = item.href || "";
      label = label.replace(/-/g, " ").replace(/\//g, " ");

      return label.toLowerCase().includes(searchText.toLowerCase());
    });

    return groupByLabel(filteredRoutes);
  };

  const menuItemsFiltered = filterRoutes(pageRoutes, searchText);

  useEffect(() => {
    if (inputRef?.current) {
      // @ts-ignore
      inputRef.current.focus();
    }
    return () => {
      inputRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TourWrapper tourRef="tour_portal_search">
        <div className="flex h-8 items-center justify-center">
          <Input
            className="bg-transparent w-full rounded-[22px] border-primary cursor-pointer"
            wrapperClassName="h-7 w-[20vw] border-none ring-none "
            placeholder="Search for anything..."
            readOnly
            onClick={() => openModal()}
            prefixx={<SearchIcon width="15" height="19" viewBox="0 0 19 19" />}
          />
        </div>
      </TourWrapper>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70 " />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full mt-[35px] 2xl:mt-[70px] max-w-2xl 2xl:max-w-3xl transform overflow-hidden rounded-[22px] bg-background text-left align-middle shadow-xl transition-all pb-4">
                  <Dialog.Title
                    as="div"
                    className="text-lg px-5 py-4 font-medium leading-6 text-gray-900 border-b flex justify-between items-center gap-8"
                  >
                    <div className="w-full">
                      <Input
                        placeholder="Search for anything..."
                        className="bg-gray-200 dark:bg-transparent active:bg-transparent focus:bg-transparent pl-9 rounded-[22px] dark:text-white"
                        wrapperClassName="h-[34px]"
                        value={searchText}
                        ref={inputRef}
                        onChange={(e) => setSearchText(e.target.value)}
                        prefixx={
                          <SearchIcon
                            width="15"
                            height="19"
                            viewBox="0 0 19 19"
                          />
                        }
                        suffixx={
                          searchText && (
                            <Button
                              className="rounded-full text-xs"
                              variant={"link"}
                              onClick={(e) => {
                                e.preventDefault();
                                setSearchText("");
                              }}
                            >
                              clear
                            </Button>
                          )
                        }
                      />
                    </div>
                  </Dialog.Title>
                  <div className="px-5 h-[60vh] overflow-auto space-y-2 pt-4">
                    <>
                      {Object.keys(menuItemsFiltered).length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center">
                          <NotFoundIcon
                            width="70"
                            height="71"
                            viewBox="0 0 100 101"
                          />
                          <span className="max-w-sm text-center mt-4 text-muted-foreground text-sm 2xl:text-lg">
                            Apologies, no results found for your search. <br />
                            Please refine your search.
                          </span>
                        </div>
                      ) : null}
                    </>
                    {Object.keys(menuItemsFiltered).map((label) => (
                      <Fragment key={label}>
                        <h6 className="mb-1 px-3 pt-6 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-500">
                          {label}
                        </h6>
                        {menuItemsFiltered[label].map(
                          (
                            item: {
                              name: any;
                              href: string;
                            },
                            index: string
                          ) => (
                            <Link
                              key={item.name + "-" + index}
                              href={item.href as string}
                              onClick={closeModal}
                              className="relative my-[1px] flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus-visible:bg-gray-100 dark:hover:bg-gray-50/50 dark:hover:backdrop-blur-lg"
                            >
                              <span className="inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-500">
                                <FileTextIcon className="h-5 w-5" />
                              </span>
                              <span className="ms-3 grid gap-0.5">
                                <span className="font-medium capitalize text-gray-900 dark:text-gray-700">
                                  {item.name}
                                </span>
                                <span className="text-gray-500">
                                  {item.href as string}
                                </span>
                              </span>
                            </Link>
                          )
                        )}
                      </Fragment>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
