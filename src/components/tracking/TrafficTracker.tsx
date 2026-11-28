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

function detectNetworkInfo(): { networkType: string; networkDetail?: string } {
  if (typeof navigator === "undefined") return { networkType: "Không rõ" };
  const conn =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;
  if (!conn) return { networkType: "Không rõ" };

  const eff = conn.effectiveType ? String(conn.effectiveType).toUpperCase() : "";
  const rtt = typeof conn.rtt === "number" && conn.rtt > 0 ? `${conn.rtt}ms` : "";
  const downlink =
    typeof conn.downlink === "number" && conn.downlink > 0 ? `${conn.downlink}Mbps` : "";
  const metrics = [eff && eff !== "4G" ? eff : "", downlink, rtt].filter(Boolean).join(" • ");

  if (conn.type === "wifi") {
    return { networkType: "Wi-Fi", networkDetail: metrics || undefined };
  }
  if (conn.type === "ethernet") {
    return { networkType: "Cáp mạng", networkDetail: metrics || undefined };
  }
  if (conn.type === "cellular") {
    const label = eff ? `${eff}/Di động` : "4G/Di động";
    return { networkType: label, networkDetail: [downlink, rtt].filter(Boolean).join(" • ") || undefined };
  }
  if (eff) {
    return {
      networkType: eff === "4G" ? "Mạng nhanh (4G/Wi-Fi)" : eff,
      networkDetail: [downlink, rtt].filter(Boolean).join(" • ") || undefined,
    };
  }
  return { networkType: "Không rõ" };
}

function sendBeaconPayload(payload: string): void {
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
}

export default function TrafficTracker() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();
  const lastTrackedPath = useRef<string | null>(null);
  const currentVisitId = useRef<string>("");
  const pageEnterTs = useRef<number>(Date.now());

  const ga4Id = (siteConfig.tracking as any)?.googleAnalyticsId || "";
  const enableGa4 = Boolean((siteConfig.tracking as any)?.enableGa4 && ga4Id);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const visitId = `pv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    currentVisitId.current = visitId;
    pageEnterTs.current = Date.now();

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

        const netInfo = detectNetworkInfo();
        const payload = JSON.stringify({
          visitId,
          path: pathname,
          device: isMobile ? "mobile" : "desktop",
          networkType: netInfo.networkType,
          networkDetail: netInfo.networkDetail || "",
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

        sendBeaconPayload(payload);
      } catch {
        // Non-blocking
      }
    }, 2500);

    const visitorId = getOrCreateVisitorId();
    // Fetch live block status & active fraud policy for this IP/device
    fetch(`/api/tracking/block-status?visitorId=${encodeURIComponent(visitorId)}`, {
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof window !== "undefined") {
          (window as any).__fptFraudBlock = {
            blocked: Boolean(data.blocked),
            reason: data.reason || null,
            policy: data.policy || { blockForm: true, blockCall: true, blockZalo: true },
          };
        }
      })
      .catch(() => {});

    const reportUpdate = (action?: string) => {
      if (!currentVisitId.current) return;
      const durationSeconds = Math.max(1, Math.round((Date.now() - pageEnterTs.current) / 1000));
      sendBeaconPayload(
        JSON.stringify({
          mode: "update",
          visitId: currentVisitId.current,
          durationSeconds,
          action,
        })
      );
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") reportUpdate();
    };
    const handlePageHide = () => reportUpdate();
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const fraudBlock =
        typeof window !== "undefined" ? (window as any).__fptFraudBlock : null;

      if (href.startsWith("tel:")) {
        if (fraudBlock?.blocked && fraudBlock?.policy?.blockCall) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          reportUpdate("Chặn bấm gọi");
          window.alert(
            "Hệ thống phát hiện bạn truy cập lặp lại nhiều lần (spam) nên đã chặn thao tác bấm gọi từ thiết bị/mạng này."
          );
          return;
        }
        reportUpdate("Bấm gọi");
      } else if (href.includes("zalo.me")) {
        if (fraudBlock?.blocked && fraudBlock?.policy?.blockZalo) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          reportUpdate("Chặn bấm Zalo");
          window.alert(
            "Hệ thống phát hiện bạn truy cập lặp lại nhiều lần (spam) nên đã chặn thao tác bấm Zalo từ thiết bị/mạng này."
          );
          return;
        }
        reportUpdate("Bấm Zalo");
      } else if (href.includes("m.me") || href.includes("messenger.com")) {
        reportUpdate("Bấm Messenger");
      }
    };
    const handleSubmit = () => {
      const fraudBlock =
        typeof window !== "undefined" ? (window as any).__fptFraudBlock : null;
      if (fraudBlock?.blocked && fraudBlock?.policy?.blockForm) {
        reportUpdate("Chặn gửi form");
        return;
      }
      reportUpdate("Gửi form");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
    };
  }, [pathname, enableGa4, ga4Id]);

  return null;
}
