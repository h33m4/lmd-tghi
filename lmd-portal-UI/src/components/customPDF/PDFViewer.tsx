"use client";
import React from "react";

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  return (
    <div className="border h-full">
      <iframe
        src={pdfUrl}
        // type="application/pdf"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  );
}
