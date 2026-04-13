import AdminReportPreview from "@/components/shared/reports/AdminReportPreview";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Sierra Leone | Admin - Report Preview"),
};

interface Props {
  params: { id: string };
}

export default function SierraLeoneAdminReportPreviewPage({ params }: Props) {
  return <AdminReportPreview reportId={params.id} country="Sierra_Leone" />;
}
