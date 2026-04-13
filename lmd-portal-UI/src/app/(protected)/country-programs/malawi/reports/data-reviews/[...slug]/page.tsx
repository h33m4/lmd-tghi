import { Metadata } from "next";
import TopNavBar from "@/components/shared/TopNavBar";

import reportdata from "./../reportsdata.json";

import { metaObject } from "@/config/site.config";

// reports
import { getReportById } from "@/components/shared/reports-old/getReportById";
import { IReportData } from "@/components/shared/reports-old/ReportCard";
import ReportRenderer from "@/components/shared/reports-old/ReportRenderer";

// seo meta data
export const metadata = {
  ...metaObject("Malawi Program | Program Reports"),
};

export default async function Page({ params }: { params: { slug: string } }) {
  const reportId = params.slug[0];
  const report = await getReportById(reportId, reportdata as IReportData[]);

  return (
    <>
      <TopNavBar
        country="Malawi"
        pageName="Program Reports"
        subPageName={report?.title}
      />
      <div className="border  border-primary dark:border-border  h-full bg-background rounded-md flex items-center justify-center">
        <ReportRenderer report={report!} />
      </div>
    </>
  );
}
