import React, { useRef } from "react";

type Props = {
  isRequired?: boolean;
  onInputChange: (value: any) => void;
  labelText?: string;
  placeholderText?: string;
  value?: string | null;
  isWide?: boolean;
  validationRegex?: RegExp;
  disabled?: boolean;
  name?: string;
  resetText?: string;
  resetEmailHandler?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

const EmailInput = ({
  labelText,
  isRequired,
  disabled,
  placeholderText,
  onInputChange,
  name,
  resetText,
  resetEmailHandler,
  value,
}: Props) => {
  //   const inputRef = useRef<HTMLInputElement>(null);

  function inputHandler(inputValue: string) {
    onInputChange(inputValue);
  }
  const isWide: boolean = true;

  return (
    <div className={`w-full flex flex-col gap-[3px]`}>
      <label
        className={`text-grey-dark text-sm md:text-sm th-font-roman flex justify-between ${
          disabled && "text-th-text-disabled"
        }`}
      >
        <div className="w-full">
          {labelText}
          {isRequired && (
            <span
              className={`ml-1 text-red-600 th-font-heavy ${
                disabled && "text-th-text-disabled"
              }`}
            >
              *
            </span>
          )}
        </div>
        <button
          type={"reset"}
          onClick={resetEmailHandler}
          className="text-pink hover:underline-offset-1 hover:underline w-full text-right text-sm mt-0.5"
        >
          {resetText}
        </button>
      </label>
      <input
        required={isRequired}
        name={name}
        value={value!}
        type={"email"}
        className={`text-input  ${
          disabled
            ? "bg-background hover:border-th-stroke-primary text-th-text-disabled"
            : "bg-th-background-surface"
        }`}
        placeholder={placeholderText}
        disabled={disabled}
        onChange={(event) => {
          inputHandler(event.target.value);
        }}
        autoComplete="email"
      />
    </div>
  );
};

export default EmailInput;
