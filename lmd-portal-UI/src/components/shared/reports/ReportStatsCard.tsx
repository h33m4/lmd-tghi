import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

export interface StatCard {
  title: string;
  value: number;
  change?: string;
  icon: LucideIcon;
  gradient: string;
}

interface ReportStatsCardProps {
  modernStats: StatCard[];
  isRefreshing: boolean;
}

function ReportStatsCard({ modernStats, isRefreshing }: ReportStatsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {modernStats.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden border shadow-sm hover:shadow-md transition-shadow py-4"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}
          />
          <CardContent className=" relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{stat.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {isRefreshing ? (
                    <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-2xl font-bold">{stat.value}</p>
                  )}
                </div>
                {isRefreshing ? (
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                )}
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ReportStatsCard;
