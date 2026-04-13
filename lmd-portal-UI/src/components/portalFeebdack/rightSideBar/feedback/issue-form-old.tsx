import { useRightSidebar } from "@/context/rightSideBarContext";
import React, { useState } from "react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ApiSimulator } from "@/utils/helper_functions";

import { useSession } from "next-auth/react";
import { json } from "stream/consumers";
import { TicketFormSchema } from "../../schema";

type Props = {
  setView: React.Dispatch<React.SetStateAction<"home" | "issue" | "idea">>;
};

export const priority = ["Low", "Medium", "High"] as const;
const FormSchema = z.object({
  priority: z.enum(priority, {
    required_error: "You need to select a priority type.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  consentToReachBack: z.boolean().default(false),
});

export default function Issueform({ setView }: Props) {
  const { closeSidebar } = useRightSidebar();
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const user = session.data?.user;

  const form = useForm<z.infer<typeof TicketFormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: priority[0],
      consentToReachBack: false,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
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
      <div className=" flex justify-between items-center border-b pb-1">
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
          className="w-[98%]  border-green-300 space-y-2 ml-1 flex flex-col justify-between h-full"
        >
          <div className=" h-[calc(100vh-200px)] 2xl:h-[calc(100vh-210px)] overflow-auto space-y-6 border-red-800">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select a priority value" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priority.map((item, _id) => (
                        <SelectItem key={_id + item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Please select the priority level
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
                      className="border-lmh-dark-blue"
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
                      className="border-lmh-dark-blue h-[100px]"
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
                      you for more additional imformation
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
