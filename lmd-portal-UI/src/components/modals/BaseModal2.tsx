import { Dialog, Transition } from "@headlessui/react";
import React, {
  Fragment,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
// import { useMediaQuery } from "react-responsive";

import { Button } from "../ui/button";
import { X } from "lucide-react";

type Props = {
  ctaOnClicked?: () => void;
  cancelOnClicked?: () => void;
  onCloseModal?: (modalState: boolean) => void;
  onOpenModal?: (modalState: boolean) => void;
  hasFooter?: boolean;
  isLoading?: boolean;
  isCtaDisabled?: boolean;
  size?: "very-small" | "small" | "medium" | "large";
  title: string;
  buttonComponent: React.JSX.Element;
  leftButtonComponent?: React.JSX.Element;
  ctaTitle?: string;
  children: ReactNode;
};

export interface BaseModal2Ref {
  openModal: () => void;
  closeModal: () => void;
}

const BaseModal2 = forwardRef<BaseModal2Ref, Props>(function (
  {
    size = "small",
    title,
    buttonComponent,
    leftButtonComponent,
    hasFooter = true,
    isCtaDisabled = true,
    children,
    isLoading = false,
    ctaOnClicked = () => {},
    cancelOnClicked = () => {},
    onCloseModal = () => {},
    onOpenModal = () => {},
    ctaTitle = "",
  },
  ref
) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [renderBool, setRenderBool] = useState<boolean>(false);
  let renderTimeOut: NodeJS.Timeout;
  //   const isMobile = useMediaQuery({ query: "(max-width: 760px)" });

  async function closeModal() {
    setIsOpen(false);
    onCloseModal(false); //pass modal state to modal wrapper if needed
    //handle close render
    renderTimeOut = setTimeout(() => {
      setRenderBool(false);
    }, 500);
  }

  async function openModal() {
    setIsOpen(true);
    onOpenModal(true); //pass modal state to modal wrapper if needed

    //handle open render
    clearTimeout(renderTimeOut);
    setRenderBool(true);
  }

  // Expose a function to trigger the form submission
  useImperativeHandle(ref, () => ({
    openModal: openModal,
    closeModal: closeModal,
  }));

  return (
    <>
      {/* Button Component */}
      <div
        role="button"
        onClick={async () => {
          await openModal();
        }}
      >
        {buttonComponent}
      </div>

      {/* Base Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[99999999]"
          onClose={async () => {
            await closeModal();
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div
              className={`flex min-h-full items-center justify-center p-4 text-center`}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full ${
                    size === "very-small" ? "max-w-lg" : ""
                  } ${size === "small" ? "max-w-2xl" : ""} ${
                    size === "medium" ? "max-w-4xl" : ""
                  } ${
                    size === "large" ? "max-w-6xl 2xl:max-w-7xl " : ""
                  } transform rounded-lg  text-left align-middle shadow-xl transition-all`}
                >
                  {/* Modal Header */}
                  <Dialog.Title>
                    <div className="h-[45px] flex-none flex items-center justify-between px-3 py-3 border-b-[0.5px] border bg-background  rounded-t-lg ">
                      <h1 className=" -mb-2.5 text-lg font-semibold leading-none tracking-tight">
                        {title}
                      </h1>
                      <Button
                        className="rounded-full"
                        variant={"ghost"}
                        size={"icon"}
                        onClick={async () => {
                          await closeModal();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Dialog.Title>

                  <div
                    className={`flex flex-col bg-background rounded-b-lg border   justify-between `}
                  >
                    {/* Modal Components */}
                    <div>
                      {renderBool && <div className="pr-1">{children}</div>}
                    </div>

                    {/* Modal Footer */}
                    {hasFooter && (
                      <div className="h-[50px] bg-background rounded-b-lg border-t  flex flex-row lg:flex-row justify-between items-center py-4 px-4 gap-2 border-th-stroke-primary">
                        {/* Left Component Button */}
                        {leftButtonComponent}

                        <div className="flex-1"></div>

                        <div className="flex flex-row gap-2">
                          {/* Submit Button */}
                          {ctaTitle && (
                            <Button
                              disabled={isCtaDisabled}
                              title={ctaTitle}
                              isLoading={isLoading}
                              className="px-8 h-[30px]"
                              size={"sm"}
                              onClick={() => {
                                ctaOnClicked();
                              }}
                              variant={"default"}
                            >
                              {ctaTitle}
                            </Button>
                          )}

                          {/* Cancel Button */}
                          <Button
                            title="Cancel"
                            variant={"destructive"}
                            className="px-8  h-[30px]"
                            size={"sm"}
                            onClick={async () => {
                              await closeModal();
                              cancelOnClicked();
                            }}
                            disabled={false}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
});

BaseModal2.displayName = "BaseModal2";
export default BaseModal2;
