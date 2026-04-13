import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import { IButtonStatus } from "@/types";
import { CustomCellRendererProps } from "ag-grid-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import KpiDatasetFormsBuilder, {
  KpiDatasetFormsBuilderRef,
} from "../KpiDatasetFormsBuilder";
import { useSearchParams } from "next/navigation";
import { ZodObject, ZodTypeAny } from "zod";
import { toast } from "sonner";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { Eye, Check, X } from "lucide-react";
import { Tooltip } from "antd";
import { useUserPermissions } from "@/utils/app-permission-helpers";
import { ApprovalInfoBanner } from "./approvalCard";
import { updateApprovalStatus } from "@/utils/kpi-approval-helpers";
import { IKpiMetadata } from "../new/types";
import KpiDatasetMetadata from "../kpi-dataset-metadata";

// Types
interface BaseRecord {
  id: string | number;
  approval_status?: string;
  [key: string]: any;
}

interface ViewRecordModalProps<T extends BaseRecord> {
  props: CustomCellRendererProps<T>;
  schema: ZodObject<Record<string, ZodTypeAny>>;
  onEditCallback: () => void;
}

interface IApprovalData {
  kpi_id: number;
  kpi_dataset_id: string;
  approval_status: string;
  approved_by: string | null;
  entered_by: string;
  last_update_date: string;
  updated_by: string | null;
  date_inserted: string;
}

const APPROVAL_OPTIONS = [
  { value: "approved", label: "Approve", icon: Check, color: "text-green-600" },
  {
    value: "not_approved",
    label: "Not Approve",
    icon: X,
    color: "text-red-600",
  },
  { value: "pending", label: "Pending", icon: null, color: "text-amber-600" },
] as const;

const API_ENDPOINTS = {
  updateRecord: (
    country: string,
    tablename: string,
    recordId: string | number,
  ) =>
    `${process.env.NEXT_PUBLIC_LMD_API}/kpi_data/${country}/${tablename}/${recordId}`,
  approveRecord: () => `${process.env.NEXT_PUBLIC_LMD_API}/kpi_data/approvals`,
} as const;

// Utility Functions
const normalizeId = (id: string): string =>
  id
    .toLowerCase()
    .replace(/^(gs_|lib_|mlw_|sl_|eth_)/, "")
    .replace(/_(1|2|3|4|5|6|7|8|9|10)$/, "");

const getManualMappings = (): Record<string, string> => ({
  cross_cutting_1: "gs_cross_cutting_1",
  cross_cutting_2: "gs_cross_cutting_2",
  strengthen_1: "lib_strengthen_1",
  upskill_1: "lib_upskill_1",
  deliver_1: "lib_deliver_1",
});

const FormError: React.FC<{ error: string; onDismiss: () => void }> = ({
  error,
  onDismiss,
}) => (
  <div className="mb-4 p-2 border bg-red-200 text-sm rounded-sm relative">
    {error}
    <Button
      size="icon"
      variant="ghost"
      className="absolute h-5 w-5 border text-red-800 bg-red-200 rounded-full right-[-5px] top-[-6px]"
      onClick={onDismiss}
      aria-label="Dismiss error"
    >
      <XMarkIcon className="h-4 w-4" />
    </Button>
  </div>
);

