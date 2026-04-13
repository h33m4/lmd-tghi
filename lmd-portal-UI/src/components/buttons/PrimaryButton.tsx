"use client";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { concatClassNames } from "@/utils/helper_functions";

type Props = {
  isLoading?: boolean;
  onClicked: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  title: string;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  isWide?: boolean;
  variant?: "default" | "white" | "pink" | "blue" | "red" | "green";
  icon?: SVGSVGElement | any;
  size?: "small" | "medium" | "large";
};

const PrimaryButton = ({
  isLoading = false,
  onClicked,
  disabled = false,
  title,
  className,
  type = "button",
  isWide = false,
  variant = "default",
  icon,
  size = "medium",
}: Props) => {
  return (
    <button
      className={concatClassNames(
        "px-6 flex items-center gap-2 justify-center  th-text-size  th-font-heavy tracking-wide   transition-all duration-200 rounded-[4px]",
        `${variant === "default" && "bg-secondary text-white"}
        ${variant === "white" && "bg-background text-lmh-dark-blue"}
        ${variant === "blue" && "bg-primary text-white"}
        ${variant === "pink" && "bg-pink text-white"}
         ${variant === "red" && "bg-red-700 text-white"}
          ${variant === "green" && "bg-green text-white"}`,
        disabled
          ? " cursor-not-allowed opacity-80"
          : " active:scale-[97%] hover:opacity-95 ",
        isLoading ? "bg-opacity-80" : "bg-opacity-100",
        `${size === "small" && "h-[30px]"}`,
        `${size === "medium" && "h-[35px]"}`,
        `${size === "large" && "h-[38px]"}`,
        className!
      )}
      type={type}
      onClick={onClicked}
      disabled={disabled}
    >
      {isLoading && (
        <LoadingOutlined style={{ fontSize: 14 }} spin rev={undefined} />
      )}
      {icon && icon}
      <p className="">{title}</p>
    </button>
  );
};

export default PrimaryButton;
