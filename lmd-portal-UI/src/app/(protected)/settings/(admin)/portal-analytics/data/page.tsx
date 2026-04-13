import React from "react";
import EventsDataTable from "./data-table";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function AnalyticsPage() {
  return (
    <div className="h-full pt-4">
      <EventsDataTable />
    </div>
  );
}
