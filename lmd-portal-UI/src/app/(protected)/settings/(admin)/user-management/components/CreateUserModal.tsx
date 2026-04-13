"use client";

import { useCallback, useRef, useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import BaseModal, { BaseModalRef } from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorBanner from "@/components/ui/banner/ErrorBanner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import handleAdminCreateUser from "@/lib/actions/auth/handleAdminCreateUser";
import { IButtonStatus } from "@/types";
import SuccessBanner from "@/components/ui/banner/SuccessBanner";

type Props = {
  onCloseModal: (data: any) => void;
};

const FormSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Email is required"),
  title: z.string().optional(),
  department: z.string().optional(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const CreateUserModal = ({ onCloseModal }: Props) => {
  const [formError, setFormError] = useState<string | undefined>();
  const [formSuccess, setFormSuccess] = useState<string>();
  const [buttonStatus, setButtonStatus] = useState<IButtonStatus>("default");
  const baseModalRef = useRef<BaseModalRef>(null);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", email: "", department: "", title: "" },
  });

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

  const formSubmitHandler = async () => {
    setButtonStatus("loading");
    setFormError(undefined);

    try {
      const isValid = await form.trigger();
      if (!isValid) throw new Error("Form validation failed");

      const formData = { ...form.getValues() };
      const result = await handleAdminCreateUser(formData);

      if (result?.error) {
        setFormError(result.error);
        toast.error(result.error);
      } else if (result?.success) {
        setFormSuccess(`Account for ${formData.email} created successfully`);
        toast.success("User created successfully!");
        onCloseModal(result.user);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setButtonStatus("default");
    }
  };

  return (
    <BaseModal
      ref={baseModalRef}
      title="Create New User"
      buttonComponent={
        <Button title="Add User" variant="dark-blue" className="h-8">
          <UserPlusIcon className="h-[19px] w-[19px] mr-2" />
          Add User
        </Button>
      }
      ctaTitle={buttonStatus === "loading" ? "Creating User" : "Create User"}
      ctaOnClicked={formSubmitHandler}
      isCtaDisabled={buttonStatus === "loading"}
      isLoading={buttonStatus === "loading"}
      components={
        <div className="px-6 py-4 overflow-y-auto lg:max-h-[80vh] h-[55vh]">
          <ErrorBanner
            setFormError={() => setFormError(undefined)}
            message={formError}
          />
          <SuccessBanner
            message={formSuccess}
            setFormSuccess={() => setFormSuccess(undefined)}
          />

          <Form {...form}>
            <form className="space-y-5 mt-3">
              <div className="text-sm mt-4 border w-full bg-yellow-100 p-2 rounded-sm">
                Newly created user accounts will have minimal access permissions.
                To grant elevated permissions, please navigate to the user
                management section after the user has confirmed their account.
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Please user's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Please user's email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., MERL Director" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., GMERL, POPs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      }
      cancelOnClicked={handleClose}
      onCloseModal={handleClose}
    />
  );
};

export default CreateUserModal;
