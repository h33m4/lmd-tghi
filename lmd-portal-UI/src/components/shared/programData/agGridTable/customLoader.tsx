import Spinner from "@/components/ui/spinner";
import React from "react";

export default function CustomTableLoader(props: any) {
  return (
    <div
      className="space-y-6 bg-transparent  border-red-400"
      role="presentation"
    >
      <Spinner />
      <div aria-live="polite" aria-atomic="true">
        {/* {props.loadingMessage} */}
        <p className="th-font-mediumOblique text-muted-foreground">
          fetching data..
        </p>
      </div>
    </div>
  );
}
