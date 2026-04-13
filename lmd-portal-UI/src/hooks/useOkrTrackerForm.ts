// hooks/useOkrTrackerForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { OkrRecord, OkrMonthlyUpdate, OkrStatus } from "@/types/okrTracker";
import {
  calculateOkrProgress,
  getNextMonthYear,
  sortMonthlyUpdates,
} from "@/utils/okr-helpers";

import { toast } from "sonner";
import {
  addMonthlyUpdate,
  updateMonthlyUpdate,
} from "@/lib/actions/okr-dashboard/monthlyUpdates";
import { updateOKRField } from "@/lib/actions/okr-dashboard/okr";

/**
 * Creates a dynamic validation schema based on OKR measurement unit
 */
const createUpdateFormSchema = (okr: OkrRecord) => {
  const baseSchema = {
    month: z
      .number()
      .min(1, "Month is required")
      .max(12, "Month must be between 1 and 12"),
    year: z
      .number()
      .min(2000, "Year is required")
      .max(3000, "Year must be between 2000 and 3000"),
    narrative: z.string().min(1, "Narrative is required"),
    status: z.enum([
      "on_track",
      "at_risk",
      "delayed",
      "achieved",
      "okr_under_review",
    ] as const),
    risks: z.array(z.string()).optional().default([]),
    mitigations: z.array(z.string()).optional().default([]),
  };

  // Qualitative KRs — no numeric value at all, just narrative
  if (okr.unit === "qualitative") {
    return z.object({
      ...baseSchema,
      value: z.string().optional(),
      numerator: z.string().optional(),
      denominatorOverride: z.string().optional(),
    });
  }

  // Special validation for yes/no type
  if (okr.unit === "yes_no") {
    return z.object({
      ...baseSchema,
      value: z
        .string()
        .min(1, "Please select Yes or No")
        .refine((val) => val === "0" || val === "1", {
          message: "Please select Yes or No",
        }),
      numerator: z.string().optional(),
      denominatorOverride: z.string().optional(),
    });
  }

  // Percentage-based OKRs use numerator/denominator
  if (okr.unit === "percent") {
    return z.object({
      ...baseSchema,
      numerator: z
        .string()
        .min(1, `${okr.numeratorLabel || "Numerator"} is required`)
        .refine((val) => !isNaN(parseFloat(val)), {
          message: "Must be a valid number",
        }),
      denominatorOverride: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val || val.trim() === "") return true;
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
          },
          {
            message: "Denominator must be a valid number greater than 0",
          },
        ),
      value: z.string().optional(), // Auto-calculated, optional
    });
  }

  // Numeric validation with min/max bounds for other units
  return z.object({
    ...baseSchema,
    value: z
      .string()
      .min(1, "Value is required")
      .refine((val) => !isNaN(parseFloat(val)), {
        message: "Must be a valid number",
      })
      .refine(
        (val) => {
          if (okr.minValue == null) return true;
          return parseFloat(val) >= okr.minValue;
        },
        {
          message: `Value must be at least ${okr.minValue}`,
        },
      )
      .refine(
        (val) => {
          if (okr.maxValue == null) return true;
          return parseFloat(val) <= okr.maxValue;
        },
        {
          message: `Value must not exceed ${okr.maxValue}`,
        },
      ),
    numerator: z.string().optional(),
    denominatorOverride: z.string().optional(),
  });
};

type UpdateFormSchema = z.infer<ReturnType<typeof createUpdateFormSchema>>;

interface UseOkrFormProps {
  okr: OkrRecord;
  onUpdate: (updatedOkr: OkrRecord) => void;
  userEmail: string;
}

/**
 * Custom hook for managing OKR monthly update forms
 * Handles form state, validation, submission with optimistic updates
 */
