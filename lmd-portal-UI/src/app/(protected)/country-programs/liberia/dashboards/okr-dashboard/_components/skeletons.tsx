// components/okr/skeletons.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function StatsOverviewSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-4 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </Card>
      ))}
    </div>
  );
}

export function OKRCardSkeleton() {
  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </Card>
  );
}

export function OKRGroupSkeleton() {
  return (
    <div className="border-b pb-6 space-y-4 border-l-4 border-gray-200">
      {/* Group Header */}
      <div className="border p-4 bg-gray-200 dark:bg-gray-700 space-y-2">
        <Skeleton className="h-6 w-64" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      {/* OKR Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 ml-2 lg:ml-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <OKRCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="@container/main border-none border-primary dark:border-border h-full bg-transparent rounded-md flex flex-col overflow-y-scroll">
      <main className="w-full max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-6 py-8 space-y-8">
        {/* Stats Overview Skeleton */}
        <StatsOverviewSkeleton />

        {/* OKR Groups Skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <OKRGroupSkeleton key={i} />
        ))}
      </main>
    </div>
  );
}
