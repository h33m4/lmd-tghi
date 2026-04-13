import Spinner from "@/components/ui/spinner";
import React from "react";

export default function Loading() {
  return (
    <div className="border h-full flex flex-col justify-center items-center">
      {/* <span>Loading for program data default page</span> */}
      <Spinner />
    </div>
  );
}
