"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Info, CheckCircle, AlertCircle, X } from "lucide-react";

type BannerVariant = "info" | "success" | "error";

type Props = {
  title?: string;
  description?: string;
  variant?: BannerVariant;
  onClose?: () => void;
  setFormInfo?: React.Dispatch<React.SetStateAction<string | undefined>>;
  className?: string;
  body?: ReactNode;
  closable?: boolean;
};

const variantStyles = {
  info: {
    border: "border-sky-400",
    background: "bg-sky-100 dark:bg-sky-300",
    icon: Info,
    iconColor: "text-sky-600",
    titleColor: "text-sky-700",
  },
  success: {
    border: "border-green-400",
    background: "bg-green-100 dark:bg-green-300",
    icon: CheckCircle,
    iconColor: "text-green-600",
    titleColor: "text-green-700",
  },
  error: {
    border: "border-red-400",
    background: "bg-red-100 dark:bg-red-300",
    icon: AlertCircle,
    iconColor: "text-red-600",
    titleColor: "text-red-700",
  },
};

const Banner = ({
  title,
  description,
  variant = "info",
  setFormInfo,
  className,
  body,
  onClose,
  closable = true,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  useEffect(() => {
    if (description !== undefined) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [description]);

  const handleClose = () => {
    setIsOpen(false);
    setFormInfo?.(undefined);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "w-full border-[0.5px] rounded-md py-1.5 px-3 flex items-start",
        styles.border,
        styles.background,
        className
      )}
    >
      <Icon className={cn("h-5 w-5", styles.iconColor)} />

      <div className="flex-1 ml-4 text-sm ">
        <p className={cn("font-medium", styles.titleColor)}>{title}</p>
        <p className="text-black">{description}</p>
        {body}
      </div>

      {closable && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-7 w-7 rounded-full"
        >
          <X className="h-4 w-4 text-black" />
        </Button>
      )}
    </div>
  );
};

export default Banner;
