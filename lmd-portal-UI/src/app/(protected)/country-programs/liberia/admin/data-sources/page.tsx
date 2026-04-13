import { metaObject } from "@/config/site.config";
import dynamic from "next/dynamic";
import DashboardManagerSkeleton from "@/components/shared/dashboards/DashboardManagerSkeleton";
import React from "react";

export const metadata = {
  ...metaObject("Liberia Program | Admin - Data Sources"),
};

const AdminPipelineManager = dynamic(
  () =>
    import("@/components/shared/program-admin/data-sources/PipelineManager"),
  {
    ssr: false,
    loading: () => <DashboardManagerSkeleton />,
  },
);

export default function page() {
  return (
    <div className="h-full">
      <AdminPipelineManager ownerFilter={["Liberia", "LMD"]} />
    </div>
  );
}
