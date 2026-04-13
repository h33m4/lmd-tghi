/* eslint-disable react-hooks/exhaustive-deps */
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { FeedbackModalContext } from "./OpenFeedbackModal";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ticketCategory,
  TicketFormSchema,
  ticketPriority,
  ticketStatus,
} from "../schema";
import { useRouter } from "next/navigation";

export default function TicketForm({
  formSubmitTriggerRef,
}: {
  formSubmitTriggerRef: MutableRefObject<(() => void) | null>;
}) {
  const session = useSession();
  const router = useRouter();
  const user = session.data?.user;
  const { isSubmitting } = useContext(FeedbackModalContext);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/auth/sign-in");
    }
  }, [user]);

  const form = useForm<z.infer<typeof TicketFormSchema>>({
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      status: "Opened",
      title: "",
      description: "",
      priority: "Low",
      category: "Other",
      openedBy: user?.email!,
      consentToReachBack: false,
    },
    mode: "onBlur", // Change to onBlur to show errors when leaving a field
  });

  // Comprehensive error handling function
  const handleFormErrors = (
    errors: FieldErrors<z.infer<typeof TicketFormSchema>>
  ) => {
    const errorMessages: string[] = [];

    // Collect all form validation errors
    Object.entries(errors).forEach(([field, error]) => {
      if (error?.message) {
        // Provide more context for each error
        const fieldLabels: { [key: string]: string } = {
          title: "Title",
          description: "Description",
          priority: "Priority",
          category: "Category",
          consentToReachBack: "Consent",
        };

        const fieldLabel = fieldLabels[field] || field;
        errorMessages.push(`${fieldLabel}: ${error.message}`);
      }
    });

    // Set form errors state
    setFormErrors(errorMessages);
  };

  // Set up the submit trigger
  useEffect(() => {
    formSubmitTriggerRef.current = async () => {
      // Clear previous errors
      setFormErrors([]);

      // Validate all form fields
      const isValid = await form.trigger();

      if (isValid) {
        try {
          const result = await onSubmit(form.getValues());
          if (result) {
            // Reset form if submission is successful
            form.reset();
            return true;
          }
        } catch (error) {
          // Handle any unexpected errors during submission
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          setFormErrors([errorMessage]);
          return false;
        }
      } else {
        // Trigger error display if validation fails
        handleFormErrors(form.formState.errors);
      }

      return false;
    };

    return () => {
      formSubmitTriggerRef.current = null;
    };
  }, [form]);

  const onSubmit = async (data: z.infer<typeof TicketFormSchema>) => {
    try {
      const response = await fetch("/api/slack/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          openedBy: user?.email!,
          openedOn: new Date().toUTCString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Your ticket has been submitted successfully!");
        return true;
      } else {
        // Capture server-side errors
        const serverErrorMessage = result.error || "Submission failed";
        toast.error(serverErrorMessage);
        setFormErrors([serverErrorMessage]);
        return false;
      }
    } catch (error) {
      const errorMessage = "Error reporting issue, please try again";
      toast.error(errorMessage);
      setFormErrors([errorMessage]);
      return false;
    }
  };

  return (
    <div className="h-full p-5">
      {formErrors.length > 0 && (
        <div className="mb-4 p-3 border bg-red-100 text-red-800 rounded-sm relative">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="font-semibold">Form Submission Errors</h4>
          </div>
          <ul className="list-disc pl-5 mt-2">
            {formErrors.map((error, index) => (
              <li key={index} className="text-sm">
                {error}
              </li>
            ))}
          </ul>
          <Button
            size="icon"
            variant="ghost"
            className="absolute h-5 w-5 border text-red-800 bg-red-100 rounded-full right-[-5px] top-[-6px]"
            onClick={() => setFormErrors([])}
          >
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, handleFormErrors)}
          className="space-y-6 h-full"
        >
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel>Priority</FormLabel>
                <select
                  {...field}
                  className="flex h-8 w-full items-center px-2 py-1 rounded-md border border-border bg-transparent text-sm shadow-sm cursor-pointer ring-border transition duration-200 hover:border-primary [&.is-focus]:ring-[0.8px] ring-[0.6px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {ticketPriority.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <FormDescription>
                  Please select the priority level
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel>Category</FormLabel>
                <select
                  {...field}
                  className="flex h-8 w-full items-center px-2 py-1 rounded-md border border-border bg-transparent text-sm shadow-sm cursor-pointer ring-border transition duration-200 hover:border-primary [&.is-focus]:ring-[0.8px] ring-[0.6px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {ticketCategory.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <FormDescription>
                  Please select a ticket category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} className="border-border" />
                </FormControl>
                <FormDescription>
                  Please enter a title for your support
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here. "
                    {...field}
                    className="border-border h-[100px]"
                  />
                </FormControl>
                <FormDescription>
                  Please do not include any sensitive information
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consentToReachBack"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    We may reach out for additional information
                  </FormLabel>
                  <FormDescription>
                    Accepting this means that you confirm that we can contact
                    you for additional information
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <div className="h-[3vh]"></div>
        </form>
      </Form>
    </div>
  );
}
