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
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { useForm, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { FeedbackModalContext } from "./OpenFeedbackModal";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SuggestionFormSchema } from "../schema";

export const ticketStatus = [
  "Opened",
  "In Progress",
  "Pending",
  "Closed",
] as const;
export const ticketPriority = ["Low", "Medium", "High"] as const;

export default function SuggestionForm({
  formSubmitTriggerRef,
}: {
  formSubmitTriggerRef: MutableRefObject<(() => void) | null>;
}) {
  const session = useSession();
  const user = session.data?.user;
  const { isSubmitting } = useContext(FeedbackModalContext);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const form = useForm<z.infer<typeof SuggestionFormSchema>>({
    resolver: zodResolver(SuggestionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      suggestedBy: user?.email!,
      consentToReachBack: false,
      pageURL: "",
    },
    mode: "onChange",
  });

  // Comprehensive error handling function
  const handleFormErrors = (
    errors: FieldErrors<z.infer<typeof SuggestionFormSchema>>
  ) => {
    const errorMessages: string[] = [];

    // Collect all form validation errors
    Object.values(errors).forEach((error) => {
      if (error?.message) {
        errorMessages.push(error.message);
      }
    });

    // Set form errors state
    setFormErrors(errorMessages);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      form.setValue("pageURL", window.location.href);
    }
  }, [form]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof SuggestionFormSchema>) => {
      try {
        const response = await fetch("/api/slack/suggestion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data,
            suggestedBy: user?.email!,
            createdOn: new Date().toUTCString(),
          }),
        });

        const result = await response.json();

        if (result.success) {
          toast.success("Your suggestion has been submitted successfully!");
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
    },
    [user?.email]
  );

  // Set up the submit trigger
  useEffect(() => {
    formSubmitTriggerRef.current = async () => {
      // Clear previous errors
      setFormErrors([]);

      // Validate form
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
  }, [form, formSubmitTriggerRef, onSubmit]);

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
        </form>
      </Form>
      <div className="h-[3vh]"></div>
    </div>
  );
}
