import { metaObject } from "@/config/site.config";
import React from "react";
import { UserGuides } from "./user-guides";

export const metadata = {
  ...metaObject("Docs | User Guides"),
};

export default function UserGuidesPage() {
  return (
    <article className="w-full max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Guides</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">
          User Guides
        </h1>
        <p className="text-muted-foreground">
          Step-by-step walkthroughs to help you get the most out of LMD 2.0.
        </p>
      </div>

      <UserGuides />
    </article>
  );
}
