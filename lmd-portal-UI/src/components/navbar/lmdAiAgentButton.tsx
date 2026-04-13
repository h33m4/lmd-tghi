"use client";
import React, { useRef } from "react";
import { Zap, Brain } from "lucide-react";
import { TourWrapper } from "@/context/tourContext";
import { Tooltip } from "antd";
import { BaseModalRef } from "../modals/BaseModal";
import { useRightSidebar } from "@/context/rightSideBarContext";

type Props = {
  tourRef?: string;
};

function LmdAiAgentButton({ tourRef }: Props) {
  const OpenAiAgentModalRef = useRef<BaseModalRef>(null);
  const { openAiAgent, isRightSidebarOpen, closeSidebar } = useRightSidebar();

  return (
    <div className="mt-[0.2rem] 2xl:mt-0">
      <TourWrapper tourRef={tourRef}>
        <Tooltip
          title={isRightSidebarOpen ? "Close AI Chat" : "Open AI Chat"}
          placement={"bottom"}
        >
          <button
            className="rounded-full h-7 w-7 flex items-center justify-center bg-transparent hover:bg-gray-100 transition-colors duration-200 group"
            aria-label="Open AI Chat"
            onClick={isRightSidebarOpen ? closeSidebar : openAiAgent}
          >
            <Brain className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 group-hover:rotate-180 hover:text-lmh-blue hover:fill-lmh-bluef" />
          </button>
        </Tooltip>
      </TourWrapper>
    </div>
  );
}

export default LmdAiAgentButton;
