"use client";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import React, { useCallback, useRef, useState } from "react";
import { IFAQData } from "./faq-table";
import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import TextInput from "@/components/input/TextInput";
import dynamic from "next/dynamic";
import { IButtonStatus } from "@/types";
import Spinner from "@/components/ui/spinner";

const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[111px] place-content-center">
      <Spinner />
    </div>
  ),
});

interface Props {
  faqData: IFAQData;
  onCloseModal: (data: any) => void;
}

function EditFaqModal({ faqData, onCloseModal }: Props) {
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const baseModalRef = useRef<BaseModalRef>(null);
  const [data, setData] = useState<IFAQData>({ ...faqData });

  const handleInputChange = (field: string, value: string) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const onFormSubmitHandler = () => {
    setButtonStatus("loading");
    onCloseModal(data);

    console.log("dataaaa", data);
    baseModalRef.current?.closeModal();
    setButtonStatus("default");
  };

  const ModalComponent = useCallback(
    () => (
      <div className="px-6 py-4 overflow-auto h-[25rem] space-y-4">
        {/* title */}
        <TextInput
          onInputChange={(val) => handleInputChange("title", val)}
          labelText="Title"
          placeholderText="FAQ title"
          isRequired
          value={data.title}
        />

        {/* quilbox text */}
        <QuillEditor
          labelText="Description"
          isRequired
          className="[&>.ql-container_.ql-editor]:min-h-[100px] h-[14rem] rounded-md"
          labelClassName="font-medium text-gray-900 dark:text-white capitalize"
          value={data.value}
          onChange={(val) => handleInputChange("value", val)}
        />
      </div>
    ),
    [data]
  );
  return (
    <>
      <BaseModal
        ref={baseModalRef}
        title={"Edit FAQ"}
        size={"medium"}
        buttonComponent={
          <Button
            variant={"ghost"}
            className="rounded-full h-[1.6rem] w-[1.6rem]"
            size={"icon"}
          >
            <Pencil1Icon className="h-4 w-4 text-lmh-pink" />
          </Button>
        }
        components={ModalComponent()}
        ctaOnClicked={() => onFormSubmitHandler()}
        isLoading={buttonStatus === "loading"}
        isCtaDisabled={buttonStatus === "disabled"}
        ctaTitle={buttonStatus === "loading" ? "Updating" : "Update"}
      />
    </>
  );
}

export default EditFaqModal;
