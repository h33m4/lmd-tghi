"use client";

import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { IFAQData } from "../../kpi-dashboard/faq/faq-table";
import initialFAQData from "./faq_data.json";
import { Disclosure } from "@headlessui/react";
import EditFaqModal from "../../kpi-dashboard/faq/editFaqModal";
import { isUserAllowed } from "@/utils/isUserAllowed";
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQsTable() {
  const session = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [faqData, setFaqData] = useState<IFAQData[]>(initialFAQData);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFaqUpdate = (updatedFaq: IFAQData, index: number) => {
    setFaqData(faqData.map((item, idx) => (idx === index ? updatedFaq : item)));
  };

  const filteredFaqData = faqData.filter(
    (data) =>
      data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* FAQ list */}
      <div className="space-y-2">
        {filteredFaqData.map((data, index) => (
          <Disclosure key={index} as="div">
            {({ open }) => (
              <div className={cn(
                "rounded-lg border border-border bg-background transition-colors",
                open && "border-primary/30"
              )}>
                <Disclosure.Button className="flex w-full items-center justify-between px-4 py-4 text-left focus:outline-none">
                  <span className="text-sm font-semibold text-foreground pr-4">{data.title}</span>
                  <ChevronDownIcon
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      open && "rotate-180"
                    )}
                  />
                </Disclosure.Button>

                <Disclosure.Panel className="px-4 pb-4">
                  <div className="pt-1 pl-0 border-t border-border">
                    <div
                      className="mt-3 text-sm text-muted-foreground leading-relaxed faq-content"
                      dangerouslySetInnerHTML={{ __html: data.value }}
                    />
                    <style jsx global>{`
                      .faq-content ul {
                        list-style-type: disc;
                        margin-left: 1.25rem;
                        margin-top: 0.5rem;
                        margin-bottom: 0.5rem;
                      }
                      .faq-content ul li { margin-bottom: 0.375rem; }
                      .faq-content ul ul {
                        list-style-type: circle;
                        margin-left: 1.25rem;
                        margin-top: 0.375rem;
                      }
                    `}</style>
                    {isUserAllowed(session.data!, ["global_publisher", "super_administrator"]) && (
                      <div className="mt-3">
                        <EditFaqModal
                          faqData={data}
                          onCloseModal={(updatedData: IFAQData) => {
                            handleFaqUpdate(updatedData, index);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}

        {filteredFaqData.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No results found for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
