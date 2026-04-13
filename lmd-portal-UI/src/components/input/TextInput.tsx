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
};

const TextInput = ({
  labelText,
  isRequired,
  type = "text",
  disabled,
  placeholderText,
  onInputChange,
  name,
  value,
}: Props) => {
  //   const inputRef = useRef<HTMLInputElement>(null);

  function inputHandler(inputValue: string) {
    // Validate email with Regex
    if (inputValue) {
      onInputChange(inputValue);
    }
  }
  const isWide: boolean = true;

  return (
    <div className={`w-full flex flex-col gap-[3px]`}>
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
      <input
        name={name}
        type={type}
        value={value!}
        className={`text-input  ${
          disabled
            ? "bg-background hover:border-th-stroke-primary text-th-text-disabled"
            : "bg-th-background-surface"
        }`}
        placeholder={placeholderText}
        disabled={disabled}
        onChange={(event) => {
          onInputChange(event.target.value);
        }}
        required={isRequired}
      />
    </div>
  );
};

export default TextInput;
