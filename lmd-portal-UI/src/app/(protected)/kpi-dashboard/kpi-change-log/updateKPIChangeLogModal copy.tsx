import { CustomCellRendererProps } from "ag-grid-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IKPIChangeLog } from "./data";
import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { IButtonStatus } from "@/types";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/input/TextInput";
import TextBoxInput from "@/components/input/TextBoxInput";
import { isEqual } from "lodash";
import { ApiSimulator } from "@/utils/helper_functions";
import { toast } from "sonner";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface UpdateKPIChangeLogModalProps {
  props: CustomCellRendererProps<IKPIChangeLog>;
}

const UpdateKPIChangeLogModal: React.FC<UpdateKPIChangeLogModalProps> = ({
  props,
}) => {
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const baseModalRef = useRef<BaseModalRef>(null);
  const [formError, setFormError] = useState<string>();

  const initialData = useMemo(
    () => ({
      id: props.data?.id as number,
      country: props.data?.country || "",
      tocpillar: props.data?.tocpillar || "",
      kpi: props.data?.kpi || "",
      typeofchangemade: props.data?.typeofchangemade || "",
      additionaldetails: props.data?.additionaldetails || "",
      oldvalue: props.data?.oldvalue || "",
      newvalue: props.data?.newvalue || "",
      dateinserted: props.data?.dateinserted || "",
      supportingdocumentlink: props.data?.supportingdocumentlink || "",
      reasonforchange: props.data?.reasonforchange || "",
    }),
    [props.data]
  );

  const [originalKpiChangeLogData, setOriginalKpiChangeLogData] =
    useState<IKPIChangeLog>({ ...initialData });
  const [newKpiChangeLogData, setNewKpiChangeLogData] = useState<IKPIChangeLog>(
    { ...initialData }
  );

  useEffect(() => {
    setOriginalKpiChangeLogData({ ...initialData });
    setNewKpiChangeLogData({ ...initialData });
  }, [initialData]);

  const handleFormDataChange = useCallback(
    (fieldName: keyof IKPIChangeLog, value: string) => {
      setNewKpiChangeLogData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    },
    []
  );

  const onSubmitForm = useCallback(() => {
    if (isEqual(newKpiChangeLogData, originalKpiChangeLogData)) return;
    setButtonStatus("loading");
    setFormError(undefined);

    ApiSimulator(true, 1000)
      .then(() => {
        toast.success("Success", {
          description: "KPI Changelog updated successfully",
        });
        props.node.updateData(newKpiChangeLogData);
        baseModalRef.current?.closeModal();
        setOriginalKpiChangeLogData({ ...newKpiChangeLogData });
      })
      .catch((error) => {
        setFormError("An error occurred. Please try again.");
      })
      .finally(() => {
        setButtonStatus("default");
      });
  }, [newKpiChangeLogData, originalKpiChangeLogData, props.node]);

  const ModalComponent = useCallback(
    () => (
      <div className="px-6 py-4 overflow-auto h-[70vh]">
        <div className="space-y-5">
          <div className="grid grid-cols-3 space-x-5">
            <TextInput
              onInputChange={(val) => handleFormDataChange("country", val)}
              labelText="Country"
              isRequired
              placeholderText={originalKpiChangeLogData.country}
              value={newKpiChangeLogData.country}
            />
            <div className="col-span-2">
              <TextInput
                onInputChange={(value) =>
                  handleFormDataChange("tocpillar", value)
                }
                labelText="Theory of Change (TOC) Pillar"
                isRequired
                placeholderText={originalKpiChangeLogData["tocpillar"]}
                value={newKpiChangeLogData["tocpillar"]}
              />
            </div>
          </div>
          <TextBoxInput
            labelText="KPI"
            onInputChange={(value) => handleFormDataChange("kpi", value)}
            value={newKpiChangeLogData.kpi}
            isRequired
          />
          <div className="grid grid-cols-3 space-x-5">
            <TextInput
              onInputChange={(value) =>
                handleFormDataChange("typeofchangemade", value)
              }
              labelText="Type of Change Made"
              isRequired
              placeholderText={originalKpiChangeLogData.typeofchangemade}
              value={newKpiChangeLogData.typeofchangemade}
            />
            <div className="col-span-2">
              <TextInput
                onInputChange={(value) =>
                  handleFormDataChange("additionaldetails", value)
                }
                labelText="Additional Detail on Change Made (e.g., timeframe or specific changes made)"
                placeholderText={originalKpiChangeLogData.additionaldetails}
                value={newKpiChangeLogData.additionaldetails}
              />
            </div>
          </div>
          <div className="flex gap-5">
            <TextInput
              onInputChange={(value) => handleFormDataChange("oldvalue", value)}
              labelText="Old Value"
              isRequired
              placeholderText={originalKpiChangeLogData.oldvalue}
              value={newKpiChangeLogData.oldvalue}
            />
            <TextInput
              onInputChange={(value) => handleFormDataChange("newvalue", value)}
              labelText="New Value"
              isRequired
              placeholderText={originalKpiChangeLogData.newvalue}
              value={newKpiChangeLogData.newvalue}
            />
          </div>
          <TextBoxInput
            onInputChange={(value) =>
              handleFormDataChange("reasonforchange", value)
            }
            labelText="Comments / Reason for Change"
            value={newKpiChangeLogData["reasonforchange"]}
            isRequired
          />
          <TextBoxInput
            labelText="Any Supporting Document for Change (link)"
            onInputChange={(value) =>
              handleFormDataChange("supportingdocumentlink", value)
            }
            placeholderText="Please enter any supporting document link"
            textBoxClassName="h-[40px]"
            value={newKpiChangeLogData["supportingdocumentlink"]}
          />
        </div>
      </div>
    ),
    [originalKpiChangeLogData, newKpiChangeLogData, handleFormDataChange]
  );

  return (
    <BaseModal
      ref={baseModalRef}
      title={"Update KPI Change Log"}
      size={"medium"}
      buttonComponent={
        <Button className="h-6 px-4" size={"sm"} variant={"pink"}>
          Edit
          <PencilSquareIcon className="ml-2 h-4 w-4" />
        </Button>
      }
      components={ModalComponent()}
      ctaTitle={buttonStatus === "loading" ? "Updating..." : "Update"}
      leftButtonComponent={
        <div className="flex flex-col ">
          <p className="text-sm text-th-text-disabled">
            Last updated on:
            <span className="ml-1.5 th-font-medium">
              {newKpiChangeLogData["dateupdated"]}
            </span>
          </p>
          <p className="text-sm -mt-1 text-th-text-disabled">
            Last updated by:
            <span className="ml-1.5 th-font-medium">{"Gideon Agbeshie"}</span>
          </p>
        </div>
      }
      isCtaDisabled={isEqual(originalKpiChangeLogData, newKpiChangeLogData)}
      isLoading={buttonStatus === "loading"}
      ctaOnClicked={onSubmitForm}
    />
  );
};

export default UpdateKPIChangeLogModal;
