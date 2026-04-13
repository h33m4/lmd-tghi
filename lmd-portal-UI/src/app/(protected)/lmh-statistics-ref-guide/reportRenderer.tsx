"use client";
import React from "react";

export default function ReportRenderer() {
  const reportUrl =
    "https://docs.google.com/spreadsheets/d/1kfkrymo1xrhouVb6gmpKE8v7QlkF1Bhp4EJffwim148/edit?usp=sharing";
  return (
    <div className="border rounded-md h-full">
      <iframe
        src={`${reportUrl}`}
        width="100%"
        height="100%"
        className="rounded-md"
        suppressContentEditableWarning
        loading={"lazy"}
      />
    </div>
  );
}
