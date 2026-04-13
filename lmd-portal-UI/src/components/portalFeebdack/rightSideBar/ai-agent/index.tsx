"use client";
import { Button } from "@/components/ui/button";
import { useRightSidebar } from "@/context/rightSideBarContext";
import { BrainIcon, X, Zap } from "lucide-react";
import React from "react";
import AiAgentChatForm from "./chat-form";

export default function AiAgent() {
  const { closeSidebar, content } = useRightSidebar();
  return (
    <>
      {/* header */}
      <div className=" flex justify-between items-center border-b pb-1 pr-2">
        <div className="flex flex-row items-center  gap-2 ml-2">
          <BrainIcon className="h-5 w-5 text-lmh-dark-blue dark:text-white" />
          <h1 className="text-md th-font-medium mt-1 text-lmh-dark-blue dark:text-white">
            {" "}
            LMD AI Agent
          </h1>
        </div>
        <Button
          onClick={closeSidebar}
          className="rounded-full"
          variant={"ghost"}
          size={"icon"}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <AiAgentChatForm />
    </>
  );
}
