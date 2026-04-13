"use client";
import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import { IButtonStatus } from "@/types";
import {
  DocumentPlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TextBoxInput from "@/components/input/TextBoxInput";
import { Textarea } from "@/components/ui/textarea";
import { ApiSimulator } from "@/utils/helper_functions";

import ErrorBanner from "@/components/ui/banner/ErrorBanner";

type Props = {
  onAddRecordCallback: () => void;
};

const allowedCountries = [
  "Liberia",
  "Malawi",
  "Ethiopia",
  "Sierra Leone",
] as const;

const allowedTocPillars = [
  "Cross-Cutting",
  "Upskill",
  "Deliver",
  "Strengthen",
] as const;

const FormSchema = z.object({
  country: z.enum(allowedCountries, {
    errorMap: () => ({
      message:
        "Invalid country. Please enter from Liberia, Malawi, Ethiopia, or Sierra Leone.",
    }),
  }),
  tocpillar: z.enum(allowedTocPillars, {
    errorMap: () => ({
      message:
        "Invalid TOC Pillar. Please enter from Cross-cutting, Upskill, Deliver, or Strengthen.",
    }),
  }),
  kpi: z.string().min(1, "KPI is required."),
  typeofchangemade: z.string().min(1, "Type of Change Made is required."),
  additionaldetails: z.string().optional(),
  oldvalue: z.string().min(1, "Old Value is required."),
  newvalue: z.string().min(1, "New Value is required."),
  supportingdocumentlink: z.string().optional(),
  reasonforchange: z.string().min(1, "Comments/Reason for Change is required."),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function AddNewKpiChangeLogModal({
  onAddRecordCallback,
}: Props) {
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const baseModalRef = useRef<BaseModalRef>(null);
  const [formError, setFormError] = useState<string>();

  //   form
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      country: undefined,
      tocpillar: undefined,
      kpi: "",
      typeofchangemade: "",
      additionaldetails: "",
      oldvalue: "",
      newvalue: "",
      supportingdocumentlink: "",
      reasonforchange: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change" && name) {
        form.clearErrors(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleClose = useCallback(() => {
    setFormError(undefined);
    setButtonStatus("default");
    form.reset(undefined, {
      keepIsSubmitted: false,
      keepErrors: false,
      keepDirty: false,
      keepValues: false,
      keepDefaultValues: true,
    });
  }, [form]);

  async function formSubmitHandler() {
    setButtonStatus("loading");
    setFormError(undefined);

    const promiseResult = new Promise(async (resolve, reject) => {
      try {
        const isValid = await form.trigger();
        if (!isValid) {
          throw new Error("Form validation failed");
        }

        const formData = form.getValues();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LMD_API}/kpi_data/changelogs`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promiseResult, {
      loading: "Submitting record...",
      success: () => {
        onAddRecordCallback();
        handleClose();
        baseModalRef.current?.closeModal();
        return "Record added successfully";
      },
      error: (error) => {
        setFormError(
          error instanceof Error ? error.message : "An error occurred"
        );
        return error instanceof Error ? error.message : "Failed to add record";
      },
    });

    try {
      await promiseResult;
    } catch (error) {
      console.error("Error adding record:", error);
    } finally {
      setButtonStatus("default");
    }
  }

  function ModalComponent() {
    return (
      <div className="px-6 py-4 overflow-auto h-[70vh]">
        {formError && (
          <ErrorBanner
            setFormError={() => setFormError(undefined)}
            message={formError}
          />
        )}
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-3"
          >
            <div className="grid grid-cols-3 space-x-5">
              {/* country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please enter country name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* toc pillar */}

              <FormField
                control={form.control}
                name="tocpillar"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>TOC Pillar</FormLabel>
                    <FormControl>
                      <Input placeholder="Please enter TOC Pillar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* kpi */}
            <FormField
              control={form.control}
              name="kpi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KPI</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Please enter KPI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 space-x-5">
              {/* country */}
              <FormField
                control={form.control}
                name="typeofchangemade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Change Made</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please enter type of change made"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* additionaldetails */}
              <FormField
                control={form.control}
                name="additionaldetails"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Additional Detail on Change Made (e.g., timeframe or
                      specific changes made)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please enter any additional details on the change made"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="oldvalue"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Old Value</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please enter the  old value"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newvalue"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>New Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Please enter new value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* reasonforchange */}
            <FormField
              control={form.control}
              name="reasonforchange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments / Reason for Change</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please enter reasons for the change you are making"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* supportingdocumentlink */}
            <FormField
              control={form.control}
              name="supportingdocumentlink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Any Supporting Document for Change (link)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please enter any supporting document link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    );
  }

  return (
    <BaseModal
      ref={baseModalRef}
      title={"Add New KPI Change Log"}
      size={"medium"}
      buttonComponent={
        <Button className="h-8 flex items-center">
          <DocumentPlusIcon className="h-4 w-4 mr-1" />
          New Record
        </Button>
      }
      components={ModalComponent()}
      ctaTitle={buttonStatus === "loading" ? "Submiting..." : "Submit"}
      isCtaDisabled={buttonStatus === "loading"}
      isLoading={buttonStatus === "loading"}
      ctaOnClicked={formSubmitHandler}
      cancelOnClicked={handleClose}
      onCloseModal={handleClose}
    />
  );
}
