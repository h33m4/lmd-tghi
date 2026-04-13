"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

// Define types for tracking events
interface TrackEventProps {
  event: string;
  [key: string]: any;
}

interface LoginEventProps {
  user_id?: string;
  user_email?: string;
  user_groups?: string[];
  method?: string;
  [key: string]: any;
}

// Define global function types
declare global {
  interface Window {
    dataLayer: any[];
    trackEvent: (data: TrackEventProps) => void;
    trackLogin: (data: LoginEventProps) => void;
  }
}

// Initialize tracking functions
const initializeTracking = () => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  // Generic event tracking function
  window.trackEvent = (data: TrackEventProps) => {
    window.dataLayer.push(data);
  };

  // Login specific tracking function (GTM recommended event)
  window.trackLogin = ({
    user_id,
    user_email,
    user_groups,
    method = "password",
    ...rest
  }: LoginEventProps) => {
    window.dataLayer.push({
      event: "login",
      user_id,
      user_email,
      user_groups,
      method,
      ...rest,
    });
  };
};

const pushToDataLayer = (data: any): void => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
};

// Exported tracking functions
export const gtm_trackEvent = (data: TrackEventProps): void => {
  pushToDataLayer(data);
};

export const gtm_trackLogin = (data: LoginEventProps): void => {
  pushToDataLayer({
    event: "lmd_login",
    ...data,
  });
};

export const gtm_trackPageView = (
  pageTitle: string,
  pagePath: string
): void => {
  pushToDataLayer({
    event: "lmd_page_view",
    page_title: pageTitle,
    page_path: pagePath,
  });
};

// Main component
export default function GTM_initializer() {
  const { data: session } = useSession();

  useEffect(() => {
    // Initialize tracking functions
    initializeTracking();

    // Track session data when available
    if (session?.user) {
      const userGroups = session.user.groups || [];

      pushToDataLayer({
        event: "lmd_session",
        user_id: session.user.id || session.user.email,
        user_email: session.user.email,
        user_groups: userGroups,
      });
    }
  }, [session]);

  return null;
}
