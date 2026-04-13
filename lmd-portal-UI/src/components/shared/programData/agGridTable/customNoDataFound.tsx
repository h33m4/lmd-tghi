import Spinner from "@/components/ui/spinner";
import React from "react";
import NoDataFoundIcon from "@public/assets/icons/no-data-found.svg";

interface Props {
  displayText?: string;
}

export default function CustomTableNoDataFound({ displayText }: Props) {
  return (
    <div
      className="space-y-6 bg-transparent  opacity-90 border-red-400 items-center justify-center flex flex-col"
      role="presentation"
    >
      <NoDataFoundIcon />
      <div aria-live="polite" aria-atomic="true">
        <p className="th-font-mediumOblique text-muted-foreground -mt-6">
          {displayText || "No record found"}
        </p>
      </div>
    </div>
  );
}

// Set display name for the component
CustomTableNoDataFound.displayName = "CustomTableNoDataFound";
