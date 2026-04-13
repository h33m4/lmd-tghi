import AdminDashboardPreview from "@/components/shared/dashboards/AdminDashboardPreview";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Sierra Leone | Admin - Dashboard Preview"),
};

interface Props {
  params: { id: string };
}

export default function SierraLeoneAdminDashboardPreviewPage({ params }: Props) {
  return <AdminDashboardPreview dashboardId={params.id} country="Sierra_Leone" />;
}
