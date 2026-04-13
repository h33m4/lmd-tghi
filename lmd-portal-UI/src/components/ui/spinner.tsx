import clsx from "clsx";

const sizes = {
  sm: "w-5 h-5",
  DEFAULT: "w-7 h-7",
  lg: "w-9 h-9",
  xl: "w-11 h-11",
};

const strokeSizes = {
  sm: "border-2",
  DEFAULT: "border-2",
  lg: "border-[3px]",
  xl: "border-4",
};

const colors = {
  DEFAULT: "text-gray-1000",
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-red",
  info: "text-blue",
  success: "text-green",
  warning: "text-orange",
  current: "text-current",
};

export type SpinnerSizeTypes = keyof typeof sizes;
export type SpinnerColorTypes = keyof typeof colors;

type SpinnerProps = {
  tag?: "div" | "span";
  size?: SpinnerSizeTypes;
  color?: SpinnerColorTypes;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement | HTMLSpanElement>;

export default function Spinner({
  tag = "div",
  size = "lg",
  color = "primary",
  className,
}: SpinnerProps) {
  let Component = tag;

  return (
    <Component className="h-full w-full flex flex-col items-center justify-center ">
      <div
        className={clsx(
          "relative mx-auto flex flex-shrink-0  ",
          sizes[size],
          colors[color],
          className
        )}
      >
        <span
          className={clsx(
            "absolute h-full w-full animate-spinner-ease-spin rounded-full border-solid border-b-current border-l-transparent border-r-transparent border-t-transparent",
            strokeSizes[size]
          )}
        />
        <span
          className={clsx(
            "absolute h-full w-full animate-spinner-linear-spin rounded-full border-dotted border-b-current border-l-transparent border-r-transparent border-t-transparent",
            strokeSizes[size]
          )}
        />
      </div>
    </Component>
  );
}
