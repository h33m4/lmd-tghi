import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Plus, RefreshCw, ChevronRight, Database } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { LmhPrograms } from "@/types";

interface AdminDataSourcesProps {
  program: LmhPrograms;
}

// Management Section Card
const ManagementSectionCard = ({
  title,
  description,
  icon: Icon,
  stats,
  actionLabel,
  actionHref,
  viewAllHref,
  children,
  loading,
}: {
  title: string;
  description: string;
  icon: any;
  stats: { label: string; value: number; color: string }[];
  actionLabel: string;
  actionHref: string;
  viewAllHref: string;
  children: React.ReactNode;
  loading?: boolean;
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="border-b bg-gray-50/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        <Link href={actionHref}>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Button>
        </Link>
      </div>

      {/* Stats Pills */}
      <div className="flex items-center gap-4 mt-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`px-3 py-1.5 rounded-full ${stat.color} text-xs font-medium`}
          >
            {stat.label}: {stat.value}
          </div>
        ))}
      </div>
    </CardHeader>

    <CardContent className="p-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">{children}</div>

          <Link href={viewAllHref}>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              View All {title}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </>
      )}
    </CardContent>
  </Card>
);

function AdminDataSources({ program }: AdminDataSourcesProps) {
  return (
    <ManagementSectionCard
      title="Data Sources"
      description="Manage data connections and integrations"
      icon={Database}
      stats={[
        {
          label: "Active",
          value: 8,
          color: "bg-green-100 text-green-800",
        },
        {
          label: "Syncing",
          value: 2,
          color: "bg-blue-100 text-blue-800",
        },
        {
          label: "Error",
          value: 0,
          color: "bg-red-100 text-red-800",
        },
      ]}
      actionLabel="Add Source"
      actionHref="/country-programs/liberia/admin/data-sources/new"
      viewAllHref="/country-programs/liberia/admin/data-sources"
    >
      <div className="border rounded-lg p-8 text-center bg-gray-50">
        <Database className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <h4 className="font-semibold text-gray-900 mb-2">
          Data Source Management
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Configure and monitor your data connections
        </p>
        <div className="flex items-center justify-center gap-3">
          <Badge variant="outline" className="bg-green-50">
            DHIS2 Connected
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            Database Active
          </Badge>
          <Badge variant="outline" className="bg-blue-50">
            API Syncing
          </Badge>
        </div>
      </div>
    </ManagementSectionCard>
  );
}

export default AdminDataSources;
