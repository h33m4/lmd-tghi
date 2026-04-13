"use client";
import { Card, CardContent } from "@/components/ui/card";
import { LmhPrograms } from "@/types";
import { BarChart3, Database, FileText } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

type Props = { program: LmhPrograms };

interface Stats {
  totalDashboards: number;
  publishedDashboards: number;
  totalReports: number;
  publishedReports: number;
  dataSources: number;
}

const StatsCard = ({ title, value, icon: Icon, subtitle, loading }: any) => (
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

function normalizeString(str: string | null) {
  return str?.toLowerCase().replace(/\s+/g, "_") || "";
}

function AdminStats({ program }: Props) {
  const [dashboards, setDashboards] = useState<any[] | null>(null);
  const [reports, setReports] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardsRes, reportsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_LMD_API}/dashboards`),
          fetch(`${process.env.NEXT_PUBLIC_LMD_API}/reports`),
        ]);
        if (!dashboardsRes.ok || !reportsRes.ok)
          throw new Error("Fetch failed");
        const [dashboardsData, reportsData] = await Promise.all([
          dashboardsRes.json(),
          reportsRes.json(),
        ]);
        setDashboards(dashboardsData);
        setReports(reportsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [program]);

  const stats = useMemo(() => {
    if (!dashboards || !reports)
      return {
        totalDashboards: 0,
        publishedDashboards: 0,
        totalReports: 0,
        publishedReports: 0,
        dataSources: 0,
      };
    const programSlug = normalizeString(program);

    const filteredDashboards = dashboards.filter((d) => {
      const country = normalizeString(d.country);
      const prog = normalizeString(d.program);
      return country === programSlug || prog === programSlug;
    });
    const filteredReports = reports.filter((r) => {
      const country = normalizeString(r.country);
      const prog = normalizeString(r.program);
      return country === programSlug || prog === programSlug;
    });

    return {
      totalDashboards: filteredDashboards.length,
      publishedDashboards: filteredDashboards.filter(
        (d) => d.status?.toLowerCase() === "published",
      ).length,
      totalReports: filteredReports.length,
      publishedReports: filteredReports.filter(
        (r) => r.status?.toLowerCase() === "published",
      ).length,
      dataSources: 1,
    };
  }, [dashboards, reports, program]);

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
