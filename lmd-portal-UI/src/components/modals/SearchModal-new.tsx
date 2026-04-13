"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { FileTextIcon } from "@radix-ui/react-icons";
import SearchIcon from "@public/assets/icons/search.svg";
import { Button } from "../ui/button";
import NotFoundIcon from "@public/assets/icons/no-data-found.svg";
import Link from "next/link";
import { TourWrapper } from "@/context/tourContext";
import { Route } from "@/lib/routes/utils";

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<{
    [key: string]: Route[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDynamicPath = (href: string) => {
    return href
      .replace(/\[\.{3}\w+\]/g, "") // Handle [...param]
      .replace(/\[\w*\]/g, ":id") // Handle [param] and []
      .replace(/\/$/, ""); // Remove trailing slash
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (searchText.length < 2) {
        setSearchResults({});
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchText)}`
        );
        const data = await response.json();
        const groupedResults = data.results.reduce(
          (acc: { [key: string]: Route[] }, route: Route) => {
            if (!acc[route.label]) {
              acc[route.label] = [];
            }
            acc[route.label].push(route);
            return acc;
          },
          {}
        );
        setSearchResults(groupedResults);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults({});
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchText]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      <TourWrapper tourRef="tour_portal_search">
        <div className="flex h-8 items-center justify-center">
          <Input
            className="bg-transparent w-full rounded-[22px] border-primary cursor-pointer"
            wrapperClassName="h-7 w-[20vw] border-none ring-none"
            placeholder="Search for anything..."
            readOnly
            onClick={() => setIsOpen(true)}
            prefixx={<SearchIcon width="15" height="19" viewBox="0 0 19 19" />}
          />
        </div>
      </TourWrapper>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70" />
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
                              variant="link"
                              onClick={() => setSearchText("")}
                            >
                              clear
                            </Button>
                          )
                        }
                      />
                    </div>
                  </Dialog.Title>

                  <div className="px-5 h-[60vh] overflow-auto space-y-2 pt-4">
                    {isLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-muted-foreground">
                          Loading...
                        </span>
                      </div>
                    ) : Object.keys(searchResults).length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center">
                        <NotFoundIcon
                          width="70"
                          height="71"
                          viewBox="0 0 100 101"
                        />
                        <span className="max-w-sm text-center mt-4 text-muted-foreground text-sm 2xl:text-lg">
                          {searchText.length < 2
                            ? "Type at least 2 characters to search"
                            : "No results found. Please try a different search."}
                        </span>
                      </div>
                    ) : (
                      Object.keys(searchResults).map((label) => (
                        <Fragment key={label}>
                          <h6 className="mb-1 px-3 pt-6 text-xs font-semibold uppercase tracking-widest text-gray-500">
                            {label}
                          </h6>
                          {searchResults[label].map((item, index) => (
                            <Link
                              key={`${item.name}-${index}`}
                              href={formatDynamicPath(item.href)}
                              onClick={() => setIsOpen(false)}
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
                                  {item.description ||
                                    formatDynamicPath(item.href)}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </Fragment>
                      ))
                    )}
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
