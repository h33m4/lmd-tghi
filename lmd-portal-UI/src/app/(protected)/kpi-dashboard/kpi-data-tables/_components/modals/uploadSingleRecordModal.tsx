"use client";
import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { IButtonStatus } from "@/types";
import React, { useRef, useState } from "react";
import KpiDatasetFormsBuilder, {
  KpiDatasetFormsBuilderRef,
} from "../KpiDatasetFormsBuilder";
import { useSearchParams } from "next/navigation";
import { ZodObject, ZodTypeAny } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { analytics } from "@/services/analytics";

export type UploadRecordModalProps = {
  modalRef: React.RefObject<BaseModalRef>;
  schema: ZodObject<Record<string, ZodTypeAny>>;
  onAddRecordCallback: () => void;
};

interface ApiResult {
  data: any;
  status: number;
}

interface ApiError extends Error {
  statusCode: number;
  responseBody: string;
}

function UploadSingleRecordModal({
  modalRef,
  schema,
  onAddRecordCallback,
}: UploadRecordModalProps) {
  const { data: sessionData } = useSession();
  const searchParams = useSearchParams();

  const country = searchParams.get("country");
  const tablename = searchParams.get("tablename");
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const [formError, setFormError] = useState<string>();
  const formRef = useRef<KpiDatasetFormsBuilderRef>(null);

  const uploadEndpoint = `${process.env.NEXT_PUBLIC_LMD_API}/kpi_data/${country}/${tablename}`;

  async function addSingleRecord(formData: any): Promise<ApiResult> {
    if (!country || !tablename) {
      throw new Error("Missing required parameters");
    }

    const response = await fetch(uploadEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        entered_by: sessionData?.user.email!,
      }),
    });

    const status = response.status;

    if (!response.ok) {
      let body = "";
      try {
        body = await response.text();
      } catch {
        // ignore
      }
      let message = "Failed to add record";
      try {
        const parsed = JSON.parse(body);
        message = parsed.message || parsed.error || parsed.detail || message;
      } catch {
        // non-JSON error body
        if (body) message = body;
      }
      const err = new Error(message) as ApiError;
      err.statusCode = status;
      err.responseBody = body;
      throw err;
    }

    const data = await response.json();
    return { data, status };
  }

  function ModalComponent() {
    return (
      <div className="px-6 py-4 overflow-auto h-[60vh]">
        {formError && (
          <div className="mb-4 p-2 border bg-red-200 text-sm rounded-sm relative">
            {formError}
            <Button
              size={"icon"}
              variant={"ghost"}
              className="absolute h-5 w-5 border text-red-800 bg-red-200 rounded-full right-[-5px] top-[-6px] "
              onClick={() => setFormError(undefined)}
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
        <KpiDatasetFormsBuilder
          ref={formRef}
          schema={schema}
          onSubmit={() => {}}
        />
      </div>
    );
  }

  async function handleFormSubmit() {
    const uploadStartTime = performance.now();
    // Capture formData once — reused in both success and failure paths
    let capturedFormData: Record<string, any> | null = null;

    try {
      setFormError(undefined);
      setButtonStatus("loading");

      const formData = await formRef.current?.submitForm();
      if (!formData) throw new Error("No form data available");
      capturedFormData = formData;

      const { data: result, status: apiStatusCode } =
        await addSingleRecord(formData);

      const uploadDurationMs = Math.round(performance.now() - uploadStartTime);

      analytics.trackKpiSingleUpload({
        tablename: tablename!,
        uploadEndpoint,
        recordPayload: formData,
        uploadStatus: "success",
        uploadDurationMs,
        apiStatusCode,
        apiResponseMessage: result?.message || "Record created successfully",
        createdRecordId: result?.id ?? result?.record_id,
      });

      modalRef.current?.closeModal();
      toast.success("Record added successfully");
      onAddRecordCallback();
    } catch (error) {
      const uploadDurationMs = Math.round(performance.now() - uploadStartTime);
      const apiError = error as ApiError;
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add record";

      setFormError(errorMessage);
      toast.error(errorMessage);

      analytics.trackKpiSingleUpload({
        tablename: tablename!,
        uploadEndpoint,
        recordPayload: capturedFormData ?? {},
        uploadStatus: "failed",
        uploadDurationMs,
        errorMessage,
        apiStatusCode: apiError.statusCode,
        apiResponseBody: apiError.responseBody,
      });
    } finally {
      setButtonStatus("default");
    }
  }

  function cancelModal() {
    setFormError(undefined);
    setButtonStatus("default");
  }

  return (
    <>
      <BaseModal
        title={`New Record -  ${tablename}`}
        ref={modalRef}
        buttonComponent={<></>}
        components={ModalComponent()}
        ctaTitle={buttonStatus === "loading" ? "Submiting..." : "Submit"}
        isCtaDisabled={buttonStatus === "loading"}
        isLoading={buttonStatus === "loading"}
        ctaOnClicked={handleFormSubmit}
        cancelOnClicked={cancelModal}
        onCloseModal={cancelModal}
      />
    </>
  );
}

export default UploadSingleRecordModal;
