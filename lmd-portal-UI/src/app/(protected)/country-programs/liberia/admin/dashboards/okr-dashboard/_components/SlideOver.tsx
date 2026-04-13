"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PanelLayout = "slideover" | "modal";

// ─── SlideOver ────────────────────────────────────────────────────────────────

export function SlideOver({
  open,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  layout = "slideover",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  layout?: PanelLayout;
}) {
  const header = (
    <div className="bg-gradient-to-br from-lmh-dark-blue to-[#1e4d62] px-5 py-5 shrink-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">{badge}</div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1 -mr-1 rounded"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
      {subtitle && (
        <p className="text-sm text-white/60 mt-1 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );

  if (layout === "modal") {
    return (
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-2xl flex flex-col bg-background rounded-xl shadow-2xl overflow-hidden"
                style={{ maxHeight: "90dvh" }}
              >
                {header}
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                  {children}
                </div>
                {footer && (
                  <div className="shrink-0 px-5 py-4 border-t bg-background flex items-center justify-end gap-2 rounded-b-xl">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  }

  // Slide-over
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed top-0 right-0 h-full flex">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-screen sm:w-[540px] flex flex-col h-full shadow-2xl">
                  {header}
                  <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-background">
                    {children}
                  </div>
                  {footer && (
                    <div className="shrink-0 px-5 py-4 border-t bg-background flex items-center justify-end gap-2">
                      {footer}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
