import { useRightSidebar } from "@/context/rightSideBarContext";
import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ApiSimulator } from "@/utils/helper_functions";

import { useSession } from "next-auth/react";
import { json } from "stream/consumers";
import { ticketCategory, TicketFormSchema, ticketPriority } from "../../schema";

type Props = {
  setView: React.Dispatch<React.SetStateAction<"home" | "issue" | "idea">>;
};

export default function Issueform({ setView }: Props) {
  const { closeSidebar } = useRightSidebar();
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const user = session.data?.user;

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
      pageURL: "", //add this in the useffect
    },
    mode: "onBlur", // Change to onBlur to show errors when leaving a field
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentURL = window.location.href;
      form.setValue("pageURL", currentURL);
    }
  }, [form]);

  async function onSubmit(data: z.infer<typeof TicketFormSchema>) {
    setLoading(true);
    const openedOn = new Date();
    const openedBy = user?.email!;

    try {
      const response = await fetch("/api/slack/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          openedBy,
          openedOn: openedOn.toUTCString(),
        }),
      });

      const result = await response.json();
      // console.info("result", result);
      // console.info("response", response);
      if (result.success) {
        toast.success("Your ticket has been submitted successfully!");
      } else {
        toast.error(`Failed to send ticket: ${result.error}`);
      }
    } catch (error) {
      toast.error("Error reporting issue, please try again");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setView("home");
      }, 500);
    }
  }
  return (
    <>
      {/* header */}
      <div className=" flex justify-between items-center border-b pb-1 pr-2">
        <div className="flex flex-row items-center gap-1.5 ml-0.5">
          <Button
            className="rounded-full"
            variant={"ghost"}
            size={"icon"}
            onClick={() => setView("home")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-lg th-font-medium">Report an Issue</h1>
        </div>
        <Button
          onClick={closeSidebar}
          className="rounded-full"
          variant={"ghost"}
          size={"icon"}
        >
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* contents */}
      {/* <div className="flex-1 overflow-auto">

      </div> */}

      {/* contents */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[98%]  space-y-2 ml-1 flex flex-col justify-between h-full "
        >
          <div className=" h-[calc(100vh-200px)] 2xl:h-[calc(100vh-210px)] overflow-auto space-y-6 border-red-800 pr-2">
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
                    <Input
                      placeholder=""
                      {...field}
                      className="border-border"
                    />
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
                      you for additional imformation
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="h-10 ">
            <Button
              type="submit"
              className="h-9 w-full"
              variant={"green"}
              isLoading={loading}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
