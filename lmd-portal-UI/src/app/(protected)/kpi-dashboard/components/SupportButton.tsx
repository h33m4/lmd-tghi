"use client";
import React, { useState } from "react";
import { FloatButton } from "antd";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useRightSidebar } from "@/context/rightSideBarContext";

export default function SupportButton() {
  const { openFeedback, openComments, isRightSidebarOpen } = useRightSidebar();
  return (
    <>
      {isRightSidebarOpen ? (
        <></>
      ) : (
        <>
          {/* <FloatButton.Group
           trigger="hover"
           type="primary"
           style={{ right: 24, bottom: 25 }}
           icon={<InformationCircleIcon />}
         >
           <FloatButton
             icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
             tooltip={"Comments"}
             onClick={openComments}
           />
           <FloatButton
             icon={<QuestionMarkCircledIcon className="h-5 w-5" />}
             tooltip={"Feedback"}
             onClick={openFeedback}
           />
         </FloatButton.Group> */}

          <FloatButton
            type="primary"
            style={{ right: 25, bottom: 20, height: 34, width: 34 }}
            icon={<QuestionMarkCircledIcon className="h-5 w-5" />}
            tooltip={"Feedback"}
            onClick={openFeedback}
          />
        </>
      )}
    </>
  );
}
