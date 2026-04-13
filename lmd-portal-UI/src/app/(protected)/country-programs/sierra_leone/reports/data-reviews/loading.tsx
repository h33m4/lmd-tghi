import Spinner from "@/components/ui/spinner";
import React from "react";

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Spinner />
    </div>
  );
}
