"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { usePathname } from "next/navigation";
import CommentForm, { IMessage } from "./comment-form";
import ChatComponent from "./chat-component";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useRightSidebar } from "@/context/rightSideBarContext";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CommentSidebar() {
  const { closeSidebar, content } = useRightSidebar();
  const pathname = usePathname();
  const [chats, setChats] = useState<IMessage[]>([]);
  const endOfChatsRef = useRef<HTMLDivElement>(null);

  function handleSendMessage(msg: IMessage) {
    setChats((prevChats) => [...prevChats, msg]);
  }

  useEffect(() => {
    if (endOfChatsRef.current) {
      endOfChatsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  return (
    <>
      {/* header */}
      <div className=" flex justify-between items-center border-b pb-1">
        <div className="flex flex-row items-center gap-1.5 ml-2">
          <h1 className="text-lg th-font-medium">
            {content &&
              content?.toString()[0].toUpperCase() +
                content?.toString().slice(1)}
          </h1>
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

      {/* main contents */}
      <div className="flex-1 my-2 overflow-auto space-y-3 mb-6">
        {chats.map((chat, index) => (
          <ChatComponent key={index} chat={chat} />
        ))}

        {chats.length === 0 && (
          <div className="h-[90%] w-full flex flex-col justify-center items-center">
            <ChatBubbleLeftRightIcon className="h-10 w-10 text-muted-foreground" />
            <span className="text-muted-foreground">No chats found</span>
          </div>
        )}

        {/* Add a div to act as the end of the chat list */}
        <div ref={endOfChatsRef} />
      </div>

      <CommentForm onSendMessage={handleSendMessage} />
    </>
  );
}
