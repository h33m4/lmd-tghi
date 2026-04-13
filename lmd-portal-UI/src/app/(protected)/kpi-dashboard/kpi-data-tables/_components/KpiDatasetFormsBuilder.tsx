import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  capitalizeWords,
  getFiscalYearAndQuarter,
} from "@/utils/helper_functions";
import { parseNumberFromString } from "@/utils/table-helpers";
import { getInnerType, isTextAreaField } from "@/utils/zod-helpers";

type SchemaType = z.ZodObject<Record<string, z.ZodTypeAny>>;

export interface KpiDatasetFormsBuilderRef {
  submitForm: () => Promise<any>;
  getValues: () => any;
}

interface KpiDatasetFormsBuilderProps<T extends z.ZodTypeAny> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  data?: Partial<z.infer<T>>;
  isEditable?: boolean;
}

const DEFAULT_FIELDS = ["period_start_date", "fy_q"];

// const formatDateString = (dateValue: string | Date): string => {
//   if (!dateValue) return "";

//   let date: Date;
//   if (typeof dateValue === "string") {
//     if (dateValue.includes("/")) {
//       const [month, day, year] = dateValue.split("/");
//       date = new Date(Number(year), Number(month) - 1, Number(day));
//     } else {
//       date = new Date(dateValue);
//     }
//   } else {
//     date = dateValue;
//   }

//   return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
// };

// const formatDateString2 = (dateValue: string | Date): string => {
//   if (!dateValue) return "";

//   let date: Date;
//   if (typeof dateValue === "string") {
//     date = new Date(dateValue);
//   } else {
//     date = dateValue;
//   }

//   const month = String(date.getMonth() + 1);
//   const day = String(date.getDate());
//   const year = date.getFullYear();

//   return `${month}/${day}/${year}`;
// };

/**
 * Safely formats a date value to YYYY-MM-DD format without timezone issues.
 * Parses strings directly to avoid Date object timezone conversions.
 */
