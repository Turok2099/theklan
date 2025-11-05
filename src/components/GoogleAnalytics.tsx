"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// Declarar tipo para dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface GoogleAnalyticsProps {
  gtmId: string;
}

function GoogleAnalyticsComponent({ gtmId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inicializar dataLayer en el montaje del componente
  useEffect(() => {
    // Asegurar que dataLayer existe
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      
      // Enviar configuración inicial
      window.dataLayer.push({
        event: "gtm.js",
        "gtm.start": new Date().getTime(),
      });

      console.log("✅ GTM Inicializado:", gtmId);
    }
  }, [gtmId]);

  // Rastrear cambios de página
  useEffect(() => {
    if (pathname && typeof window !== "undefined") {
      // Asegurar que dataLayer existe
      window.dataLayer = window.dataLayer || [];

      // Enviar pageview a GTM/GA4
      window.dataLayer.push({
        event: "page_view",
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href,
        page_search: searchParams?.toString() || "",
        gtm_id: gtmId,
        timestamp: new Date().toISOString(),
      });

      // Log para debugging
      console.log("📊 GA4 Pageview:", {
        path: pathname,
        title: document.title,
        url: window.location.href,
        dataLayerLength: window.dataLayer.length,
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