// Main Component
export default function ViewRecordModal<T extends BaseRecord>({
  props,
  schema,
  onEditCallback,
}: ViewRecordModalProps<T>) {
  const searchParams = useSearchParams();
  const { data: sessionData } = useSession();

  const country = searchParams.get("country");
  const tablename = searchParams.get("tablename");
  const recordId = props.data?.id;

  const permissions = useUserPermissions(sessionData, country);

  const [editButtonStatus, setEditButtonStatus] =
    useState<IButtonStatus>("default");
  const [approvalButtonStatus, setApprovalButtonStatus] =
    useState<IButtonStatus>("default");
  const [formError, setFormError] = useState<string>();
  const [isEditMode, setIsEditMode] = useState(false);

  const [currentData, setCurrentData] = useState<T>(() => {
    return props.data || ({} as T);
  });

  // console.log("Initial props data:", props.data);

  useEffect(() => {
    if (props.data) {
      setCurrentData(props.data);
    }
  }, [props.data]);

  const baseModalRef = useRef<BaseModalRef>(null);
  const formRef = useRef<KpiDatasetFormsBuilderRef>(null);

  const updateRecord = useCallback(
    async (formData: Partial<T>) => {
      if (!country || !tablename || !recordId) {
        throw new Error("Missing required parameters");
      }

      const response = await fetch(
        API_ENDPOINTS.updateRecord(country, tablename, recordId),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            updated_by: sessionData?.user.email!, //toggle this to allow backend tracking
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update record");
      }

      return response.json();
    },
    [country, tablename, recordId],
  );

  const handleEdit = useCallback(async () => {
    if (!permissions.canEdit) return;

    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }

    if (!currentData || !props.data) {
      setFormError("No data available to update");
      return;
    }

    try {
      setFormError(undefined);
      setEditButtonStatus("loading");

      const formData = await formRef.current?.submitForm();
      if (!formData) {
        throw new Error("No form data available");
      }

      // necessary to persis new data on the ui
      setCurrentData((prev) => ({
        ...prev,
        ...cleanedData,
        approval_status: "pending",
      }));

      const cleanedData = Object.entries(formData).reduce<Partial<T>>(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key as keyof T] = value as T[keyof T];
          }
          return acc;
        },
        {},
      );

      await updateRecord(cleanedData);

      // After successful update, change approval status to pending
      // no need to do this
      // await updateApprovalStatus("pending");
      // await updateApprovalStatus({
      //   recordId: recordId!,
      //   newStatus: "pending",
      //   tableName: tablename!,
      //   approverEmail: sessionData?.user.email || "",
      //   record: {
      //     kpi_id: Number(currentData.id),
      //     kpi_dataset_id: tablename || "",
      //     approval_status: status,
      //     approved_by: sessionData?.user.email || null,
      //     entered_by: currentData.entered_by || sessionData?.user.email || "",
      //     last_update_date: currentData.last_update_date || "",
      //     date_inserted: currentData.date_inserted || "",
      //   },
      // });

      // setCurrentData((prev) => ({ ...prev, ...cleanedData }));
      setIsEditMode(false);

      toast.success("Record updated successfully");
      onEditCallback();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      console.error("Error updating record:", error);
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setEditButtonStatus("default");
    }
  }, [
    permissions.canEdit,
    isEditMode,
    currentData,
    props.data,
    updateRecord,
    onEditCallback,
  ]);

  const handleApprovalChange = useCallback(
    async (status: "approved" | "not_approved" | "pending") => {
      if (!permissions.canApprove) return;

      try {
        setApprovalButtonStatus("loading");
        // await updateApprovalStatus(status);

        await updateApprovalStatus({
          recordId: Number(recordId) || currentData.id,
          newStatus: status,
          tableName: tablename!,
          approverEmail: sessionData?.user.email || "",
          record: {
            kpi_id: Number(currentData.id),
            kpi_dataset_id: tablename || "",
            approval_status: status,
            approved_by: sessionData?.user.email || null,
            entered_by: currentData.entered_by || "",
            last_update_date: currentData.last_update_date || "",
            date_inserted: currentData.date_inserted || "",
          },
        });

        const { approval_status, approved_by, ...restRecordDetails } =
          currentData;

        // Update local state
        setCurrentData((prev) => ({ ...prev, approval_status: status }));

        const statusLabel = APPROVAL_OPTIONS.find(
          (opt) => opt.value === status,
        )?.label;
        toast.success(`Record status updated to ${statusLabel}`);
        onEditCallback();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update approval status";
        console.error("Error updating approval status:", error);
        toast.error(errorMessage);
        setFormError(errorMessage);
      } finally {
        setApprovalButtonStatus("default");
      }
    },
    [
      permissions.canApprove,
      recordId,
      currentData,
      tablename,
      sessionData?.user.email,
      onEditCallback,
    ],
  );

  const handleModalCancel = useCallback(() => {
    setIsEditMode(false);
  }, []);

  const handleDismissError = useCallback(() => {
    setFormError(undefined);
  }, []);

  const ModalContent = () => (
    <div className="px-6 py-4 overflow-auto h-[50vh]">
      {/* <KpiDatasetMetadata tablename={tablename} className="mb-4" /> */}

      {formError && (
        <FormError error={formError} onDismiss={handleDismissError} />
      )}

      {/* approval status */}
      {currentData && (
        <ApprovalInfoBanner
          data={{
            kpi_id: Number(currentData.id),
            kpi_dataset_id: tablename || "",
            approval_status: currentData.approval_status || "pending",
            approved_by: currentData.approved_by || null,
            entered_by: currentData.entered_by || "",
            last_update_date: currentData.last_update_date || "",
            date_inserted: currentData.date_inserted || "",
            updated_by: currentData.updated_by || null,
          }}
        />
      )}

      <KpiDatasetFormsBuilder
        ref={formRef}
        schema={schema}
        onSubmit={(data) => console.log("Form submitted:", data)}
        data={currentData}
        isEditable={isEditMode && permissions.canEdit}
      />
    </div>
  );

  // update to remove lock ==> && currentData.approval_status !== "approved"
  const getPrimaryAction = () => {
    if (permissions.canEdit) {
      return {
        title:
          editButtonStatus === "loading"
            ? "Updating..."
            : isEditMode
              ? "Update"
              : "Edit",
        onClick: handleEdit,
        isDisabled: editButtonStatus === "loading",
        isLoading: editButtonStatus === "loading",
      };
    }
    return null; // no button if locked
  };

  const primaryAction = getPrimaryAction();

  // Get current approval status styling
  const currentApprovalOption = APPROVAL_OPTIONS.find(
    (opt) => opt.value === (currentData.approval_status || "pending"),
  );

  return (
    <BaseModal
      title={`Indicator ID - ${tablename || "Unknown"}`}
      ref={baseModalRef}
      buttonComponent={
        <Tooltip title="View Record">
          <Button size="icon" className="h-6 w-6 mt-1" variant="green">
            <Eye className="h-4 w-4" />
          </Button>
        </Tooltip>
      }
      components={<ModalContent />}
      ctaTitle={primaryAction?.title}
      isCtaDisabled={primaryAction?.isDisabled}
      isLoading={primaryAction?.isLoading}
      ctaOnClicked={primaryAction?.onClick}
      // cancelOnClicked={permissions.canEdit ? handleModalCancel : undefined}
      cancelOnClicked={
        permissions.canEdit && currentData.approval_status !== "approved"
          ? handleModalCancel
          : undefined
      }
      leftButtonComponent={
        <div className="flex justify-between items-center gap-3  w-full">
          {/* <div className="flex flex-col items-start text-xs">
            <p>
              Last Updated:{" "}
              <span className="font-semibold">
                {props.data?.last_update_date
                  ? new Date(props.data.last_update_date).toLocaleString()
                  : ""}
              </span>
            </p>
            <p>
              Updated by:{" "}
              <span className="font-semibold">
                {props.data?.updated_by || "Unknown"}
              </span>
            </p>
          </div> */}

          {permissions.canApprove && (
            <div className="flex items-center gap-2 h-8">
              <label htmlFor="approval-status" className="text-xs font-medium">
                Approval Status:
              </label>
              <select
                id="approval-status"
                name="approval-status"
                className="text-sm border rounded px-2 py-1 bg-white"
                value={currentData.approval_status || "pending"}
                onChange={(e) =>
                  handleApprovalChange(
                    e.target.value as "approved" | "not_approved" | "pending",
                  )
                }
                disabled={approvalButtonStatus === "loading"}
              >
                <option value="approved">Approve Record</option>
                <option value="not_approved">Reject Record</option>
                <option value="pending"> Default (Pending)</option>
              </select>
              {approvalButtonStatus === "loading" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 ml-2" />
              )}
            </div>
          )}
        </div>
      }
    />
  );
}
