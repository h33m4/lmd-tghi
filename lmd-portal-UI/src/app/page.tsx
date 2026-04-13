import Footer from "@/components/footer/Footer";
import CTASection from "@/components/landingPageComponents/CTASection";
import CTASection2 from "@/components/landingPageComponents/CTASection2";
import Features from "@/components/landingPageComponents/Features";
import Features2 from "@/components/landingPageComponents/Features2";
import Hero from "@/components/landingPageComponents/Hero";
import Hero2 from "@/components/landingPageComponents/Hero2";
import NonAuthNavbar from "@/components/navbar/NonAuth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LMD 2.0 Portal - Welcome",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

export default function LandingPage() {
  return (
    <main className="page-constraints p-0 flsex flex-col gap-0  ">
      <NonAuthNavbar />
      {/* <Hero /> */}
      <Hero2 />
      {/* <Features /> */}
      <Features2 />
      {/* <CTASection /> */}
      <CTASection2 />
      <Footer />
    </main>
  );
}
