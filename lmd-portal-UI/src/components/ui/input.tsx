import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** add clearable option */
  // clearable?: boolean;
  /** clear event */
  onClear?: (event: React.MouseEvent) => void;
  /** The prefix is design for adding any icon or text on the Input field's start (it's a left icon for the `ltr` and right icon for the `rtl`) */
  prefixx?: React.ReactNode;
  /** The suffix is design for adding any icon or text on the Input field's end (it's a right icon for the `ltr` and left icon for the `rtl`) */
  suffixx?: React.ReactNode;
  /** The classname as a string to style the wrapper */
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefixx, suffixx, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn(" relative flex items-center h-8", wrapperClassName)}>
        <input
          type={type}
          className={cn(
            "flex h-full w-full items-center rounded-md border border-border bg-transparent  pt-0 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ring-border transition duration-200 hover:border-primary [&.is-focus]:ring-[0.8px] ring-[0.6px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary  ",
            "px-3",
            prefixx ? "pl-7" : "",
            suffixx ? "pr-" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="absolute left-0 w-fit  border-primary  p-2 flex flex-col items-center justify-center h-full">
          <span>{prefixx && prefixx} </span>
        </div>

        <div className="absolute right-0 w-fit  border-primary px-2 flex flex-col items-center justify-center h-full">
          <span>{suffixx && suffixx} </span>
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
