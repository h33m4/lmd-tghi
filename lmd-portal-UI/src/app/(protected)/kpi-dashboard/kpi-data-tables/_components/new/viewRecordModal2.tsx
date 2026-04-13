import React, { useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { XMarkIcon } from "@heroicons/react/24/outline";

import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import KpiDatasetFormsBuilder, {
  KpiDatasetFormsBuilderRef,
} from "../KpiDatasetFormsBuilder";
import { BaseRecord, FormState, ViewRecordModalProps } from "./types";
import { usePermissions } from "./usePermission";
import { useRecordUpdate } from "./useRecordUpdate";
import { useKpiMetadata } from "./useKpiMetadata";
import { MetadataBanner } from "./MetadataBarner";

export default function ViewRecordModal<T extends BaseRecord>({
  props,
  schema,
  onEditCallback,
  requiredPermissions = ["global_publisher", "super_administrator"],
}: ViewRecordModalProps<T>) {
  const searchParams = useSearchParams();
  const country = searchParams.get("country");
  const tablename = searchParams.get("tablename");

  // Refs
  const baseModalRef = useRef<BaseModalRef>(null);
  const formRef = useRef<KpiDatasetFormsBuilderRef>(null);

  // State
  const [formState, setFormState] = useState<FormState>({
    isEditMode: false,
    buttonStatus: "default",
    formError: null,
  });

  // Custom hooks
  const { hasPermission } = usePermissions(requiredPermissions);
  const { currentMetadata, isLoading, error } = useKpiMetadata(tablename);
  const {
    updateRecord,
    status: updateStatus,
    isLoading: isUpdating,
  } = useRecordUpdate<T>({
    onSuccess: () => {
      baseModalRef.current?.closeModal();
      onEditCallback();
      setFormState((prev) => ({ ...prev, isEditMode: false }));
    },
  });

  // Handlers
  const handleFormSubmit = useCallback(async () => {
    if (!hasPermission) return;

    if (!formState.isEditMode) {
      setFormState((prev) => ({ ...prev, isEditMode: true }));
      return;
    }

    if (!country || !tablename || !props.data?.id) {
      setFormState((prev) => ({
        ...prev,
        formError: "Missing required parameters",
      }));
      return;
    }

    try {
      setFormState((prev) => ({
        ...prev,
        formError: null,
        buttonStatus: "loading",
      }));

      const formData = await formRef.current?.submitForm();
      if (!formData) {
        throw new Error("No form data available");
      }

      await updateRecord(
        country,
        tablename,
        props.data.id,
        formData as Partial<T>
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setFormState((prev) => ({
        ...prev,
        formError: errorMessage,
        buttonStatus: "error",
      }));
    } finally {
      setFormState((prev) => ({ ...prev, buttonStatus: "default" }));
    }
  }, [
    hasPermission,
    formState.isEditMode,
    country,
    tablename,
    props.data?.id,
    updateRecord,
  ]);

  const handleModalCancel = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      isEditMode: false,
      formError: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setFormState((prev) => ({ ...prev, formError: null }));
  }, []);

  // Compute button state
  const getCtaTitle = () => {
    if (!hasPermission) return undefined;
    if (formState.isEditMode) {
      return isUpdating ? "Updating..." : "Update";
    }
    return "Edit";
  };

  return (
    <BaseModal
      ref={baseModalRef}
      title={`IndicatorID - ${tablename || "Unknown"}`}
      buttonComponent={
        <Button
          size="icon"
          className="h-6 w-6 mt-1"
          variant="green"
          aria-label="View record"
        >
          <OpenInNewWindowIcon className="h-4 w-4" />
        </Button>
      }
      components={
        <div className="px-6 py-4 overflow-auto h-[50vh]">
          <MetadataBanner
            metadata={currentMetadata}
            isLoading={isLoading}
            error={error}
            tableId={tablename}
          />

          {formState.formError && (
            <div
              className="mb-4 p-2 border bg-red-200 text-sm rounded-sm relative"
              role="alert"
            >
              {formState.formError}
              <Button
                size="icon"
                variant="ghost"
                className="absolute h-5 w-5 border text-red-800 bg-red-200 rounded-full right-[-5px] top-[-6px]"
                onClick={clearError}
                aria-label="Clear error"
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          )}

          <KpiDatasetFormsBuilder
            ref={formRef}
            schema={schema}
            onSubmit={(data) => console.log("Form submitted:", data)}
            data={props.data || {}}
            isEditable={formState.isEditMode && hasPermission}
          />
        </div>
      }
      ctaTitle={getCtaTitle()}
      isCtaDisabled={isUpdating}
      isLoading={isUpdating}
      ctaOnClicked={hasPermission ? handleFormSubmit : undefined}
      cancelOnClicked={hasPermission ? handleModalCancel : undefined}
      leftButtonComponent={
        <>
          props.data?.last_update_date && (
          <div className="flex flex-col items-start text-xs">
            <p>
              Last Updated:{" "}
              <span className="font-semibold">
                {props.data?.last_update_date}
              </span>
            </p>
            {props.data?.updated_by && (
              <p>
                Updated by:{" "}
                <span className="font-semibold">{props.data.updated_by}</span>
              </p>
            )}
          </div>
          )
        </>
      }
    />
  );
}
