"use client";

export interface TrackingParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  fbc?: string;
  fbp?: string;
}

const STORAGE_KEY = "fpt_lead_attribution";

/**
 * Read cookie value safely
 */
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : undefined;
}

/**
 * Capture and persist UTM and Facebook click ID
 */
export function captureAttribution(): TrackingParams {
  if (typeof window === "undefined") return {};

  const searchParams = new URLSearchParams(window.location.search);
  const currentParams: TrackingParams = {};

  const utmKeys: (keyof TrackingParams)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
  ];

  let hasNewParams = false;
  utmKeys.forEach((key) => {
    const val = searchParams.get(key);
    if (val) {
      currentParams[key] = val;
      hasNewParams = true;
    }
  });

  // Extract Facebook cookies if present
  const fbc = getCookie("_fbc");
  const fbp = getCookie("_fbp");
  if (fbc) currentParams.fbc = fbc;
  if (fbp) currentParams.fbp = fbp;

  // If new UTMs found in URL, save to sessionStorage
  if (hasNewParams) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentParams));
    } catch {
      // Ignore storage errors in private browsing
    }
    return currentParams;
  }

  // Otherwise try restoring from previous page views in the same session
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, fbc: fbc || parsed.fbc, fbp: fbp || parsed.fbp };
    }
  } catch {
    // Ignore parse error
  }

  return currentParams;
}
