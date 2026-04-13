"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function ActionsButtons() {
  const router = useRouter();
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button variant={"outline"} onClick={() => router.push("/")} className="">
        Return Home
      </Button>
      <Button variant={"dark-blue"} onClick={() => router.back()} className="">
        Try Again
      </Button>
    </div>
  );
}

export default ActionsButtons;
