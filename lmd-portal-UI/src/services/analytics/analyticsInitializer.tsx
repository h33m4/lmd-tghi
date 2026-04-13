"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAnalytics } from "@/context/analyticContext";
import { sessionTracker } from "./sessionTracker";
import { analytics } from ".";

/**
 * Component to initialize analytics and session tracking
 * This component integrates with AuthJS (NextAuth.js) for user data
 */
export default function AnalyticsInitializer() {
  const { data: session, status } = useSession();
  const { initUser, resetUser } = useAnalytics();
  const previousStatus = useRef(status);

  // Initialize analytics with user data from AuthJS session
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize session tracking
    sessionTracker.initialize();

    // Handle authentication state changes
    if (status === "authenticated" && session?.user) {
      // Get user ID and email from the session
      const userId = session.user.id || session.user.id || "anonymous user";
      const userEmail = session.user.email || "anonymous email";

      // Initialize analytics with user data
      initUser(userId as string, userEmail as string);

      if (
        previousStatus.current === "unauthenticated" ||
        previousStatus.current === "loading"
      ) {
        // Determine login type (can be improved if you store provider info in the session)
        // const loginType = session.provider === "google" ? "google" : "password";
        analytics.trackLogin("google");
      }
    } else if (status === "unauthenticated") {
      // Reset user data when not authenticated
      console.log("resetting user ---");
      resetUser();
    }
  }, [status, session, initUser, resetUser]);

  // This is a utility component with no UI
  return null;
}
