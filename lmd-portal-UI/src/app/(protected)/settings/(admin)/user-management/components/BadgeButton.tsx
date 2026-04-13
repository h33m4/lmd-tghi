import clsx from "clsx";
import React from "react";

type Props = {
  showDot?: Boolean;
  value: string;
  variant?: "red" | "blue" | "green" | "yellow";
};

const BadgeButton = ({ showDot = false, value, variant = "green" }: Props) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center  text-xs th-font-medium me-2 px-2.5 py-[0.5px] rounded-md  border ",
        `${
          variant === "green" && "bg-[#d1fae5] text-[#166534]  border-[#4ade80]"
        }
        ${variant === "red" && "bg-red-100 text-red-800 border-red-400"}
        ${
          variant === "yellow" &&
          "bg-[#fef3c7] text-[#92400e]  border-[#fbbf24]"
        }
        ${variant === "blue" && "bg-blue-100 text-blue-800  border-blue-400"}
        
        
        `
      )}
    >
      {showDot && (
        <svg
          className={clsx(
            "mr-1.5 h-2 w-2 ",

            `${variant === "green" && "text-[#34d399]"}
            ${variant === "red" && "text-red-800"}
            ${variant === "yellow" && "text-[#fbbf24]"}
            ${variant === "blue" && "text-blue-400"}
            `
          )}
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx={4} cy={4} r={3} />
        </svg>
      )}
      {value}
    </span>
  );
};

export default BadgeButton;
