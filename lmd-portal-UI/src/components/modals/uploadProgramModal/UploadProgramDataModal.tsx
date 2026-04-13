"use client";
import React, { useRef, useState } from "react";
import BaseModal, { BaseModalRef } from "../BaseModal";
import { Button } from "../../ui/button";
import { UploadIcon, ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Steps, Table, Tooltip, Upload, UploadFile, UploadProps } from "antd";
import { useSession } from "next-auth/react";
import { parseCSV, parseRcFileToFile } from "@/utils/file_reader_functions";
import SelectProgramCombobox from "@/app/(protected)/country-programs/liberia/program-data/_components/selectProgramCombobox";
import { ICountryNames, ICountryProgram } from "@/types";
import { isValidFileName, validateFileName } from "@/utils/isValidFileName";
import UploadProgressBar from "./uploadProgressBar";
import { parseCountryNameForApi } from "@/utils/parseCountryNameForAPI";
import { Input } from "../../ui/input";
import { PaperClipIcon, TrashIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import CustomFileImportButton from "./customFileImportButton";
import {
  downloadJSON,
  formatFileSize,
  getReadableTimeForFile,
} from "@/utils/helper_functions";
import { toast } from "sonner";
import { Session } from "next-auth";
// import { isUserAllowed } from "@/utils/isUserAllowed";

type Props = {
  country: ICountryNames;
};

const countryToCode = {
  Liberia: "liberia",
  Malawi: "malawi",
  Ethiopia: "ethiopia",
  Sierra_Leone: "sierra_leone",
} as const;

const UploadProgramDataModal = ({ country }: Props) => {
  const modalRef = useRef<BaseModalRef>(null);
  const { data } = useSession();
  const [current, setCurrent] = useState(0);
  const [fileData, setFileData] = useState<any>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<ICountryProgram>();
  const [fileUploadError, setFileUploadError] = useState<string>();
  const [fileUploadStatus, setFileUploadStatus] = useState<
    "default" | "uploading" | "success" | "failed"
  >("default");

  const isUserAllowed = (data: Session) => {
    const countryCode = countryToCode[country];
    const allowedGroups = [
      `${countryCode}_publisher`,
      "global_publisher",
      "super_administrator",
    ];

    return data.user.groups.some((group: string) =>
      allowedGroups.includes(group)
    );
  };

  function Step1Form() {
    const handleFileChange = (file: File | null) => {
      setFileUploadError(undefined);
      if (!file) {
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        // if (!isValidFileName(file.name, selectedProgram?.code)) {
        //   setFileUploadError("Incorrect file name");
        // }
        try {
          const result = validateFileName(file.name, selectedProgram?.code!);
          console.log(result);
        } catch (error) {
          console.log(error);
          if (error instanceof Error) {
            console.error(error.message);
            setFileUploadError(error.message);
            toast.error(error.message);
          }
        }
        parseCSV(file).then((data: any) => {
          setFileData(data);
        });
      }
    };

    // console.log("selectedFile", selectedFile);
    // console.log("fileData", fileData);

    return (
      <div className="h-full w-full  flex flex-col gap-4 justify-start    ">
        <div className="flex flex-col px-6 ">
          <h1 className="text-accent-foreground th-font-roman">
            Hi {data?.user.name}, please follow the steps below to upload your
            dataset
          </h1>
          <ul className="text-muted-foreground th-font-book text-sm list-disc ml-4 ">
            <li>
              Ensure that the file extension is a{" "}
              <span className="th-font-medium text-destructive">.csv</span>
            </li>
            <li>
              Ensure the file name is in the format{" "}
              <span className="th-font-medium text-destructive mr-2">
                program_name_mm_dd_yyyy.csv
              </span>
              (eg:
              <span className="ml-1 th-font-mediumOblique">
                {country === "Liberia" && `lib_chw_masterlist_06_01_2024.csv`}
                {country === "Malawi" && `mlw_cbmnc_training_06_01_2024.csv`}
                {country === "Ethiopia" && "eth_rmnch_06_01_2024.csv"}
                {country === "Sierra_Leone" && "sl_chw_training_06_01_2024.csv"}
              </span>
              )
            </li>
            <li>
              Ensure that the file size is not more than{" "}
              <span className="th-font-medium text-destructive">50 MB</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-border mt-4 px-6 pt-4 flex  flex-col ">
          <h1>
            Please select the program for which you are uploading the dataset.
          </h1>

          <SelectProgramCombobox
            countryName={country}
            selectedd={selectedProgram!}
            disabled={selectedFile != null}
            selectedProgram={(val) => {
              setSelectedProgram(val!);
            }}
          />
        </div>
        <div className="border-t border-border mt-4 px-6 pt-4 flex  flex-col ">
          <h1
            className={`${
              Boolean(!selectedProgram) &&
              "text-muted-foreground cursor-not-allowed"
            } `}
          >
            Now, import the dataset from your local computer and click next{" "}
          </h1>

          {/* upload  */}
          <div className="flex flex-col gap-1.5">
            <CustomFileImportButton
              disabled={Boolean(!selectedProgram)}
              onFileChange={handleFileChange}
            />

            {selectedFile && (
              <div className="transition ease-in-out delay-100  flex items-center  hover:bg-[#f2f2f2]/60 justify-between py-[1px]">
                <div className="flex items-center gap-2 text-sm">
                  <PaperClipIcon className="h-[14px] w-[14px]" />{" "}
                  <span>{selectedFile?.name}</span>
                </div>
                <button
                  className="py-0.5 px-2  hover:bg-border rounded-md"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileUploadError(undefined);
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {fileUploadError && (
            <span className="text-sm text-destructive mt-2 th-font-medium">
              {fileUploadError}
            </span>
          )}
        </div>

        <div className="h-5 my-5 text-background">h</div>
      </div>
    );
  }

  function Step2Form() {
    const rowData = fileData?.data!;
    const headers: string[] = fileData?.meta?.fields ?? []; // Use empty array as default value if undefined

    // console.log("my row headers =>", headers);
    // console.log("my row data =>", rowData);

    function createColumnsFromHeaders(headerNames: string[]) {
      return headerNames.map((headerName, index) => ({
        title: headerName,
        dataIndex: headerName,
        key: `${headerName}-${index}`,
      }));
    }

    const columns = createColumnsFromHeaders(headers);
    // console.log("ddd", rowData);

    // downloadJSON(rowData, "kpiChangeLogData");

    return (
      <div className="h-full w-full px-4 flex flex-col justify-between  border-red-400">
        <h1 className="text-accent-foreground th-font-roman">
          Now, preview to confirm the contents of the dataset and click next
        </h1>
        <div className="flex-1 h-full border border-primary overflow-auto rounded-sm">
          {/* {rowData ? (
            <Table
              // rowKey={r}
              columns={columns}
              dataSource={rowData}
              scroll={{ x: 1300 }}
              bordered
            />
          ) : (
            <div className="bg-primary/10 h-full flex items-center justify-center">
              <ReloadIcon className="h-4 w-4 mr-2 animate-spin" />
              Loading Dataset..
            </div>
          )} */}

          <div className="overflow-x-auto h-full">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="">
                <tr className="bg-primary">
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-1.5 text-left text-sm th-font-medium text-white tracking-wider sticky top-0 bg-primary z-10 "
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-gray-200">
                {rowData &&
                  rowData.map((row: any, rowIndex: any) => (
                    <tr key={rowIndex}>
                      {headers.map((header, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-1.5 whitespace-nowrap text-sm border-x "
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function Step3Form() {
    const [progress, setProgress] = useState(0);
    const [uploadStatusText, setUploadStatusText] = useState("");

    const numberOfColumns = fileData?.meta?.fields?.length || 0;
    const numberOfRecords = fileData?.data?.length || 0;

    function uploadFile() {
      const file = selectedFile;

      if (!file) {
        return;
      }
      setUploadStatusText("");
      setProgress(0);
      setFileUploadStatus("uploading");

      const xhr = new XMLHttpRequest();

      // open the connection
      xhr.open(
        "POST",
        `${
          process.env.NEXT_PUBLIC_LMD_API
        }/program_data/${parseCountryNameForApi(country)}/${
          selectedProgram?.code
        }`,
        true
      );

      // Set headers
      xhr.setRequestHeader("Accept", "application/json");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 202) {
          setFileUploadStatus("success");
          setUploadStatusText(`Success ✨ ${xhr.responseText}`);
        }
      };
      console.log("rrrr-->", xhr);
      xhr.onerror = () => {
        setFileUploadStatus("failed");
        console.log(xhr);
        setUploadStatusText(`Upload failed ${xhr.responseText}`);
      };

      const formData = new FormData();
      formData.append("program_data", file, file.name);

      xhr.send(formData);
    }

    return (
      <div className="h-full w-full px-6 border-t flex flex-col  justify-start items-start gap-[3vh] pt-[5vh]">
        <div className="">
          <ul className="space-y-1.5">
            <li className="th-font-medium text-sm">
              <label
                htmlFor=""
                className="mr-2 th-font-roman text-muted-foreground"
              >
                Program:
              </label>
              {selectedProgram?.name}
            </li>
            <li className="th-font-medium text-sm">
              <label
                htmlFor=""
                className="mr-2 th-font-roman text-muted-foreground "
              >
                File Name:
              </label>
              {selectedFile?.name}
            </li>

            <li className="th-font-medium text-sm">
              <label
                htmlFor=""
                className="mr-2 th-font-roman text-muted-foreground"
              >
                No of Columns:
              </label>
              {numberOfColumns} columns
            </li>
            <li className="th-font-medium text-sm">
              <label
                htmlFor=""
                className="mr-2 th-font-roman text-muted-foreground"
              >
                No of Records:
              </label>
              {numberOfRecords} records
            </li>
            <li className="th-font-medium text-sm">
              <label
                htmlFor=""
                className="mr-2 th-font-roman text-muted-foreground"
              >
                File Size:
              </label>
              {formatFileSize(selectedFile?.size!)}
            </li>
            <li className="th-font-medium text-sm">
              <label
                htmlFor=""
                className="mr-2 th-font-roman text-muted-foreground"
              >
                Last Modified:
              </label>
              {getReadableTimeForFile(selectedFile?.lastModified!)}
            </li>
          </ul>
        </div>

        <Button
          className="mt-4 "
          variant={fileUploadStatus === "failed" ? "green" : "dark-blue"}
          onClick={uploadFile}
          isLoading={fileUploadStatus === "uploading"}
          disabled={fileUploadStatus === "success"}
        >
          {fileUploadStatus === "default" && "Upload Dataset Now"}
          {fileUploadStatus === "failed" && "Retry Upload"}
          {fileUploadStatus === "uploading" && "Uploading..."}
          {fileUploadStatus === "success" && "Upload Complete"}
        </Button>

        {fileUploadStatus != "default" && (
          <UploadProgressBar progress={progress} />
        )}

        {fileUploadStatus != "default" &&
          (fileUploadStatus === "failed" ? (
            <span className="text-destructive">{uploadStatusText}</span>
          ) : (
            <span>{uploadStatusText}</span>
          ))}
      </div>
    );
  }

  const steps = [
    {
      title: "File Preparation",
      content: Step1Form(),
    },
    {
      title: "Preview Dataset",
      content: Step2Form(),
    },
    {
      title: "Upload Dataset",
      content: Step3Form(),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const onCTAClickedHandler = () => {
    if (current === 0) {
      setCurrent(current + 1);
    }

    if (current === 1) {
      setCurrent(current + 1);
    }

    if (current === 2) {
      // we done
      onCancelClickedHandler();
      modalRef.current?.closeModal();
    }
  };

  const onCancelClickedHandler = () => {
    setCurrent(0);
    setSelectedFile(null);
    setFileData(undefined);
    setSelectedProgram(undefined);
    setFileUploadStatus("default");
  };

  const ModalComponent = () => {
    return (
      <>
        <div className="bg-background  pt-4 pb-2  overflow-y-auto   h-[70vh] border-y">
          <Steps
            current={current}
            items={items}
            className="text-foreground"
            rootClassName=" border-red-500 mt-2 px-6"
          />
          <div className="flex-1  border-dashed rounded-xl  mt-6  h-[calc(70vh-91px)] dark:bg-[#09090b]l bg-[#f7f8fc]l">
            {steps[current].content}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <BaseModal
        ref={modalRef}
        size={"large"}
        title={"Upload Program Data"}
        buttonComponent={
          <>
            {isUserAllowed(data!) && (
              <Button
                className="px-4 h-[27px]  border-red-500"
                variant={"dark-blue"}
                size={"sm"}
              >
                <UploadIcon className="h-4 w-5 mr-2" />
                Upload Dataset
              </Button>
            )}
          </>
        }
        components={ModalComponent()}
        isCtaDisabled={
          selectedFile === null ||
          fileUploadError !== undefined ||
          (current === 2 && fileUploadStatus !== "success")
        }
        ctaTitle={current === steps.length - 1 ? "Done" : "Next"}
        ctaOnClicked={onCTAClickedHandler}
        cancelOnClicked={onCancelClickedHandler}
        onCloseModal={onCancelClickedHandler}
        leftButtonComponent={
          current > 0 && fileUploadStatus != "success" ? (
            <Button
              variant={"dark-blue"}
              onClick={() => setCurrent(current - 1)}
              className="px-4 h-[30px] "
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </Button>
          ) : (
            <></>
          )
        }
      />
    </>
  );
};

export default UploadProgramDataModal;
