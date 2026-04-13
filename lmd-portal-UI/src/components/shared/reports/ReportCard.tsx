"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/date-helpers";
import { Report } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, User } from "lucide-react";
import { LmhPrograms } from "@/types";

interface ReportCardProps {
  report: Report;
  program: LmhPrograms;
  isAdminView?: boolean;
}

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // spaces → dashes
    .replace(/-+/g, "-"); // collapse dashes

const ReportCard = ({ report, program, isAdminView }: ReportCardProps) => {
  const router = useRouter();

  const handleClick = (reportId: string, title: string) => {
    const slug = generateSlug(title);
    const url = `reports/${reportId}-${slug}`;
    router.push(url);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-500";
      case "draft":
        return "bg-amber-500";
      case "archived":
        return "bg-gray-400";
      default:
        return "bg-blue-500";
    }
  };

  // Get type label
  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const tagsArray = report.tags
    ? report.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      onClick={() => handleClick(report.id, report.title)}
      className={cn(
        "group hover:bg-background hover:cursor-pointer rounded-xl hover-up relative w-full flex-col justify-start items-start gap-4 block border-2 border-gray-200 dark:border-neutral-dark-300 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* Header Image with Status Indicator */}
      <div className="h-[9.5rem] xl:h-[14vw] 2xl:h-[13rem] w-full relative">
        <Image
          alt={report.title}
          src="/assets/img/country/reports-mock-bg.png"
          className="w-full rounded-none  absolute"
          placeholder="blur"
          blurDataURL="/assets/img/country/reports-mock-bg.png"
          fill
          priority
        />
        {/* Status Indicator Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 ${getStatusColor(
            report.status
          )}`}
        />

        <div className="absolute text-white px-6 flex flex-col items-start justify-center h-full">
          <div className="space-y-2">
            <h1 className="text-lg font-semibold line-clamp-2">
              {report.title}
            </h1>
            <div className="flex">
              <hr className="border-[0.1px] border-gray-300 my-1 w-1/3" />
            </div>
            <span className="text-sm font-medium text-gray-200">
              {getTypeLabel(report.type)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-col justify-start items-start gap-2 flex pt-0 px-4 pb-4">
        {/* Badges */}
        {isAdminView && (
          <div className="flex flex-wrap gap-2 w-full mt-2">
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                "bg-lmh-blue text-white border-lmh-blue"
              )}
            >
              {report.program}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium capitalize",
                report.status === "published"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : report.status === "draft"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              )}
            >
              {report.status}
            </Badge>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-lmh-dark-blue font-semibold dark:text-gray-400 line-clamp-2 leading-relaxed  mt-2">
          {report.description}
        </p>

        {/* Tags */}
        {tagsArray.length > 0 && (
          <div className="flex flex-wrap gap-1 ">
            {tagsArray.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 text-xs bg-lmh-pink/10 text-lmh-pink font-semibold rounded-md"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {tagsArray.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{tagsArray.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="w-full space-y-2 text-xs text-gray-500 pt-1.5 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{report.uploaded_by}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(report.date_updated)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
