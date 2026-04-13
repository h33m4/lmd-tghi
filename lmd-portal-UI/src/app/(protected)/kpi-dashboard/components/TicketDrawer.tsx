"use client";
import BaseDrawer from "@/components/modals/BaseDrawer";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

interface TicketDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function TicketDrawer({
  onClose,
  open = false,
}: TicketDrawerProps) {
  return (
    <>
      <BaseDrawer
        isOpen={open}
        onCloseModal={() => {
          onClose();
        }}
        size={"large"}
      >
        <>
          <div className="flex justify-between py-3.5 px-4 border-b-[0.5px] border-th-stroke-primary items-center">
            <div>
              <h1 className="text-lg th-font-medium">Support Tickets</h1>
            </div>
            <Button
              className="rounded-full"
              variant={"ghost"}
              size={"icon"}
              onClick={onClose}
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-3.5 flex flex-col gap-2">body</div>
        </>
      </BaseDrawer>
    </>
  );
}
