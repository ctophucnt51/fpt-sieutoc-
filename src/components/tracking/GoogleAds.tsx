"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useSiteConfig } from "@/context/ConfigContext";
import { captureAttribution } from "@/lib/trackingUtils";

interface TrackingRuntimeConfig {
  googleAdsId: string;
  googleAdsConversionLabel: string;
  googleAdsCallConversionLabel?: string;
  googleAdsConversionValue?: number;
  enableGoogleAds: boolean;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __FPT_TRACKING_CONFIG__?: TrackingRuntimeConfig;
  }
}

function getRuntimeTrackingConfig(): TrackingRuntimeConfig | null {
  if (typeof window === "undefined") return null;
  return window.__FPT_TRACKING_CONFIG__ || null;
}

function logConversionToAdmin(payload: {
  eventType: "form_submit" | "hotline_click" | "zalo_click" | "test";
  sendTo: string;
  conversionLabel?: string;
  leadId?: string;
  packageName?: string;
  value: number;
  gtagReady: boolean;
}) {
  if (typeof window === "undefined") return;
  try {
    const attribution = captureAttribution();
    fetch("/api/tracking/google-ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        ...payload,
        currency: "VND",
        gclid: attribution.gclid || undefined,
        utm_source: attribution.utm_source || undefined,
        utm_campaign: attribution.utm_campaign || undefined,
        utm_term: attribution.utm_term || undefined,
        pagePath: window.location.pathname,
      }),
    }).catch(() => {});
  } catch {
    // Non-blocking
  }
}

/**
 * Fire Google Ads Conversion event safely (supports Form, Hotline/Zalo & Test)
 */
export function trackGoogleConversion(params?: {
  eventType?: "form_submit" | "hotline_click" | "zalo_click" | "test";
  conversionLabel?: string;
  transactionId?: string;
  value?: number;
  packageName?: string;
  forceTest?: boolean;
}) {
  if (typeof window === "undefined") return false;

  const cfg = getRuntimeTrackingConfig();
  if (!cfg) return false;

  const {
    googleAdsId,
    googleAdsConversionLabel,
    googleAdsCallConversionLabel,
    googleAdsConversionValue,
    enableGoogleAds,
  } = cfg;

  if ((!enableGoogleAds && !params?.forceTest) || !googleAdsId) {
    return false;
  }

  const eventType = params?.eventType || "form_submit";
  const isCall = eventType === "hotline_click" || eventType === "zalo_click";
  const label =
    params?.conversionLabel ||
    (isCall ? googleAdsCallConversionLabel : googleAdsConversionLabel) ||
    "";

  const value = params?.value ?? (googleAdsConversionValue || 1);
  const transactionId = params?.transactionId || `lead_${Date.now()}`;
  const gtagReady = typeof window.gtag === "function";

  let sendTo = googleAdsId;
  if (label) {
    sendTo = label.includes("/") ? label : `${googleAdsId}/${label}`;
    if (gtagReady && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: sendTo,
        value,
        currency: "VND",
        transaction_id: transactionId,
      });
    }
  }

  // Push standard event to GTM dataLayer (hoạt động song song với GTM-N4VB2HJ6)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventType === "test" ? "fpt_test_conversion" : "fpt_lead_conversion",
    conversion_type: eventType,
    send_to: sendTo,
    package_name: params?.packageName || "Đăng ký lắp mạng FPT",
    lead_id: transactionId,
    value,
    currency: "VND",
  });

  if (gtagReady && window.gtag && !isCall) {
    window.gtag("event", "generate_lead", {
      event_category: "form",
      event_label: params?.packageName || "Đăng ký lắp mạng FPT",
      value,
      currency: "VND",
    });
  }

  // Record conversion signal for Admin Conversion Analytics
  logConversionToAdmin({
    eventType,
    sendTo,
    conversionLabel: label || undefined,
    leadId: params?.transactionId,
    packageName: params?.packageName,
    value,
    gtagReady,
  });

  return true;
}

/**
 * Dedicated Google Tracker Helper
 */
export const googleTracker = {
  formConversion: (packageName?: string, leadId?: string, label?: string) =>
    trackGoogleConversion({
      eventType: "form_submit",
      packageName,
      transactionId: leadId,
      conversionLabel: label,
    }),

  callConversion: (channel: "hotline" | "zalo", label?: string) =>
    trackGoogleConversion({
      eventType: channel === "zalo" ? "zalo_click" : "hotline_click",
      packageName: label || (channel === "zalo" ? "Chat Zalo FPT" : "Gọi Hotline FPT"),
      transactionId: `${channel}_${Date.now()}`,
    }),

  testConversion: (overrideConfig?: Partial<TrackingRuntimeConfig>) => {
    if (typeof window !== "undefined" && overrideConfig) {
      window.__FPT_TRACKING_CONFIG__ = {
        ...(window.__FPT_TRACKING_CONFIG__ || {
          googleAdsId: "",
          googleAdsConversionLabel: "",
          enableGoogleAds: true,
        }),
        ...overrideConfig,
      };
    }
    return trackGoogleConversion({
      eventType: "test",
      packageName: "Kiểm tra kết nối Google Ads từ Admin",
      transactionId: `test_${Date.now()}`,
      forceTest: true,
    });
  },
};

/**
 * Google Ads Tag Component (Reads live Admin Config)
 */
export default function GoogleAds() {
  const siteConfig = useSiteConfig();
  const {
    googleAdsId,
    googleAdsConversionLabel,
    googleAdsCallConversionLabel,
    googleAdsConversionValue,
    enableGoogleAds,
  } = siteConfig.tracking;

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__FPT_TRACKING_CONFIG__ = {
        googleAdsId: googleAdsId || "",
        googleAdsConversionLabel: googleAdsConversionLabel || "",
        googleAdsCallConversionLabel: googleAdsCallConversionLabel || "",
        googleAdsConversionValue: googleAdsConversionValue ?? 1,
        enableGoogleAds: Boolean(enableGoogleAds),
      };
    }
  }, [
    googleAdsId,
    googleAdsConversionLabel,
    googleAdsCallConversionLabel,
    googleAdsConversionValue,
    enableGoogleAds,
  ]);

  if (!enableGoogleAds || !googleAdsId || googleAdsId.includes("YOUR_")) {
    return null;
  }

  return (
    <>
      <Script
        id="google-tag-src"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
      />
      <Script
        id="google-tag-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAdsId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
