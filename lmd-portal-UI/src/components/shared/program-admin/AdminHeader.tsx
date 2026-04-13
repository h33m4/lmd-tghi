import { Button } from "@/components/ui/button";
import { LmhPrograms } from "@/types";
import React from "react";

interface AdminHeaderProps {
  program: LmhPrograms;
  rightSideContent?: React.ReactNode;
}

function AdminHeader({ program, rightSideContent }: AdminHeaderProps) {
  return (
    <div className="bg-background rounded-xl shadow-sm border border-gray-200 px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-lmh-pink ">
            {program} Program Admin Portal
          </h1>
          <p className="text-foreground  mt-1">
            Manage dashboards, reports, and data sources and more
          </p>
        </div>
        {rightSideContent}
      </div>
    </div>
  );
}

export default AdminHeader;
