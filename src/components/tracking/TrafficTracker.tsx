"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useSiteConfig } from "@/context/ConfigContext";
import { captureAttribution } from "@/lib/trackingUtils";

const SESSION_FLAG = "fpt_traffic_session_counted";

export default function TrafficTracker() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();
  const lastTrackedPath = useRef<string | null>(null);

  const ga4Id = (siteConfig.tracking as any)?.googleAnalyticsId || "";
  const enableGa4 = Boolean((siteConfig.tracking as any)?.enableGa4 && ga4Id);
  const needsOwnGtagScript =
    enableGa4 && (!siteConfig.tracking.enableGoogleAds || !siteConfig.tracking.googleAdsId);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    // 1. Send GA4 page_view if configured
    if (enableGa4 && typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("config", ga4Id, {
        page_path: pathname,
      });
    }

    // 2. Send lightweight internal Pageview beacon (non-blocking, zero impact on LCP)
    const timer = setTimeout(() => {
      try {
        let isNewSession = false;
        let sessionId = "";
        if (typeof sessionStorage !== "undefined") {
          sessionId = sessionStorage.getItem(SESSION_FLAG) || "";
          if (!sessionId) {
            sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
            sessionStorage.setItem(SESSION_FLAG, sessionId);
            isNewSession = true;
          }
        }

        const attribution = captureAttribution();
        const isMobile =
          typeof window !== "undefined" &&
          (window.innerWidth < 768 ||
            /mobile|android|iphone|ipad/i.test(navigator.userAgent));

        const payload = JSON.stringify({
          path: pathname,
          device: isMobile ? "mobile" : "desktop",
          isNewSession,
          sessionId,
          gclid: attribution.gclid || "",
          fbclid: attribution.fbclid || "",
          utm_source: attribution.utm_source || "",
          utm_medium: attribution.utm_medium || "",
          utm_campaign: attribution.utm_campaign || "",
          utm_term: attribution.utm_term || "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        });

        if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
          const blob = new Blob([payload], { type: "application/json" });
          navigator.sendBeacon("/api/tracking/pageview", blob);
        } else {
          fetch("/api/tracking/pageview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            body: payload,
          }).catch(() => {});
        }
      } catch {
        // Non-blocking
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, enableGa4, ga4Id]);

  if (!needsOwnGtagScript) {
    return null;
  }

  return (
    <>
      <Script
        id="ga4-tag-src"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
      />
      <Script
        id="ga4-tag-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga4Id}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
