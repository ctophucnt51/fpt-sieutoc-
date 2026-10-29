"use client";

import { useEffect } from "react";
import Script from "next/script";
import { siteConfig } from "@/config/siteConfig";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * Fire standard Meta Pixel event safely
 */
export function trackMetaEvent(
  eventName: "PageView" | "ViewContent" | "Contact" | "Lead",
  params?: Record<string, unknown>,
  options?: { eventID?: string }
) {
  if (typeof window === "undefined" || !window.fbq) {
    return;
  }

  // Only track if Pixel ID is configured and not a placeholder
  const pixelId = siteConfig.tracking.facebookPixelId;
  if (!pixelId || pixelId.includes("YOUR_") || pixelId === "0000000000") {
    // In dev / unconfigured mode, log to console for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[Meta Pixel Dev] Event: ${eventName}`, params, options);
    }
    return;
  }

  if (options?.eventID) {
    window.fbq("track", eventName, params, { eventID: options.eventID });
  } else {
    window.fbq("track", eventName, params);
  }
}

/**
 * Dedicated event helpers
 */
export const fbTracker = {
  pageView: () => {
    trackMetaEvent("PageView");
  },

  viewContent: (contentName: string, category: string) => {
    trackMetaEvent("ViewContent", {
      content_name: contentName,
      content_category: category,
      currency: "VND",
    });
  },

  contact: (channel: "hotline" | "zalo" | "messenger" | "form", label?: string) => {
    trackMetaEvent("Contact", {
      channel,
      label: label || `Click ${channel}`,
    });
  },

  lead: (eventId: string, packageName: string) => {
    // Lead event fires ONLY upon backend confirmation
    trackMetaEvent(
      "Lead",
      {
        content_name: packageName,
        currency: "VND",
      },
      { eventID: eventId }
    );
  },
};

/**
 * Meta Pixel Script Tag Component
 */
export default function MetaPixel() {
  const pixelId = siteConfig.tracking.facebookPixelId;

  useEffect(() => {
    if (pixelId) {
      fbTracker.pageView();
    }
  }, [pixelId]);

  if (!pixelId || pixelId.includes("YOUR_") || pixelId === "0000000000") {
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
