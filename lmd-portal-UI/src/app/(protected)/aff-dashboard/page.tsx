import Footer from "@/components/footer/Footer";
import DefaultDashboard from "@/components/shared/NoEmbeddedDashboard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "LMD 2.0 - AFF Dashboard",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const AffDashboardPage = () => {
  return (
    <>
      {/* <div className="my-20">
        <h1 className="text-center">Welcome to AFF Dashboard Page</h1>
      </div> */}

      <div className="h-[28rem]">
        <DefaultDashboard
          title="Coming soon!"
          message="Feature will be released soon - stay tuned 🚀"
        />
      </div>
      <Footer />
    </>
  );
};

export default AffDashboardPage;