export function useOkrTrackerForm({
  okr,
  onUpdate,
  userEmail,
}: UseOkrFormProps) {
  // Form visibility and editing state
  const [showForm, setShowForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<string | null>(null);

  // Risks and mitigations management
  const [newRisk, setNewRisk] = useState("");
  const [newMitigation, setNewMitigation] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm<UpdateFormSchema>({
    resolver: zodResolver(createUpdateFormSchema(okr)),
    mode: "onChange",
    defaultValues: {
      month: 0,
      year: 0,
      value: "",
      numerator: "",
      denominatorOverride: "",
      narrative: "",
      status: okr.status,
      risks: [],
      mitigations: [],
    },
  });

  const formValues = watch();

  /**
   * Auto-select "achieved" status when target value is met
   */
  useEffect(() => {
    if (okr.unit === "yes_no" && formValues.value) {
      if (formValues.value === "1") {
        setValue("status", "achieved");
      } else {
        setValue("status", "on_track");
      }
    } else if (okr.unit === "percent" && formValues.numerator) {
      // For percentage OKRs, calculate percentage and check against target
      const num = parseFloat(formValues.numerator);
      const denom = formValues.denominatorOverride
        ? parseFloat(formValues.denominatorOverride)
        : okr.denominator;

      if (!isNaN(num) && denom && denom !== 0) {
        const percentage = (num / denom) * 100;
        if (percentage >= okr.targetValue) {
          setValue("status", "achieved");
        }
      }
    } else if (formValues.value) {
      // For other units
      const numValue = parseFloat(formValues.value);
      if (!isNaN(numValue) && numValue >= okr.targetValue) {
        setValue("status", "achieved");
      }
    }
  }, [
    formValues.value,
    formValues.numerator,
    formValues.denominatorOverride,
    okr.targetValue,
    okr.unit,
    okr.denominator,
    setValue,
  ]);

  /**
   * Calculate the next month/year based on last update
   */
  const getNextMonth = (): { month: number; year: number } => {
    if (okr.monthlyUpdates.length === 0) {
      const now = new Date();
      return {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      };
    }
    const sorted = sortMonthlyUpdates(okr.monthlyUpdates);
    const lastUpdate = sorted[sorted.length - 1];
    return getNextMonthYear(lastUpdate.month, lastUpdate.year);
  };

  /**
   * Check if a given month/year is the latest update
   */
  const isLatestMonth = (
    month: number,
    year: number,
    updates: OkrMonthlyUpdate[],
  ) => {
    if (updates.length === 0) return true;

    const sorted = sortMonthlyUpdates(updates);
    const latest = sorted[sorted.length - 1];

    return latest.month === month && latest.year === year;
  };

  /**
   * Open form for adding a new update
   */
  const handleAddUpdate = () => {
    setEditingUpdate(null);
    const nextMonthYear = getNextMonth();
    reset({
      month: nextMonthYear.month,
      year: nextMonthYear.year,
      value: "",
      numerator: "",
      denominatorOverride: "",
      narrative: "",
      status: okr.status,
      risks: [],
      mitigations: [],
    });
    setShowForm(true);
  };

  /**
   * Open form for editing an existing update
   */
  const handleEditUpdate = (update: OkrMonthlyUpdate) => {
    setEditingUpdate(`${update.month}_${update.year}`);
    reset({
      month: update.month,
      year: update.year,
      value: String(update.value || ""),
      numerator: update.numerator != null ? String(update.numerator) : "",
      denominatorOverride:
        update.denominatorOverride != null
          ? String(update.denominatorOverride)
          : "",
      narrative: update.narrative,
      status: okr.status,
      risks: update.risks || [],
      mitigations: update.mitigations || [],
    });
    setShowForm(true);
  };

  /**
   * Cancel form and reset state
   */
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUpdate(null);
    reset({
      month: 0,
      year: 0,
      value: "",
      numerator: "",
      denominatorOverride: "",
      narrative: "",
      status: okr.status,
      risks: [],
      mitigations: [],
    });
    setNewRisk("");
    setNewMitigation("");
  };

  /**
   * Add a new risk to the form
   */
  const handleAddRisk = () => {
    if (newRisk.trim()) {
      setValue("risks", [...(formValues.risks || []), newRisk.trim()]);
      setNewRisk("");
    }
  };

  /**
   * Remove a risk from the form
   */
  const handleRemoveRisk = (index: number) => {
    setValue(
      "risks",
      (formValues.risks || []).filter((_, i) => i !== index),
    );
  };

  /**
   * Add a new mitigation to the form
   */
  const handleAddMitigation = () => {
    if (newMitigation.trim()) {
      setValue("mitigations", [
        ...(formValues.mitigations || []),
        newMitigation.trim(),
      ]);
      setNewMitigation("");
    }
  };

  /**
   * Remove a mitigation from the form
   */
  const handleRemoveMitigation = (index: number) => {
    setValue(
      "mitigations",
      (formValues.mitigations || []).filter((_, i) => i !== index),
    );
  };

  /**
   * Submit form with optimistic updates and server sync
   */
  const onSubmit = async (data: UpdateFormSchema) => {
    // Prevent duplicate submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Prepare data based on OKR unit type
      let numericValue: number | null = null;
      let numeratorValue: number | null = null;
      let denominatorOverrideValue: number | null = null;

      if (okr.unit === "percent") {
        // For percentage OKRs, send numerator and optional denominator override
        numeratorValue = data.numerator ? parseFloat(data.numerator) : null;
        denominatorOverrideValue = data.denominatorOverride
          ? parseFloat(data.denominatorOverride)
          : null;
        // Value will be calculated on backend
        numericValue = null;
      } else if (okr.unit === "qualitative") {
        // Qualitative KRs have no numeric value
        numericValue = null;
      } else {
        // For other units (number, currency, counties, yes_no), use the value directly
        numericValue = data.value ? parseFloat(data.value) : null;
      }

      // Create the new update object
      const newUpdate: OkrMonthlyUpdate = {
        month: data.month,
        year: data.year,
        numerator: numeratorValue!,
        denominatorOverride: denominatorOverrideValue!,
        value: numericValue!,
        narrative: data.narrative.trim(),
        ...(data.risks && data.risks.length > 0 && { risks: data.risks }),
        ...(data.mitigations &&
          data.mitigations.length > 0 && { mitigations: data.mitigations }),
      };

      // Save previous state for potential rollback
      const previousUpdates = [...okr.monthlyUpdates];
      const previousStatus = okr.status;
      const previousProgress = okr.progress;

      let updatedMonthlyUpdates: OkrMonthlyUpdate[];

      if (editingUpdate) {
        // EDITING EXISTING UPDATE
        const [editMonth, editYear] = editingUpdate.split("_").map(Number);
        updatedMonthlyUpdates = okr.monthlyUpdates.map((update) =>
          update.month === editMonth && update.year === editYear
            ? newUpdate
            : update,
        );

        const latest = isLatestMonth(
          editMonth,
          editYear,
          updatedMonthlyUpdates,
        );

        // Calculate new progress based on updated monthly updates
        const newProgress = calculateOkrProgress(updatedMonthlyUpdates, okr);

        // Create optimistic OKR state
        const optimisticOkr: OkrRecord = {
          ...okr,
          monthlyUpdates: updatedMonthlyUpdates,
          status: latest ? data.status : okr.status, // only update parent if latest
          progress: newProgress,
        };

        // Optimistically update UI
        onUpdate(optimisticOkr);

        // Call server actions
        await toast.promise(
          Promise.all([
            updateMonthlyUpdate(okr.id, editMonth, editYear, {
              numerator: numeratorValue!,
              denominatorOverride: denominatorOverrideValue!,
              value: numericValue!,
              narrative: data.narrative.trim(),
              risks: data.risks,
              mitigations: data.mitigations,
              updatedByEmail: userEmail,
              status: data.status,
            }),
            latest
              ? updateOKRField(okr.id, { status: data.status })
              : Promise.resolve({ success: true }),
          ]),
          {
            loading: "Saving update...",
            success: ([updateResult, statusResult]) => {
              if (updateResult.success && statusResult.success) {
                // Keep the optimistic state
                handleCancelForm();
                setIsSubmitting(false);
                return "Update saved successfully!";
              } else {
                // Revert optimistic update on error
                onUpdate({
                  ...okr,
                  monthlyUpdates: previousUpdates,
                  status: previousStatus,
                  progress: previousProgress,
                });
                setIsSubmitting(false);
                throw new Error(updateResult.error || "Failed to save update");
              }
            },
            error: (err: any) => {
              // Revert optimistic update on error
              onUpdate({
                ...okr,
                monthlyUpdates: previousUpdates,
                status: previousStatus,
                progress: previousProgress,
              });
              setIsSubmitting(false);
              return err?.message || "An error occurred while saving update";
            },
          },
        );
      } else {
        // ADDING NEW UPDATE
        updatedMonthlyUpdates = sortMonthlyUpdates([
          ...okr.monthlyUpdates,
          newUpdate,
        ]);

        // Calculate new progress based on updated monthly updates
        const newProgress = calculateOkrProgress(updatedMonthlyUpdates, okr);

        // Create optimistic OKR state
        const optimisticOkr: OkrRecord = {
          ...okr,
          monthlyUpdates: updatedMonthlyUpdates,
          status: data.status,
          progress: newProgress,
        };

        // Optimistically update UI
        onUpdate(optimisticOkr);

        // Call server actions
        await toast.promise(
          Promise.all([
            addMonthlyUpdate({
              okrId: okr.id,
              month: data.month,
              year: data.year,
              numerator: numeratorValue,
              denominatorOverride: denominatorOverrideValue,
              value: numericValue,
              narrative: data.narrative.trim(),
              risks: data.risks,
              mitigations: data.mitigations,
              createdByEmail: userEmail,
              status: data.status,
            }),
            updateOKRField(okr.id, {
              status: data.status,
            }),
          ]),
          {
            loading: "Adding update...",
            success: ([addResult, statusResult]) => {
              if (addResult.success && statusResult.success) {
                // Keep the optimistic state
                handleCancelForm();
                setIsSubmitting(false);
                return "Update added successfully!";
              } else {
                // Revert optimistic update on error
                onUpdate({
                  ...okr,
                  monthlyUpdates: previousUpdates,
                  status: previousStatus,
                  progress: previousProgress,
                });
                setIsSubmitting(false);
                throw new Error(
                  addResult.error ||
                    statusResult.error ||
                    "Failed to add update",
                );
              }
            },
            error: (err: any) => {
              // Revert optimistic update on error
              onUpdate({
                ...okr,
                monthlyUpdates: previousUpdates,
                status: previousStatus,
                progress: previousProgress,
              });
              setIsSubmitting(false);
              return err?.message || "An error occurred while adding update";
            },
          },
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return {
    // Form state
    showForm,
    setShowForm,
    editingUpdate,
    formValues,
    errors,
    newRisk,
    setNewRisk,
    newMitigation,
    setNewMitigation,
    isSubmitting,

    // Form methods
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    trigger,

    // Handlers
    handleAddUpdate,
    handleEditUpdate,
    handleCancelForm,
    handleAddRisk,
    handleRemoveRisk,
    handleAddMitigation,
    handleRemoveMitigation,
  };
}
