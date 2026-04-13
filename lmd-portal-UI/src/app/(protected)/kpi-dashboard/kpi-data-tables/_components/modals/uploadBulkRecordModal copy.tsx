"use client";
import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { IButtonStatus } from "@/types";
import React, { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ZodObject, ZodTypeAny } from "zod";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Steps } from "antd";
import { PaperClipIcon, TrashIcon } from "@heroicons/react/24/outline";
import CustomFileImportButton from "@/components/modals/uploadProgramModal/customFileImportButton";
import { toast } from "sonner";
import { parseCSV } from "@/utils/file_reader_functions";
import {
  formatFileSize,
  getReadableTimeForFile,
} from "@/utils/helper_functions";
import UploadProgressBar from "@/components/modals/uploadProgramModal/uploadProgressBar";
import InfoBanner from "@/components/ui/banner/InfoBanner";
import ErrorBanner from "@/components/ui/banner/ErrorBanner";
import SuccessBanner from "@/components/ui/banner/SuccessBanner";
import { apiErrorTitles } from "@/utils/api-requests";

type UploadRecordModalProps = {
  modalRef: React.RefObject<BaseModalRef>;
  schema: ZodObject<Record<string, ZodTypeAny>>;
};

function UploadBulkRecordModal({ modalRef, schema }: UploadRecordModalProps) {
  const searchParams = useSearchParams();
  const country = searchParams.get("country");
  const tablename = searchParams.get("tablename");
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  // const modalFormRef = useRef<BaseModalRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSession();
  const [current, setCurrent] = useState(0);
  const [fileData, setFileData] = useState<any>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string>();
  const [fileUploadStatus, setFileUploadStatus] = useState<
    "default" | "uploading" | "success" | "failed"
  >("default");

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
          // const result = validateFileName(file.name, selectedProgram?.code!);
          // console.log(result);
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

    return (
      <div className="h-full w-full  flex flex-col gap-4 justify-start    ">
        <div className="px-6">
          <InfoBanner
            className="p-3"
            showCloseButton={false}
            title={`Hi ${data?.user.name}, please follow the steps below to upload
                  your dataset`}
            body={
              <div className="flex flex-col px-6 ">
                <h1 className="text-accent-foreground th-font-roman"></h1>
                <ul className="text-muted-foreground th-font-book text-sm list-disc ml-4 mt-2">
                  <li>
                    Ensure that the file extension is a{" "}
                    <span className="th-font-medium text-destructive">
                      .csv
                    </span>
                  </li>
                  {/* API no more tracking this */}
                  {/* <li>
              Ensure the file name is in the format{" "}
              <span className="th-font-medium text-destructive mr-2">
                datasetname_mm_dd_yyyy.csv.csv
              </span>
            </li> */}
                  <li>
                    Ensure that the file size is not more than{" "}
                    <span className="th-font-medium text-destructive">
                      50 MB
                    </span>
                  </li>
                </ul>
              </div>
            }
          />
        </div>

        <div className="border-t border-border mt-2 px-6 pt-4 flex  flex-col ">
          <h1 className="">Please confirm the country and TOC Pillar below</h1>
          <div className="mt-2">
            Country: <span className="th-font-medium">{country}</span>
          </div>
          <div>
            TOC Pillar: <span className="th-font-medium">{tablename}</span>
          </div>

          <p className="text-sm mt-3 text-muted-foreground th-font-oblique">
            Kindly close this modal and select the appropriate LMH Country and
            TOC pillar if they are incorrect
          </p>
        </div>

        <div className="border-t border-border mt-2 px-6 pt-4 flex  flex-col ">
          <h1 className={`${"text-muted-foreground"} `}>
            Now, import the dataset from your local computer and click next{" "}
          </h1>

          {/* upload  */}
          <div className="flex flex-col gap-1.5">
            <CustomFileImportButton
              disabled={Boolean(false)}
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

    function createColumnsFromHeaders(headerNames: string[]) {
      return headerNames.map((headerName, index) => ({
        title: headerName,
        dataIndex: headerName,
        key: `${headerName}-${index}`,
      }));
    }

    // console.log("headers", hea/ders);

    const columns = createColumnsFromHeaders(headers);
    return (
      <div className="h-full w-full px-4 flex flex-col justify-between  border-red-400">
        <h1 className="text-accent-foreground th-font-roman">
          Now, preview to confirm the contents of the dataset and click next
        </h1>
        <div className="flex-1 h-full border border-primary overflow-auto rounded-sm">
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
    const [uploadError, setUploadError] = useState<
      | {
          title: string;
          message: string;
        }
      | undefined
    >();
    const [uploadSuccess, setUploadSuccess] = useState<string | undefined>();

    const numberOfColumns = fileData?.meta?.fields?.length || 0;
    const numberOfRecords = fileData?.data?.length || 0;

    const handleError = (
      error: any,
      statusCode: number,
      responseText: string
    ): void => {
      setProgress(0);
      setFileUploadStatus("failed");
      setUploadSuccess(undefined);

      let errorTitle =
        apiErrorTitles[statusCode] || "An unexpected error occurred";
      let errorMessage = "";

      try {
        // Try to parse the response text as JSON
        const parsedError = JSON.parse(responseText);
        errorMessage = parsedError.message || responseText;
      } catch {
        // If parsing fails, use the raw response text
        errorMessage = responseText;
      }

      setUploadError({
        title: errorTitle,
        message: errorMessage,
      });

      toast.error(errorMessage);

      // Log error for debugging
      console.error("Upload Error:", {
        statusCode,
        errorTitle,
        errorMessage,
        technicalDetails: error,
      });
    };

    const handleSuccess = (responseText: string): void => {
      setFileUploadStatus("success");
      setUploadError(undefined); // Clear any previous error
      const successMessage = `File uploaded successfully! ${responseText}`;
      setUploadSuccess(successMessage);
      toast.success("File uploaded successfully!");
    };

    function uploadFile() {
      const file = selectedFile;

      if (!file) {
        return;
      }

      // Reset states
      setProgress(0);
      setUploadError(undefined);
      setFileUploadStatus("uploading");
      setUploadSuccess(undefined);

      const xhr = new XMLHttpRequest();
      const uploadUrl = `${process.env.NEXT_PUBLIC_LMD_API}/kpi_data/upload/${country}/${tablename}`;

      try {
        xhr.open("POST", uploadUrl, true);
        xhr.setRequestHeader("Accept", "application/json");

        // Add timeout handling
        xhr.timeout = 300000; // 5 minutes timeout
        xhr.ontimeout = () => {
          handleError(null, 408, "Request timed out. Please try again.");
        };

        // Handle upload progress
        xhr.upload.onprogress = (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(percentComplete);
          }
        };

        // Handle successful upload
        xhr.onload = () => {
          if (xhr.status === 202) {
            handleSuccess(xhr.responseText);
          } else {
            handleError(xhr, xhr.status, xhr.responseText);
          }
        };

        // Handle network errors
        xhr.onerror = () => {
          handleError(
            xhr,
            0,
            "Network error occurred. Please check your internet connection and try again."
          );
        };

        // Handle abort
        xhr.onabort = () => {
          handleError(xhr, 0, "Upload was cancelled. Please try again.");
        };

        const formData = new FormData();
        formData.append("kpi_file", selectedFile, selectedFile.name);

        xhr.send(formData);
      } catch (error) {
        handleError(
          error,
          0,
          "An unexpected error occurred while initiating the upload."
        );
      }
    }

    return (
      <div className="h-full w-full px-6 border-t flex flex-col  justify-start items-start gap-[3vh] pt-[5vh]">
        {/* error */}
        <>
          {uploadError && (
            <ErrorBanner
              title={uploadError.title}
              message={uploadError.message}
              onClose={() => setUploadError(undefined)}
            />
          )}
          <SuccessBanner
            title="Success"
            message={uploadSuccess}
            onClose={() => setUploadSuccess(undefined)}
          />
        </>
        <div className="">
          <ul className="space-y-1.5">
            <li className="th-font-medium text-sm">
              <label
                htmlFor=""
                className="mr-2 th-font-roman text-muted-foreground"
              >
                Country:
              </label>
              {country}
            </li>
            <li className="th-font-medium text-sm">
              <label
                htmlFor=""
                className="mr-2 th-font-roman text-muted-foreground"
              >
                KPI TOC Dataset name:
              </label>
              {tablename}
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
              {selectedFile
                ? getReadableTimeForFile(selectedFile?.lastModified)
                : "-"}
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
          // <UploadProgressBar progress={progress} />
          <></>
        )}
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
    // setSelectedProgram(undefined);
    setFileUploadStatus("default");
  };

  function ModalComponent() {
    return (
      <div className="bg-background flex flex-col h-[70vh]">
        {/* Fixed header section */}
        <div className="pt-4 px-6 flex-none">
          <Steps
            current={current}
            items={items}
            className="text-foreground"
            rootClassName="border-red-500"
          />
        </div>

        {/* Scrollable content section */}
        <div className="flex-1 overflow-y-auto mt-5">
          <div className="h-full">{steps[current].content}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BaseModal
        title={`Bulk Dataset Upload --  ${tablename}`}
        size={"large"}
        ref={modalRef}
        buttonComponent={<></>}
        components={ModalComponent()}
        ctaTitle={current === steps.length - 1 ? "Done" : "Next"}
        isCtaDisabled={
          selectedFile === null ||
          fileUploadError !== undefined ||
          (current === 2 && fileUploadStatus !== "success")
        }
        ctaOnClicked={onCTAClickedHandler}
        cancelOnClicked={onCancelClickedHandler}
        onCloseModal={onCancelClickedHandler}
        isLoading={buttonStatus === "loading"}
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
}

export default UploadBulkRecordModal;
