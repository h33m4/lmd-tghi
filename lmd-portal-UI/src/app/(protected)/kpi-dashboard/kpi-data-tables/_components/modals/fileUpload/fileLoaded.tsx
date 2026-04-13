"use client";
import React, { useState } from "react";
import { PaperClipIcon, TrashIcon } from "@heroicons/react/24/outline";

interface DragDropFileUploadProps {
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

export default function DragDropFileUpload({
  onFileChange,
  disabled = false,
  accept = ".csv",
  maxSizeMB = 50,
}: DragDropFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (file: File | null) => {
    setError("");

    if (!file) {
      setSelectedFile(null);
      onFileChange(null);
      return;
    }

    // Validate file type
    const acceptedExtensions = accept.split(",").map((ext) => ext.trim());
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!acceptedExtensions.includes(fileExtension)) {
      const msg = `Only ${accept} files are allowed`;
      setError(msg);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const msg = `File size must not exceed ${maxSizeMB} MB`;
      setError(msg);
      return;
    }

    setSelectedFile(file);
    onFileChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileChange(null);
  };

  return (
    <div className="space-y-3 h-fit">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border border-dashed rounded-lg p-8 transition-all duration-200 ${
          disabled
            ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
            : isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 cursor-pointer"
        }`}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="text-center pointer-events-none">
          <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            {isDragging
              ? "Drop file here"
              : disabled
              ? "Upload disabled"
              : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-gray-500">
            {accept.toUpperCase().replace(/\./g, "")} files only (max{" "}
            {maxSizeMB}MB)
          </p>
        </div>
      </div>

      {/* Selected File Display */}
      {/* {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="flex items-center gap-2 text-sm text-gray-700">
            <PaperClipIcon className="h-4 w-4 text-gray-600" />
            <span className="font-medium">{selectedFile.name}</span>
            <span className="text-gray-500">
              ({(selectedFile.size / 1024).toFixed(2)} KB)
            </span>
          </span>
          <button
            onClick={handleRemoveFile}
            disabled={disabled}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className="h-4 w-4 text-gray-600 hover:text-red-600" />
          </button>
        </div>
      )} */}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <svg
            className="w-4 h-4 text-red-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
