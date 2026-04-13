"use client";
import { Card, CardContent } from "@/components/ui/card";
import { LmhPrograms } from "@/types";
import { BarChart3, Database, FileText } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  program: LmhPrograms;
};

interface Stats {
  totalDashboards: number;
  publishedDashboards: number;
  totalReports: number;
  publishedReports: number;
  dataSources: number;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  loading,
}: {
  title: string;
  value: number;
  icon: any;
  subtitle?: string;
  loading?: boolean;
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium">{title}</p>
          {loading ? (
            <div className="h-9 w-16 bg-gray-200 animate-pulse rounded mt-2" />
          ) : (
            <h3 className="text-3xl font-extrabold text-lmh-pink mt-2">
              {value}
            </h3>
          )}
          {loading ? (
            <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mt-1" />
          ) : (
            subtitle && <p className="text-xs font-semibold mt-1">{subtitle}</p>
          )}
        </div>
        <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center">
          <Icon className="h-7 w-7 text-lmh-blue" />
        </div>
      </div>
    </CardContent>
  </Card>
);

function AdminStats({ program }: Props) {
  const [stats, setStats] = useState<Stats>({
    totalDashboards: 0,
    publishedDashboards: 0,
    totalReports: 0,
    publishedReports: 0,
    dataSources: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [dashboardsRes, reportsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_LMD_API}/dashboards`),
          fetch(`${process.env.NEXT_PUBLIC_LMD_API}/reports`),
        ]);

        if (!dashboardsRes.ok || !reportsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [dashboardsData, reportsData] = await Promise.all([
          dashboardsRes.json(),
          reportsRes.json(),
        ]);

        const programSlug = program.toLowerCase().replace(/\s+/g, "_");

        // Dashboards filter by country
        const filteredDashboards = dashboardsData.filter((item: any) => {
          if (!item.country) return false;
          return (
            item.country.toLowerCase().replace(/\s+/g, "_") === programSlug
          );
        });

        // Reports filter by program
        const filteredReports = reportsData.filter((item: any) => {
          if (!item.program) return false;
          return (
            item.program.toLowerCase().replace(/\s+/g, "_") === programSlug
          );
        });

        setStats({
          totalDashboards: filteredDashboards.length,
          publishedDashboards: filteredDashboards.filter(
            (d: any) => d.status === "published"
          ).length,
          totalReports: filteredReports.length,
          publishedReports: filteredReports.filter(
            (r: any) => r.status === "published"
          ).length,
          dataSources: 1,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        // On error, stats remain at 0
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [program]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total Dashboards"
        value={stats.totalDashboards}
        icon={BarChart3}
        subtitle={`${stats.publishedDashboards} published`}
        loading={loading}
      />
      <StatsCard
        title="Total Reports"
        value={stats.totalReports}
        icon={FileText}
        subtitle={`${stats.publishedReports} published`}
        loading={loading}
      />
      <StatsCard
        title="Data Sources"
        value={stats.dataSources}
        icon={Database}
        subtitle="Active connections"
        loading={loading}
      />
    </div>
  );
}

export default AdminStats;
