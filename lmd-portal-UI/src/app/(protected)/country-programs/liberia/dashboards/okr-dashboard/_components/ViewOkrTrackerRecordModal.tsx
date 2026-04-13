// components/okr/ViewOkrTrackerRecordModal.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useOkrTrackerForm } from "@/hooks/useOkrTrackerForm";
import { OkrRecord, OkrMilestone, isNarrativeUnit } from "@/types/okrTracker";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import * as echarts from "echarts";
import {
  Plus,
  Edit2,
  X,
  AlertTriangle,
  Shield,
  Calendar,
  Target,
  CheckCircle,
  Clock,
  Circle,
  Star,
  ChevronDown,
  ChevronRight,
  Calculator,
  RefreshCw,
} from "lucide-react";
import {
  formatMonthName,
  formatMonthYearDisplay,
  formatMonthYearShort,
  sortMonthlyUpdates,
} from "@/utils/okr-helpers";
import { useOkrStatusColors } from "./useOkrColors";
import { StatusBadge } from "./statusBagde";
import AutoExpandTextarea from "@/components/input/AutoExpandTextarea";
import { ProgressBar } from "./ProgressBar";
import { InfoContainer } from "@/components/infoContainer/infoContainerComponent";

import { toast } from "sonner";
import {
  addMilestone,
  bulkUpdateMilestones,
} from "@/lib/actions/okr-dashboard/milestone";
import { useSession } from "next-auth/react";
import { checkMonthlyUpdateExists } from "@/lib/actions/okr-dashboard/mthupdatesNew";
// import { checkMonthlyUpdateExists } from "@/lib/actions/okr-dashboard/monthlyUpdates";

type Props = {
  okr: OkrRecord;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedOkr: OkrRecord) => void;
  /** When true, auto-opens the Add Update form as soon as the modal mounts. */
  openAddUpdate?: boolean;
};

export function formatOkrMeasurementUnit(
  unit: string,
  value?: number | string,
  chartMetricUnit?: string,
): string {
  if (unit === "percent") return "%";
  if (unit === "yes_no") return value === 0 ? "No" : "Yes";
  return chartMetricUnit || unit;
}

