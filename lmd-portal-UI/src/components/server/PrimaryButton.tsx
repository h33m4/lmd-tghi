import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { concatClassNames } from "@/utils/helper_functions";

type Props = {
  isLoading?: boolean;
  disabled?: boolean;
  title: string;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  isWide?: boolean;
  variant?: "default" | "white" | "pink" | "blue" | "green";
  icon?: SVGSVGElement | any;
};
const PrimaryButton = ({
  disabled,
  variant = "default",
  title,
  isLoading,
  type = "button",
  isWide = false,
  icon,
  className,
}: Props) => {
  return (
    <button
      className={concatClassNames(
        "text-center flex gap-3 px-6  items-center justify-center  text-sm  th-font-heavy tracking-wide   transition-all duration-200 rounded-[4px]",

        disabled
          ? " cursor-not-allowed opacity-80"
          : " active:scale-[97%] hover:opacity-95 ",
        ` ${variant === "default" && "bg-secondary text-white"}
                ${variant === "white" && "bg-background text-lmh-dark-blue"}
                ${variant === "blue" && "bg-primary text-white"}
                ${variant === "pink" && "bg-pink text-white"}
                 ${variant === "green" && "bg-green text-white"}
                `,
        isWide ? "h-[38px] px-6" : "h-[35px] ",
        className!
      )}
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
