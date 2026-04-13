import React from "react";

// icons
import GoogleIcon from "../../../public/assets/icons/logo_google.svg";

type Props = {
  isLoading?: boolean;
  onClicked: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  title: string;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  isWide?: boolean;
};

const SocialMediaLoginButton = ({
  isLoading = false,
  onClicked,
  disabled = false,
  title,
  className,
  type = "button",
  isWide = false,
}: Props) => {
  return (
    <button
      className={`
      bg-background
      ${
        disabled
          ? " cursor-not-allowed opacity-80"
          : " active:scale-[97%] hover:opacity-95 "
      }  px-6 flex items-center justify-center    transition-all duration-200 rounded-[4px] border text-th-text-placeholder border-th-stroke-primary hover:border-th-stroke-secondary ${
        isWide ? "h-[38px] px-6" : "h-[38px] "
      } text-center flex items-center justify-center gap-4`}
      type={type}
      onClick={onClicked}
    >
      <GoogleIcon />
      <p className=" mt-0.5 text-[#696f78] th-text-size  th-font-book tracking-wide ">
        {title}
      </p>
    </button>
  );
};

export default SocialMediaLoginButton;
