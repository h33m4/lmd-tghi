import PDFViewer from "@/components/customPDF/PDFViewer";
import { metaObject } from "@/config/site.config";
import React from "react";

// seo meta data
export const metadata = {
  ...metaObject("Malawi Program | Overview - One Pager"),
};

export default function Page() {
  return (
    <PDFViewer pdfUrl="https://lastmilehealth.org/wp-content/uploads/2024/11/Malawi-one-pager-2024_09.pdf" />
  );
}
