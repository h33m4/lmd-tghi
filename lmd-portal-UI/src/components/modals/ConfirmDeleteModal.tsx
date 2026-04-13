import { Dialog, Transition } from "@headlessui/react";
import React, {
  Fragment,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { useMediaQuery } from "react-responsive";

import { Button } from "../ui/button";
import CloseIconButton from "../buttons/CloseIconButton";
import { TrashIcon } from "@heroicons/react/20/solid";
import WarningIcon from "../icons/warning";
import DeleteIcon from "@public/assets/icons/delete_red.svg";

type Props = {
  children: React.ReactNode;
  onCloseModal?: (modalState: boolean) => void;
  onOpenModal?: (modalState: boolean) => void;
  onConfirmDeleteClicked?: () => void;
  confirmDeleteTitle?: string;
  buttonComponent: React.JSX.Element;
  title?: string;
  showWarning?: boolean;
  isLoading?: boolean;
  isCtaDisabled?: boolean;
};

export interface ConfirmDeleteModalRef {
  openModal: () => void;
  closeModal: () => void;
}

const ConfirmDeleteModal = forwardRef<ConfirmDeleteModalRef, Props>(function (
  {
    children,
    onCloseModal = () => {},
    onOpenModal = () => {},
    onConfirmDeleteClicked = () => {},
    buttonComponent,
    confirmDeleteTitle = "Delete",
    showWarning = false,
    isLoading = false,
    isCtaDisabled = true,
    title,
  },
  ref
) {
  let [isOpen, setIsOpen] = useState(false);
  const [renderBool, setRenderBool] = useState<boolean>(false);
  var renderTimeOut: NodeJS.Timeout;

  function closeModal() {
    setIsOpen(false);
    onCloseModal(false);
    //handle close render
    renderTimeOut = setTimeout(() => {
      setRenderBool(false);
    }, 500);
  }

  function openModal() {
    setIsOpen(true);
    onOpenModal(true);

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

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[99999999]" onClose={closeModal}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title>
                    <div className="h-[46px] flex-none flex items-center justify-between px-2.5 py-4  bg-background  rounded-t-lg ">
                      <h1 className="text-lg th-font-heavy text-lmh-dark-blue dark:text-white -mb-2.5">
                        {title}
                      </h1>
                      <CloseIconButton
                        onClicked={async () => {
                          await closeModal();
                          // cancelOnClicked();
                        }}
                      />
                    </div>
                  </Dialog.Title>
                  <div className="pb-5 w-full max-w-md  transform rounded-2xl bg-th-background-surface text-left align-middle shadow-xl transition-all">
                    <div className="flex flex-col justify-center items-center gap-4 -mt-2">
                      <div className="h-[74px] w-[74px] rounded-full flex flex-row justify-center items-center bg-border ">
                        <DeleteIcon width="30" height="30" viewBox="0 0 9 11" />
                      </div>
                    </div>
                    <div className="text-center mt-6">
                      <h1 className="md:text-xl text-2xl th-font-heavy">
                        You are about to delete an item.
                      </h1>
                    </div>
                    <div className="">{children}</div>
                    {showWarning && (
                      <div className="px-6 py-8  -mt-5">
                        <div className="rounded-sm border bg-destructive/10 p-2 border-border text-sm">
                          <h1 className="flex items-center gap-2 text-sm th-font-medium mb-1.5">
                            <WarningIcon className="h-7 w-7 text-destructive" />{" "}
                            Warning
                          </h1>
                          Please know that this action is irreversible!
                        </div>
                      </div>
                    )}
                    <div className=" w-full flex items-center justify-center gap-5 py-2">
                      <Button
                        disabled={isCtaDisabled}
                        isLoading={isLoading}
                        className="h-8 px-3"
                        variant={"destructive"}
                        onClick={onConfirmDeleteClicked}
                      >
                        {/* <TrashIcon className="h-4 w-4 mr-2" /> */}
                        {confirmDeleteTitle}
                      </Button>

                      <Button
                        className="h-8"
                        variant={"outline2"}
                        onClick={async () => {
                          await closeModal();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
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

ConfirmDeleteModal.displayName = "ConfirmDeleteModal";

export default ConfirmDeleteModal;
