"use client";
import React from "react";

type Priority = {
  value: string;
  label: string;
};

const prororities: Priority[] = [
  {
    value: "high",
    label: "High",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "low",
    label: "Low",
  },
];

export function ComboboxPopover() {
  return <div className="flex items-center space-x-4">content here</div>;
}
