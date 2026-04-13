import UploadProgramDataModal from "@/components/modals/uploadProgramModal/UploadProgramDataModal";
import TopNavBar from "@/components/shared/TopNavBar";
import SelectProgramCombobox from "@/components/shared/programData/SelectProgramCombobox";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function MalawiProgramDataPagelayout({ children }: Props) {
  return (
    <>
      <TopNavBar country="Malawi" pageName="Program Data">
        <UploadProgramDataModal country={"Malawi"} />
      </TopNavBar>

      <SelectProgramCombobox
        className="z-20"
        country="malawi"
        label="Select Project"
      />
      <div className=" mt-3   border-green-400 w-full h-full relative">
        {children}
      </div>
    </>
  );
}
