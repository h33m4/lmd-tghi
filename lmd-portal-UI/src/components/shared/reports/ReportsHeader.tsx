import { LMH_ProgramCountries, LmhPrograms } from "@/types";
import React from "react";
import EmbeddReportModal from "./embedReportModal";

type ReportsHeaderProps = { program: LmhPrograms };

function ReportsHeader({ program }: ReportsHeaderProps) {
  return (
    <div className="bg-background rounded-xl shadow-sm border border-border p-4 m-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Reports</h1>
          <p className="text-foreground mt-1">
            Manage and monitor all your program reports in one place
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button> */}
          <EmbeddReportModal program={program} />
        </div>
      </div>
    </div>
  );
}

export default ReportsHeader;
