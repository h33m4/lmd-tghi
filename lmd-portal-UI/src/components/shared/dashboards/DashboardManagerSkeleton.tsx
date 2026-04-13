import { Card, CardContent } from "@/components/ui/card";
import React from "react";

/* ============================= */
/* Table Row Skeleton */
/* ============================= */

export const SkeletonTableRow = () => (
  <tr className="border-b border-gray-100">
    <td className="p-6">
      <div className="space-y-3">
        <div>
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-1" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-12" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-20" />
        </div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
      </div>
    </td>
    {[...Array(5)].map((_, i) => (
      <td key={i} className="p-6">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
      </td>
    ))}
    <td className="p-6">
      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
    </td>
  </tr>
);

/* ============================= */
/* Grid Card Skeleton */
/* ============================= */

export const SkeletonGridCard = () => (
  <Card className="border border-gray-200 overflow-hidden">
    <div className="h-2 bg-gray-200 animate-pulse" />
    <CardContent className="p-5">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
        </div>

        <div className="flex gap-1.5">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-14" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-12" />
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-between">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ============================= */
/* Full Dashboard Skeleton */
/* ============================= */

interface DashboardManagerSkeletonProps {
  view?: "grid" | "table";
  items?: number;
}

function DashboardManagerSkeleton({
  view = "grid",
  items = 6,
}: DashboardManagerSkeletonProps) {
  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-40" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
          <div className="h-10 bg-gray-200 rounded animate-pulse w-24" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-10 bg-gray-200 rounded animate-pulse w-40" />
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
      </div>

      {/* Content Area */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(items)].map((_, i) => (
            <SkeletonGridCard key={i} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full">
            <tbody>
              {[...Array(items)].map((_, i) => (
                <SkeletonTableRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardManagerSkeleton;
