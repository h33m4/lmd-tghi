import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import { IButtonStatus } from "@/types";
import { CustomCellRendererProps } from "ag-grid-react";
import React, { useRef, useState } from "react";
import KpiDatasetFormsBuilder, {
  KpiDatasetFormsBuilderRef,
} from "../KpiDatasetFormsBuilder";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import { ZodObject, ZodTypeAny } from "zod";
import { toast } from "sonner";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { analytics } from "@/services/analytics";
import { useSession } from "next-auth/react";

interface BaseRecord {
  id: string | number;
  [key: string]: any;
}

interface EditRecordModalProps<T extends BaseRecord> {
  props: CustomCellRendererProps<T>;
  schema: ZodObject<Record<string, ZodTypeAny>>;
  onEditCallback: () => void;
}

export default function EditRecordModal<T extends BaseRecord>({
  props,
  schema,
  onEditCallback,
}: EditRecordModalProps<T>) {
  const searchParams = useSearchParams();
  const { data: sessionData } = useSession();

  const country = searchParams.get("country");
  const tablename = searchParams.get("tablename");
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const baseModalRef = useRef<BaseModalRef>(null);
  const [formError, setFormError] = useState<string>();
  const formRef = useRef<KpiDatasetFormsBuilderRef>(null);

  const record_id = props.data?.id;

  async function updateRecord(formData: Partial<T>) {
    if (!country || !tablename || !record_id) {
      throw new Error("Missing required parameters");
    }

    console.log(
      "Updating record with data:",
      formData,
      sessionData?.user.email!
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LMD_API}/kpi_data/${country}/${tablename}/${record_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          entered_by: sessionData?.user.email!, //keep original entered_by
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update record");
    }

    return await response.json();
  }

  function ModalComponent() {
    return (
      <div className="px-6 py-4 overflow-auto h-[50vh] ">
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
          onSubmit={(e) => console.log("data", e)}
          data={{ ...props.data }}
        />
      </div>
    );
  }

  async function handleFormSubmit() {
    const editStartTime = performance.now();
    const oldData = { ...props.data };

    const editEndpoint = `${process.env.NEXT_PUBLIC_LMD_API}/kpi_data/${country}/${tablename}/${record_id}`;

    try {
      setFormError(undefined);
      setButtonStatus("loading");

      const formData = await formRef.current?.submitForm();
      if (!formData) {
        throw new Error("No form data available");
      }

      // Remove any undefined or null values
      const cleanedData = Object.entries(formData).reduce<Partial<T>>(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key as keyof T] = value as T[keyof T];
          }
          return acc;
        },
        {}
      );

      // Update the record
      await updateRecord(cleanedData);

      const editDuration = String(performance.now() - editStartTime);

      analytics.trackDatasetEdit(
        tablename || "unknown",
        record_id || "unknown",
        JSON.stringify(oldData),
        JSON.stringify(formData),
        editEndpoint,
        editDuration,
        "success"
      );

      // Close modal and show success message
      baseModalRef.current?.closeModal();
      toast.success("Record updated successfully");

      onEditCallback();
    } catch (error) {
      console.error("Error updating record:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update record";
      setFormError(errorMessage);
      toast.error(errorMessage);

      const editDuration = String(performance.now() - editStartTime);
      const formData = await formRef.current?.submitForm();

      analytics.trackDatasetEdit(
        tablename || "unknown",
        record_id || "unknown",
        JSON.stringify(oldData),
        JSON.stringify(formData || {}),
        editEndpoint,
        editDuration,
        "failed",
        errorMessage
      );
    } finally {
      setButtonStatus("default");
    }
  }

  return (
    <BaseModal
      title={`Update Record - ${tablename}`}
      ref={baseModalRef}
      buttonComponent={
        <Button size="icon" className="h-6 w-6 mt-1" variant="green">
          <Pencil1Icon className="h-4 w-4" />
        </Button>
      }
      components={<>{ModalComponent()}</>}
      ctaTitle={buttonStatus === "loading" ? "Updating..." : "Update"}
      isCtaDisabled={buttonStatus === "loading"}
      isLoading={buttonStatus === "loading"}
      ctaOnClicked={handleFormSubmit}
    />
  );
}
