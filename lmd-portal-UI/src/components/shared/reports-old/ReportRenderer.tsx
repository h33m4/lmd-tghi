"use client";
import React from "react";
import dynamic from "next/dynamic";

import DefaultDashboard from "../NoEmbeddedDashboard";
import Spinner from "@/components/ui/spinner";
import { IReportData } from "./ReportCard";

// Dynamically import ReactGoogleSlides with no SSR
const ReactGoogleSlides = dynamic(() => import("react-google-slides"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full">
      {/* <DefaultDashboard
        title="Loading Presentation"
        message="Please wait while we load your presentation..."
      /> */}
      <Spinner className="" />
    </div>
  ),
});

type Props = {
  report: IReportData;
};

export default function ReportRenderer({ report }: Props) {
  if (!report?.url) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <DefaultDashboard
          title="No Report Found"
          message="Please refine your search or consider contacting report"
        />
      </div>
    );
  }

  // Detect document type from URL if not explicitly provided
  const getDocumentType = (url: string): IReportData["type"] => {
    if (url.includes("presentation")) return "Presentation";
    if (url.includes("document")) return "Document";
    if (url.includes("spreadsheets")) return "Spreadsheets";
    return undefined;
  };

  // Use explicit type if provided, otherwise detect from URL
  const documentType = report.type || getDocumentType(report.url);

  // Render based on document type
  switch (documentType) {
    case "Presentation":
      return (
        <div className="w-full h-full">
          <ReactGoogleSlides
            width="100%"
            height="100%"
            className="rounded-md"
            slidesLink={report.url}
            autoPlay={false}
            slideDuration={5}
            position={1}
            showControls
            loop
            allowFullScreen
          />
        </div>
      );

    case "Document":
      return (
        <iframe
          src={report.url}
          width="100%"
          height="100%"
          className="rounded-md"
          suppressContentEditableWarning
          loading="lazy"
          title={report.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      );

    case "Spreadsheets":
      return (
        <iframe
          src={report.url}
          width="100%"
          height="100%"
          className="rounded-md"
          suppressContentEditableWarning
          loading="lazy"
          title={report.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      );

    // Default case - if type couldn't be detected or doesn't match above cases
    default:
      return (
        <iframe
          src={report.url}
          width="100%"
          height="100%"
          className="rounded-md"
          suppressContentEditableWarning
          loading="eager"
          title={report.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      );
  }
}
