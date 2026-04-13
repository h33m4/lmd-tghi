import AdminReportPreview from "@/components/shared/reports/AdminReportPreview";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Liberia | Admin - Report Preview"),
};

interface Props {
  params: { id: string };
}

export default function LiberiaAdminReportPreviewPage({ params }: Props) {
  return <AdminReportPreview reportId={params.id} country="Liberia" />;
}
