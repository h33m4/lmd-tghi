import React, { forwardRef, useImperativeHandle, useEffect } from "react";
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
import {
  capitalizeWords,
  getFiscalYearAndQuarter,
} from "@/utils/helper_functions";

type SchemaType = z.ZodObject<Record<string, z.ZodTypeAny>>;

export interface KpiDatasetFormsBuilderRef {
  // submitForm: () => void;
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

const formatDateString = (dateValue: string | Date): string => {
  if (!dateValue) return "";

  let date: Date;
  if (typeof dateValue === "string") {
    if (dateValue.includes("/")) {
      const [month, day, year] = dateValue.split("/");
      date = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
      date = new Date(dateValue);
    }
  } else {
    date = dateValue;
  }

  return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const formatDateString2 = (dateValue: string | Date): string => {
  if (!dateValue) return "";

  let date: Date;
  if (typeof dateValue === "string") {
    date = new Date(dateValue);
  } else {
    date = dateValue;
  }

  // const month = String(date.getMonth() + 1).padStart(2, "0");
  // const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

const KpiDatasetFormsBuilder = forwardRef<
  KpiDatasetFormsBuilderRef,
  KpiDatasetFormsBuilderProps<SchemaType>
>(({ schema, onSubmit, data, isEditable = true }, ref) => {
  type FormData = z.infer<typeof schema>;

  const getDefaultValue = (zodType: z.ZodTypeAny, key: string) => {
    if (data && data[key] !== undefined) {
      if (zodType instanceof z.ZodDate && typeof data[key] === "string") {
        return formatDateString(data[key]);
      }
      // api returns all fields as numbers. this fix is supposed to convert the numbers into numbers type
      if (zodType instanceof z.ZodNumber && typeof data[key] === "string") {
        return Number(data[key]);
      }
      return data[key];
    }

    if (key === "period_start_date") return "";
    if (key === "fy_q") return "";

    if (zodType instanceof z.ZodString) return "";
    if (zodType instanceof z.ZodNumber) return 0;
    if (zodType instanceof z.ZodBoolean) return false;
    if (zodType instanceof z.ZodDate) return "";
    if (zodType instanceof z.ZodEnum) return zodType.options[0];
    return null;
  };

  const defaultValues = Object.entries(schema.shape).reduce(
    (acc, [key, zodType]) => {
      acc[key] = getDefaultValue(zodType, key);
      return acc;
    },
    {} as Record<string, any>
  ) as FormData;

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
      // period_start_date convert it from default format to mm/dd/yyyy.
      const p_start_data = formatDateString2(
        form.getValues("period_start_date")
      );
      const formData2 = { ...formData, period_start_date: p_start_data };

      onSubmit(formData2);
      return formData2;
    },
    getValues: () => form.getValues(),
  }));

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

  useEffect(() => {
    if (data?.period_start_date) {
      const formattedDate = formatDateString(data.period_start_date);
      const fyq = getFiscalYearAndQuarter(formattedDate);
      form.setValue("fy_q", fyq, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [data, form]);

  const renderField = (key: string) => {
    const fieldSchema = schema.shape[key];

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
            </FormLabel>
            <FormControl>
              {fieldSchema instanceof z.ZodBoolean ? (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              ) : fieldSchema instanceof z.ZodEnum ? (
                <select
                  {...field}
                  disabled={!isEditable}
                  className="flex h-8 w-full items-center px-2 py-1 rounded-md border border-border bg-transparent text-sm shadow-sm cursor-pointer ring-border transition duration-200 hover:border-primary [&.is-focus]:ring-[0.8px] ring-[0.6px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select {key.replace(/_/g, " ")}</option>
                  {fieldSchema.options.map((option: string) => (
                    <option key={option} value={option}>
                      {/* {capitalizeWords(option.replace(/_/g, " "), [
                        "chw",
                        "hbp",
                        "lmh",
                        "cha",
                        "chss",
                        "n/a",
                      ])} */}
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Controller
                  name={key as keyof FormData}
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      className=""
                      {...field}
                      // disabled={!isEditable}
                      readOnly={!isEditable}
                      type={
                        fieldSchema instanceof z.ZodNumber
                          ? "number"
                          : fieldSchema instanceof z.ZodDate
                          ? "date"
                          : "text"
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          fieldSchema instanceof z.ZodNumber
                            ? value === ""
                              ? null
                              : Number(value)
                            : value
                        );
                      }}
                    />
                  )}
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
                    // onChange={(e) => {
                    //   const value = e.target.value;
                    //   console.log("raw value", formatDateString2(value));
                    //   field.onChange(formatDateString2(value))
                    // }}
                    readOnly={!isEditable}
                    // disabled={!isEditable}
                    type="date"
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
