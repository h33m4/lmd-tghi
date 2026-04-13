import AdminReportPreview from "@/components/shared/reports/AdminReportPreview";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Ethiopia | Admin - Report Preview"),
};

interface Props {
  params: { id: string };
}

export default function EthiopiaAdminReportPreviewPage({ params }: Props) {
  return <AdminReportPreview reportId={params.id} country="Ethiopia" />;
}
