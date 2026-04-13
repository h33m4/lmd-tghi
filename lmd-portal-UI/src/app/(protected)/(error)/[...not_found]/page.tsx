import Footer from "@/components/footer/Footer";
import NotFoundComponent from "@/components/ui/not-found";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "LMD 2.0 - Not Found",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const NotfoundPage = () => {
  return (
    <div className="h-full">
      {/* <AuthNavbar /> */}
      <NotFoundComponent />

      <Footer />
    </div>
  );
};

export default NotfoundPage;
