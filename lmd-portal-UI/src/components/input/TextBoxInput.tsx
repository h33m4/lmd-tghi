import { cn } from "@/lib/utils";
import React, { useRef } from "react";

type Props = {
  isRequired?: boolean;
  onInputChange: (value: any) => void;
  labelText?: string;
  placeholderText?: string;
  value?: string | null;
  isWide?: boolean;
  validationRegex?: RegExp;
  type?:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "email"
    | "hidden"
    | "month"
    | "number"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  disabled?: boolean;
  name?: string;
  textBoxClassName?: string;
};

const TextBoxInput = ({
  labelText,
  isRequired,
  type,
  disabled,
  placeholderText,
  onInputChange,
  value,
  name,
  textBoxClassName,
}: Props) => {
  //   const inputRef = useRef<HTMLInputElement>(null);

  function inputHandler(inputValue: string) {
    onInputChange(inputValue);
  }
  const isWide: boolean = true;

  return (
    <div className={`w-full flex flex-col gap-[3px]`}>
      <label
        className={`text-grey-dark text-sm md:text-sm th-font-roman ${
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
      <textarea
        name={name}
        value={value!}
        // className={`text-input h-[60px] py-2 ${
        //   disabled
        //     ? "bg-background hover:border-th-stroke-primary text-th-text-disabled"
        //     : "bg-th-background-surface"
        // }`}
        className={cn(
          "text-input h-[60px] py-2",
          disabled
            ? "bg-background hover:border-th-stroke-primary text-th-text-disabled"
            : "bg-th-background-surface",
          textBoxClassName
        )}
        placeholder={placeholderText}
        disabled={disabled}
        onChange={(event) => {
          inputHandler(event.target.value);
        }}
      />
    </div>
  );
};

export default TextBoxInput;
