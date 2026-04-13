"use client";

import TagIcon from "@/components/icons/tag";
import TagIcon2 from "@/components/icons/tag-2";
import TagIcon3 from "@/components/icons/tag-3";
import TicketIcon from "@/components/icons/ticket";
import MetricCard from "./metricCard";
import { cn } from "@/lib/utils";

const ticketStats = [
  {
    id: 1,
    icon: <TicketIcon className="h-full w-full" />,
    title: "Total Tickets",
    metric: "12,450",
  },
  {
    id: 2,
    icon: <TagIcon className="h-full w-full" />,
    title: "Opened Tickets",
    metric: "3,590",
  },
  {
    id: 3,
    icon: <TagIcon2 className="h-full w-full" />,
    title: "Pending Tickets",
    metric: "7,890",
  },
  {
    id: 3,
    icon: <TagIcon3 className="h-full w-full" />,
    title: "Closed Tickets",
    metric: "1,160",
  },
];

export default function StatCards({ className }: { className?: string }) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-5 3xl:gap-8 4xl:gap-9", className)}
    >
      {ticketStats.map((stat) => (
        <MetricCard
          key={stat.title + stat.id}
          title={stat.title}
          metric={stat.metric}
          icon={stat.icon}
          iconClassName="bg-transparent w-11 h-11"
        />
      ))}
    </div>
  );
}
