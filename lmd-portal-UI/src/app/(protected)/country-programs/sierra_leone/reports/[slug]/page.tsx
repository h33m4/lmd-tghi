import TopNavBar from "@/components/shared/TopNavBar";
import { metaObject } from "@/config/site.config";
import UserFetchRenderAllReport from "@/components/shared/reports/UserFetchRenderAllReports";

export const metadata = {
  ...metaObject("Sierra Leone Program | Report"),
};

interface ReportPageProps {
  params: {
    slug: string; // this is "7"
  };
}

export default function DashboardPage({ params }: ReportPageProps) {
  const slugParts = params.slug.split("-");
  const reportId = slugParts[0];
  // const reportId = params.slug; // ✅ use this directly

  return (
    <>
      <TopNavBar
        country={"Sierra Leone"}
        excludedBreadcrumbPaths={[""]}
        capitalizeWords={[]}
      />

      <UserFetchRenderAllReport reportId={reportId} reportSlug={""} />
    </>
  );
}
