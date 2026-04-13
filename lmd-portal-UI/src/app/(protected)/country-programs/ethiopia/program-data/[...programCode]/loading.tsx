import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/ui/spinner";
import React from "react";

export default function Loading() {
  return (
    <div className="border h-full w-full flex flex-col items-center justify-center">
      <Spinner />
      {/* <span>Loading for program data</span> */}
      {/* <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" /> */}
    </div>
  );
}
