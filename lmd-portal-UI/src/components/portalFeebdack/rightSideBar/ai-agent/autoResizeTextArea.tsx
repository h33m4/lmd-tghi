import React, { useRef, useEffect } from "react";

type AutoResizeTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  };

export function AutoResizeTextarea({
  value,
  onChange,
  ...props
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      className="flex-1 resize-none rounded-lg border border-gray-300 px-3 pt-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      style={{ minHeight: "40px", maxHeight: "200px", overflowY: "auto" }}
      {...props}
    />
  );
}
