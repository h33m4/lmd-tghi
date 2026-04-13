"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, ChevronRight, Database, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { LmhPrograms } from "@/types";
import AdminSectionComponent from "./AdminSectionComponent";
import Link from "next/link";

interface AdminDataSourcesProps {
  program: LmhPrograms;
}

function AdminDataSources({ program }: AdminDataSourcesProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {};

  return (
    <>
      <AdminSectionComponent
        title="Data Souces"
        description="Manage data connections and integrations"
        rightSideHeaderContent={
          <div className="flex items-center gap-2 ">
            <Button
              size="sm"
              variant={"dark-blue"}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              {refreshing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
            <Link
              href={`/country-programs/${program.toLowerCase()}/admin/data-sources`}
            >
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        }
        HeaderIcon={Database}
      >
        <div className="space-y-4">
          {/* stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-green-100 text-green-800">Active</div>
            <div className="bg-blue-100 text-blue-800">Syncing</div>
            <div className="bg-red-100 text-red-800">Error</div>
          </div>
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
        </div>
      </AdminSectionComponent>
    </>
  );
}

export default AdminDataSources;
