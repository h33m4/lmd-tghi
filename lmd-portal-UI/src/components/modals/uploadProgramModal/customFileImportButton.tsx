"use client";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "@radix-ui/react-icons";
import { Tooltip } from "antd";
import React, { useEffect, useRef } from "react";

interface Props {
  disabled: boolean;
  disabledText?: string;
  onFileChange: (files: File | null) => void;
}

export default function CustomFileImportButton({
  disabled,
  disabledText = "Please select a program name above before you proceed",
  onFileChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log(files);
      onFileChange(files[0]);
    } else if (files?.length === 0) {
      onFileChange(null);
    } else {
      onFileChange(null);
    }
  };

  useEffect(() => {
    const handleCancel = () => {
      if (fileInputRef.current && fileInputRef.current.value === "") {
        onFileChange(null);
      }
    };

    window.addEventListener("focus", handleCancel);
    return () => window.removeEventListener("focus", handleCancel);
  }, [onFileChange]);

  return (
    <div className="mt-4 ">
      <>
        {disabled ? (
          <Tooltip title={disabledText} color="#ff1100" placement="right">
            <Button
              variant={"outline"}
              size={"sm"}
              className="w-48 h-7 flex items-center border-border"
              disabled={disabled}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Click to Import
            </Button>
          </Tooltip>
        ) : (
          <div className="relative inline-block">
            <Button
              variant={"outline"}
              size={"sm"}
              className="w-48 h-7 flex items-center"
              disabled={disabled}
              onClick={handleButtonClick}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Click to Import
            </Button>

            <input
              type="file"
              disabled={disabled}
              ref={fileInputRef}
              className="absolute top-0 left-0 w-full h-full opacity-0  cursor-pointer"
              onChange={handleFileChange}
              accept=".csv"
              onAbortCapture={() => console.log("aborting")}
            />
          </div>
        )}
      </>
    </div>
  );
}
