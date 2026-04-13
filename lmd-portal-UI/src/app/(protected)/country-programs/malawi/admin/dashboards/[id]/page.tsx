import AdminDashboardPreview from "@/components/shared/dashboards/AdminDashboardPreview";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Malawi | Admin - Dashboard Preview"),
};

interface Props {
  params: { id: string };
}

export default function MalawiAdminDashboardPreviewPage({ params }: Props) {
  return <AdminDashboardPreview dashboardId={params.id} country="Malawi" />;
}
