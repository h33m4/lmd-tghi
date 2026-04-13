"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import FeedbackIcon from "@public/assets/icons/feedback.svg";
import {
  FlagIcon,
  LightBulbIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRightSidebar } from "@/context/rightSideBarContext";
import IdeaForm from "./idea-form";
import Issueform from "./issue-form";

export default function FeedbackSidebar() {
  const { closeSidebar, content } = useRightSidebar();
  const [view, setView] = useState<"home" | "issue" | "idea">("home");
  return (
    <>
      {view === "home" && (
        <>
          {/* header */}
          <div className=" flex justify-between items-center border-b pb-1 pr-2">
            <div className="flex flex-row items-center gap-1.5 ml-2">
              <h1 className="text-lg th-font-medium">Send Feedback</h1>
            </div>
            <Button
              onClick={closeSidebar}
              className="rounded-full"
              variant={"ghost"}
              size={"icon"}
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* contents */}
          <div className=" h-full flex flex-col items-center justify-center gap-[5vh] pr-2">
            <FeedbackIcon className="h-[12rem] -mt-[5rem]  w-full" />

            <div className="flex flex-col gap-4 w-full">
              <Button
                className="  w-full flex items-center"
                variant={"ghost"}
                onClick={() => setView("issue")}
              >
                <FlagIcon className="h-5 w-5 mr-2" />
                Report an issue
              </Button>

              <Button
                className=" w-full flex items-center"
                variant={"ghost"}
                onClick={() => setView("idea")}
              >
                <LightBulbIcon className="h-5 w-5 mr-2" />
                Suggest an idea
              </Button>
            </div>
          </div>
        </>
      )}

      {view === "idea" && <IdeaForm setView={setView} />}
      {view === "issue" && <Issueform setView={setView} />}
    </>
  );
}
