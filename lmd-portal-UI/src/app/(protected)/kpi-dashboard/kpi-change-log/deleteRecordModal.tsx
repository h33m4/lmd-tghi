import BaseModal2 from "@/components/modals/BaseModal2";
import ConfirmDeleteModal, {
  ConfirmDeleteModalRef,
} from "@/components/modals/ConfirmDeleteModal";
import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { IButtonStatus } from "@/types";
import { toast } from "sonner";
import { CustomCellRendererProps } from "ag-grid-react";
import { IKPIChangeLog } from "./data";
import { Trash2 } from "lucide-react";

interface Props {
  props: CustomCellRendererProps<IKPIChangeLog>;
  // onAddRecordCallback: () => void;
}

export default function DeleteRecordModal({ props }: Props) {
  const modalRef = useRef<ConfirmDeleteModalRef>(null);
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const [formError, setFormError] = useState<string>();

  async function onDeleteHandler() {
    setButtonStatus("loading");
    const promiseResult = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LMD_API}/kpi_data/changelogs/${props.data?.id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        // use the props to remove the record from the table table
        props.api.applyTransaction({
          remove: [props.node.data!],
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });

    //
    toast.promise(promiseResult, {
      loading: `Deleting KPI record with id ${props.data?.id}`,
      success: () => {
        return `Record with ID ${props.data?.id} deleted successfully`;
      },
      error: (error) => {
        setFormError(
          error instanceof Error ? error.message : "An error occurred"
        );
        return error instanceof Error
          ? error.message
          : `Failed to delete record with ID ${props.data?.id}, Please try again`;
      },
    });

    try {
      await promiseResult;
    } catch (error) {
      console.error("Error deleting record:", error);
    } finally {
      setButtonStatus("default");
    }
  }

  return (
    <ConfirmDeleteModal
      buttonComponent={
        <Button size={"icon"} className="h-6 w-6 mt-1" variant={"destructive"}>
          <Trash2 className="h-4 w-4" />
        </Button>
      }
      onConfirmDeleteClicked={onDeleteHandler}
      isLoading={buttonStatus === "loading"}
      isCtaDisabled={buttonStatus === "loading"}
    >
      <p className="text-center mb-6 th-font-medium text-muted-foreground">
        This will permanently remove the record with ID {props.data?.id}
      </p>
    </ConfirmDeleteModal>
  );
}
