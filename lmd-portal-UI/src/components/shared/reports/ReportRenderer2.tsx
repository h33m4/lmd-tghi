"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Maximize2, Minimize2 } from "lucide-react";

import DefaultDashboard from "../NoEmbeddedDashboard";
import Spinner from "@/components/ui/spinner";
import { Report } from "@/types/report";

// Dynamically import ReactGoogleSlides with no SSR
const ReactGoogleSlides = dynamic(() => import("react-google-slides"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full">
      <Spinner className="" />
    </div>
  ),
});

type DocumentType = "Presentation" | "Document" | "Spreadsheets" | undefined;

type Props = {
  report: Report;
};

export default function ReportRenderer({ report }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!report?.report_url) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <DefaultDashboard
          title="No Report Found"
          message="Please refine your search or consider contacting support"
        />
      </div>
    );
  }

  // Detect Google Drive document type from URL
  const getDocumentType = (url: string): DocumentType => {
    if (url.includes("presentation")) return "Presentation";
    if (url.includes("document")) return "Document";
    if (url.includes("spreadsheets")) return "Spreadsheets";
    return undefined;
  };

  const documentType = getDocumentType(report.report_url);

  const FullscreenButton = () => (
    <>
      {isFullscreen && (
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/60 backdrop-blur-sm">
          <span className="text-xs font-bold text-white tracking-wide">LMD</span>
          <span className="text-[10px] font-semibold text-primary bg-white/15 px-1 py-0.5 rounded">2.0</span>
        </div>
      )}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-sm transition-colors"
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        {isFullscreen ? "Exit" : "Fullscreen"}
      </button>
    </>
  );

  // Render based on document type
  switch (documentType) {
    case "Presentation":
      return (
        <div ref={containerRef} className="relative w-full h-full">
          <ReactGoogleSlides
            width="100%"
            height="100%"
            className="rounded-md"
            slidesLink={report.report_url}
            autoPlay={false}
            position={1}
            showControls
            loop
            allowFullScreen
          />
          <FullscreenButton />
        </div>
      );

    case "Document":
      return (
        <div ref={containerRef} className="relative w-full h-full">
          <iframe
            src={report.report_url}
            width="100%"
            height="100%"
            className="rounded-md"
            suppressContentEditableWarning
            loading="lazy"
            title={report.title}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
          <FullscreenButton />
        </div>
      );

    case "Spreadsheets":
      return (
        <div ref={containerRef} className="relative w-full h-full">
          <iframe
            src={report.report_url}
            width="100%"
            height="100%"
            className="rounded-md"
            suppressContentEditableWarning
            loading="lazy"
            title={report.title}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
          <FullscreenButton />
        </div>
      );

    default:
      return (
        <div ref={containerRef} className="relative w-full h-full">
          <iframe
            src={report.report_url}
            width="100%"
            height="100%"
            className="rounded-md"
            suppressContentEditableWarning
            loading="eager"
            title={report.title}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
          <FullscreenButton />
        </div>
      );
  }
}
