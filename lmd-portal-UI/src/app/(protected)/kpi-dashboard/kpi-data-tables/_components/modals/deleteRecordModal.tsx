import ConfirmDeleteModal, {
  ConfirmDeleteModalRef,
} from "@/components/modals/ConfirmDeleteModal";
import { Button } from "@/components/ui/button";
import { IButtonStatus } from "@/types";
import { CustomCellRendererProps } from "ag-grid-react";
import { Tooltip } from "antd";
import { Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

interface BaseRecord {
  id: string | number;
  [key: string]: any;
}
interface DeleteRecordModalProps<T extends BaseRecord> {
  props: CustomCellRendererProps<T>;
  onDeleteCallback: () => void;
}

export default function DeleteRecordModal<T extends BaseRecord>({
  props,
  onDeleteCallback,
}: DeleteRecordModalProps<T>) {
  const searchParams = useSearchParams();
  const country = searchParams.get("country");
  const tablename = searchParams.get("tablename");
  const modalRef = useRef<ConfirmDeleteModalRef>(null);
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");

  const record_id = props.data?.id;

  async function onDeleteHandler() {
    console.log("deleting item");
    setButtonStatus("loading");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMD_API}/kpi_data/${country}/${tablename}/${record_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete record");
      }
      const result = await response.json();

      onDeleteCallback();
      toast.success(`Record with ID: ${record_id} deleted successfully`);
      modalRef.current?.closeModal();
    } catch (error) {
      console.error(error);
      toast.error("An error occured, please try again");
    } finally {
      setButtonStatus("default");
    }
  }
  return (
    <ConfirmDeleteModal
      ref={modalRef}
      confirmDeleteTitle={"Yes, I'm sure"}
      showWarning={false}
      buttonComponent={
        <Tooltip title="Delete Record">
          <Button
            size={"icon"}
            className="h-6 w-6 mt-1"
            variant={"destructive"}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Tooltip>
      }
      onConfirmDeleteClicked={onDeleteHandler}
      isLoading={buttonStatus === "loading"}
      isCtaDisabled={buttonStatus === "loading"}
    >
      <p className="text-center mb-6 th-font-medium text-muted-foreground">
        This will permanently remove the record with ID {record_id}
      </p>
    </ConfirmDeleteModal>
  );
}
