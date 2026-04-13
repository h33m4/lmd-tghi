import React, { useState } from "react";
import {
  ChartConfig,
  CHART_PRESETS,
  ChartType,
  LegendPosition,
  LineStyle,
  TooltipTrigger,
  AnimationEasing,
} from "./types";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ChartConfigPanelProps {
  config: ChartConfig;
  onConfigChange: (key: keyof ChartConfig, value: any) => void;
  onApplyPreset?: (preset: keyof typeof CHART_PRESETS) => void;
  onReset?: () => void;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
  collapsible?: boolean;
  showAdvanced?: boolean;
}

const chartTypes: ChartType[] = [
  "line",
  "bar",
  "area",
  "scatter",
  "pie",
  "donut",
  "gauge",
  "radar",
  "candlestick",
  "heatmap",
  "sankey",
  "graph",
];

const legendPositions: LegendPosition[] = ["top", "bottom", "left", "right"];
const lineStyles: LineStyle[] = ["solid", "dashed", "dotted"];
const tooltipTriggers: TooltipTrigger[] = ["item", "axis", "none"];

const animationEasings: AnimationEasing[] = [
  "linear",
  "cubicOut",
  "cubicInOut",
  "elasticOut",
  "bounceOut",
];

export const ChartConfigPanel: React.FC<ChartConfigPanelProps> = ({
  config,
  onConfigChange,
  onApplyPreset,
  onReset,
  isOpen = true,
  onToggleOpen,
  collapsible = true,
  showAdvanced = false,
}) => {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced" | "presets">(
    "basic"
  );
  const [showAdvancedTab, setShowAdvancedTab] = useState(showAdvanced);

  const tabs = [
    { id: "basic" as const, label: "Basic" },
    { id: "advanced" as const, label: "Advanced", hidden: !showAdvancedTab },
    { id: "presets" as const, label: "Presets" },
  ].filter((tab) => !tab.hidden);

  return (
    <div className="bg-muted/50 rounded-lg border border-border">
      {collapsible && (
        <button
          onClick={() => onToggleOpen?.(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/70 transition-colors"
        >
          <span className="font-medium text-sm">Chart Configuration</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary -mb-1"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Basic Tab */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              {/* Chart Type */}
              <SettingGroup label="Chart Type">
                <SelectInput
                  value={config.chartType}
                  options={chartTypes}
                  onChange={(value) =>
                    onConfigChange("chartType", value as ChartType)
                  }
                />
              </SettingGroup>

              {/* Display Options */}
              <SettingGroup label="Display">
                <div className="space-y-2">
                  <CheckboxInput
                    label="Show Target Line"
                    checked={config.showTarget}
                    onChange={(value) => onConfigChange("showTarget", value)}
                  />
                  <CheckboxInput
                    label="Show Grid Lines"
                    checked={config.showGridLines}
                    onChange={(value) => onConfigChange("showGridLines", value)}
                  />
                  <CheckboxInput
                    label="Show Tooltip"
                    checked={config.showTooltip}
                    onChange={(value) => onConfigChange("showTooltip", value)}
                  />
                  <CheckboxInput
                    label="Show Legend"
                    checked={config.showLegend}
                    onChange={(value) => onConfigChange("showLegend", value)}
                  />
                  <CheckboxInput
                    label="Smooth Curve"
                    checked={config.smoothCurve}
                    onChange={(value) => onConfigChange("smoothCurve", value)}
                  />
                </div>
              </SettingGroup>

              {/* Animation */}
              <SettingGroup label="Animation">
                <div className="space-y-2">
                  <CheckboxInput
                    label="Enable Animations"
                    checked={config.showAnimations}
                    onChange={(value) =>
                      onConfigChange("showAnimations", value)
                    }
                  />
                  {config.showAnimations && (
                    <>
                      <RangeInput
                        label={`Duration: ${config.animationDuration}ms`}
                        min={100}
                        max={2000}
                        step={100}
                        value={config.animationDuration}
                        onChange={(value) =>
                          onConfigChange("animationDuration", value)
                        }
                      />
                      <SelectInput
                        label="Easing"
                        value={config.animationEasing}
                        options={animationEasings}
                        onChange={(value) =>
                          onConfigChange(
                            "animationEasing",
                            value as AnimationEasing
                          )
                        }
                      />
                    </>
                  )}
                </div>
              </SettingGroup>

              {/* Legend */}
              <SettingGroup label="Legend">
                <div className="space-y-2">
                  <SelectInput
                    label="Position"
                    value={config.legendPosition}
                    options={legendPositions}
                    onChange={(value) =>
                      onConfigChange("legendPosition", value as LegendPosition)
                    }
                  />
                </div>
              </SettingGroup>

              {/* Line & Series */}
              <SettingGroup label="Line & Series">
                <div className="space-y-2">
                  <RangeInput
                    label={`Line Width: ${config.lineWidth}`}
                    min={1}
                    max={5}
                    value={config.lineWidth}
                    onChange={(value) => onConfigChange("lineWidth", value)}
                  />
                  <RangeInput
                    label={`Data Point Size: ${config.dataPointSize}`}
                    min={2}
                    max={16}
                    value={config.dataPointSize}
                    onChange={(value) => onConfigChange("dataPointSize", value)}
                  />
                  <RangeInput
                    label={`Area Opacity: ${(config.areaOpacity * 100).toFixed(
                      0
                    )}%`}
                    min={0.1}
                    max={1}
                    step={0.1}
                    value={config.areaOpacity}
                    onChange={(value) => onConfigChange("areaOpacity", value)}
                  />
                </div>
              </SettingGroup>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === "advanced" && (
            <div className="space-y-4">
              {/* Tooltip Configuration */}
              <SettingGroup label="Tooltip">
                <div className="space-y-2">
                  <SelectInput
                    label="Trigger Type"
                    value={config.tooltipTrigger}
                    options={tooltipTriggers}
                    onChange={(value) =>
                      onConfigChange("tooltipTrigger", value as TooltipTrigger)
                    }
                  />
                  <ColorInput
                    label="Background Color"
                    value={config.tooltipBackgroundColor}
                    onChange={(value) =>
                      onConfigChange("tooltipBackgroundColor", value)
                    }
                  />
                  <ColorInput
                    label="Text Color"
                    value={config.tooltipTextColor}
                    onChange={(value) =>
                      onConfigChange("tooltipTextColor", value)
                    }
                  />
                  <RangeInput
                    label={`Text Size: ${config.tooltipTextSize}px`}
                    min={8}
                    max={16}
                    value={config.tooltipTextSize}
                    onChange={(value) =>
                      onConfigChange("tooltipTextSize", value)
                    }
                  />
                </div>
              </SettingGroup>

              {/* Target Line */}
              <SettingGroup label="Target Line">
                <div className="space-y-2">
                  <SelectInput
                    label="Line Style"
                    value={config.targetLineStyle}
                    options={lineStyles}
                    onChange={(value) =>
                      onConfigChange("targetLineStyle", value as LineStyle)
                    }
                  />
                  <RangeInput
                    label={`Line Width: ${config.targetLineWidth}`}
                    min={1}
                    max={4}
                    value={config.targetLineWidth}
                    onChange={(value) =>
                      onConfigChange("targetLineWidth", value)
                    }
                  />
                  <ColorInput
                    label="Line Color"
                    value={config.targetLineColor}
                    onChange={(value) =>
                      onConfigChange("targetLineColor", value)
                    }
                  />
                </div>
              </SettingGroup>

              {/* Grid & Axis */}
              <SettingGroup label="Grid & Axis">
                <div className="space-y-2">
                  <CheckboxInput
                    label="Show Axis Lines"
                    checked={config.showAxisLines}
                    onChange={(value) => onConfigChange("showAxisLines", value)}
                  />
                  <ColorInput
                    label="Grid Line Color"
                    value={config.gridLineColor}
                    onChange={(value) => onConfigChange("gridLineColor", value)}
                  />
                  <RangeInput
                    label={`Axis Label Size: ${config.axisLabelSize}px`}
                    min={8}
                    max={16}
                    value={config.axisLabelSize}
                    onChange={(value) => onConfigChange("axisLabelSize", value)}
                  />
                </div>
              </SettingGroup>

              {/* Performance */}
              <SettingGroup label="Performance">
                <div className="space-y-2">
                  <CheckboxInput
                    label="Use Canvas Renderer"
                    checked={config.useCanvas}
                    onChange={(value) => onConfigChange("useCanvas", value)}
                  />
                  <CheckboxInput
                    label="Use Dirty Rectangle Optimization"
                    checked={config.useDirtyRect}
                    onChange={(value) => onConfigChange("useDirtyRect", value)}
                  />
                </div>
              </SettingGroup>
            </div>
          )}

          {/* Presets Tab */}
          {activeTab === "presets" && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CHART_PRESETS).map(([key]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onApplyPreset?.(key as keyof typeof CHART_PRESETS)
                  }
                  className="capitalize"
                >
                  {key}
                </Button>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex gap-2 pt-4 border-t border-border">
            {onReset && (
              <Button variant="outline" size="sm" onClick={onReset}>
                Reset to Defaults
              </Button>
            )}
            {showAdvancedTab === false && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedTab(true)}
              >
                Show Advanced Options
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Input Components

const SettingGroup: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-2">
    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
    </label>
    {children}
  </div>
);

const CheckboxInput: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer text-sm">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-border"
    />
    {label}
  </label>
);

const SelectInput: React.FC<{
  value: any;
  options: (string | number)[];
  onChange: (value: any) => void;
  label?: string;
}> = ({ value, options, onChange, label }) => (
  <div className={label ? "space-y-1" : ""}>
    {label && <label className="text-xs font-medium">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-1.5 text-sm border border-border rounded bg-background text-foreground"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {String(option).charAt(0).toUpperCase() + String(option).slice(1)}
        </option>
      ))}
    </select>
  </div>
);

const RangeInput: React.FC<{
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}> = ({ label, min, max, step = 1, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

const ColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium">{label}</label>
    <div className="flex gap-2">
      <input
        type="color"
        value={value.startsWith("rgb") ? "#000000" : value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-8 border border-border rounded cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
      />
    </div>
  </div>
);
