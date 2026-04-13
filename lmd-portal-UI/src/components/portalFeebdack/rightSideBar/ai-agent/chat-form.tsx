"use client";
import React, { useState, useRef, useEffect } from "react";
import { Brain, X, Send, Loader2, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import MarkdownRenderer from "./markdownRenderer3";
import { useRightSidebar } from "@/context/rightSideBarContext";
import { AutoResizeTextarea } from "./autoResizeTextArea";

type Message = {
  role: "user" | "assistant";
  content: string;
};

// Simple markdown renderer component

export default function AiAgentChatForm() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();
  const { pageContext, capturePageContext } = useRightSidebar();

  // console.log(session.data?.user.id);

  const user_id = session.data?.user.id || "default_user_id";

  // Mock closeSidebar function for demo
  const closeSidebar = () => console.log("Close sidebar");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Capture page context when component mounts
  useEffect(() => {
    if (!pageContext) {
      capturePageContext();
    }
  }, [capturePageContext, pageContext]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // always capture fresh page context before sending
      capturePageContext();

      // console.log("context --->", pageContext);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LMD_AI_AGENT_BASE_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage.content,
            user_id: user_id,
            page_context: pageContext,
            database: "",
          }),
        }
      );

      // console.log("response", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // console.log("data", data);

      const aiMessage: Message = {
        role: "assistant",
        content: data || data || "Sorry, I couldn't process that request.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling AI API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Let form handle the submit
      (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
    }
  };

  const handleRefreshContext = () => {
    capturePageContext();
  };

  return (
    <>
      {/* Page Context Info */}
      {/* {pageContext && (
        <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium truncate">
                {pageContext.pageName}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                {pageContext.title}
              </p>
            </div>
            <button
              onClick={handleRefreshContext}
              className="ml-2 p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              title="Refresh page context"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        </div>
      )} */}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 h-full mr-[1px]">
        {messages.length === 0 && (
          <div className="text-center text-gray-500  h-[60vh] flex flex-col items-center justify-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Welcome to LMD AI Agent</p>
            <p className="text-sm">Ask me anything to get started!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[95%] rounded-lg px-3 py-1.5 ${
                message.role === "user"
                  ? "bg-lmh-blue text-white"
                  : "bg-gray-200/50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
              }`}
            >
              {message.role === "assistant" ? (
                <MarkdownRenderer content={message.content} />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 flex items-center gap-2 border border-gray-200 dark:border-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI is thinking...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="border-t px-3  pt-3 py-2 flex gap-2  flex-col"
      >
        <div className="flex gap-2">
          <AutoResizeTextarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your prompt here..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-lmh-blue hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center w-full">
          Please remember AI agents can make mistakes, always double-check
          responses for accuracy.
        </p>
      </form>
    </>
  );
}
