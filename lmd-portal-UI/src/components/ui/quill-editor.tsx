import { cn } from "@/lib/utils";
import * as React from "react";
import ReactQuill, { type ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuillEditorProps extends ReactQuillProps {
  error?: string;
  label?: React.ReactNode;
  labelText?: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  toolbarPosition?: "top" | "bottom";
  isRequired?: boolean;
  disabled?: boolean;
}

export default function QuillEditor({
  id,
  label,
  error,
  className,
  labelClassName,
  errorClassName,
  toolbarPosition = "top",
  labelText,
  isRequired,
  disabled,
  ...props
}: QuillEditorProps) {
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
      ["link"],

      ["clean"],
    ],
  };

  return (
    <div className={cn("")}>
      <label
        className={`text-dark-grey text-sm md:text-sm th-font-roman ${
          disabled && "text-th-text-disabled"
        }`}
      >
        {labelText}
        {isRequired ? (
          <span
            className={`ml-1 text-red-600 th-font-heavy ${
              disabled && "text-th-text-disabled"
            }`}
          >
            *
          </span>
        ) : (
          ""
        )}
      </label>
      <ReactQuill
        modules={quillModules}
        // formats={quillFormats}
        className={cn(
          "react-quill",
          toolbarPosition === "bottom" && "react-quill-toolbar-bottom relative",
          className
        )}
        {...props}
      />
    </div>
  );
}
