"use client";

import Script from "next/script";
import { siteConfig } from "@/config/siteConfig";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fire Google Ads Conversion event safely
 */
export function trackGoogleConversion(params?: {
  conversionLabel?: string;
  transactionId?: string;
  value?: number;
  packageName?: string;
}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const { googleAdsId, googleAdsConversionLabel, enableGoogleAds } = siteConfig.tracking;

  if (!enableGoogleAds || !googleAdsId) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Google Ads Dev] Tracking disabled or missing Google Ads ID", params);
    }
    return;
  }

  const label = params?.conversionLabel || googleAdsConversionLabel;

  // 1. Google Ads Conversion Event
  if (label) {
    const sendTo = label.includes("/") ? label : `${googleAdsId}/${label}`;
    window.gtag("event", "conversion", {
      send_to: sendTo,
      value: params?.value || 1.0,
      currency: "VND",
      transaction_id: params?.transactionId || `lead_${Date.now()}`,
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`[Google Ads] Conversion fired to: ${sendTo}`, params);
    }
  }

  // 2. Standard Google Analytics / Google Tag Lead Event
  window.gtag("event", "generate_lead", {
    event_category: "form",
    event_label: params?.packageName || "Đăng ký lắp mạng FPT",
    value: params?.value || 1.0,
    currency: "VND",
  });
}

/**
 * Dedicated Google Tracker Helper
 */
export const googleTracker = {
  formConversion: (packageName?: string, leadId?: string, label?: string) => {
    trackGoogleConversion({
      packageName,
      transactionId: leadId,
      conversionLabel: label,
      value: 1.0,
    });
  },
};

/**
 * Google Ads Tag Component
 */
export default function GoogleAds() {
  const { googleAdsId, enableGoogleAds } = siteConfig.tracking;

  if (!enableGoogleAds || !googleAdsId || googleAdsId.includes("YOUR_")) {
    return null;
  }

  return (
    <>
      <Script
        id="google-tag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
      />
      <Script
        id="google-tag-init"
        strategy="afterInteractive"
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
