import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LmhPrograms } from "@/types";
import { ReportStatus, ReportType, Report } from "@/types/report";
import { formatDate } from "@/utils/date-helpers";
import { Users } from "lucide-react";
import Image from "next/image";

export const getReportTypeBadge = (type: ReportType) => {
  return (
    <Badge
      variant="outline"
      className="bg-blue-50 text-blue-700 border-blue-200 capitalize"
    >
      {type.replace("_", " ")}
    </Badge>
  );
};

export const getProgramBadge = (program: LmhPrograms) => {
  const colors: Record<string, string> = {
    liberia: "bg-blue-50 text-blue-700 border-blue-200",
    malawi: "bg-purple-50 text-purple-700 border-purple-200",
    ethiopia: "bg-rose-50 text-rose-700 border-rose-200",
    sierra_leone: "bg-teal-50 text-teal-700 border-teal-200",
    aff: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <Badge
      variant="outline"
      className={`${colors[program.toLocaleLowerCase()] || ""} capitalize`}
    >
      {program.replace("_", " ")}
    </Badge>
  );
};

export const getStatusBadge = (status: ReportStatus) => {
  const variants = {
    published: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    draft: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    archived: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      dot: "bg-gray-500",
    },
  };
  const variant = variants[status];
  return (
    <Badge
      variant="outline"
      className={`${variant.bg} ${variant.text} ${variant.border} capitalize`}
    >
      <div className={`w-2 h-2 rounded-full ${variant.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Map report types to display labels
const reportTypeLabels: Record<ReportType, string> = {
  data_review: "Data Review",
  donor_report: "Donor Report",
  impact_report: "Impact Report",
  quarterly_report: "Quarterly Report",
  annual_report: "Annual Report",
  case_study: "Case Study",
  other: "Other",
};

export const ReportCard = ({
  report,
  onPreview,
}: {
  report: Report;
  onPreview: (report: Report) => void;
}) => {
  const tags = report.tags
    ? report.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      className={cn(
        "group hover:bg-background rounded-sm hover-up relative w-full flex-col justify-start items-start gap-5 block border-2 border-neutral-300 dark:border-neutral-dark-300 overflow-hidden cursor-pointer"
      )}
      onClick={() => onPreview(report)}
    >
      <div className="h-[9.5rem] xl:h-[14vw] 2xl:h-[13rem] w-full relative">
        <Image
          alt=""
          src="/assets/img/country/reports-mock-bg.png"
          className="w-full rounded-sm object-cover absolute"
          placeholder="blur"
          blurDataURL="/assets/img/country/reports-mock-bg.png"
          fill
        />
        <div className="absolute text-white px-6 flex flex-col items-center justify-center h-full">
          <div>
            <h1 className="text-lg">{report.program} Program</h1>
            <div className="flex">
              <hr className="border-[0.1px] border-gray-500 my-1 w-1/3" />
            </div>
            <span className="text-md th-font-book text-primary">
              {reportTypeLabels[report.type]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-col justify-start items-start gap-3.5 flex pt-4 px-3 pb-4">
        <div className="justify-between items-center gap-5 inline-flex w-full">
          <div
            className={cn(
              "px-3 py-[8px] dark:bg-neutral-dark-200 rounded-3xl justify-center items-center gap-2.5 flex",
              report.type === "data_review"
                ? "bg-lmh-pink/90 text-white dark:text-neutral-100"
                : "bg-neutral-200 text-neutral-900 dark:text-neutral-dark-950"
            )}
          >
            <div className="text-xs font-medium leading-none">
              {reportTypeLabels[report.type]}
            </div>
          </div>
          <div className="justify-start items-center gap-2 flex">
            <div className="text-neutral-700 text-xs font-medium leading-none dark:text-neutral-dark-700">
              {formatDate(report.date_published || report.date_updated)}
            </div>
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-neutral-950 dark:text-white/70 text-base font-bold leading-snug mb-2 line-clamp-2">
            {report.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {report.description}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Bottom Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 w-full">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {report.uploaded_by}
          </span>
          {getStatusBadge(report.status)}
        </div>
      </div>
    </div>
  );
};

const ReportSkeletonCard = () => (
  <div className="group rounded-sm relative w-full flex-col justify-start items-start border-2 border-neutral-300 dark:border-neutral-dark-300 overflow-hidden">
    <div className="h-[9.5rem] xl:h-[14vw] 2xl:h-[13rem] w-full bg-gray-200 animate-pulse" />
    <div className="flex-col justify-start items-start gap-3.5 flex pt-4 px-3 pb-4">
      <div className="justify-between items-center gap-5 inline-flex w-full">
        <div className="h-8 w-24 bg-gray-200 rounded-3xl animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-2 w-full">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
      </div>
    </div>
  </div>
);

export { reportTypeLabels, ReportSkeletonCard };
