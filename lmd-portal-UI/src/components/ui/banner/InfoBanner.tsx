"use client";
import { cn } from "@/lib/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "../button";
import { Info } from "lucide-react";

type Props = {
  title?: string | undefined;
  description?: string | undefined;
  onClose?: () => void;
  setFormInfo?: React.Dispatch<React.SetStateAction<string | undefined>>;
  className?: string;
  body?: ReactNode;
  showCloseButton?: boolean;
};

const InfoBanner = ({
  title,
  description,
  setFormInfo,
  className,
  body,
  showCloseButton = true,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Open the banner if either description or body is defined
    if (description !== undefined || body !== undefined) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [description, body]);

  return (
    <>
      {isOpen ? (
        <div
          className={cn(
            "w-full border-[0.5px] border-sky-400 bg-sky-100 dark:bg-sky-300 rounded-md py-1.5 px-3 flex items-start",
            className
          )}
        >
          <Info className="h-5 w-5 text-sky-600" />

          <div className="flex-1 ml-4 text-sm text-lmh-dark-blue">
            <p className="th-font-medium text-sky-700">{title}</p>
            <p className="text-black">{description}</p>
            {body}
          </div>
          {showCloseButton && (
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => {
                setIsOpen(false);
                setFormInfo && setFormInfo(undefined);
              }}
              className="h-7 w-7 rounded-full"
            >
              <XMarkIcon className="text-black h-4 w-4" />
            </Button>
          )}
        </div>
      ) : null}
    </>
  );
};

export default InfoBanner;
