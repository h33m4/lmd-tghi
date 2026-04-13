import UploadProgramDataModal from "@/components/modals/uploadProgramModal/UploadProgramDataModal";
import TopNavBar from "@/components/shared/TopNavBar";
import SelectProgramCombobox from "@/components/shared/programData/SelectProgramCombobox";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function SierraLeoneProgramDataPagelayout({ children }: Props) {
  return (
    <>
      <TopNavBar country="Sierra Leone" pageName="Program Data">
        <UploadProgramDataModal country="Sierra_Leone" />
      </TopNavBar>

      <SelectProgramCombobox
        className="z-20"
        country="sierra_leone"
        label="Select Project"
      />
      <div className=" mt-3   border-green-400 w-full h-full relative">
        {children}
      </div>
    </>
  );
}
