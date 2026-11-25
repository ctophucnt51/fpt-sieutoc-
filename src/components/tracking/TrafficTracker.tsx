"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useSiteConfig } from "@/context/ConfigContext";
import { captureAttribution } from "@/lib/trackingUtils";

const SESSION_FLAG = "fpt_traffic_session_counted";
const VISITOR_UID_KEY = "fpt_visitor_uid";
const ADS_GCLIDS_KEY = "fpt_ads_gclids_24h";

function getOrCreateVisitorId(): string {
  if (typeof localStorage === "undefined") return "";
  let uid = localStorage.getItem(VISITOR_UID_KEY) || "";
  if (!uid) {
    uid = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    try {
      localStorage.setItem(VISITOR_UID_KEY, uid);
    } catch {}
  }
  return uid;
}

function trackRepeatAdsDevice(gclid?: string): void {
  if (!gclid || typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(ADS_GCLIDS_KEY);
    const now = Date.now();
    const cutoff = now - 24 * 60 * 60 * 1000;
    let items: { gclid: string; ts: number }[] = raw ? JSON.parse(raw) : [];
    items = items.filter((i) => i.ts >= cutoff);
    if (!items.some((i) => i.gclid === gclid)) {
      items.push({ gclid, ts: now });
      localStorage.setItem(ADS_GCLIDS_KEY, JSON.stringify(items.slice(-20)));
    }
    // If >= 2 distinct GCLIDs from the same browser/device within 24h, emit audience-exclusion signal
    if (items.length >= 2 && typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "suspicious_repeat_click", {
        repeat_count: items.length,
        event_category: "anti_click_fraud",
      });
    }
  } catch {}
}

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

    // 2. Send lightweight internal Pageview beacon (non-blocking, zero impact on TBT/LCP)
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
        const visitorId = getOrCreateVisitorId();
        trackRepeatAdsDevice(attribution.gclid);
        const isMobile =
          typeof window !== "undefined" &&
          (window.innerWidth < 768 ||
            /mobile|android|iphone|ipad/i.test(navigator.userAgent));

        const payload = JSON.stringify({
          path: pathname,
          device: isMobile ? "mobile" : "desktop",
          isNewSession,
          sessionId,
          visitorId,
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
    }, 2500);

    return () => clearTimeout(timer);
  }, [pathname, enableGa4, ga4Id]);

  return null;
}
