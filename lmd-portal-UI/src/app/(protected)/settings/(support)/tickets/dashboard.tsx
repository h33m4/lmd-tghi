import React from "react";
import StatCards from "./ticketStats";
import TicketsTable from "./ticketsTable";

function TicketsDashboard() {
  return (
    <div className="@container pt-6">
      <div className="grid grid-cols-12 gap-6 3xl:gap-8 border-b pb-4 mb-2">
        <StatCards className="col-span-full grid-cols-2 @2xl:grid-cols-4 @6xl:grid-cols-4" />
      </div>

      {/* all tickets tables */}
      <TicketsTable />
    </div>
  );
}

export default TicketsDashboard;