function ViewOkrTrackerRecordModal({ okr, isOpen, onClose, onUpdate, openAddUpdate }: Props) {
  const { data: sessionData } = useSession();
  const userEmail = sessionData?.user.email;

  // local state for OKR
  const [localOkr, setLocalOkr] = useState<OkrRecord>(okr);

  // Collapse states
  const [collapsedUpdates, setCollapsedUpdates] = useState<Set<string>>(
    new Set(),
  );
  const [isMilestonesCollapsed, setIsMilestonesCollapsed] = useState(true);

  // NEW: State for checking month data
  const [isCheckingMonth, setIsCheckingMonth] = useState(false);

  // Chart
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const { getStatusColors } = useOkrStatusColors();

  useEffect(() => {
    setLocalOkr(okr);
  }, [okr]);

  // Collapse all updates by default when OKR changes
  useEffect(() => {
    setCollapsedUpdates((prev) => {
      const newKeys = localOkr.monthlyUpdates.map(
        (u) => `${u.month}_${u.year}`,
      );
      return new Set([...Array.from(prev), ...newKeys]);
    });
  }, [localOkr.monthlyUpdates]);

  const handleUpdate = useCallback(
    (updatedOkr: OkrRecord) => {
      setLocalOkr(updatedOkr);
      onUpdate(updatedOkr);
    },
    [onUpdate],
  );

  // Auto-open the add-update form when requested by parent (e.g. card button)
  const didAutoOpen = useRef(false);

  // Use the custom hook for form management
  const {
    showForm,
    editingUpdate,
    formValues,
    errors,
    newRisk,
    setNewRisk,
    newMitigation,
    setNewMitigation,
    isSubmitting,
    register,
    handleSubmit,
    setValue,
    handleAddUpdate,
    handleEditUpdate,
    handleCancelForm,
    handleAddRisk,
    handleRemoveRisk,
    handleAddMitigation,
    handleRemoveMitigation,
  } = useOkrTrackerForm({
    okr: localOkr,
    onUpdate: handleUpdate,
    userEmail: userEmail!,
  });

  // Auto-open add form when parent requests it (e.g. card "Add Update" button)
  useEffect(() => {
    if (openAddUpdate && isOpen && !didAutoOpen.current) {
      didAutoOpen.current = true;
      handleAddUpdate();
    }
    if (!isOpen) didAutoOpen.current = false;
  }, [openAddUpdate, isOpen, handleAddUpdate]);

  // NEW: Handle month/year change with auto-fill
  const handleMonthYearChange = async (
    selectedMonth: number,
    selectedYear: number,
  ) => {
    const alreadyExists = localOkr.monthlyUpdates.some(
      (update) =>
        update.month === selectedMonth && update.year === selectedYear,
    );

    if (alreadyExists) {
      toast.error(
        `Update for ${formatMonthName(selectedMonth)} ${selectedYear} already exists`,
      );
      setValue("month", 0);
      return;
    }

    if (selectedMonth && selectedYear) {
      setIsCheckingMonth(true);

      const result = await checkMonthlyUpdateExists(
        localOkr.id,
        localOkr.okrId,
        selectedMonth,
        selectedYear,
      );

      setIsCheckingMonth(false);

      if (result.exists && result.data) {
        toast.info(
          `Auto-filled with existing data for ${formatMonthName(selectedMonth)} ${selectedYear}`,
        );

        setValue("month", selectedMonth);
        setValue("year", selectedYear);
        setValue(
          "numerator",
          result.data.numerator != null ? String(result.data.numerator) : "",
        );
        // setValue(
        //   "denominatorOverride",
        //   result.data.denominatorOverride != null
        //     ? String(result.data.denominatorOverride)
        //     : "",
        // );
        // setValue(
        //   "value",
        //   result.data.value != null ? String(result.data.value) : "",
        // );
        // setValue("narrative", result.data.narrative || "");
        // setValue("status", result.data.status || localOkr.status);
        // setValue("risks", result.data.risks || []);
        // setValue("mitigations", result.data.mitigations || []);
      } else {
        setValue("month", selectedMonth);
        setValue("year", selectedYear);
      }
    }
  };

  // NEW: Refresh month data
  const handleRefreshMonthData = async () => {
    if (!formValues.month || !formValues.year) {
      toast.error("Please select month and year first");
      return;
    }

    setIsCheckingMonth(true);

    try {
      const result = await checkMonthlyUpdateExists(
        localOkr.id,
        localOkr.okrId,
        formValues.month,
        formValues.year,
      );

      console.log("resss", result);

      if (result.exists && result.data) {
        toast.success(
          `Refreshed data for ${formatMonthName(formValues.month)} ${formValues.year}`,
        );

        setValue(
          "numerator",
          result.data.numerator != null ? String(result.data.numerator) : "",
        );
        // setValue(
        //   "denominatorOverride",
        //   result.data.denominatorOverride != null
        //     ? String(result.data.denominatorOverride)
        //     : "",
        // );
        // setValue(
        //   "value",
        //   result.data.value != null ? String(result.data.value) : "",
        // );

        // if (result.data.narrative) {
        //   setValue("narrative", result.data.narrative);
        // }

        // if (result.data.status) {
        //   setValue("status", result.data.status);
        // }

        // if (result.data.risks && result.data.risks.length > 0) {
        //   setValue("risks", result.data.risks);
        // }

        // if (result.data.mitigations && result.data.mitigations.length > 0) {
        //   setValue("mitigations", result.data.mitigations);
        // }
      } else {
        toast.info(
          `No existing data found for ${formatMonthName(formValues.month)} ${formValues.year}`,
        );
      }
    } catch (error) {
      console.error("Error refreshing month data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsCheckingMonth(false);
    }
  };

  // Milestone state
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editingMilestoneIndex, setEditingMilestoneIndex] = useState<
    number | null
  >(null);
  const [isSavingMilestone, setIsSavingMilestone] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState<OkrMilestone>({
    milestone: "",
    dueDate: "",
    status: "not_started",
  });

  const getCurrentValue = () => {
    if (localOkr.monthlyUpdates.length === 0) return localOkr.baseline;
    const sorted = sortMonthlyUpdates(localOkr.monthlyUpdates);
    const latestUpdate = sorted[sorted.length - 1];
    return typeof latestUpdate.value === "number"
      ? latestUpdate.value
      : localOkr.baseline;
  };

  const getConfidenceBadgeColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const toggleUpdateCollapse = (updateKey: string) => {
    setCollapsedUpdates((prev) => {
      const next = new Set(prev);
      if (next.has(updateKey)) {
        next.delete(updateKey);
      } else {
        next.add(updateKey);
      }
      return next;
    });
  };

  const renderPriorityStars = () => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < localOkr.priority
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const monthlyChartData = useMemo(
    () =>
      sortMonthlyUpdates(localOkr.monthlyUpdates).map((u) => ({
        month: formatMonthYearShort(u.month, u.year),
        fullMonth: u.month,
        fullYear: u.year,
        value: typeof u.value === "number" ? u.value : 0,
        target: localOkr.targetValue,
        narrative: u.narrative,
        risks: u.risks || [],
        mitigations: u.mitigations || [],
      })),
    [localOkr.monthlyUpdates, localOkr.targetValue],
  );

  const statusColorHex = getStatusColors(localOkr.status).hex;
  const { unit, chartMetricType, chartMetricUnit, targetValue } = localOkr;

  const formatChartTooltip = (params: any) => {
    if (Array.isArray(params) && params.length > 0) {
      const data = monthlyChartData[params[0].dataIndex];
      if (!data) return "";
      let tip = `<strong>${formatMonthYearDisplay(data.fullMonth, data.fullYear)}</strong><br/>`;
      params.forEach((p: any) => {
        tip += `${p.marker} ${p.seriesName}: ${p.value} ${unit}<br/>`;
      });
      if (data.narrative)
        tip += `<br/><div style="max-width:260px;white-space:normal"><em>${data.narrative}</em></div>`;
      if (data.risks?.length) {
        tip += `<br/><strong style="color:#ef4444">⚠ Risks:</strong><br/>`;
        data.risks.forEach((r: string) => {
          tip += `• ${r}<br/>`;
        });
      }
      if (data.mitigations?.length) {
        tip += `<br/><strong style="color:#10b981">🛡 Mitigations:</strong><br/>`;
        data.mitigations.forEach((m: string) => {
          tip += `• ${m}<br/>`;
        });
      }
      return tip;
    }
    return "";
  };

  const getChartOption = useCallback((): echarts.EChartsOption => {
    const ct = localOkr.chartType;
    if (ct === "yes_no") return {};

    const toolbox = {
      show: true,
      feature: {
        dataView: {
          show: true,
          readOnly: false,
          title: "Data View",
          lang: ["Data View", "Close", "Refresh"],
        },
        restore: { show: true, title: "Restore" },
        saveAsImage: { show: true, title: "Save as Image" },
      },
      top: 10,
      right: 10,
    };
    const legend = {
      show: true,
      bottom: 0,
      left: "center",
      textStyle: { fontSize: 11, color: "#374151" },
    };
    const grid = {
      top: 60,
      right: 20,
      bottom: 60,
      left: 50,
      containLabel: true,
    };
    const axisStyle = { lineStyle: { color: "#e5e7eb" } };
    const yAxisLabel = {
      fontSize: 10,
      color: "#6b7280",
      formatter: chartMetricType === "percentage" ? "{value}%" : "{value}",
    };
    const xAxisLabel = { fontSize: 10, color: "#6b7280" };
    const splitLine = {
      lineStyle: { color: "#f3f4f6", type: "dashed" as const },
    };

    if (ct === "pie") {
      const cv =
        typeof getCurrentValue() === "number"
          ? (getCurrentValue() as number)
          : 0;
      const pct =
        chartMetricType === "percentage"
          ? cv
          : Math.round((cv / targetValue) * 100);
      return {
        toolbox,
        tooltip: {
          trigger: "item",
          formatter: (p: any) =>
            p.name === "Achieved"
              ? `${p.name}: ${cv} ${unit} (${p.percent}%)`
              : `${p.name}: ${p.percent}%`,
        },
        legend: { ...legend, data: ["Achieved", "Remaining"] },
        series: [
          {
            name: "Progress",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "45%"],
            data: [
              {
                value: pct,
                name: "Achieved",
                itemStyle: { color: statusColorHex },
              },
              {
                value: Math.max(0, 100 - pct),
                name: "Remaining",
                itemStyle: { color: "#e5e7eb" },
              },
            ],
          },
        ],
      };
    }

    if (ct === "geomap") {
      const cv =
        typeof getCurrentValue() === "number"
          ? (getCurrentValue() as number)
          : 0;
      return {
        toolbox,
        tooltip: { trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
        legend: { ...legend, data: ["Completed", "Remaining"] },
        series: [
          {
            name: "Geographic Distribution",
            type: "pie",
            radius: ["30%", "60%"],
            center: ["50%", "45%"],
            data: [
              {
                value: cv,
                name: "Completed",
                itemStyle: { color: statusColorHex },
              },
              {
                value: Math.max(0, targetValue - cv),
                name: "Remaining",
                itemStyle: { color: "#e5e7eb" },
              },
            ],
          },
        ],
        title: {
          text: `${cv} / ${targetValue} ${unit}`,
          left: "center",
          top: "5%",
          textStyle: { fontSize: 14, color: "#374151" },
        },
      };
    }

    const xData = monthlyChartData.map((d) => d.month);

    if (ct === "line")
      return {
        toolbox,
        grid,
        tooltip: {
          trigger: "axis",
          axisPointer: {},
          formatter: formatChartTooltip,
          confine: true,
        },
        legend: { ...legend, data: ["Actual", "Target"] },
        xAxis: {
          type: "category",
          data: xData,
          boundaryGap: false,
          axisLine: axisStyle,
          axisLabel: xAxisLabel,
        },
        yAxis: {
          type: "value",
          axisLine: axisStyle,
          splitLine,
          axisLabel: yAxisLabel,
        },
        series: [
          {
            name: "Actual",
            type: "line",
            data: monthlyChartData.map((d) => d.value),
            smooth: true,
            symbolSize: 8,
            showSymbol: true,
            lineStyle: { color: statusColorHex, width: 2 },
            itemStyle: {
              color: statusColorHex,
              borderWidth: 2,
              borderColor: "#fff",
            },
          },
          {
            name: "Target",
            type: "line",
            data: monthlyChartData.map(() => targetValue),
            lineStyle: { color: "#dc2626", width: 2, type: "dashed" },
            symbolSize: 6,
            showSymbol: true,
            itemStyle: {
              color: "#dc2626",
              borderWidth: 2,
              borderColor: "#fff",
            },
          },
        ],
      };

    // bar (default)
    return {
      toolbox,
      grid,
      tooltip: {
        trigger: "axis",
        axisPointer: {},
        formatter: formatChartTooltip,
        confine: true,
      },
      legend: { ...legend, data: ["Actual", "Target"] },
      xAxis: {
        type: "category",
        data: xData,
        axisLine: axisStyle,
        axisLabel: xAxisLabel,
      },
      yAxis: {
        type: "value",
        axisLine: axisStyle,
        splitLine,
        axisLabel: yAxisLabel,
      },
      series: [
        {
          name: "Actual",
          type: "bar",
          data: monthlyChartData.map((d) => d.value),
          itemStyle: { color: statusColorHex, borderRadius: [8, 8, 0, 0] },
          label: {
            show: true,
            position: "top",
            fontSize: 10,
            color: "#374151",
          },
        },
        {
          name: "Target",
          type: "bar",
          data: monthlyChartData.map(() => targetValue),
          itemStyle: { color: "#d1d5db", borderRadius: [8, 8, 0, 0] },
          label: { show: true, position: "top", fontSize: 10, color: "#9ca3af" },
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    localOkr.chartType,
    localOkr.status,
    monthlyChartData,
    statusColorHex,
    chartMetricType,
    targetValue,
    unit,
  ]);

  useEffect(() => {
    if (
      !isOpen ||
      localOkr.chartType === "yes_no" ||
      !chartContainerRef.current
    )
      return;
    let chart = chartInstanceRef.current;
    if (!chart) {
      chart = echarts.init(chartContainerRef.current, null, {
        renderer: "canvas",
      });
      chartInstanceRef.current = chart;
    }
    chart.setOption(getChartOption(), { notMerge: true });
    const onResize = () => chart?.resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen, getChartOption, localOkr.chartType]);

  useEffect(() => {
    if (!isOpen && chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
      chartInstanceRef.current = null;
    }
  }, [isOpen]);

  const renderChart = () => (
    <div className="px-3 pb-3">
      <div className="bg-card rounded-lg p-1 border border-border">
        {localOkr.chartType === "yes_no" ? (
          <div className="flex items-center justify-center h-[160px]">
            <span
              className={`text-5xl font-bold ${getCurrentValue() ? "text-green-500" : "text-red-500"}`}
            >
              {getCurrentValue() ? "YES" : "NO"}
            </span>
          </div>
        ) : (
          <div
            ref={chartContainerRef}
            style={{ width: "100%", height: "220px" }}
          />
        )}
      </div>
    </div>
  );

  const renderNarrativeSummary = () => {
    const completedMilestones = localOkr.milestones.filter((m) => m.status === "completed").length;
    const totalMilestones = localOkr.milestones.length;

    return (
      <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-background px-3 pt-2 pb-2 space-y-2 mx-3 mt-3 mb-1 rounded-lg border">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] text-muted-foreground">Milestones</p>
            <p className="text-sm font-bold leading-tight">
              {completedMilestones}/{totalMilestones}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({totalMilestones === 0 ? "0.00" : ((completedMilestones / totalMilestones) * 100).toFixed(2)}%)
              </span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Updates</p>
            <p className="text-sm font-bold leading-tight">
              {localOkr.monthlyUpdates.length}
            </p>
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground pt-1 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Start: {new Date(localOkr.periodStart).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Due: {new Date(localOkr.periodEnd).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderOkrSummary = () => {
    const currentValue = getCurrentValue();
    const completedMilestones = localOkr.milestones.filter(
      (m) => m.status === "completed",
    ).length;
    const totalMilestones = localOkr.milestones.length;

    return (
      <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-background px-3 pt-2 pb-2 space-y-2 mx-3 mt-3 mb-1 rounded-lg border">
        {/* Progress Bar */}
        <ProgressBar
          value={localOkr.progress}
          status={localOkr.status}
          showPercentage={true}
          size="md"
        />

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* Current */}
          <div>
            <p className="text-[10px] text-muted-foreground">Current</p>
            <p className="text-sm font-bold text-primary leading-tight">
              {!isNarrativeUnit(localOkr.unit) && typeof currentValue === "number" ? Number(currentValue).toFixed(2) : currentValue}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                {formatOkrMeasurementUnit(localOkr.unit, currentValue, localOkr.chartMetricUnit)}
              </span>
            </p>
          </div>
          {/* Target */}
          <div>
            <p className="text-[10px] text-muted-foreground">Target</p>
            <p className="text-sm font-bold leading-tight">
              {!isNarrativeUnit(localOkr.unit) && Number(localOkr.targetValue).toFixed(2)}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                {formatOkrMeasurementUnit(localOkr.unit, currentValue, localOkr.chartMetricUnit)}
              </span>
            </p>
          </div>
          {/* Milestones */}
          <div>
            <p className="text-[10px] text-muted-foreground">Milestones</p>
            <p className="text-sm font-bold leading-tight">
              {completedMilestones}/{totalMilestones}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({totalMilestones === 0 ? "0.00" : (completedMilestones / totalMilestones * 100).toFixed(2)}%)
              </span>
            </p>
          </div>
          {/* Updates */}
          <div>
            <p className="text-[10px] text-muted-foreground">Updates</p>
            <p className="text-sm font-bold leading-tight">
              {localOkr.monthlyUpdates.length}
            </p>
          </div>
        </div>

        {/* Period */}
        <div className="flex justify-between text-[10px] text-muted-foreground pt-1 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              Start: {new Date(localOkr.periodStart).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              Due: {new Date(localOkr.periodEnd).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Milestone handlers
  const handleAddMilestone = () => {
    setEditingMilestoneIndex(null);
    setMilestoneForm({
      milestone: "",
      dueDate: "",
      status: "not_started",
    });
    setShowMilestoneForm(true);
  };

  const handleEditMilestone = (index: number) => {
    const milestone = localOkr.milestones[index];
    setEditingMilestoneIndex(index);
    setMilestoneForm({
      milestone: milestone.milestone,
      dueDate: milestone.dueDate,
      status: milestone.status,
      completionDate: milestone.completionDate,
    });
    setShowMilestoneForm(true);
  };

  const handleCancelMilestoneForm = () => {
    setShowMilestoneForm(false);
    setEditingMilestoneIndex(null);
    setMilestoneForm({
      milestone: "",
      dueDate: "",
      status: "not_started",
    });
  };

  const handleSubmitMilestone = async () => {
    if (!milestoneForm.milestone.trim() || !milestoneForm.dueDate) {
      toast.error("Milestone name and due date are required");
      return;
    }

    setIsSavingMilestone(true);

    const milestoneData = {
      milestone: milestoneForm.milestone.trim(),
      dueDate: milestoneForm.dueDate,
      status: milestoneForm.status,
      ...(milestoneForm.status === "completed" && milestoneForm.completionDate
        ? { completionDate: milestoneForm.completionDate }
        : {}),
    };

    const previousMilestones = [...localOkr.milestones];

    if (editingMilestoneIndex !== null) {
      const updatedMilestones = localOkr.milestones.map((milestone, index) =>
        index === editingMilestoneIndex ? milestoneData : milestone,
      );

      const optimisticOkr: OkrRecord = {
        ...localOkr,
        milestones: updatedMilestones,
      };

      handleUpdate(optimisticOkr);

      await toast.promise(
        bulkUpdateMilestones(localOkr.id, updatedMilestones),
        {
          loading: "Saving milestone...",
          success: (result) => {
            if (result.success) {
              handleCancelMilestoneForm();
              setIsSavingMilestone(false);
              return "Milestone updated successfully!";
            } else {
              handleUpdate({
                ...localOkr,
                milestones: previousMilestones,
              });
              setIsSavingMilestone(false);
              throw new Error(result.error || "Failed to save milestone");
            }
          },
          error: (err: any) => {
            handleUpdate({
              ...localOkr,
              milestones: previousMilestones,
            });
            setIsSavingMilestone(false);
            return err?.message || "An error occurred while saving milestone";
          },
        },
      );
    } else {
      const optimisticOkr: OkrRecord = {
        ...localOkr,
        milestones: [...localOkr.milestones, milestoneData],
      };

      handleUpdate(optimisticOkr);

      await toast.promise(addMilestone(localOkr.id, milestoneData), {
        loading: "Adding milestone...",
        success: (result) => {
          if (result.success) {
            handleCancelMilestoneForm();
            setIsSavingMilestone(false);
            return "Milestone added successfully!";
          } else {
            handleUpdate({
              ...localOkr,
              milestones: previousMilestones,
            });
            setIsSavingMilestone(false);
            throw new Error(result.error || "Failed to add milestone");
          }
        },
        error: (err: any) => {
          handleUpdate({
            ...localOkr,
            milestones: previousMilestones,
          });
          setIsSavingMilestone(false);
          return err?.message || "An error occurred while adding milestone";
        },
      });
    }
  };

  const handleRemoveMilestone = async (index: number) => {
    const previousMilestones = [...localOkr.milestones];
    const updatedMilestones = localOkr.milestones.filter((_, i) => i !== index);

    const optimisticOkr: OkrRecord = {
      ...localOkr,
      milestones: updatedMilestones,
    };

    handleUpdate(optimisticOkr);

    await toast.promise(bulkUpdateMilestones(localOkr.id, updatedMilestones), {
      loading: "Removing milestone...",
      success: (result) => {
        if (result.success) {
          return "Milestone removed successfully!";
        } else {
          handleUpdate({
            ...localOkr,
            milestones: previousMilestones,
          });
          throw new Error(result.error || "Failed to remove milestone");
        }
      },
      error: (err: any) => {
        handleUpdate({
          ...localOkr,
          milestones: previousMilestones,
        });
        return err?.message || "An error occurred while removing milestone";
      },
    });
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
      case "in_progress":
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800";
    }
  };

  const renderMilestonesSection = () => (
    <div className="space-y-3 mt-6 px-4">
      {/* Collapsible Header */}
      <div
        className="flex items-center justify-between cursor-pointer p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
        onClick={() => setIsMilestonesCollapsed(!isMilestonesCollapsed)}
      >
        <div className="flex items-center gap-2">
          {isMilestonesCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          <Target className="w-5 h-5 text-primary" />
          <h4 className="font-semibold">Milestones</h4>
          <Badge variant="secondary" className="text-xs">
            {localOkr.milestones.filter((m) => m.status === "completed").length}
            /{localOkr.milestones.length}
          </Badge>
        </div>
        {!showMilestoneForm && !isMilestonesCollapsed && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddMilestone();
            }}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        )}
      </div>

      {/* Milestones Content */}
      {!isMilestonesCollapsed && (
        <div className="space-y-3 pl-3">
          {showMilestoneForm && (
            <div className="p-4 bg-background rounded-lg border space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-sm">
                  {editingMilestoneIndex !== null
                    ? "Edit Milestone"
                    : "New Milestone"}
                </h5>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCancelMilestoneForm}
                  disabled={isSavingMilestone}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="milestone-name">
                    Milestone Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="milestone-name"
                    placeholder="Enter milestone name..."
                    value={milestoneForm.milestone}
                    onChange={(e) =>
                      setMilestoneForm({
                        ...milestoneForm,
                        milestone: e.target.value,
                      })
                    }
                    disabled={isSavingMilestone}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="milestone-due-date">
                      Due Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="milestone-due-date"
                      type="date"
                      value={milestoneForm.dueDate}
                      onChange={(e) =>
                        setMilestoneForm({
                          ...milestoneForm,
                          dueDate: e.target.value,
                        })
                      }
                      disabled={isSavingMilestone}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="milestone-status">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="milestone-status"
                      className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={milestoneForm.status}
                      onChange={(e) =>
                        setMilestoneForm({
                          ...milestoneForm,
                          status: e.target.value as
                            | "not_started"
                            | "in_progress"
                            | "completed",
                        })
                      }
                      disabled={isSavingMilestone}
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {milestoneForm.status === "completed" && (
                  <div className="space-y-2">
                    <Label htmlFor="milestone-completion-date">
                      Completion Date
                    </Label>
                    <Input
                      id="milestone-completion-date"
                      type="date"
                      value={milestoneForm.completionDate || ""}
                      onChange={(e) =>
                        setMilestoneForm({
                          ...milestoneForm,
                          completionDate: e.target.value,
                        })
                      }
                      disabled={isSavingMilestone}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelMilestoneForm}
                  disabled={isSavingMilestone}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitMilestone}
                  disabled={isSavingMilestone}
                >
                  {isSavingMilestone
                    ? "Saving..."
                    : editingMilestoneIndex !== null
                      ? "Save Changes"
                      : "Add Milestone"}
                </Button>
              </div>
            </div>
          )}

          {localOkr.milestones.length > 0 ? (
            <div className="space-y-2">
              {localOkr.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border ${getMilestoneStatusColor(milestone.status)}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      {getMilestoneIcon(milestone.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {milestone.milestone}
                        </p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            Due:{" "}
                            {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                          {milestone.completionDate && (
                            <span className="text-xs text-green-600 dark:text-green-400">
                              Completed:{" "}
                              {new Date(
                                milestone.completionDate,
                              ).toLocaleDateString()}
                            </span>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {milestone.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEditMilestone(index)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveMilestone(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !showMilestoneForm && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No milestones added yet. Click &quot;Add&quot; to create one.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );

  const renderMonthlyUpdatesList = () => {
    const sortedUpdates = sortMonthlyUpdates(localOkr.monthlyUpdates).reverse();

    return (
      <div className="space-y-4 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-background px-4 py-3 bg-gray-100 dark:bg-gray-800 z-[20]">
          <div>
            <h3 className="text-lg font-semibold">Monthly Updates</h3>
            <p className="text-xs text-muted-foreground">
              {localOkr.monthlyUpdates.length} update
              {localOkr.monthlyUpdates.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={handleAddUpdate} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Update
          </Button>
        </div>

        {/* Milestones Section */}
        {renderMilestonesSection()}

        {/* Updates List */}
        <div className="space-y-3 mt-6 px-4">
          <h4 className="font-semibold text-sm text-muted-foreground">
            Progress Updates
          </h4>
          {sortedUpdates.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No monthly updates yet
              </p>
              <Button
                onClick={handleAddUpdate}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Update
              </Button>
            </div>
          ) : (
            sortedUpdates.map((update, index) => {
              const updateKey = `${update.month}_${update.year}`;
              const isCollapsed = collapsedUpdates.has(updateKey);
              const hasRisks = update.risks && update.risks.length > 0;
              const hasMitigations =
                update.mitigations && update.mitigations.length > 0;
              const hasMetadata =
                update.createdAt ||
                update.createdByEmail ||
                update.updatedAt ||
                update.updatedByEmail;
              const hasDetails = hasRisks || hasMitigations || hasMetadata;

              // Calculate display value for percentage OKRs
              const displayValue = (() => {
                if (
                  localOkr.unit === "percent" &&
                  update.numerator != null &&
                  typeof update.numerator === "number"
                ) {
                  const denom =
                    update.denominatorOverride || (localOkr.denominator ?? 0);

                  if (denom && denom !== 0) {
                    const percentage = (
                      (update.numerator / denom) *
                      100
                    ).toFixed(1);
                    return (
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="text-sm font-bold text-primary">
                          {percentage}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {update.numerator} / {denom}
                        </div>
                      </div>
                    );
                  }
                }

                return (
                  <span className="text-sm font-bold text-primary">
                    {!isNarrativeUnit(localOkr.unit) && update.value}{" "}
                    {formatOkrMeasurementUnit(localOkr.unit, update.value, localOkr.chartMetricUnit)}
                  </span>
                );
              })();

              return (
                <div
                  key={updateKey}
                  className="rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  {/* Update Header - Always Visible */}
                  <div
                    className="px-3 py-2 cursor-pointer"
                    onClick={() => toggleUpdateCollapse(updateKey)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span className="text-sm font-semibold">
                          {formatMonthYearDisplay(update.month, update.year)}
                        </span>
                        {(hasRisks || hasMitigations) && (
                          <div className="flex items-center gap-1">
                            {hasRisks && (
                              <Badge variant="destructive" className="text-xs">
                                {update.risks!.length} Risk
                                {update.risks!.length > 1 ? "s" : ""}
                              </Badge>
                            )}
                            {hasMitigations && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              >
                                {update.mitigations!.length} Mitigation
                                {update.mitigations!.length > 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {!isNarrativeUnit(localOkr.unit) && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-md">
                            {displayValue}
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditUpdate(update);
                          }}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Narrative - Always visible */}
                    <p className="text-sm text-muted-foreground leading-relaxed pl-5">
                      {update.narrative}
                    </p>
                  </div>

                  {/* Collapsible Details — risks, mitigations & metadata */}
                  {!isCollapsed && hasDetails && (
                    <div className="px-3 pb-2 space-y-2 border-t pt-2">
                      {hasMetadata && (
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground py-1">
                          {update.createdAt && update.createdByEmail && (
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="font-medium text-foreground">Created by:</span>
                              <span className="text-primary font-medium">{update.createdByEmail}</span>
                              <span>•</span>
                              <span>{new Date(update.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          )}
                          {update.updatedAt && update.updatedByEmail && update.createdAt !== update.updatedAt && (
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="font-medium text-foreground">Updated by:</span>
                              <span className="text-primary font-medium">{update.updatedByEmail}</span>
                              <span>•</span>
                              <span>{new Date(update.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {(hasRisks || hasMitigations) && (
                    <div className="space-y-2">
                      {/* Risks */}
                      {hasRisks && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">
                                Risks Identified:
                              </p>
                              <ul className="space-y-1">
                                {update.risks!.map((risk, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-red-600 dark:text-red-400"
                                  >
                                    • {risk}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mitigations */}
                      {hasMitigations && (
                        <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                          <div className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">
                                Mitigations Applied:
                              </p>
                              <ul className="space-y-1">
                                {update.mitigations!.map((mitigation, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-green-600 dark:text-green-400"
                                  >
                                    • {mitigation}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderUpdateForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background px-4 py-3 bg-gray-100 dark:bg-gray-800 z-[20]">
        <div>
          <h3 className="text-lg font-semibold">
            {editingUpdate ? "Edit Update" : "Add New Update"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {editingUpdate
              ? `Editing ${formatMonthYearDisplay(formValues.month, formValues.year)}`
              : "Add a new monthly progress update"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancelForm}
          type="button"
          disabled={isSubmitting || isCheckingMonth}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 mx-4">
        {/* Month Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="month">
              Month <span className="text-red-500">*</span>
            </Label>
            {!editingUpdate && !isNarrativeUnit(localOkr.unit) && formValues.month && formValues.year && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefreshMonthData}
                disabled={isCheckingMonth || isSubmitting}
                className="h-7 px-2 text-xs"
              >
                <RefreshCw
                  className={`w-3 h-3 mr-1 ${isCheckingMonth ? "animate-spin" : ""}`}
                />
                {isCheckingMonth ? "Refreshing..." : "Refresh Data"}
              </Button>
            )}
          </div>

          {editingUpdate ? (
            <Input
              id="month"
              value={formatMonthYearDisplay(formValues.month, formValues.year)}
              disabled
              className="bg-muted"
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <select
                    id="month-select"
                    value={String(formValues.month)}
                    onChange={(e) => {
                      const selectedMonth = Number(e.target.value);
                      handleMonthYearChange(selectedMonth, formValues.year);
                    }}
                    disabled={isCheckingMonth || isSubmitting}
                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">
                      {isCheckingMonth ? "Checking..." : "Select Month"}
                    </option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                      const hasUpdate = localOkr.monthlyUpdates.some(
                        (update) =>
                          update.month === m && update.year === formValues.year,
                      );

                      return (
                        <option key={m} value={m} disabled={hasUpdate}>
                          {formatMonthName(m)}{" "}
                          {hasUpdate ? "(Already updated)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="space-y-2">
                  <Input
                    id="year-input"
                    type="number"
                    placeholder="Year"
                    value={formValues.year || ""}
                    onChange={(e) => {
                      const selectedYear = Number(e.target.value);
                      if (formValues.month) {
                        handleMonthYearChange(formValues.month, selectedYear);
                      } else {
                        setValue("year", selectedYear);
                      }
                    }}
                    disabled={isCheckingMonth || isSubmitting}
                    min={2020}
                    max={2100}
                  />
                </div>
              </div>
              {errors.month && (
                <p className="text-sm text-red-500">{errors.month.message}</p>
              )}
            </>
          )}
        </div>

        {/* Show indicator if auto-computed */}
        {formValues.narrative &&
          formValues.narrative.includes("Auto-computed") && (
            <Badge variant="secondary" className="text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              Auto-computed from data pipeline
            </Badge>
          )}

        {/* Value Field - Conditional based on OKR type */}
        {localOkr.unit === "percent" ? (
          <>
            {/* Numerator Input */}
            <div className="space-y-2">
              <Label htmlFor="numerator">
                {localOkr.numeratorLabel || "Numerator"}{" "}
                <span className="text-red-500">*</span>
                <InfoContainer
                  id={"okrTrackerFormNumeratorHint"}
                  text={
                    localOkr.denominatorLabel
                      ? `Enter ${localOkr.numeratorLabel!.toLowerCase()}`
                      : "Enter actual count"
                  }
                />
              </Label>
              <Input
                id="numerator"
                type="number"
                step="any"
                placeholder={`Enter ${localOkr.numeratorLabel?.toLowerCase() || "numerator"}`}
                {...register("numerator")}
                className={errors.numerator ? "border-red-500" : ""}
                disabled={isCheckingMonth || isSubmitting}
              />
              {errors.numerator && (
                <p className="text-sm text-red-500">
                  {errors.numerator.message}
                </p>
              )}
            </div>

            {/* Denominator Override (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="denominatorOverride">
                {localOkr.denominatorLabel || "Total"}{" "}
                <span className="text-xs text-muted-foreground">
                  (Default: {localOkr.denominator || "Not set"})
                </span>
                <InfoContainer
                  id={"okrTrackerFormDenominatorHint"}
                  text="Leave blank to use the default denominator. Override only if the total has changed."
                />
              </Label>
              <Input
                id="denominatorOverride"
                type="number"
                step="any"
                placeholder={`Override default (${localOkr.denominator || "not set"})`}
                {...register("denominatorOverride")}
                disabled={isCheckingMonth || isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to use the default denominator
              </p>
            </div>

            {/* Calculated Percentage Display */}
            {(() => {
              const num = parseFloat(formValues.numerator || "0");
              const denom = formValues.denominatorOverride
                ? parseFloat(formValues.denominatorOverride)
                : localOkr.denominator;

              if (!isNaN(num) && denom && denom !== 0) {
                const percentage = ((num / denom) * 100).toFixed(2);
                return (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <Label className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Calculated Percentage:
                      </Label>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {percentage}%
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      {num} / {denom} × 100
                    </p>
                  </div>
                );
              }
              return null;
            })()}
          </>
        ) : localOkr.unit === "yes_no" ? (
          // Yes/No toggle — handled below
          // Yes/No toggle buttons
          <div className="space-y-2">
            <Label>
              Response <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-3">
              {(["1", "0"] as const).map((val) => {
                const isSelected = String(formValues.value) === val;
                const isYes = val === "1";
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setValue("value", val)}
                    disabled={isCheckingMonth || isSubmitting}
                    className={`flex-1 py-3 rounded-md border-2 font-semibold text-sm transition-colors ${
                      isSelected
                        ? isYes
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                        : "border-border bg-background text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {isYes ? "✓ Yes" : "✗ No"}
                  </button>
                );
              })}
            </div>
            {errors.value && (
              <p className="text-sm text-red-500">{errors.value.message}</p>
            )}
          </div>
        ) : isNarrativeUnit(localOkr.unit) ? null : (
          // Regular value input for other units
          <>
            <div className="space-y-2">
              <Label htmlFor="value">
                {localOkr.valuePrompt || "Value"}{" "}
                <span className="text-red-500">*</span>
                <InfoContainer
                  id={"okrTrackerFormValueHint"}
                  text={localOkr.valueHint || "No hint"}
                />
              </Label>
              <div className="relative">
                <Input
                  id="value"
                  type="number"
                  placeholder={`Enter value${
                    localOkr.unit === "counties"
                      ? " (number of counties)"
                      : localOkr.unit === "currency"
                        ? " (amount)"
                        : ""
                  }`}
                  {...register("value")}
                  min={localOkr.minValue}
                  max={localOkr.maxValue}
                  step={localOkr.unit === "currency" ? "0.01" : "1"}
                  className={`${localOkr.unit === "currency" ? "pl-7" : ""} ${
                    errors.value ? "border-red-500" : ""
                  }`}
                  disabled={isCheckingMonth || isSubmitting}
                />
                {localOkr.unit === "currency" && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                )}
              </div>
              {errors.value && (
                <p className="text-sm text-red-500">{errors.value.message}</p>
              )}
            </div>
          </>
        )}

        {/* Narrative Field */}
        <div className="space-y-2">
          <Label htmlFor="narrative">
            Narrative <span className="text-red-500">*</span>
            <InfoContainer
              id={"okrTrackerFormNarrativeHint"}
              text={
                "Provide any details on progress, challenges, and achievements."
              }
            />
          </Label>
          <AutoExpandTextarea
            id="narrative"
            placeholder="Describe the progress, challenges, and achievements for this month..."
            {...register("narrative")}
            minRows={4}
            maxHeight={240}
            disabled={isCheckingMonth || isSubmitting}
          />
          {errors.narrative && (
            <p className="text-sm text-red-500">{errors.narrative.message}</p>
          )}
        </div>

        {/* Status Field */}
        <div className="space-y-2">
          <Label htmlFor="status">
            OKR Status <span className="text-red-500">*</span>
            <InfoContainer
              placement={"right"}
              id={"okrTrackerFormStatusHint"}
              text={
                "Select the current status of the OKR based on overall progress. Select from options like On Track, At Risk, Delayed, Achieved, or Under Review. Where At Risk mean there are potential issues that could impact success, Delayed indicates significant setbacks, Achieved means the OKR has been successfully met, and Under Review suggests the status is being evaluated."
              }
            />
          </Label>
          <select
            id="status"
            {...register("status")}
            className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            disabled={isCheckingMonth || isSubmitting}
          >
            <option value="on_track">On Track</option>
            <option value="at_risk">At Risk</option>
            <option value="delayed">Delayed</option>
            <option value="achieved">Achieved</option>
            <option value="okr_under_review">Under Review</option>
          </select>
        </div>

        {/* Only show Risks and Mitigations if status is NOT achieved */}
        {formValues.status !== "achieved" && (
          <>
            {/* Risks Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Risks{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (Optional)
                </span>
              </Label>
              <p className="text-xs text-muted-foreground">
                List specific threats or blockers that could prevent this OKR from being achieved — e.g. resource constraints, dependencies, or external factors. These are distinct from the narrative, which describes what has already happened.
              </p>
              <div className="flex gap-2">
                <AutoExpandTextarea
                  placeholder="Add a risk..."
                  value={newRisk}
                  onChange={(e) => setNewRisk(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddRisk();
                    }
                  }}
                  minRows={1}
                  maxHeight={120}
                  disabled={isCheckingMonth || isSubmitting}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddRisk}
                  disabled={isCheckingMonth || isSubmitting}
                >
                  Add
                </Button>
              </div>
              {formValues.risks && formValues.risks.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formValues.risks.map((risk, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded"
                    >
                      <span className="flex-1 text-xs text-red-900 dark:text-red-100">
                        {risk}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveRisk(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mitigations Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Mitigations{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (Optional)
                </span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Describe the actions being taken to address the risks listed above — e.g. contingency plans, workarounds, or escalations. Not a summary of progress; that belongs in the narrative.
              </p>
              <div className="flex gap-2">
                <AutoExpandTextarea
                  placeholder="Add a mitigation..."
                  value={newMitigation}
                  onChange={(e) => setNewMitigation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddMitigation();
                    }
                  }}
                  minRows={1}
                  maxHeight={120}
                  disabled={isCheckingMonth || isSubmitting}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddMitigation}
                  disabled={isCheckingMonth || isSubmitting}
                >
                  Add
                </Button>
              </div>
              {formValues.mitigations && formValues.mitigations.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formValues.mitigations.map((mitigation, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded"
                    >
                      <span className="flex-1 text-xs text-green-900 dark:text-green-100">
                        {mitigation}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveMitigation(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 justify-end p-3 sticky bottom-0 bg-background border-t">
        <Button
          variant="outline"
          onClick={handleCancelForm}
          type="button"
          disabled={isSubmitting || isCheckingMonth}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isCheckingMonth}>
          {isSubmitting || isCheckingMonth
            ? "Loading..."
            : editingUpdate
              ? "Save Changes"
              : "Add Update"}
        </Button>
      </div>
    </form>
  );

  // Escape key handler
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        handleCancelForm();
        setShowMilestoneForm(false);
      }
    };
    if (isOpen) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
    handleCancelForm();
    setShowMilestoneForm(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={handleClose}
      />
      {/* Modal panel */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none`}
      >
      <div
        className={`w-full max-w-3xl flex flex-col shadow-2xl rounded-xl overflow-hidden pointer-events-auto transition-all duration-200 ease-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{ maxHeight: "90dvh" }}
      >
        {/* Hero header */}
        <div className="bg-gradient-to-br from-lmh-dark-blue to-[#1e4d62] px-4 py-3 shrink-0">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-white/15 text-white">
                OKR {localOkr.okrId}
              </span>
              {localOkr.status && <StatusBadge status={localOkr.status} />}
              <Badge className={getConfidenceBadgeColor(localOkr.confidenceLevel)}>
                {localOkr.confidenceLevel.toUpperCase()} Confidence
              </Badge>
              {renderPriorityStars()}
            </div>
            <button
              onClick={handleClose}
              className="text-white/60 hover:text-white transition-colors p-1 -mr-1 rounded shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 className="text-base font-bold text-white leading-tight mb-1">
            {localOkr.keyResult}
          </h2>
          <p className="text-xs text-white/50 leading-relaxed line-clamp-1 flex items-center gap-1.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/15 text-white/80 shrink-0">
              TOC
            </span>
            {localOkr.objective}
          </p>
        </div>
        {/* Scrollable — progress + chart + monthly updates + milestones */}
        <div className="flex-1 overflow-y-auto bg-background">
          {isNarrativeUnit(localOkr.unit) ? renderNarrativeSummary() : (
            <>
              {renderOkrSummary()}
              {renderChart()}
            </>
          )}
          {showForm ? renderUpdateForm() : renderMonthlyUpdatesList()}
        </div>
      </div>
      </div>
    </>
  );
}

export default ViewOkrTrackerRecordModal;
