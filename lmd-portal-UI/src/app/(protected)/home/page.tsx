import { Metadata } from "next";
import React from "react";
import HeroCarousel from "@/app/(protected)/home/_components/HeroCarousel";
import ResultsAtGlance from "./_components/ResultsAtGlance";
import Footer from "@/components/footer/Footer";
import HomePageReports from "./_components/HomePageReports";
import AfricaMapSection from "./_components/AfricaMapSection";
import { metaObject } from "@/config/site.config";
import { WelcomeTour } from "@/components/tours/welcome";

export const metadata = {
  ...metaObject(" Home "),
};

const HomePage = () => {
  return (
    <>
      <HeroCarousel />
      <ResultsAtGlance />
      <AfricaMapSection />
      <HomePageReports />
      <WelcomeTour />
      <Footer />
    </>
  );
};

export default HomePage;
