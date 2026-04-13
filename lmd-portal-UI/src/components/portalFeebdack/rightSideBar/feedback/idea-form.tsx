import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRightSidebar } from "@/context/rightSideBarContext";
import { ApiSimulator } from "@/utils/helper_functions";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SuggestionFormSchema } from "../../schema";

type Props = {
  setView: React.Dispatch<React.SetStateAction<"home" | "issue" | "idea">>;
};

export default function IdeaForm({ setView }: Props) {
  const { closeSidebar, content } = useRightSidebar();
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const user = session.data?.user;

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

  async function onSubmit(data: z.infer<typeof SuggestionFormSchema>) {
    setLoading(true);
    const createdOn = new Date();
    const suggestedBy = user?.email!;

    try {
      const response = await fetch("/api/slack/suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          suggestedBy,
          createdOn: createdOn.toUTCString(),
        }),
      });

      const result = await response.json();
      // console.info("result", result);
      // console.info("response", response);
      if (result.success) {
        toast.success("Your suggestion has been submitted successfully!");
      } else {
        toast.error(`Failed to send idea: ${result.error}`);
      }
    } catch (error) {
      toast.error("Error submitting idea, please try again");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setView("home");
      }, 500);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      form.setValue("pageURL", window.location.href);
    }
  }, [form]);

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
          <h1 className="text-lg th-font-medium">Suggest an Idea</h1>
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[98%]  border-green-300 space-y-2 ml-1 flex flex-col justify-between h-full"
        >
          <div className=" h-[calc(100vh-200px)] 2xl:h-[calc(100vh-210px)] overflow-auto space-y-6 border-red-800 pr-2">
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
                    Please enter a title for your idea
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
                      placeholder="Tell us about your idea. "
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
