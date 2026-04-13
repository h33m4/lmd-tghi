import React from "react";
import { Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminStats from "./AdminStats";
import { LmhPrograms } from "@/types";

type Props = { program: LmhPrograms };

export default function AdminOverviewContent({ program }: Props) {
  return (
    <>
      <AdminStats program={program} />
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Quick Actions
              </h3>
              <p className="text-sm text-gray-600">
                Frequently used tools and shortcuts
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white"
              >
                <Plus className="h-4 w-4" />
                New Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white"
              >
                <Database className="h-4 w-4" />
                Connect Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
