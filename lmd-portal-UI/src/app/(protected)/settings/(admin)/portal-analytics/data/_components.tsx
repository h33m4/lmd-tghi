import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import React, { useMemo } from "react";
import { memo } from "react";

const FETCH_LIMIT_OPTIONS = [
  { label: "100 events", value: 100 },
  { label: "500 events", value: 500 },
  { label: "1 000 events", value: 1000 },
  { label: "5 000 events", value: 5000 },
  { label: "10 000 events", value: 10000 },
  { label: "All", value: 99999999 },
];

// Fetch limit — controls how many records are pulled from the API
const LimitInput = memo(
  ({
    value,
    onChange,
    onApply,
    disabled,
  }: {
    value: number;
    onChange: (value: number) => void;
    onApply: () => void;
    disabled?: boolean;
  }) => (
    <div className="flex flex-col">
      <label className="text-xs text-muted-foreground">Fetch Limit</label>
      <select
        className="h-8 px-2 border rounded text-sm"
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value));
          // apply immediately on change — no need to click Apply
          setTimeout(onApply, 0);
        }}
        disabled={disabled}
      >
        {FETCH_LIMIT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
);

LimitInput.displayName = "LimitInput";

// Memoized Components
const SearchInput = memo(
  ({
    value,
    onChange,
    onSearch,
    disabled,
  }: {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    disabled?: boolean;
  }) => (
    <div className="w-72 relative">
      <Input
        id="filter-text-box"
        className="h-8 pl-7 pr-16 py-1 flex items-center"
        type="search"
        placeholder="Search by anything"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        disabled={disabled}
      />
      <div className="absolute inset-0 pl-1.5 h-full flex items-center -z-10">
        <MagnifyingGlassIcon className="h-4 w-4 text-muted-lmh-dark-blue" />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onSearch}
        disabled={disabled}
        className="absolute right-0 top-0 h-8 px-2"
      >
        Search
      </Button>
    </div>
  )
);

SearchInput.displayName = "SearchInput";

// DateRange Filter Component
const DateRangePicker = memo(
  ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    disabled,
  }: {
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
    onApply: () => void;
    disabled?: boolean;
  }) => (
    <div className="flex items-center gap-2 borderl  rounded">
      <div className="flex flex-col">
        <label className="text-xs text-gray-500">Start Date</label>
        <input
          type="date"
          className="h-8 px-2 border rounded"
          value={startDate ? startDate.toISOString().slice(0, 10) : ""}
          onChange={(e) => {
            const date = e.target.value ? new Date(e.target.value) : null;
            onStartDateChange(date);
          }}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-500">End Date</label>
        <input
          type="date"
          className="h-8 px-2 border rounded"
          value={endDate ? endDate.toISOString().slice(0, 10) : ""}
          onChange={(e) => {
            const date = e.target.value ? new Date(e.target.value) : null;
            onEndDateChange(date);
          }}
          disabled={disabled}
        />
      </div>
    </div>
  )
);

DateRangePicker.displayName = "DateRangePicker";

// Event Type Filter Component
const EventTypeFilter = memo(
  ({
    value,
    onChange,
    disabled,
  }: {
    value: string | null;
    onChange: (value: string | null) => void;
    disabled?: boolean;
  }) => (
    <div className="w-48 relative">
      <label htmlFor="" className="text-xs text-muted-foreground">
        Event Type
      </label>
      <select
        className="h-8 w-full px-2 border rounded text-sm"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={disabled}
      >
        <option value="">All Events</option>
        <optgroup label="KPI Uploads">
          <option value="kpiBulkUpload">Bulk Upload (CSV)</option>
          <option value="kpiSingleUpload">Single Record Upload</option>
        </optgroup>
        <optgroup label="Data">
          <option value="datasetDownload">Dataset Download</option>
          <option value="datasetEdit">Dataset Edit</option>
        </optgroup>
        <optgroup label="Session">
          <option value="page">Page Views</option>
          <option value="login">Login</option>
          <option value="session">Sessions</option>
          <option value="search">Search</option>
        </optgroup>
        <optgroup label="Errors">
          <option value="apiRequest">API Errors</option>
        </optgroup>
        <optgroup label="Legacy">
          <option value="datasetUpload">Dataset Upload (legacy)</option>
          <option value="singleDatasetUpload">Single Upload (legacy)</option>
        </optgroup>
      </select>
    </div>
  )
);

EventTypeFilter.displayName = "EventTypeFilter";

// Pagination Controls Component
const PaginationControls = memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
  }) => {
    // Calculate which page numbers to show
    const pageNumbers = useMemo(() => {
      const numbers = [];
      const maxPagesToShow = 5;

      if (totalPages <= maxPagesToShow) {
        // Show all pages if there are fewer than maxPagesToShow
        for (let i = 1; i <= totalPages; i++) {
          numbers.push(i);
        }
      } else {
        // Always show first page
        numbers.push(1);

        // Calculate middle pages
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Adjust if we're near the beginning
        if (currentPage <= 3) {
          endPage = Math.min(maxPagesToShow - 1, totalPages - 1);
        }

        // Adjust if we're near the end
        if (currentPage >= totalPages - 2) {
          startPage = Math.max(2, totalPages - maxPagesToShow + 2);
        }

        // Add ellipsis after first page if needed
        if (startPage > 2) {
          numbers.push("...");
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          numbers.push(i);
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
          numbers.push("...");
        }

        // Always show last page
        if (totalPages > 1) {
          numbers.push(totalPages);
        }
      }

      return numbers;
    }, [currentPage, totalPages]);

    return (
      <div className="flex items-center justify-center space-x-1 sm:space-x-2 flex-nowrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="h-8 px-2 border border-gray-300 flex-shrink-0"
          title="Previous Page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="ml-1">Prev</span>
        </Button>

        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-1 flex-shrink-0">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(Number(page))}
                disabled={isLoading}
                className={cn(
                  "w-8 h-8 p-0 font-medium flex-shrink-0",
                  currentPage === page
                    ? "bg-lmh-dark-blue hover:bg-lmh-dark-blue/90 text-white hover:font-semibold"
                    : "border border-gray-300"
                )}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="h-8 px-2 border border-gray-300 flex-shrink-0"
          title="Next Page"
        >
          <span className="mr-1">Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);

PaginationControls.displayName = "PaginationControls";

export {
  LimitInput,
  SearchInput,
  DateRangePicker,
  EventTypeFilter,
  PaginationControls,
};
