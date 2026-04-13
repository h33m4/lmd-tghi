"use client";
import React from "react";
import { PaperClipIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import CustomFileImportButton from "@/components/modals/uploadProgramModal/customFileImportButton";
import InfoBanner from "@/components/ui/banner/InfoBanner";
import { useSession } from "next-auth/react";
import { ZodObject, ZodTypeAny } from "zod";
import { Download } from "lucide-react";
import Banner from "@/components/ui/banner/banner";
import { Tooltip } from "antd";
import DragDropFileUpload from "./fileLoaded";

interface Step1FileSelectProps {
  selectedFile: File | null;
  setSelectedFile: (f: File | null) => void;
  fileError?: string;
  setFileError: (err?: string) => void;
  country: string | null;
  tablename: string | null;
  onFileParsed: (data: any) => void;
  parseCSV: (file: File) => Promise<any>;
  schema: ZodObject<Record<string, ZodTypeAny>>;
}

export default function Step1FileSelect({
  selectedFile,
  setSelectedFile,
  fileError,
  setFileError,
  country,
  tablename,
  onFileParsed,
  parseCSV,
  schema,
}: Step1FileSelectProps) {
  const { data } = useSession();

  const requiredColumns = Object.keys(schema.shape);
  //   console.log("schema", requiredColumns);

  const handleFileChange = (file: File | null) => {
    setFileError(undefined);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.endsWith(".csv")) {
      const msg = "Only .csv files are allowed";
      setFileError(msg);
      toast.error(msg);
      return;
    }

    setSelectedFile(file);
    parseCSV(file)
      .then(onFileParsed)
      .catch((err) => {
        setFileError("Failed to parse file");
        toast.error(err.message);
      });
  };

  const handleDownloadTemplate = () => {
    const csvHeader = requiredColumns.join(",") + "\n";
    const blob = new Blob([csvHeader], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${tablename ?? "dataset"}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-6 flex flex-col gap-4 border h-full">
      <Banner
        description=""
        closable={false}
        collapsible={true}
        defaultOpen={true}
        className="p-3"
        title={`Hi ${data?.user.name}, please follow the steps below to upload
                  your dataset`}
        body={
          <div className="flex flex-col px-6 ">
            {/* <h1 className="text-accent-foreground th-font-roman"></h1> */}
            <ul className="text-muted-foreground th-font-book text-sm list-disc ml-4 mt-0 space-y-1">
              <li>
                Ensure that the file extension is a{" "}
                <span className="th-font-medium text-destructive">.csv</span>
              </li>
              {/* API no more tracking this */}
              <li className="">
                <div>
                  <div className="mb-2">
                    Your file
                    <span className="underline font-bold mx-1">must</span>
                    include the following columns:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {requiredColumns.map((col) => (
                      <span
                        key={col}
                        className="bg-green-300 rounded-lg px-2 py-[1px] text-xs font-medium"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
              <li>
                Ensure that the file size is not more than{" "}
                <span className="th-font-medium text-destructive">100 MB</span>
              </li>
            </ul>
          </div>
        }
      />

      {/* Confirmation Details */}
      <div className="border-t border-border  px-6 pt-4 flex  flex-col ">
        {/* <h1 className="">Please confirm the country and TOC Pillar below</h1> */}
        <div className="mt-2">
          Country: <span className="th-font-medium">{country}</span>
        </div>
        <div>
          Dataset: <span className="th-font-medium">{tablename}</span>
        </div>

        <p className="text-sm mt-3 text-muted-foreground th-font-oblique">
          Kindly close this modal and select the appropriate LMH Country and
          dataset if they are incorrect
        </p>
      </div>

      {/* Download Template Button */}
      <div className=" px-6">
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 underline transition-colors "
        >
          <Download className="w-4 h-4" />
          Download CSV Template
        </button>
      </div>

      {/* <CustomFileImportButton
        disabled={false}
        onFileChange={handleFileChange}
      /> */}

      {selectedFile && (
        <div className="flex items-center justify-between mt-2 hover:underline">
          <span className="flex items-center gap-2 text-sm">
            <PaperClipIcon className="h-4 w-4" />
            {selectedFile.name}
          </span>
          <button
            onClick={() => {
              setSelectedFile(null);
              setFileError(undefined);
            }}
          >
            <TrashIcon className="h-4 w-4 text-red-500" />
          </button>
        </div>
      )}

      {fileError && <p className="text-red-500 text-sm">{fileError}</p>}

      <DragDropFileUpload
        onFileChange={handleFileChange}
        disabled={false}
        accept=".csv"
        maxSizeMB={100}
      />
    </div>
  );
}
