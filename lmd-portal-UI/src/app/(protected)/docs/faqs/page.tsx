import { metaObject } from "@/config/site.config";
import React from "react";
import FAQsTable from "./faqs_table";

export const metadata = {
  ...metaObject("Frequently Asked Questions"),
};

export default function FAQsPage() {
  return (
    <article className="w-full max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Support</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground">
          Can&apos;t find an answer? Please open a support ticket for additional questions.
        </p>
        <p className="text-xs text-muted-foreground mt-2">Last Updated: December 31, 2024</p>
      </div>

      <FAQsTable />
    </article>
  );
}
