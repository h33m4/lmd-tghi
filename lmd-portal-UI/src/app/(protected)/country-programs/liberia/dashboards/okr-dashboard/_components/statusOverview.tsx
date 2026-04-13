import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { useOkrStatusColors } from "./useOkrColors";
import { cn } from "@/lib/utils";

interface StatsOverviewProps {
  totalKRs: number;
  onTrack: number;
  atRisk: number;
  behind: number;
  achieved?: number;
  underReview?: number;
  delayed: number;
}

export const StatsOverview = ({
  totalKRs,
  onTrack,
  atRisk,
  behind,
  achieved = 0,
  underReview = 0,
  delayed = 0,
}: StatsOverviewProps) => {
  const { getStatusColors } = useOkrStatusColors();

  // Get colors for each status
  const onTrackColors = getStatusColors("on_track");
  const atRiskColors = getStatusColors("at_risk");
  const delayedColors = getStatusColors("delayed");
  const achievedColors = getStatusColors("achieved");
  const underReviewColors = getStatusColors("okr_under_review");

  const stats = [
    {
      label: "Total OKRs",
      value: totalKRs,
      icon: Target,
      textColor: "text-primary",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
      border: "border-l-4 border-l-primary",
    },
    {
      label: "Under Review",
      value: underReview,
      icon: HelpCircle,
      textColor: underReviewColors.text,
      bgColor: underReviewColors.bg,
      iconColor: underReviewColors.text,
      border: "border-l-4 border-l-gray-500",
    },
    {
      label: "On Track",
      value: onTrack,
      icon: TrendingUp,
      textColor: onTrackColors.text,
      bgColor: onTrackColors.bg,
      iconColor: onTrackColors.text,
      border: "border-l-4 border-l-amber-400",
    },
    {
      label: "At Risk",
      value: atRisk,
      icon: AlertTriangle,
      textColor: atRiskColors.text,
      bgColor: atRiskColors.bg,
      iconColor: atRiskColors.text,
      border: "border-l-4 border-l-orange-600",
    },
    {
      label: "delayed",
      value: delayed,
      icon: AlertTriangle,
      textColor: delayedColors.text,
      bgColor: delayedColors.bg,
      iconColor: delayedColors.text,
      border: "border-l-4 border-l-red-500",
    },
    {
      label: "Achieved",
      value: achieved,
      icon: CheckCircle,
      textColor: achievedColors.text,
      bgColor: achievedColors.bg,
      iconColor: achievedColors.text,
      border: "border-l-4 border-l-green-600",
    },
  ];

  // Add Achieved if applicable
  // if (achieved > 0) {
  //   stats.push({
  //     label: "Achieved",
  //     value: achieved,
  //     icon: CheckCircle,
  //     textColor: achievedColors.text,
  //     bgColor: achievedColors.bg,
  //     iconColor: achievedColors.text,
  //     border: "border-l-4 border-l-green-600",
  //   });
  // }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 animate-fade-in ">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={cn(
            "overflow-hidden hover:shadow-md transition-shadow duration-300",
            stat.border,
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
