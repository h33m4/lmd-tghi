"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * SessionGuard — mounted once in the (protected) layout.
 *
 * Watches session status and renders a full-screen overlay whenever the
 * session becomes unauthenticated (i.e. it expired mid-session). This
 * prevents any child component from crashing trying to read session.user
 * on a null session.
 */
export default function SessionGuard() {
  const { status } = useSession();
  const router = useRouter();
  const wasAuthenticated = useRef(false);
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      wasAuthenticated.current = true;
    }

    // Only show the expired screen if the user WAS authenticated and
    // the session subsequently became unauthenticated — not on a cold
    // load of a protected page (middleware handles that redirect).
    if (status === "unauthenticated" && wasAuthenticated.current) {
      setShowExpired(true);
    }
  }, [status]);

  if (!showExpired) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center gap-5">
        <div className="h-16 w-16 rounded-full bg-lmh-pink/10 flex items-center justify-center">
          <Clock className="h-8 w-8 text-lmh-pink" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-lmh-dark-blue-foreground th-font-heavy">
            Session Expired
          </h2>
          <p className="text-sm text-gray-500">
            Your session has timed out. Please sign back in to continue where
            you left off.
          </p>
        </div>

        <Button
          variant="dark-blue"
          className="w-full flex items-center gap-2"
          onClick={() => {
            const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
            router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`);
          }}
        >
          <LogIn className="h-4 w-4" />
          Sign back in
        </Button>
      </div>
    </div>
  );
}
