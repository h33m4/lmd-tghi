"use client";

import React, { useState, useTransition } from "react";
import { PortalConfig, forceLogoutAllUsers, clearForceLogout } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const COOKIE_INFO = [
  {
    name: "next-auth.session-token",
    storage: "Cookie (httpOnly)",
    purpose: "NextAuth session JWT — authenticates the user on every request",
    clearable: true,
  },
  {
    name: "next-auth.csrf-token",
    storage: "Cookie",
    purpose: "CSRF protection token for NextAuth form submissions",
    clearable: false,
  },
  {
    name: "next-auth.callback-url",
    storage: "Cookie",
    purpose: "Stores the redirect URL after sign-in",
    clearable: false,
  },
  {
    name: "announcement_dismissed_*",
    storage: "localStorage",
    purpose: "Tracks which announcements the user has dismissed",
    clearable: true,
  },
  {
    name: "welcome_tour_seen",
    storage: "localStorage",
    purpose: "Tracks whether the user has seen the welcome tour",
    clearable: true,
  },
  {
    name: "_ga, _gid",
    storage: "Cookie",
    purpose: "Google Analytics / Google Tag Manager tracking cookies",
    clearable: false,
  },
];

export default function SessionsClient({ initialConfig }: { initialConfig: PortalConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleForceLogout = () => {
    startTransition(async () => {
      const result = await forceLogoutAllUsers();
      if (result.ok) {
        toast.success("Force logout activated", { description: result.message });
        setConfig((c) => ({ ...c, forceLogoutAfter: new Date().toISOString() }));
        setShowConfirm(false);
      } else {
        toast.error("Failed", { description: result.message });
      }
    });
  };

  const handleClearForceLogout = () => {
    startTransition(async () => {
      const result = await clearForceLogout();
      if (result.ok) {
        toast.success("Force logout cleared — new sessions will persist normally.");
        setConfig((c) => ({ ...c, forceLogoutAfter: null }));
      } else {
        toast.error("Failed", { description: result.message });
      }
    });
  };

  const isForceLogoutActive = !!config.forceLogoutAfter;

  return (
    <div className="space-y-5">
      {/* Force logout */}
      <div className="rounded-md border border-border bg-background overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
          <ArrowRightOnRectangleIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Force Re-login All Users</span>
        </div>
        <div className="px-4 py-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Sets a timestamp. Any user whose session was issued <em>before</em> that timestamp will be
            automatically signed out on their next page load. Useful after security changes, permission
            updates, or major deployments.
          </p>

          {isForceLogoutActive ? (
            <div className="flex items-start gap-3 p-3 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <div className="text-sm text-green-700 dark:text-green-300 flex-1">
                <span className="font-semibold">Active</span> — sessions issued before{" "}
                <span className="font-mono text-xs">
                  {new Date(config.forceLogoutAfter!).toLocaleString()}
                </span>{" "}
                will be invalidated.
              </div>
              <button
                onClick={handleClearForceLogout}
                disabled={isPending}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-background border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 transition-colors"
              >
                {isPending ? <ArrowPathIcon className="h-3 w-3 animate-spin" /> : <TrashIcon className="h-3 w-3" />}
                Clear
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 rounded-md bg-muted/30 border border-border">
              <InformationCircleIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">No active force logout. All valid sessions are accepted.</p>
            </div>
          )}

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-destructive text-white text-sm font-medium hover:bg-destructive/90 disabled:opacity-60 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Force Re-login All Users
            </button>
          ) : (
            <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  Are you sure? This will sign out all currently logged-in users.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleForceLogout}
                    disabled={isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-destructive text-white text-xs font-medium hover:bg-destructive/90 disabled:opacity-60 transition-colors"
                  >
                    {isPending && <ArrowPathIcon className="h-3 w-3 animate-spin" />}
                    Yes, sign out all users
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-3 py-1.5 rounded-md text-xs text-muted-foreground border border-border hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cookie / storage reference */}
      <div className="rounded-md border border-border bg-background overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <span className="text-sm font-semibold">Cookies & Local Storage Reference</span>
          <p className="text-xs text-muted-foreground mt-0.5">All data the portal stores on the user&apos;s browser</p>
        </div>
        <div className="divide-y divide-border">
          {COOKIE_INFO.map((item) => (
            <div key={item.name} className="px-4 py-3 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-foreground">{item.name}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    item.storage.includes("localStorage")
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  )}>
                    {item.storage}
                  </span>
                  {item.clearable && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                      clearable
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.purpose}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-muted/20 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Clearable</span> items can be reset by using &quot;Force Re-login&quot; (session cookie) or &quot;Reset dismissed&quot; on an announcement (localStorage). Users can also clear their own browser storage manually.
          </p>
        </div>
      </div>
    </div>
  );
}
