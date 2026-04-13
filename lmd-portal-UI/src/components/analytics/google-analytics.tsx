"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

interface GAConfig {
  page_path: string;
  user_id?: string;
}

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: GAConfig | Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export default function GoogleAnalytics({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID: string;
}) {
  const pathname = usePathname();
  // SearchParams is a client side function.
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();

    if (typeof window !== "undefined" && window.gtag) {
      const config: GAConfig = {
        page_path: url,
      };

      window.gtag("config", GA_MEASUREMENT_ID, config);
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  // Script is added to the head of the document. To Begin, consent is denied.
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('consent', 'default', {
                'analytics_storage': 'granted'
              });

              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname);
              `,
        }}
      />
    </>
  );
}
