// app/[slug]/loading.tsx
import React from "react";

export default function Loading() {
  return (
    <div className="border border-primary dark:border-border h-full bg-background rounded-md flex flex-col">
      {/* Dashboard Header Skeleton */}
      <div className="p-4 border-b border-primary/20 dark:border-border animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>

      {/* Dashboard Content Skeleton */}
      <div className="flex-1 p-4 animate-pulse">
        <div className="w-full h-full min-h-[500px] bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
