"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import LmdLogo from "../navbar/LmdLogo";

export default function LayoutLoader() {
  return (
    <>
      <div className=" h-screen flex items-center justify-center flex-col space-y-2">
        <LmdLogo />
        <span className=" inline-flex gap-1 items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <p>Loading...</p>
        </span>
      </div>
    </>
  );
}
