import TopNavBar from "@/components/shared/TopNavBar";
import EmbedFrame from "@/components/shared/EmbedFrame";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "LMD 2.0 - Liberia | CHA Module 1 Summary Dashboard",
  description:
    "A programmatic data management & reporting platform for Last Mile Health",
};

const CHAModule1SummaryPage = () => {
  return (
    <>
      <TopNavBar pageName="CHA Module 1 Summary Dashboard" country="Liberia" />
      <EmbedFrame
        title="CHA Module 1 Summary"
        src="https://app.powerbi.com/view?r=eyJrIjoiMzc4MjFhN2ItZjc0My00OTIwLThkNWQtOWFjNzUzZWJiMDZmIiwidCI6ImMwZGEzYWQxLWNlMjUtNGUyZi05OTBjLWJjMzE1NzUwY2VkNCIsImMiOjN9"
      />
    </>
  );
};

export default CHAModule1SummaryPage;
