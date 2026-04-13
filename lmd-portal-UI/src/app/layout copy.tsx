import type { Metadata } from "next";

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
import GoogleAnalytics from "@/components/analytics/google-analytics";
import GTM_initializer from "@/components/analytics/gtm_functions";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  // referrer: "origin-when-cross-origin",
  // other: {
  //   custom: "upgrade-insecure-requests",
  // },
};

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
      <Suspense fallback={null}>
        <GoogleTagManager GTM_ID={process.env.NEXT_PUBLIC_GTM_ID} />
        <GoogleAnalytics
          GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        />
      </Suspense>

      <body
        // to prevent any warning that is caused by third party extensions like Grammarly
        suppressHydrationWarning
        className={cn(inter.variable, lexendDeca.variable, "font-inter")}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            // enableSystem
            disableTransitionOnChange
          >
            <GTM_initializer />
            <SonnerToaster
              expand={false}
              position="top-right"
              richColors
              closeButton
            />
            <TourProvider>{children}</TourProvider>
            <Toaster position="top-right" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
