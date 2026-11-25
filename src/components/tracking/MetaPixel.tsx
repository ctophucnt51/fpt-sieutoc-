"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/siteConfig";
import { ensureTrackingLoaded } from "./TrackingLoader";

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
  if (typeof window === "undefined") {
    return;
  }
  ensureTrackingLoaded();

  // Only track if Pixel ID is configured and not a placeholder
  const pixelId = siteConfig.tracking.facebookPixelId;
  if (!pixelId || pixelId.includes("YOUR_") || pixelId === "0000000000") {
    // In dev / unconfigured mode, log to console for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[Meta Pixel Dev] Event: ${eventName}`, params, options);
    }
    return;
  }

  if (typeof window.fbq === "function") {
    if (options?.eventID) {
      window.fbq("track", eventName, params, { eventID: options.eventID });
    } else {
      window.fbq("track", eventName, params);
    }
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
  return null;
}
