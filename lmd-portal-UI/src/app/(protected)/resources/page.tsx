import Footer from "@/components/footer/Footer";
import React from "react";
import { metaObject } from "@/config/site.config";
import Resources from "./_components/ResourceCard";

export const metadata = {
  ...metaObject("Resources"),
};

const ResourcesPage = () => {
  return (
    <>
      <Resources />
      <Footer />
    </>
  );
};

export default ResourcesPage;
