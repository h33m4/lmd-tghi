"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function UserDataLayer() {
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined" && session?.user) {
      // Push user data to the dataLayer when session exists
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "userAuthenticated",
        userId: session.user.id || session.user.email,
        userEmail: session.user.email,
        // Add any other user properties you want to track
      });
    }
  }, [session]);

  // This component doesn't render anything
  return null;
}
