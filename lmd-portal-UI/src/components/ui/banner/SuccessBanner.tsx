"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "../button";
import { cn } from "@/lib/utils";

type Props = {
  title?: string | undefined;
  message?: string | undefined;
  setFormSuccess?: React.Dispatch<React.SetStateAction<string | undefined>>;
  className?: string;
  body?: ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
};

const SuccessBanner = ({
  title,
  message,
  setFormSuccess,
  className,
  body,
  showCloseButton,
  onClose,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (message !== undefined) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [message]);

  return (
    <>
      {isOpen ? (
        <div
          className={cn(
            "w-full  border-[0.5px] border-green-400 bg-green-100 rounded-md py-1.5 px-3 flex items-start",
            className
          )}
        >
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>

          <div className="flex-1 ml-4 text-sm text-lmh-dark-blue">
            <p className="th-font-medium text-green-700">{title}</p>
            <p className="text-black">{message}</p>
            {body}
          </div>
          {showCloseButton && (
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => {
                setIsOpen(false);
                setFormSuccess && setFormSuccess(undefined);
                onClose?.();
              }}
              className="h-7 w-7 rounded-full"
            >
              <XMarkIcon className="text-black h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SuccessBanner;
