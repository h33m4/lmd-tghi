"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "sonner";

export interface IMessage {
  senderName: string;
  senderImgURL: string;
  senderId: string;
  message: string;
  time: number;
}

interface CommentFormProps {
  onSendMessage: (message: IMessage) => void;
}

export default function CommentForm({ onSendMessage }: CommentFormProps) {
  const session = useSession();
  const user = session.data?.user;

  const [comment, setComment] = useState("");

  function onClear() {
    setComment("");
  }

  function onSendChat(e: React.FormEvent) {
    e.preventDefault();
    if (comment.length < 1) return;

    const newMessage: IMessage = {
      senderName: user?.name || "",
      senderImgURL: user?.image || "",
      senderId: user?.id || "",
      message: comment,
      time: Date.now(),
    };

    // Invoke the callback function with the new message
    onSendMessage(newMessage);

    // Clear the comment after sending the message
    setComment("");

    toast("Message sent successfully", {
      description: newMessage.message,
    });
  }

  return (
    <form
      className=" h-[100px] rounded-sm  flex flex-col justify-between gap-2"
      onSubmit={onSendChat}
    >
      <Textarea
        className="h-[80px]"
        onChange={(e) => setComment(e.target.value)}
        value={comment}
      />
      <div className="space-x-2 flex justify-end">
        <Button
          className=" px-6 h-7 text-destructive hover:text-destructive"
          size={"sm"}
          variant={"ghost"}
          onClick={onClear}
          type={"reset"}
        >
          Cancel
        </Button>
        <Button className=" px-6 h-7 rounded-sm" size={"sm"} type={"submit"}>
          Send
        </Button>
      </div>
    </form>
  );
}
