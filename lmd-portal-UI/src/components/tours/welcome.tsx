"use client";
import { useTourContext } from "@/context/tourContext";
import { Tour, TourProps } from "antd";
import { useEffect, useState } from "react";

export const WelcomeTour = () => {
  const { refs, isTourOpen, setIsTourOpen, showTour } = useTourContext();

  const handleCloseTour = () => {
    setIsTourOpen(false);
    localStorage.setItem("lmd_tour_completed", "true");
  };

  const steps: TourProps["steps"] = [
    {
      title: "Welcome to LMD 2.0",
      description:
        "Let's take a quick tour to help you navigate the platform and make the most of its features. 🚀",
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
    },
    {
      title: "KPI Dashboard",
      description:
        "This section provides a comprehensive overview of LMH's Key Performance Indicators (KPIs). Click here to explore real-time insights and track progress accross the fiscal years",
      target: () => refs.tour_kpi_dashboard?.current,
    },
    {
      title: "Country Program",
      description:
        "Access country-specific program data, reports, and progress metrics. Click here to dive into country-level insights",
      target: () => refs.tour_country_programs?.current,
    },
    {
      title: "AFF Dashboard",
      description:
        "Get a detailed view of AFF (Africa Frontline First) metrics",
      target: () => refs.tour_aff_dashboard?.current,
    },
    {
      title: "External KPI Dashboard",
      description:
        "This section allows you to view the external version of the KPI dashboard",
      target: () => refs.tour_ext_kpi_dashboard?.current,
    },
    {
      title: "Portal Search",
      description:
        "Use the search bar to quickly find relevant data, reports, key metrics, documentations or just anything worth searching across the portal",
      target: () => refs.tour_portal_search?.current,
    },
    {
      title: "Portal Help Function",
      description:
        "Need assistance? Click here to access the help center, log support tickets, submit suggestions, and find resources and documentations to navigate the portal effectively",
      target: () => refs.tour_help_function?.current,
    },

    {
      title: "Portal Theme Toggler",
      description:
        "Customize your experience by switching between light and dark modes. Click here to toggle the theme",
      target: () => refs.tour_theme_toggler?.current,
    },
    {
      title: "Portal Settings",
      description:
        "Manage your account settings, update your profile, and configure portal preferences among others. Click here to access the settings menu",
      target: () => refs.tour_profile_settings?.current,
    },
    {
      title: "Cross-Cutting Indicators at a Glance",
      description:
        "This section provides a quick snapshot of important Cross-cutting indicators, offering insights globally and accross the four (4) LMH program countries",
      target: () => refs.tour_results_at_glance?.current,
    },
    {
      title: "Interactive Indicator Map",
      description:
        "Visualize data geographically using this interactive map. Hover over each LMH country to explore country-level performance statistics",
      target: () => refs.tour_african_map?.current,
      placement: "center",
    },
    {
      title: "Latest Reports",
      description:
        "Stay up-to-date with the latest program reports and findings from all program countries. Click here to access recent reports and publications",
      target: () => refs.tour_latest_reports?.current,
    },
    {
      title: "Useful links",
      description: "Access useful links here",
      target: () => refs.tour_useful_links?.current,
    },
    {
      title: "End of Tour",
      description:
        "That’s it! You’re now familiar with LMD 2.0. Feel free to explore further and reach out if you need assistance. Enjoy!",
    },
  ];

  return (
    <>
      {/* <button onClick={showTour}>Show Tour</button> */}
      <Tour open={isTourOpen} onClose={handleCloseTour} steps={steps} />
    </>
  );
};
