"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { gtm_trackLogin } from "@/components/analytics/gtm_functions";

export default function GTMLoginTracker() {
  const { data: session, status } = useSession();
  const [hasTrackedLogin, setHasTrackedLogin] = useState(false);

  // console.log("Session status:", status);

  useEffect(() => {
    // Check if this is a new login session
    const isNewLogin = () => {
      try {
        // Check localStorage for previous session tracking
        const lastTrackedLogin = localStorage.getItem("last_login_tracked");

        if (!lastTrackedLogin) {
          return true; // No previous tracking, must be new
        }

        const now = new Date().getTime();
        const lastTracked = parseInt(lastTrackedLogin, 10);

        // If last tracked more than 30 minutes ago, consider it a new login
        return now - lastTracked > 30 * 60 * 1000;
      } catch (e) {
        console.error("Error checking login status:", e);
        return false;
      }
    };

    // Track the login using session data
    if (
      session &&
      status === "authenticated" &&
      !hasTrackedLogin &&
      isNewLogin()
    ) {
      // console.log("Tracking login from session:", session);

      // Track login event
      gtm_trackLogin({
        user_id: session.user?.id || session.user?.email || "unknown",
        user_email: session.user?.email || "unknown",
        user_groups: session.user?.groups || [],
        timestamp: new Date().toISOString(),
      });

      // Mark as tracked
      setHasTrackedLogin(true);

      try {
        // Store tracking timestamp
        localStorage.setItem(
          "last_login_tracked",
          new Date().getTime().toString()
        );
      } catch (e) {
        console.error("Error storing login tracking:", e);
      }

      // console.log("Login tracked successfully");
    }
  }, [session, status, hasTrackedLogin]);

  // For debugging - check session on mount
  useEffect(() => {
    if (status === "authenticated") {
      // console.log("Session available on mount:", session);
    }
  }, [session, status]);

  return null; // This component doesn't render anything
}
