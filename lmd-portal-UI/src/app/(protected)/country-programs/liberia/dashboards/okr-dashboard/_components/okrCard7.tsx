// _components/okrCard7.tsx
"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Settings,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useState, useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";
import { StatusBadge } from "./statusBagde";
import {
  formatMonthYearDisplay,
  formatMonthYearShort,
  getCurrentMonthUpdate,
  sortMonthlyUpdates,
} from "@/utils/okr-helpers";
import { useOkrStatusColors } from "./useOkrColors";
import { ProgressBar } from "./ProgressBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OkrRecord, isNarrativeUnit } from "@/types/okrTracker";

import { toast } from "sonner";
import { updateOKRField } from "@/lib/actions/okr-dashboard/okr";

interface OKRCardProps {
  okr: OkrRecord;
  currentMonth?: number;
  currentYear?: number;
  onChartTypeChange?: (chartType: string) => void;
  onPriorityChange?: (okrId: string, priority: number) => void;
  onOkrUpdate: (updatedOkr: OkrRecord) => void;
  onView: (okr: OkrRecord) => void;
  /** Called when user clicks "Add Update" — parent opens the modal with form pre-opened. */
  onAddUpdate?: (okr: OkrRecord) => void;
}

export const OKRCard7 = ({
  okr,
  currentMonth,
  currentYear,
  onChartTypeChange,
  onPriorityChange,
  onOkrUpdate,
  onView,
  onAddUpdate,
}: OKRCardProps) => {
  const [localOkr, setLocalOkr] = useState<OkrRecord>(okr);
  const [selectedChartType, setSelectedChartType] = useState(
    okr?.chartType || "bar",
  );

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const { getStatusColors } = useOkrStatusColors();

  useEffect(() => {
    setLocalOkr(okr);
  }, [okr]);

  const calculateProgress = () => {
    if (monthlyUpdates.length === 0) return parseFloat((localOkr.progress || 0).toFixed(2));

    const sorted = sortMonthlyUpdates(monthlyUpdates);
    const latestUpdate = sorted[sorted.length - 1];
    const value =
      typeof latestUpdate.value === "number" ? latestUpdate.value : 0;

    if (okr.chartMetricType === "percentage") {
      return parseFloat(value.toFixed(2));
    }

    return parseFloat(Math.min(100, (value / localOkr.targetValue) * 100).toFixed(2));
  };

  const {
    keyResult,
    priority,
    status,
    unit,
    chartMetricType,
    chartMetricUnit,
    chartType,
    targetValue,
    milestones,
    monthlyUpdates,
    denominator,
    denominatorLabel,
    numeratorLabel,
  } = localOkr;

  const progress: number = calculateProgress();

  const currentUpdate = getCurrentMonthUpdate(
    localOkr,
    currentMonth,
    currentYear,
  );

  const isPercentageOkr = unit === "percent";
  const isQualitative = unit === "qualitative";
  const isYesNo = unit === "yes_no";
  const isNarrativeOnly = isNarrativeUnit(unit);

  const latestUpdate = useMemo(() => {
    const sorted = sortMonthlyUpdates(monthlyUpdates);
    return sorted.length > 0 ? sorted[sorted.length - 1] : null;
  }, [monthlyUpdates]);

  const monthlyChartData = sortMonthlyUpdates(monthlyUpdates).map((update) => ({
    month: formatMonthYearShort(update.month, update.year),
    fullMonth: update.month,
    fullYear: update.year,
    value: typeof update.value === "number" ? update.value : 0,
    target: okr.targetValue,
    narrative: update.narrative,
    risks: update.risks || [],
    mitigations: update.mitigations || [],
  }));

  const statusColorHex = getStatusColors(status).hex;

  const renderPriorityStars = () => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < priority
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getAvailableChartTypes = () => {
    if (chartMetricType === "yes_no" || chartMetricType === "binary") {
      return ["yes_no"];
    }
    if (chartMetricType === "count" && unit === "counties") {
      return ["bar", "line", "pie", "geomap"];
    }
    return ["bar", "line", "pie"];
  };

  const handleChartTypeChange = (
    newType: "bar" | "line" | "pie" | "geomap" | "yes_no",
  ) => {
    setSelectedChartType(newType);
    onChartTypeChange?.(newType);
  };

  const handlePriorityChangeInternal = async (newPriority: number) => {
    const previousPriority = localOkr.priority;
    setLocalOkr({ ...localOkr, priority: newPriority });

    await toast.promise(updateOKRField(okr.id, { priority: newPriority }), {
      loading: "Updating priority...",
      success: (result) => {
        if (result.success) {
          onPriorityChange?.(localOkr.okrId, newPriority);
          onOkrUpdate({ ...localOkr, priority: newPriority });
          return "Priority updated successfully!";
        } else {
          setLocalOkr({ ...localOkr, priority: previousPriority });
          return result.error || "Failed to update priority";
        }
      },
      error: (err: any) => {
        setLocalOkr({ ...localOkr, priority: previousPriority });
        return err?.message || "An error occurred while updating priority";
      },
    });
  };

  const handleOkrUpdate = (updatedOkr: OkrRecord) => {
    setLocalOkr(updatedOkr);
    onOkrUpdate(updatedOkr);
  };

  const formatTooltip = (params: any) => {
    if (Array.isArray(params) && params.length > 0) {
      const dataIndex = params[0].dataIndex;
      const data = monthlyChartData[dataIndex];
      if (!data) return "";

      const monthDisplay = formatMonthYearDisplay(
        data.fullMonth,
        data.fullYear,
      );
      let tooltip = `<strong>${monthDisplay}</strong><br/>`;

      params.forEach((p: any) => {
        tooltip += `${p.marker} ${p.seriesName}: ${p.value} ${unit}<br/>`;
      });

      if (data.narrative) {
        tooltip += `<br/><div style="max-width: 300px; white-space: normal;"><em>${data.narrative}</em></div>`;
      }

      if (data.risks && data.risks.length > 0) {
        tooltip += `<br/><strong style="color: #ef4444;">⚠ Risks:</strong><br/>`;
        data.risks.forEach((risk: string) => {
          tooltip += `• ${risk}<br/>`;
        });
      }

      if (data.mitigations && data.mitigations.length > 0) {
        tooltip += `<br/><strong style="color: #10b981;">🛡 Mitigations:</strong><br/>`;
        data.mitigations.forEach((mitigation: string) => {
          tooltip += `• ${mitigation}<br/>`;
        });
      }

      return tooltip;
    }
    return "";
  };

  const getChartOption = (): echarts.EChartsOption => {
    const chartType = selectedChartType;

    const toolbox = {
      show: true,
      feature: {
        dataView: {
          show: true,
          readOnly: false,
          title: "Data View",
          lang: ["Data View", "Close", "Refresh"],
        },
        restore: {
          show: true,
          title: "Restore",
        },
        saveAsImage: {
          show: true,
          title: "Save as Image",
        },
      },
      top: 10,
      right: 10,
    };

    const legend = {
      show: true,
      bottom: 0,
      left: "center",
      textStyle: {
        fontSize: 11,
        color: "#374151",
      },
    };

    if (chartType === "yes_no") {
      const currentValue =
        typeof currentUpdate.value === "number" ? currentUpdate.value : 0;
      const isYes = currentValue === 1;

      return {
        series: [
          {
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            radius: "90%",
            center: ["50%", "65%"],
            min: 0,
            max: 1,
            splitNumber: 2,
            progress: {
              show: true,
              width: 30,
              itemStyle: {
                color: isYes ? "#10b981" : "#ef4444",
              },
            },
            axisLine: {
              lineStyle: {
                width: 30,
                color: [[1, "#e5e7eb"]],
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              fontSize: 28,
              fontWeight: "bold",
              offsetCenter: [0, "-20%"],
              formatter: function (value: number) {
                return value === 1 ? "YES" : "NO";
              },
              color: isYes ? "#10b981" : "#ef4444",
            },
            data: [
              {
                value: currentValue,
                name: chartMetricUnit || "",
              },
            ],
          },
        ],
        title: {
          text: chartMetricUnit || "",
          left: "center",
          bottom: "5%",
          textStyle: {
            fontSize: 12,
            color: "#6b7280",
          },
        },
      };
    }

    if (chartType === "geomap") {
      const currentValue = parseFloat((
        typeof currentUpdate.value === "number" ? currentUpdate.value : 0
      ).toFixed(2));

      return {
        toolbox,
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          ...legend,
          data: ["Completed", "Remaining"],
        },
        series: [
          {
            name: "Geographic Distribution",
            type: "pie",
            radius: ["30%", "60%"],
            center: ["50%", "45%"],
            data: [
              {
                value: currentValue,
                name: "Completed",
                itemStyle: { color: statusColorHex },
              },
              {
                value: parseFloat(Math.max(0, targetValue - currentValue).toFixed(2)),
                name: "Remaining",
                itemStyle: { color: "#e5e7eb" },
              },
            ],
            label: {
              show: true,
              formatter: "{b}\n{c} {unit}",
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
        title: {
          text: `${currentValue.toFixed(2)} / ${targetValue} ${unit}`,
          left: "center",
          top: "5%",
          textStyle: {
            fontSize: 14,
            color: "#374151",
          },
        },
      };
    }

    const grid = {
      top: 60,
      right: 20,
      bottom: 60,
      left: 50,
      containLabel: true,
    };

    switch (chartType) {
      case "line":
        return {
          toolbox,
          tooltip: {
            trigger: "axis",
            axisPointer: {},
            formatter: formatTooltip,
            confine: true,
          },
          legend: {
            ...legend,
            data: ["Actual", "Target"],
          },
          grid,
          xAxis: {
            type: "category",
            data: monthlyChartData.map((d) => d.month),
            boundaryGap: false,
            axisLine: {
              lineStyle: { color: "#e5e7eb" },
            },
            axisLabel: {
              fontSize: 10,
              color: "#6b7280",
            },
          },
          yAxis: {
            type: "value",
            axisLine: {
              lineStyle: { color: "#e5e7eb" },
            },
            splitLine: {
              lineStyle: { color: "#f3f4f6", type: "dashed" },
            },
            axisLabel: {
              fontSize: 10,
              color: "#6b7280",
              formatter: (val: number) =>
                chartMetricType === "percentage"
                  ? `${parseFloat(val.toFixed(2))}%`
                  : `${parseFloat(val.toFixed(2))}`,
            },
          },
          series: [
            {
              name: "Actual",
              data: monthlyChartData.map((d) => parseFloat(d.value.toFixed(2))),
              type: "line",
              lineStyle: {
                color: statusColorHex,
                width: 2,
              },
              symbolSize: 8,
              itemStyle: {
                color: statusColorHex,
                borderWidth: 2,
                borderColor: "#fff",
              },
              smooth: true,
              showSymbol: true,
            },
            {
              name: "Target",
              data: monthlyChartData.map(() => targetValue),
              type: "line",
              lineStyle: {
                color: "#dc2626",
                width: 2,
                type: "dashed",
              },
              symbolSize: 6,
              itemStyle: {
                color: "#dc2626",
                borderWidth: 2,
                borderColor: "#fff",
              },
              showSymbol: true,
            },
          ],
        };

      case "bar":
        return {
          toolbox,
          tooltip: {
            trigger: "axis",
            axisPointer: {},
            formatter: formatTooltip,
            confine: true,
          },
          legend: {
            ...legend,
            data: ["Actual", "Target"],
          },
          grid,
          xAxis: {
            type: "category",
            data: monthlyChartData.map((d) => d.month),
            axisLine: {
              lineStyle: { color: "#e5e7eb" },
            },
            axisLabel: {
              fontSize: 10,
              color: "#6b7280",
            },
          },
          yAxis: {
            type: "value",
            axisLine: {
              lineStyle: { color: "#e5e7eb" },
            },
            splitLine: {
              lineStyle: { color: "#f3f4f6", type: "dashed" },
            },
            axisLabel: {
              fontSize: 10,
              color: "#6b7280",
              formatter: (val: number) =>
                chartMetricType === "percentage"
                  ? `${parseFloat(val.toFixed(2))}%`
                  : `${parseFloat(val.toFixed(2))}`,
            },
          },
          series: [
            {
              name: "Actual",
              data: monthlyChartData.map((d) => parseFloat(d.value.toFixed(2))),
              type: "bar",
              itemStyle: {
                color: statusColorHex,
                borderRadius: [8, 8, 0, 0],
              },
              label: {
                show: true,
                position: "top",
                fontSize: 10,
                color: "#374151",
                formatter: (params: any) => String(parseFloat(Number(params.value).toFixed(2))),
              },
            },
            {
              name: "Target",
              data: monthlyChartData.map(() => targetValue),
              type: "line",
              lineStyle: {
                color: "#dc2626",
                width: 2,
                type: "dashed",
              },
              symbolSize: 8,
              itemStyle: {
                color: "#dc2626",
                borderWidth: 2,
                borderColor: "#fff",
              },
              showSymbol: true,
            },
          ],
        };

      case "pie":
        const currentValue =
          typeof currentUpdate.value === "number" ? currentUpdate.value : 0;
        const progressPercentage = parseFloat((
          chartMetricType === "percentage"
            ? currentValue
            : (currentValue / targetValue) * 100
        ).toFixed(2));
        const remainingPercentage = parseFloat(Math.max(0, 100 - progressPercentage).toFixed(2));

        return {
          toolbox,
          tooltip: {
            trigger: "item",
            formatter: (params: any) => {
              if (params.name === "Achieved") {
                return `${params.name}: ${currentValue.toFixed(2)} ${unit} (${params.percent}%)`;
              }
              return `${params.name}: ${params.percent}%`;
            },
          },
          legend: {
            ...legend,
            data: ["Achieved", "Remaining"],
          },
          series: [
            {
              name: "Progress",
              type: "pie",
              radius: ["40%", "70%"],
              center: ["50%", "45%"],
              data: [
                {
                  value: progressPercentage,
                  name: "Achieved",
                  itemStyle: { color: statusColorHex },
                },
                {
                  value: remainingPercentage,
                  name: "Remaining",
                  itemStyle: { color: "#e5e7eb" },
                },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
              label: {
                show: true,
                formatter: (params: any) => {
                  if (params.name === "Achieved") {
                    return `${currentValue}/${targetValue}\n${unit}`;
                  }
                  return `${params.percent}%`;
                },
              },
            },
          ],
        };

      default:
        return {
          toolbox,
          tooltip: {
            trigger: "axis",
            axisPointer: {},
            formatter: formatTooltip,
            confine: true,
          },
          legend: {
            ...legend,
            data: ["Actual"],
          },
          grid,
          xAxis: {
            type: "category",
            data: monthlyChartData.map((d) => d.month),
            axisLine: {
              lineStyle: { color: "#e5e7eb" },
            },
            axisLabel: {
              fontSize: 10,
              color: "#6b7280",
            },
          },
          yAxis: {
            type: "value",
            axisLine: {
              lineStyle: { color: "#e5e7eb" },
            },
            splitLine: {
              lineStyle: { color: "#f3f4f6", type: "dashed" },
            },
            axisLabel: {
              fontSize: 10,
              color: "#6b7280",
              formatter: (val: number) =>
                chartMetricType === "percentage"
                  ? `${parseFloat(val.toFixed(2))}%`
                  : `${parseFloat(val.toFixed(2))}`,
            },
          },
          series: [
            {
              name: "Actual",
              data: monthlyChartData.map((d) => parseFloat(d.value.toFixed(2))),
              type: "bar",
              itemStyle: {
                color: statusColorHex,
                borderRadius: [8, 8, 0, 0],
              },
              label: {
                show: true,
                position: "top",
                fontSize: 10,
                color: "#374151",
                formatter: (params: any) => String(parseFloat(Number(params.value).toFixed(2))),
              },
            },
          ],
        };
    }
  };

  const renderNarrativeCard = () => {
    const update = currentUpdate?.narrative ? currentUpdate : latestUpdate;
    const narrative = update?.narrative;
    const displayMonth = update?.month;
    const displayYear = update?.year;
    const hasUpdates = monthlyUpdates.length > 0;

    if (!hasUpdates) {
      return (
        <div className="bg-card rounded-lg p-6 border border-border flex flex-col items-center justify-center h-[350px]">
          <div className="flex items-center justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-muted-foreground">No Updates</p>
        </div>
      );
    }

    return (
      <div className="bg-card rounded-lg p-4 border border-border flex flex-col gap-3 h-[350px]">
        <p className="text-sm text-foreground leading-relaxed flex-1 overflow-y-auto">
          {narrative || <span className="italic text-muted-foreground">No narrative for this period yet.</span>}
        </p>
        {displayMonth && displayYear && (
          <p className="text-center text-[11px] text-muted-foreground pt-2 border-t border-border/50">
            {formatMonthYearDisplay(displayMonth, displayYear)}
          </p>
        )}
      </div>
    );
  };

  const renderYesNoChart = () => {
    if (monthlyUpdates.length === 0) {
      return (
        <div className="bg-card rounded-lg p-6 border border-border flex flex-col items-center justify-center h-[350px]">
          <div className="flex items-center justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-muted-foreground">No Updates</p>
        </div>
      );
    }

    const currentValue =
      typeof currentUpdate.value === "number" ? currentUpdate.value : 0;
    const isYes = currentValue === 1;

    return (
      <div className="bg-card rounded-lg p-6 border border-border flex flex-col items-center justify-center h-[350px]">
        <div className="flex items-center justify-center mb-4">
          {isYes ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </div>
        <div className="text-center">
          <p
            className="text-2xl font-bold mb-2"
            style={{ color: isYes ? "#10b981" : "#ef4444" }}
          >
            {isYes ? "YES" : "NO"}
          </p>
          <p className="text-sm text-muted-foreground">
            {chartMetricUnit || unit}
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Last Updated:{" "}
            {formatMonthYearDisplay(currentUpdate.month, currentUpdate.year)}
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (selectedChartType === "yes_no") return;

    if (!chartContainerRef.current) return;

    try {
      let chart = chartInstanceRef.current;
      if (!chart) {
        chart = echarts.init(chartContainerRef.current, null, {
          renderer: "canvas",
        });
        chartInstanceRef.current = chart;
      }

      const option = getChartOption();

      if (!option || typeof option !== "object") {
        console.warn("Invalid chart option generated:", option);
        return;
      }

      chart.setOption(option, { notMerge: true });
    } catch (error) {
      console.error("Error rendering chart:", error);
    }

    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedChartType, currentMonth, currentYear, monthlyUpdates]);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in pt-0 pb-5">
        <CardHeader className="pb-0 px-3 relative pt-4 h-[7rem]">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1.5 ">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  OKR: {localOkr.okrId}
                </p>
                <h3
                  className="text-sm font-semibold text-foreground leading-[1.25] text-justify line-clamp-4 cursor-default hover:line-clamp-none transition-all"
                  title={keyResult}
                >
                  {keyResult}
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 pt-5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3" align="end">
                    <div className="space-y-3">
                      {!isNarrativeOnly && (
                        <div className="space-y-2">
                          <label className="text-xs font-medium">
                            Chart Type
                          </label>
                          <Select
                            value={selectedChartType}
                            onValueChange={handleChartTypeChange}
                          >
                            <SelectTrigger className="w-full h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableChartTypes().map((type) => (
                                <SelectItem
                                  key={type}
                                  value={type}
                                  className="text-xs"
                                >
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-xs font-medium">Priority</label>
                        <Select
                          value={String(priority)}
                          onValueChange={(val) =>
                            handlePriorityChangeInternal(Number(val))
                          }
                        >
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem
                                key={num}
                                value={String(num)}
                                className="text-xs"
                              >
                                {num} Star{num !== 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="absolute right-1.5 top-1.5">
            <StatusBadge status={status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0 h-full flex flex-col justify-between">
          <div className="space-y-3 h-full">
            <div className="-mt-5 flex justify-between items-start w-full gap-4">
              <div className="flex flex-col items-start gap-1 justify-between p-2 bg-secondary/30 rounded-lg w-full -ml-5">
                <span className="text-xs font-medium text-muted-foreground">
                  OKR Priority
                </span>
                {renderPriorityStars()}
              </div>

              {!isNarrativeOnly && (
                <div className="w-full">
                  <ProgressBar
                    value={progress}
                    status={status}
                    showPercentage
                    size={"sm"}
                  />
                </div>
              )}
            </div>

            {isNarrativeOnly ? (
              renderNarrativeCard()
            ) : selectedChartType === "yes_no" ? (
              renderYesNoChart()
            ) : (
              <div className="bg-card rounded-lg p-1 border border-border">
                <div
                  ref={chartContainerRef}
                  style={{
                    width: "100%",
                    height: "350px",
                  }}
                />
              </div>
            )}
          </div>

          <div className="h-fit flex flex-col gap-2">
            {/* Last update metadata */}
            {latestUpdate && (latestUpdate.updatedByEmail || latestUpdate.createdByEmail) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-2">
                <User className="w-3 h-3 shrink-0" />
                <span className="truncate font-medium">
                  {latestUpdate.updatedByEmail ?? latestUpdate.createdByEmail}
                </span>
                {(latestUpdate.updatedAt || latestUpdate.createdAt) && (
                  <>
                    <Clock className="w-3 h-3 shrink-0 ml-auto" />
                    <span className="shrink-0">
                      {new Date(
                        latestUpdate.updatedAt ?? latestUpdate.createdAt!,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(localOkr)}>
                View More
              </Button>
              <Button size="sm" className="flex-1" onClick={() => onAddUpdate?.(localOkr)}>
                Add Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

export default OKRCard7;
