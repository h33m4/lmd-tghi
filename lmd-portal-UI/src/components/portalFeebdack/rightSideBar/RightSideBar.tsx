"use client";
import { useRightSidebar } from "@/context/rightSideBarContext";
import { cn } from "@/lib/utils";
import React from "react";
import CommentSidebar from "./comments/CommentSidebar";
import FeedbackSidebar from "./feedback/FeedbackSidebar";
import AiAgent from "./ai-agent";

type Props = {};

function RightSidebar() {
  const { isRightSidebarOpen, content } = useRightSidebar();
  return (
    <aside
      className={cn(
        "h-[calc(100vh-80px)] 2xl:h-[calc(100vh-90px)]  p-2 transition-all duration-300 ease-in-out",
        isRightSidebarOpen ? "min-w-[360px] w-[24vw] 2xl:w-[20vw]" : "hidden"
      )}
    >
      <div
        className={cn(
          "w-full border rounded-2xl h-[calc(100vh-95px)] 2xl:h-[calc(100vh-106px)] bg-[#f0f4f8] dark:bg-background py-2 pl-2",
          isRightSidebarOpen ? "block" : "hidden"
        )}
      >
        <div className=" h-full w-full flex flex-col justify-between">
          {/* contents here */}
          {content === "comments" && <CommentSidebar />}
          {content === "feedback" && <FeedbackSidebar />}
          {content === "ai-agent" && <AiAgent />}
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
