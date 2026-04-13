import React from "react";
import { metaObject } from "@/config/site.config";
import AdminOverviewContent from "@/components/shared/program-admin/AdminOverviewContent";

export const metadata = {
  ...metaObject("Ethiopia Program | Admin Tools"),
};

export default function AdminOverviewPage() {
  return <AdminOverviewContent program="Ethiopia" />;
}
