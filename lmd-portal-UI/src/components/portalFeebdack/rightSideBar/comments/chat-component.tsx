import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { IMessage } from "./comment-form";
import { formatChatTime, getInitials } from "@/utils/chat-helpers";

export default function ChatComponent({ chat }: { chat: IMessage }) {
  return (
    <div className="border rounded-lg bg-border hover:bg-border/50 p-2 space-y-2 ">
      <div className="inline-flex space-x-2">
        <Avatar className="h-7 w-7">
          <AvatarImage src="" alt="" />
          <AvatarFallback className="text-xs 2xl:text-xs">
            {getInitials(chat.senderName)}
          </AvatarFallback>
        </Avatar>

        <div className="text-xs">
          <p className="">{chat.senderName}</p>
          <span>{formatChatTime(chat.time)}</span>
        </div>
      </div>

      <p className="flex-1 text-sm">{chat.message}</p>
    </div>
  );
}
