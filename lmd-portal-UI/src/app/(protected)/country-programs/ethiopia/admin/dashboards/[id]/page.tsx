import AdminDashboardPreview from "@/components/shared/dashboards/AdminDashboardPreview";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Ethiopia | Admin - Dashboard Preview"),
};

interface Props {
  params: { id: string };
}

export default function EthiopiaAdminDashboardPreviewPage({ params }: Props) {
  return <AdminDashboardPreview dashboardId={params.id} country="Ethiopia" />;
}
