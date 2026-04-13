"use client";
import React, {
  useRef,
  useState,
  forwardRef,
  useEffect,
  useCallback,
} from "react";
import BaseModal, { BaseModalRef } from "../../modals/BaseModal";
import { useSession } from "next-auth/react";
import FeedbackIcon from "@public/assets/icons/feedback.svg";
import { Button } from "../../ui/button";
import {
  ArrowLeftIcon,
  FlagIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import SuggestionForm from "./suggestionForm";
import TicketForm from "./ticketForm";

// Create a context to pass form submission control
export const FeedbackModalContext = React.createContext<{
  submitForm: () => void;
  isSubmitting: boolean;
}>({
  submitForm: () => {},
  isSubmitting: false,
});

const OpenFeedbackModal = forwardRef<
  BaseModalRef,
  { modalRef?: React.RefObject<BaseModalRef> }
>(({ modalRef }, ref) => {
  const [view, setView] = useState<"home" | "ticket" | "suggestion">("home");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formSubmitTriggerRef = useRef<(() => Promise<boolean>) | null>(null);

  const handleFormSubmit = async () => {
    if (formSubmitTriggerRef.current) {
      setIsSubmitting(true);
      try {
        const success = await formSubmitTriggerRef.current();
        if (success) {
          setView("home");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const ctaCancel = () => {
    setView("home");
  };

  function HomeForm() {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <FeedbackIcon className="h-[15rem] w-full " />
        <div className="flex flex-row gap-4 w-full px-6 mt-[10vh] ">
          <Button
            className="w-full flex items-center h-[2.2rem]"
            variant={"ghost"}
            onClick={() => setView("ticket")}
          >
            <FlagIcon className="h-5 w-5 mr-2" />
            Report an issue
          </Button>

          <Button
            className="w-full flex items-center h-[2.2rem]"
            variant={"ghost"}
            onClick={() => setView("suggestion")}
          >
            <LightBulbIcon className="h-5 w-5 mr-2" />
            Suggest an idea
          </Button>
        </div>
      </div>
    );
  }

  function modalComponent() {
    return (
      <FeedbackModalContext.Provider
        value={{
          submitForm: () => formSubmitTriggerRef.current?.(),
          isSubmitting,
        }}
      >
        <div className="bg-background pt-4 pb-2 overflow-y-auto h-[62vh] border-y">
          {view === "home" && <HomeForm />}
          {view === "ticket" && (
            <TicketForm formSubmitTriggerRef={formSubmitTriggerRef} />
          )}
          {view === "suggestion" && (
            <SuggestionForm formSubmitTriggerRef={formSubmitTriggerRef} />
          )}
        </div>
      </FeedbackModalContext.Provider>
    );
  }

  return (
    <BaseModal
      ref={ref || modalRef}
      size={"small"}
      title={
        view === "home"
          ? "Send Feedback"
          : view === "ticket"
          ? "Report an Issue"
          : "Suggest an Idea"
      }
      buttonComponent={<></>}
      components={modalComponent()}
      leftButtonComponent={
        view === "home" ? (
          <></>
        ) : (
          <Button
            variant={"dark-blue"}
            onClick={() => setView("home")}
            className="px-4 h-[30px] "
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
        )
      }
      ctaTitle={view === "home" ? "" : "Submit"}
      ctaOnClicked={handleFormSubmit}
      isCtaDisabled={isSubmitting}
      isLoading={isSubmitting}
      cancelOnClicked={ctaCancel}
      onCloseModal={ctaCancel}
    />
  );
});

OpenFeedbackModal.displayName = "OpenFeedbackModal";

export default OpenFeedbackModal;
