import React from "react";
import { metaObject } from "@/config/site.config";
import AdminOverviewContent from "@/components/shared/program-admin/AdminOverviewContent";

export const metadata = {
  ...metaObject("Liberia Program | Admin Tools"),
};

export default function AdminOverviewPage() {
  return <AdminOverviewContent program="Liberia" />;
}
