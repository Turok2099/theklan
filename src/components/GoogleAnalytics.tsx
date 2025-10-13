"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// Declarar tipo para dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

interface GoogleAnalyticsProps {
  gtmId: string;
}

function GoogleAnalyticsComponent({ gtmId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Inicializar dataLayer si no existe
      window.dataLayer = window.dataLayer || [];

      // Enviar pageview a GTM/GA4
      window.dataLayer.push({
        event: "page_view",
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href,
        page_search: searchParams?.toString() || "",
        gtm_id: gtmId,
      });

      // Log para debugging (remover en producción si quieres)
      console.log("📊 GA4 Pageview:", {
        path: pathname,
        title: document.title,
        url: window.location.href,
      });
    }
  }, [pathname, searchParams, gtmId]);

  return null;
}

export default function GoogleAnalytics({ gtmId }: GoogleAnalyticsProps) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsComponent gtmId={gtmId} />
    </Suspense>
  );
}

