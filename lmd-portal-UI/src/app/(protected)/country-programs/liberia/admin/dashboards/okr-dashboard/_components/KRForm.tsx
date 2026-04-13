"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  BarChart2,
  Target,
  Calendar,
} from "lucide-react";
import { InfoContainer } from "@/components/infoContainer/infoContainerComponent";
import AutoExpandTextarea from "@/components/input/AutoExpandTextarea";
import {
  CalculationMethod,
  MeasurementUnit,
  OkrBaseInput,
  isNarrativeUnit,
} from "@/types/okrTracker";
import {
  UNIT_OPTIONS,
  CALCULATION_OPTIONS,
  UNIT_DESCRIPTIONS,
  UNIT_PREFILLS,
  unitColor,
  formatDate,
} from "./constants";
import { Field, StyledSelect, Section } from "./FormPrimitives";

// ─── KR Form ──────────────────────────────────────────────────────────────────

const KRForm = React.memo(function KRForm({
  formData,
  onChange,
  readOnly = false,
  lockObjective = false,
  existingObjectives = [],
  existingIds = [],
}: {
  formData: Partial<OkrBaseInput>;
  onChange: (d: Partial<OkrBaseInput>) => void;
  readOnly?: boolean;
  lockObjective?: boolean;
  existingObjectives?: {
    id: string;
    text: string;
    toc: string;
    prefix: string;
    nextKrId: string;
  }[];
  existingIds?: string[];
}) {
  const set = (patch: Partial<OkrBaseInput>) =>
    onChange({ ...formData, ...patch });
  // Units that don't use numeric targets/baselines/min/max
  const isNarrativeOnly = formData.unit
    ? isNarrativeUnit(formData.unit)
    : false;
  const isQualitative = formData.unit === "qualitative"; // kept for qualitative-specific UI copy
  const isCounties = formData.unit === "counties";
  const isPercentage = !isNarrativeOnly && formData.unit === "percent";
  const isDuplicateId = !!(
    formData.okrId && existingIds?.includes(formData.okrId)
  );

  const hasExisting = existingObjectives.length > 0;

  if (readOnly) {
    const Kv = ({
      label,
      value,
      info,
      id,
    }: {
      label: string;
      value?: React.ReactNode;
      info?: string;
      id?: string;
    }) => (
      <div>
        <div className="flex items-center gap-0.5 mb-1">
          <p className="text-[11px] font-semibold text-lmh-dark-blue/60 dark:text-primary/70 uppercase tracking-widest">
            {label}
          </p>
          {info && (
            <InfoContainer
              id={id || `view-${label}`}
              text={info}
              placement="top"
            />
          )}
        </div>
        <p className="text-sm text-foreground">{value ?? "—"}</p>
      </div>
    );
    return (
      <div className="space-y-4 p-4">
        <Section
          title="Basic Info"
          icon={<BookOpen className="h-3.5 w-3.5" />}
          accent="bg-lmh-dark-blue"
        >
          <Kv
            label="OKR ID"
            id="view-okr-id"
            info="A short unique reference for this OKR, e.g. '1.1' or '2.3'. Used to identify and link this OKR across the system."
            value={
              <span className="font-bold text-lmh-dark-blue dark:text-primary text-base">
                {formData.okrId}
              </span>
            }
          />
          <Kv
            label="TOC"
            id="view-okr-toc"
            info="Theory of Change reference. Links this OKR to a specific pathway or outcome in the program's theory of change."
            value={formData.objectiveToc}
          />
          <Kv
            label="Priority"
            id="view-okr-priority"
            info="Display order on the dashboard. Lower numbers appear first — set to 1 for the most important OKR."
            value={formData.priority}
          />
          <div className="sm:col-span-2">
            <Kv
              label="Key Result"
              id="view-okr-key-result"
              info="The specific, measurable outcome that defines success for this objective. Should be quantifiable and unambiguous."
              value={formData.keyResult}
            />
          </div>
        </Section>

        {isNarrativeOnly ? (
          <div className="rounded-xl border border-border px-4 py-3 bg-purple-50/50 dark:bg-purple-900/10 text-sm text-purple-700 dark:text-purple-400 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 shrink-0" />
            {isQualitative
              ? "Qualitative KR — progress is tracked through narrative updates only."
              : "Yes/No KR — progress is binary (achieved or not). No numeric values apply."}
          </div>
        ) : (
          <>
            <Section
              title="Measurement"
              icon={<Target className="h-3.5 w-3.5" />}
              accent="bg-primary"
            >
              <div className="sm:col-span-2">
                <Kv
                  label="Unit"
                  id="view-okr-unit"
                  info="Determines how progress is measured and which chart/calculation settings apply."
                  value={
                    <span className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${unitColor(formData.unit || "percent").bg} ${unitColor(formData.unit || "percent").text}`}
                      >
                        {formData.unit}
                      </span>
                      {formData.unit && (
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {UNIT_DESCRIPTIONS[formData.unit as MeasurementUnit]}
                        </span>
                      )}
                    </span>
                  }
                />
              </div>
              {!isNarrativeOnly && (
                <>
                  <Kv
                    label="Calculation"
                    id="view-okr-calc"
                    info="How multiple data entries are combined: 'latest' uses the most recent value, 'cumulative' adds them up, 'average' takes the mean."
                    value={formData.calculationMethod}
                  />
                  <Kv
                    label="Baseline"
                    id="view-okr-baseline"
                    info="The starting value before any program intervention. Used to calculate progress from the initial state."
                    value={formData.baseline}
                  />
                  <Kv
                    label="Target"
                    id="view-okr-target"
                    info="The numeric goal to reach by the end of the measurement period. Progress is measured against this value."
                    value={
                      <span className="font-bold text-lg text-foreground">
                        {formData.targetValue}
                      </span>
                    }
                  />
                  <Kv
                    label="Metric Unit"
                    id="view-okr-metric-unit"
                    info="The symbol or label shown alongside values on the dashboard, e.g. '%', 'USD', 'CHWs'. Purely for display."
                    value={formData.chartMetricUnit}
                  />
                </>
              )}
              <Kv
                label="Min / Max"
                id="view-okr-minmax"
                info={
                  isCounties
                    ? "Fixed bounds: 0–15 (total counties in Liberia)."
                    : "Optional axis bounds for chart scaling. If blank, the chart auto-scales."
                }
                value={
                  isCounties
                    ? "0 / 15"
                    : formData.minValue !== undefined ||
                        formData.maxValue !== undefined
                      ? `${formData.minValue ?? "—"} / ${formData.maxValue ?? "—"}`
                      : "—"
                }
              />
            </Section>

            {isPercentage && (
              <Section
                title="Percentage Fields"
                icon={<BarChart2 className="h-3.5 w-3.5" />}
                accent="bg-lmh-green"
                defaultOpen={false}
              >
                <Kv
                  label="Denominator"
                  id="view-okr-denom"
                  info="The total used as the bottom of the percentage calculation."
                  value={formData.denominator}
                />
                <Kv
                  label="Denominator Label"
                  id="view-okr-denom-label"
                  info="Human-readable name for the denominator shown on the dashboard."
                  value={formData.denominatorLabel}
                />
                <Kv
                  label="Numerator Label"
                  id="view-okr-num-label"
                  info="Human-readable name for the numerator shown on the dashboard."
                  value={formData.numeratorLabel}
                />
              </Section>
            )}
          </>
        )}

        <Section
          title="Period & Chart"
          icon={<Calendar className="h-3.5 w-3.5" />}
          accent="bg-lmh-yellow"
        >
          <Kv
            label="Period Start"
            id="view-okr-period-start"
            info="Start date of the measurement window."
            value={formatDate(formData.periodStart)}
          />
          <Kv
            label="Period End"
            id="view-okr-period-end"
            info="End date of the measurement window."
            value={formatDate(formData.periodEnd)}
          />
        </Section>

        {(formData.valuePrompt || formData.valueHint) && (
          <Section
            title="Guidance"
            icon={<BookOpen className="h-3.5 w-3.5" />}
            accent="bg-lmh-blue"
            defaultOpen={false}
          >
            <div className="sm:col-span-2">
              <Kv
                label="Value Prompt"
                id="view-okr-prompt"
                info="Instructions shown to staff when they enter data for this OKR."
                value={formData.valuePrompt}
              />
            </div>
            <div className="sm:col-span-2">
              <Kv
                label="Value Hint"
                id="view-okr-hint"
                info="Secondary helper text displayed below the data-entry field."
                value={formData.valueHint}
              />
            </div>
          </Section>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Section
        title="Basic Info"
        icon={<BookOpen className="h-3.5 w-3.5" />}
        accent="bg-lmh-dark-blue"
      >
        {/* Objective picker — shown in add mode when objectives already exist */}
        {hasExisting && (
          <div className="sm:col-span-2">
            <Field
              label="Objective"
              required
              id="okr-objective-picker"
              info="Select which objective this key result belongs to. The KR ID will be auto-suggested based on the objective number."
            >
              <select
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                value={formData.objectiveId || ""}
                onChange={(e) => {
                  const found = existingObjectives.find(
                    (o) => o.id === e.target.value,
                  );
                  set({
                    objectiveId: e.target.value,
                    objective: found?.text || "",
                    objectiveToc: found?.toc || "",
                    okrId: found?.nextKrId || "",
                  });
                }}
              >
                <option value="">— Select objective —</option>
                {existingObjectives.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.prefix} · {o.text}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        <Field
          label="OKR ID"
          required
          id="okr-id"
          info="A short unique reference for this OKR, e.g. '1.1' or '2.3'. Used to identify and link this OKR across the system."
        >
          {(lockObjective || !!formData.objectiveId) &&
          formData.okrId?.includes(".") ? (
            <div
              className={`h-8  flex items-center border rounded-md overflow-hidden bg-background ${isDuplicateId ? "border-destructive" : "border-border"}`}
            >
              <span className="px-3 py-2 bg-muted text-sm font-mono text-muted-foreground border-r border-border shrink-0 select-none">
                {formData.okrId.substring(0, formData.okrId.indexOf("."))}.
              </span>
              <input
                className="flex-1 px-3 py-2 text-sm bg-background focus:outline-none text-foreground "
                value={formData.okrId.substring(
                  formData.okrId.indexOf(".") + 1,
                )}
                onChange={(e) => {
                  const prefix = formData.okrId!.substring(
                    0,
                    formData.okrId!.indexOf("."),
                  );
                  set({ okrId: `${prefix}.${e.target.value}` });
                }}
                placeholder="1"
              />
            </div>
          ) : (
            <Input
              value={formData.okrId || ""}
              onChange={(e) => set({ okrId: e.target.value })}
              placeholder="e.g. 1.1"
              className={
                isDuplicateId
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : ""
              }
            />
          )}
          {isDuplicateId && (
            <p className="text-xs text-destructive mt-1">
              ID &ldquo;{formData.okrId}&rdquo; is already in use.
            </p>
          )}
        </Field>
        <Field
          label="Priority"
          id="okr-priority"
          info="Display order on the dashboard. 1 = highest priority, 5 = lowest."
        >
          <Input
            type="number"
            min={1}
            max={5}
            value={formData.priority ?? 1}
            onChange={(e) =>
              set({
                priority: Math.min(5, Math.max(1, Number(e.target.value))),
              })
            }
          />
        </Field>

        {/* Objective fields — only shown when creating a brand-new objective */}
        {!hasExisting && !lockObjective && (
          <>
            <Field
              label="TOC"
              id="okr-toc"
              info="Theory of Change reference. Links this OKR to a specific pathway or outcome in the program's theory of change."
            >
              <Input
                value={formData.objectiveToc || ""}
                onChange={(e) => set({ objectiveToc: e.target.value })}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field
                label="Objective"
                required
                id="okr-objective"
                info="The high-level goal this OKR is working towards. Should be qualitative, ambitious, and time-bound."
              >
                <AutoExpandTextarea
                  value={formData.objective || ""}
                  onChange={(e) => set({ objective: e.target.value })}
                />
              </Field>
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <Field
            label="Key Result"
            required
            id="okr-key-result"
            info="The specific, measurable outcome that defines success for this objective. Should be quantifiable and unambiguous."
          >
            <AutoExpandTextarea
              value={formData.keyResult || ""}
              onChange={(e) => set({ keyResult: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Measurement"
        icon={<Target className="h-3.5 w-3.5" />}
        accent="bg-primary"
      >
        {/* Unit picker always visible so users can switch away from qualitative */}
        <div className="sm:col-span-2">
          <Field
            label="Unit"
            id="okr-unit"
            info="Determines how progress is measured and which fields are relevant. Switching unit pre-fills sensible defaults for calculation method, target, and chart settings — adjust as needed."
          >
            <StyledSelect
              value={formData.unit || "percent"}
              onChange={(v) => {
                const unit = v as MeasurementUnit;
                set({ unit, ...UNIT_PREFILLS[unit] });
              }}
              options={UNIT_OPTIONS}
            />
            {formData.unit && (
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                {UNIT_DESCRIPTIONS[formData.unit]}
              </p>
            )}
          </Field>
        </div>

        {isNarrativeOnly ? (
          <div className="sm:col-span-2 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200/60 dark:border-purple-700/30 px-3 py-2.5 text-sm text-purple-700 dark:text-purple-400">
            {isQualitative
              ? "No numeric target needed — updates for this KR capture narrative progress only."
              : "Yes/No KR — progress is binary (achieved or not). No numeric targets or bounds needed."}
          </div>
        ) : (
          <>
            <Field
              label="Calculation Method"
              id="okr-calc"
              info="How multiple data entries are combined: 'latest' uses the most recent value, 'cumulative' adds them up, 'average' takes the mean."
            >
              <StyledSelect
                value={formData.calculationMethod || "latest"}
                onChange={(v) =>
                  set({ calculationMethod: v as CalculationMethod })
                }
                options={CALCULATION_OPTIONS}
              />
            </Field>
            <Field
              label="Baseline"
              id="okr-baseline"
              info="The starting value before any program intervention. Used to calculate progress from the initial state."
            >
              <Input
                type="number"
                value={formData.baseline ?? 0}
                onChange={(e) => set({ baseline: Number(e.target.value) })}
              />
            </Field>
            <Field
              label="Target Value"
              id="okr-target"
              info="The numeric goal to reach by the end of the measurement period. Progress is measured against this value."
            >
              <Input
                type="number"
                value={formData.targetValue ?? 100}
                min={isCounties ? 0 : undefined}
                max={isCounties ? 15 : undefined}
                onChange={(e) => {
                  let v = Number(e.target.value);
                  if (isCounties) v = Math.min(15, Math.max(0, v));
                  set({ targetValue: v });
                }}
              />
              {isCounties && (
                <p className="text-xs text-muted-foreground mt-1">
                  Must be between 0 and 15 (total counties in Liberia).
                </p>
              )}
            </Field>
            <Field
              label="Metric Unit"
              id="okr-metric-unit"
              info="The symbol or label shown alongside values on the dashboard, e.g. '%', 'USD', 'CHWs'. Purely for display."
            >
              <Input
                value={formData.chartMetricUnit || ""}
                onChange={(e) => set({ chartMetricUnit: e.target.value })}
                placeholder="%"
              />
            </Field>
            <Field
              label="Min Value"
              id="okr-min"
              info={
                isCounties
                  ? "Fixed at 0 — counties coverage starts from zero."
                  : "Optional lower bound for chart axis scaling. Leave blank to auto-scale."
              }
            >
              <Input
                type="number"
                value={formData.minValue ?? ""}
                onChange={(e) =>
                  set({
                    minValue: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                readOnly={isCounties}
                className={
                  isCounties
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : ""
                }
              />
            </Field>
            <Field
              label="Max Value"
              id="okr-max"
              info={
                isCounties
                  ? "Fixed at 15 — total counties in Liberia."
                  : "Optional upper bound for chart axis scaling. Leave blank to auto-scale."
              }
            >
              <Input
                type="number"
                value={formData.maxValue ?? ""}
                onChange={(e) =>
                  set({
                    maxValue: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                readOnly={isCounties}
                className={
                  isCounties
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : ""
                }
              />
            </Field>
          </>
        )}
      </Section>

      {isPercentage && (
        <Section
          title="Percentage Fields"
          icon={<BarChart2 className="h-3.5 w-3.5" />}
          accent="bg-lmh-green"
        >
          <Field
            label="Denominator"
            id="okr-denom"
            info="The total used as the bottom of the percentage calculation — e.g. total number of counties or total CHWs enrolled."
          >
            <Input
              type="number"
              value={formData.denominator ?? ""}
              onChange={(e) =>
                set({
                  denominator: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              placeholder="e.g. 100"
            />
          </Field>
          <Field
            label="Denominator Label"
            id="okr-denom-label"
            info="Human-readable name for the denominator shown on the dashboard, e.g. 'Total Counties' or 'Enrolled CHWs'."
          >
            <Input
              value={formData.denominatorLabel || ""}
              onChange={(e) => set({ denominatorLabel: e.target.value })}
              placeholder="e.g. Total Counties"
            />
          </Field>
          <Field
            label="Numerator Label"
            id="okr-num-label"
            info="Human-readable name for the numerator shown on the dashboard, e.g. 'Counties with Program' or 'Active CHWs'."
          >
            <Input
              value={formData.numeratorLabel || ""}
              onChange={(e) => set({ numeratorLabel: e.target.value })}
              placeholder="e.g. Counties with Program"
            />
          </Field>
        </Section>
      )}

      <Section
        title="Period & Chart"
        icon={<Calendar className="h-3.5 w-3.5" />}
        accent="bg-lmh-yellow"
      >
        <Field
          label="Period Start"
          required
          id="okr-period-start"
          info="Start date of the measurement window. Data entered before this date will not count towards progress."
        >
          <Input
            type="date"
            value={formatDate(formData.periodStart)}
            onChange={(e) => set({ periodStart: e.target.value })}
          />
        </Field>
        <Field
          label="Period End"
          required
          id="okr-period-end"
          info="End date of the measurement window. The OKR is considered expired after this date."
        >
          <Input
            type="date"
            value={formatDate(formData.periodEnd)}
            onChange={(e) => set({ periodEnd: e.target.value })}
          />
        </Field>
      </Section>

      {!isNarrativeOnly && (
        <Section
          title="Guidance"
          icon={<BookOpen className="h-3.5 w-3.5" />}
          accent="bg-lmh-blue"
          defaultOpen={false}
        >
          <div className="sm:col-span-2">
            <Field
              label="Value Prompt"
              id="okr-prompt"
              info="Instructions shown to staff when they enter data for this OKR, e.g. 'Enter the number of CHWs who completed training this month.'"
            >
              <AutoExpandTextarea
                value={formData.valuePrompt || ""}
                onChange={(e) => set({ valuePrompt: e.target.value })}
                placeholder="Instructions for data entry"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Value Hint"
              id="okr-hint"
              info="Secondary helper text displayed below the data-entry field to clarify units, rounding rules, or data sources."
            >
              <AutoExpandTextarea
                value={formData.valueHint || ""}
                onChange={(e) => set({ valueHint: e.target.value })}
                placeholder="Helper text shown to users"
              />
            </Field>
          </div>
        </Section>
      )}
    </div>
  );
});

export default KRForm;
