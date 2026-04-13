import type { Metadata } from "next";

import * as Sentry from "@sentry/nextjs";

import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { inter, lexendDeca } from "@/app/fonts";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

// styles
import "../styles/globals.css";
import "../styles/quill.css";
import "../styles/animation.css";
import { Suspense } from "react";
import { TourProvider } from "@/context/tourContext";
import GoogleTagManager from "@/components/analytics/google-tag-manager";
import GTM_initializer from "@/components/analytics/gtm_functions";
import { AnalyticsProvider } from "@/context/analyticContext";
import AnalyticsInitializer from "@/services/analytics/analyticsInitializer";
import ReCaptureProvider from "@/components/Providers/ReCaptureProvider";

export function generateMetadata(): Metadata {
  return {
    title: siteConfig.title,
    description: siteConfig.description,
    // ... your existing metadata
    other: {
      ...Sentry.getTraceData(),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html
      lang="en"
      // required this one for next-themes, remove it if you are not using next-theme
      suppressHydrationWarning
    >
      <body
        // to prevent any warning that is caused by third party extensions like Grammarly
        suppressHydrationWarning
        className={cn(inter.variable, lexendDeca.variable, "font-inter")}
      >
        <GoogleTagManager GTM_ID={process.env.NEXT_PUBLIC_GTM_ID} />

        <SessionProvider session={session}>
          <GTM_initializer />

          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            // enableSystem
            disableTransitionOnChange
          >
            <ReCaptureProvider>
            <SonnerToaster
              expand={false}
              position="top-right"
              richColors
              closeButton
            />
            <TourProvider>
              <AnalyticsProvider>
                <AnalyticsInitializer />
                {children}
              </AnalyticsProvider>
            </TourProvider>
            <Toaster position="top-right" />
            </ReCaptureProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
