import { metaObject } from "@/config/site.config";
import React from "react";
import StatCards from "./ticketStats";
import TicketsDashboard from "./dashboard";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export const metadata = {
  ...metaObject("Settings | Support Tickets"),
};

export default function SupportTicketsPage() {
  return (
    <div>
      <TicketsDashboard />
    </div>
  );
}
