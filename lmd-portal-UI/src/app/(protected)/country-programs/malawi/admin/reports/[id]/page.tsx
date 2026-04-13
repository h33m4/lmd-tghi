import AdminReportPreview from "@/components/shared/reports/AdminReportPreview";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Malawi | Admin - Report Preview"),
};

interface Props {
  params: { id: string };
}

export default function MalawiAdminReportPreviewPage({ params }: Props) {
  return <AdminReportPreview reportId={params.id} country="Malawi" />;
}
