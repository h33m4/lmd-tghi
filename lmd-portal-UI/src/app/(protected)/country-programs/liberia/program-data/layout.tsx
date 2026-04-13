import UploadProgramDataModal from "@/components/modals/uploadProgramModal/UploadProgramDataModal";
import TopNavBar from "@/components/shared/TopNavBar";
import React from "react";
import SelectProgramCombobox from "@/components/shared/programData/SelectProgramCombobox";

interface Props {
  children: React.ReactNode;
}

export default function LiberiaProgramDataPagelayout({ children }: Props) {
  return (
    <>
      <TopNavBar country="Liberia" pageName="Program Data">
        <UploadProgramDataModal country={"Liberia"} />
      </TopNavBar>

      <SelectProgramCombobox
        className="z-20"
        country="liberia"
        label="Select Project"
      />

      <div className=" mt-3   border-green-400 w-full h-full relative">
        {children}
      </div>
    </>
  );
}
