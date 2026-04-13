"use client";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import type { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "./input";
import { CalendarIcon } from "@radix-ui/react-icons";

const calendarContainerStyles = {
  base: "[&.react-datepicker]:shadow-lg [&.react-datepicker]:border-gray-100 [&.react-datepicker]:dark:border-border [&.react-datepicker]:rounded-md [&.react-datepicker]:",
  border: "[&.react-datepicker]:ring-border",
  monthContainer: {
    padding: "[&.react-datepicker>div]:pt-4 [&.react-datepicker>div]:pb-2",
  },
};

const prevNextButtonStyles = {
  base: "[&.react-datepicker>button]:items-baseline [&.react-datepicker>button]:top-4",
  border:
    "[&.react-datepicker>button]:border [&.react-datepicker>button]:border-solid [&.react-datepicker>button]:border [&.react-datepicker>button]:rounded-md",
  size: "[&.react-datepicker>button]:h-[22px] [&.react-datepicker>button]:w-[22px]",
  children: {
    position: "[&.react-datepicker>button>span]:top-0",
    border:
      "[&.react-datepicker>button>span]:before:border-t-[1.5px] [&.react-datepicker>button>span]:before:border-r-[1.5px] [&.react-datepicker>button>span]:before:border-muted",
    size: "[&.react-datepicker>button>span]:before:h-[7px] [&.react-datepicker>button>span]:before:w-[7px]",
  },
};

const timeOnlyStyles = {
  base: "[&.react-datepicker--time-only>div]:pr-0 [&.react-datepicker--time-only>div]:w-28",
};

export interface DatePickerProps<selectsRange extends boolean | undefined>
  extends Omit<ReactDatePickerProps, "selectsRange" | "onChange"> {
  onChange(
    date: selectsRange extends false | undefined
      ? Date | null
      : [Date | null, Date | null],
    event: React.SyntheticEvent<any> | undefined
  ): void;
  selectsRange?: selectsRange;
  inputProps?: InputProps;
}

const DatePicker = ({
  customInput,
  showPopperArrow = false,
  dateFormat = "d MMMM yyyy",
  selectsRange = false,
  onCalendarOpen,
  onCalendarClose,
  inputProps,
  calendarClassName,
  ...props
}: DatePickerProps<boolean>) => {
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);
  const handleCalenderOpen = () => setIsCalenderOpen(true);
  const handleCalenderClose = () => setIsCalenderOpen(false);
  return (
    <ReactDatePicker
      customInput={
        customInput || (
          <Input
            id="filter-text-box"
            className=""
            prefixx={<CalendarIcon className="w-5 h-5  pr-1" />}
            suffixx={
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 text-gray-500 transition",
                  isCalenderOpen && "rotate-180"
                )}
              />
            }
            {...inputProps}
          />
        )
      }
      showPopperArrow={showPopperArrow}
      dateFormat={dateFormat}
      selectsRange={selectsRange}
      onCalendarOpen={onCalendarOpen || handleCalenderOpen}
      onCalendarClose={onCalendarClose || handleCalenderClose}
      calendarClassName={cn(
        calendarContainerStyles.base,
        calendarContainerStyles.monthContainer.padding,
        prevNextButtonStyles.base,
        prevNextButtonStyles.border,
        prevNextButtonStyles.size,
        prevNextButtonStyles.children.position,
        prevNextButtonStyles.children.border,
        prevNextButtonStyles.children.size,
        timeOnlyStyles.base,
        calendarClassName
      )}
      {...props}
    />
  );
};

DatePicker.displayName = "DatePicker";
export default DatePicker;
