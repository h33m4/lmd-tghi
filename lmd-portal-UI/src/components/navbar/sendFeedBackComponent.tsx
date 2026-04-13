"use client";
import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import { useRightSidebar } from "@/context/rightSideBarContext";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import OpenFeedbackModal from "../portalFeebdack/feedBackModal/OpenFeedbackModal";
import { BaseModalRef } from "../modals/BaseModal";

export const SendFeedBackComponent = () => {
  const OpenFeedbackModalmodalRef = useRef<BaseModalRef>(null);
  const pathname = usePathname();
  const isKpiPath = pathname.includes("/kpi-dashboard");
  const isCountryPagePath =
    /\/country-programs\/(malawi|liberia|ethiopia|sierra_leone)/.test(pathname);

  const { openFeedback, openComments, isRightSidebarOpen, closeSidebar } =
    useRightSidebar();

  const handleOpenModal = () => {
    OpenFeedbackModalmodalRef.current?.openModal();
  };

  return (
    <>
      <DropdownMenuItem className="w-full" asChild>
        {isKpiPath || isCountryPagePath ? (
          <button
            className="px-2 text-sm w-full"
            onClick={isRightSidebarOpen ? closeSidebar : openFeedback}
          >
            Send Feedback
          </button>
        ) : (
          <button onClick={handleOpenModal}>Send Feedback Non db</button>
        )}
      </DropdownMenuItem>

      <OpenFeedbackModal modalRef={OpenFeedbackModalmodalRef} />
    </>
  );
};
