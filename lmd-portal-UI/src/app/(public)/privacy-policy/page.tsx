import React from "react";
import Footer from "@/components/footer/Footer";
import { metaObject } from "@/config/site.config";
import MDXContent from "@/lib/mdx/mdxContent";

export const metadata = {
  ...metaObject("Privacy Policy"),
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <MDXContent
        fileName="privacy-policy"
        showHeader={true}
        // className="max-w-5xl mx-auto px-4 py-10"
      />
      <Footer />
    </>
  );
}
