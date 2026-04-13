import { metaObject } from "@/config/site.config";
import MDXContent from "@/lib/mdx/mdxContent";
import React from "react";

export const metadata = {
  ...metaObject("Documentation"),
};

export default function DocsHomePage() {
  return (
    <div className="w-full max-w-3xl">
      <MDXContent fileName="lmd" showHeader={true} className="" />
    </div>
  );
}
