import UploadProgramDataModal from "@/components/modals/uploadProgramModal/UploadProgramDataModal";
import TopNavBar from "@/components/shared/TopNavBar";
import SelectProgramCombobox from "@/components/shared/programData/SelectProgramCombobox";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function EthiopiaProgramDataPagelayout({ children }: Props) {
  return (
    <>
      <TopNavBar country="Ethiopia" pageName="Program Data">
        <UploadProgramDataModal country="Ethiopia" />
      </TopNavBar>

      <SelectProgramCombobox
        className="z-20"
        country="ethiopia"
        label="Select Project"
      />
      <div className=" mt-3   border-green-400 w-full h-full relative">
        {children}
      </div>
    </>
  );
}
