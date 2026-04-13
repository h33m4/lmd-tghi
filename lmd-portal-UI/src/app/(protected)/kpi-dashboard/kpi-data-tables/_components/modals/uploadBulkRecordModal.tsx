"use client";
import React, { useCallback, useState } from "react";
import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { Steps } from "antd";
import {
  createFileFromFileData,
  parseCSV,
} from "@/utils/file_reader_functions";
import { useSearchParams } from "next/navigation";
import Step1 from "./fileUpload/step1";
import Step2 from "./fileUpload/step2";
import Step3 from "./fileUpload/step3";
import { ZodObject, ZodTypeAny } from "zod";
import { useFileEditor } from "./fileUpload/useFileEditorHook";

type Props = {
  modalRef: React.RefObject<BaseModalRef>;
  schema: ZodObject<Record<string, ZodTypeAny>>;
};

export default function UploadBulkRecordModal({ modalRef, schema }: Props) {
  const searchParams = useSearchParams();
  const country = searchParams.get("country");
  const tablename = searchParams.get("tablename");

  const [current, setCurrent] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<any>();
  const [fileError, setFileError] = useState<string>();
  const [editedFileData, setEditedFileData] = useState<any | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);

  // have the history in the parent file
  // Use the file editor hook
  const fileEditor = useFileEditor(fileData);

  const reset = useCallback(() => {
    setCurrent(0);
    setSelectedFile(null);
    setFileData(undefined);
    setFileError(undefined);
    setEditedFileData(null);
    setUploadComplete(false);
    fileEditor.reset();
  }, [fileEditor]);

  const steps = [
    {
      title: "Select File",
      content: (
        <Step1
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          fileError={fileError}
          setFileError={setFileError}
          country={country}
          tablename={tablename}
          onFileParsed={setFileData}
          parseCSV={parseCSV}
          schema={schema}
        />
      ),
    },
    {
      title: "Preview",
      content: fileData && (
        <Step2
          fileData={fileData}
          schema={schema}
          onDataChange={setEditedFileData}
          fileEditor={fileEditor}
          fileError={fileError}
          setFileError={setFileError}
        />
      ),
    },
    {
      title: "Upload",
      content: selectedFile && (
        <Step3
          file={createFileFromFileData(
            editedFileData || fileData,
            selectedFile.name,
          )}
          country={country}
          tablename={tablename}
          fileError={fileError}
          setFileError={setFileError}
          // uploadComplete={uploadComplete}
          setUploadComplete={setUploadComplete}
          // reset={reset}
          onUploadSuccess={() => setUploadComplete(true)}
        />
      ),
    },
  ];

  const nextStep = () => setCurrent((c) => Math.min(c + 1, steps.length - 1));
  const prevStep = () => setCurrent((c) => Math.max(c - 1, 0));

  // const reset = () => {
  //   setCurrent(0);
  //   setSelectedFile(null);
  //   setFileData(undefined);
  //   setFileError(undefined);
  //   setEditedFileData(null);
  //   fileEditor.reset();

  //   // modalRef.current?.closeModal();
  // };

  return (
    <BaseModal
      title={`Bulk Dataset Upload – ${tablename}`}
      ref={modalRef}
      size="large"
      components={
        <div className="flex flex-col h-[70vh]">
          <div className="px-6 pt-4">
            <Steps
              current={current}
              items={steps.map((s) => ({ key: s.title, title: s.title }))}
            />
          </div>
          <div className="flex-1 overflow-y-auto mt-5">
            {steps[current].content}
          </div>
        </div>
      }
      ctaTitle={current === steps.length - 1 ? "Done" : "Next"}
      ctaOnClicked={current === steps.length - 1 ? reset : nextStep}
      cancelOnClicked={reset}
      leftButtonComponent={
        <>
          {current > 0 && (
            <button onClick={prevStep} className="px-4 h-[30px]">
              ← Previous
            </button>
          )}
        </>
      }
      isCtaDisabled={
        (current === 0 && (!selectedFile || !!fileError)) ||
        (current === 1 && !fileData) ||
        (current === 2 && !uploadComplete)
      }
      buttonComponent={<></>}
      onCloseModal={() => reset()}
    />
  );
}
