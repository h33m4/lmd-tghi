import { metaObject } from "@/config/site.config";
import React from "react";

export const metadata = {
  ...metaObject("Docs | How it works"),
};

export default function HowItWorksPAge() {
  return <article className="w-full border h-[50rem]">How it works</article>;
}
