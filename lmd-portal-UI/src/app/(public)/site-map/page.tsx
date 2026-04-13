import Footer from "@/components/footer/Footer";
import { metaObject } from "@/config/site.config";
import MDXContent from "@/lib/mdx/mdxContent";
import React from "react";

export const metadata = {
  ...metaObject("Sitemap"),
};

export default function SiteMapPage() {
  return (
    <>
      <MDXContent
        fileName="site-map"
        showHeader={true}
        className="mx-auto px-4 py-10 "
      />
      <Footer />
    </>
  );
}