const formatDateToIso = (dateValue: string | Date): string => {
  if (!dateValue) return "";

  if (typeof dateValue === "string") {
    // Handle MM/DD/YYYY format
    if (dateValue.includes("/")) {
      const parts = dateValue.split("/");
      if (parts.length === 3) {
        const [month, day, year] = parts;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }

    // Handle YYYY-MM-DD format (possibly with time component)
    if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
      return dateValue.split("T")[0];
    }

    return "";
  }

  // For Date objects, use UTC methods to avoid timezone shift
  if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
    const year = dateValue.getUTCFullYear();
    const month = String(dateValue.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateValue.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return "";
};

/**
 * Converts a date value to M/D/YYYY format for API submission.
 * Parses strings directly to avoid timezone issues.
 */
const formatDateForApi = (dateValue: string | Date): string => {
  if (!dateValue) return "";

  if (typeof dateValue === "string") {
    // Handle YYYY-MM-DD format (from HTML date input)
    if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
      const [year, month, day] = dateValue.split("T")[0].split("-");
      return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year}`;
    }

    // Handle MM/DD/YYYY format - already correct
    if (dateValue.includes("/")) {
      return dateValue;
    }

    return "";
  }

  // For Date objects, use UTC methods
  if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
    const year = dateValue.getUTCFullYear();
    const month = dateValue.getUTCMonth() + 1;
    const day = dateValue.getUTCDate();
    return `${month}/${day}/${year}`;
  }

  return "";
};

// Helper function to check if a field is optional
const isOptionalField = (zodType: z.ZodTypeAny): boolean => {
  return (
    zodType instanceof z.ZodOptional ||
    (zodType instanceof z.ZodNullable &&
      zodType._def.innerType instanceof z.ZodOptional)
  );
};

const isNullableField = (zodType: z.ZodTypeAny): boolean => {
  return zodType instanceof z.ZodNullable;
};

const KpiDatasetFormsBuilder = forwardRef<
  KpiDatasetFormsBuilderRef,
  KpiDatasetFormsBuilderProps<SchemaType>
>(({ schema, onSubmit, data, isEditable = true }, ref) => {
  type FormData = z.infer<typeof schema>;

  const getDefaultValue = (zodType: z.ZodTypeAny, key: string) => {
    // If we have data for this field, use it
    if (data && data[key] !== undefined) {
      const innerType = getInnerType(zodType);
      if (innerType instanceof z.ZodDate && typeof data[key] === "string") {
        return formatDateToIso(data[key]);
      }
      if (innerType instanceof z.ZodNumber && typeof data[key] === "string") {
        const parsedNumber = parseNumberFromString(data[key]);
        // return Number(data[key]);
        return parsedNumber;
      }
      return data[key];
    }

    // Special handling for default fields
    if (key === "period_start_date") return "";
    if (key === "fy_q") return "";

    // Check if it's optional or nullable
    if (isOptionalField(zodType)) {
      return undefined; // Keep optional fields as undefined
    }

    if (isNullableField(zodType) && !isOptionalField(zodType)) {
      return null; // Nullable-only fields default to null
    }

    // For required fields, provide appropriate defaults
    const innerType = getInnerType(zodType);
    if (innerType instanceof z.ZodString) return "";
    if (innerType instanceof z.ZodNumber) return undefined;
    if (innerType instanceof z.ZodBoolean) return false;
    if (innerType instanceof z.ZodDate) return "";
    if (innerType instanceof z.ZodEnum) return innerType.options[0];
    return undefined;
  };

  // Memoize default values to prevent unnecessary re-calculations
  const defaultValues = useMemo(() => {
    const values = Object.entries(schema.shape).reduce(
      (acc, [key, zodType]) => {
        const value = getDefaultValue(zodType, key);
        acc[key] = value;

        // Debug logging to see what's happening
        if (data) {
          // console.log(
          //   `Field: ${key}, Type: ${
          //     zodType._def?.typeName || "unknown"
          //   }, Data value: ${data[key]}, Default value: ${value}`
          // );
        }

        return acc;
      },
      {} as Record<string, any>
    ) as FormData;

    // console.log("Final default values:", values);
    return values;
  }, [data, schema]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      const isValid = await form.trigger();
      if (!isValid) {
        throw new Error("Form validation failed");
      }

      const formData = form.getValues();
      const p_start_data = formatDateForApi(
        form.getValues("period_start_date")
      );
      const formData2 = { ...formData, period_start_date: p_start_data };

      onSubmit(formData2);
      return formData2;
    },
    getValues: () => form.getValues(),
  }));

  // Watch for period_start_date changes to update fy_q
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "period_start_date") {
        const dateValue = value.period_start_date;
        if (dateValue) {
          const fyq = getFiscalYearAndQuarter(dateValue);
          form.setValue("fy_q", fyq, {
            shouldValidate: true,
            shouldDirty: true,
          });
        } else {
          form.setValue("fy_q", "", {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Set fy_q when data initially loads
  useEffect(() => {
    if (data?.period_start_date) {
      const formattedDate = formatDateToIso(data.period_start_date);
      const fyq = getFiscalYearAndQuarter(formattedDate);
      form.setValue("fy_q", fyq, {
        shouldValidate: false, // Don't validate on initial load
        shouldDirty: false, // Don't mark as dirty on initial load
      });
    }
  }, [data?.period_start_date, form]);

  // Reset form when data changes (for edit mode)
  useEffect(() => {
    if (data) {
      form.reset(defaultValues, {
        keepErrors: false,
        keepDirty: false,
      });
    }
  }, [data, defaultValues, form]);

  const renderField = (key: string) => {
    const fieldSchema = schema.shape[key];
    const isOptional = isOptionalField(fieldSchema);
    const isNullable = isNullableField(fieldSchema);
    const innerType = getInnerType(fieldSchema);
    const isTextArea = isTextAreaField(fieldSchema);

    return (
      <FormField
        key={key}
        control={form.control}
        name={key as keyof FormData}
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>
              {capitalizeWords(key.replace(/_/g, " "), [
                "chw",
                "hbp",
                "lmh",
                "cha",
                "chss",
                "n/a",
                "chas",
                "irt",
                "echis",
                "mcd",
                "ncd",
                "sbcc",
                "rmnch",
                "ehh",
                "ichis",
              ])}
              {isOptional && (
                <span className="text-muted-foreground ml-1">(optional)</span>
              )}
            </FormLabel>
            <FormControl>
              {innerType instanceof z.ZodBoolean ? (
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? true : undefined)
                  }
                />
              ) : innerType instanceof z.ZodEnum ? (
                <select
                  {...field}
                  disabled={!isEditable}
                  value={field.value ?? ""}
                  className="flex h-8 w-full items-center px-2 py-1 rounded-md border border-border bg-transparent text-sm shadow-sm cursor-pointer"
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                >
                  <option value="">Select {key.replace(/_/g, " ")}</option>
                  {innerType.options.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Controller
                  name={key as keyof FormData}
                  control={form.control}
                  render={({ field }) =>
                    isTextArea ? (
                      <Textarea
                        {...field}
                        readOnly={!isEditable}
                        className="min-h-[100px]"
                        placeholder={`Enter ${key.replace(/_/g, " ")}`}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : value);
                        }}
                      />
                    ) : (
                      <Input
                        {...field}
                        readOnly={!isEditable}
                        type={
                          innerType instanceof z.ZodNumber
                            ? "number"
                            : innerType instanceof z.ZodDate
                            ? "date"
                            : "text"
                        }
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (innerType instanceof z.ZodNumber) {
                            if (isNullable && !isOptional) {
                              // For nullable-only number fields, empty string becomes null
                              field.onChange(
                                value === "" ? null : Number(value)
                              );
                            } else {
                              // For optional number fields, empty string becomes undefined
                              field.onChange(
                                value === "" ? undefined : Number(value)
                              );
                            }
                          } else {
                            if (isNullable && !isOptional) {
                              // For nullable-only fields, empty string becomes null
                              field.onChange(value === "" ? null : value);
                            } else {
                              // For optional fields, empty string becomes undefined
                              field.onChange(value === "" ? undefined : value);
                            }
                          }
                        }}
                      />
                    )
                  }
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-3 gap-5 mb-4">
          <FormField
            control={form.control}
            name="period_start_date"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Period Start Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly={!isEditable}
                    type="date"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                    className="[&::-webkit-calendar-picker-indicator]:absolute 
                     [&::-webkit-calendar-picker-indicator]:right-2 
                     [&::-webkit-calendar-picker-indicator]:top-1/2 
                     [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
                     [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fy_q"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Fiscal Year/Quarter</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    value={field.value ?? ""}
                    className="bg-background cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {Object.keys(schema.shape)
          .filter((key) => !DEFAULT_FIELDS.includes(key))
          .map(renderField)}
      </form>
    </Form>
  );
});

KpiDatasetFormsBuilder.displayName = "KpiDatasetFormsBuilder";

export default KpiDatasetFormsBuilder;
