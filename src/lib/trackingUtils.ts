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
 * Capture and persist UTM, search keywords, and click IDs (Google Ads, Facebook, Organic Search)
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

  // Tự động nhận diện từ khóa quảng cáo/tìm kiếm qua các alias phổ biến (keyword, kw, query, q)
  if (!currentParams.utm_term) {
    const kw =
      searchParams.get("keyword") ||
      searchParams.get("kw") ||
      searchParams.get("query") ||
      searchParams.get("q");
    if (kw) {
      currentParams.utm_term = kw;
      hasNewParams = true;
    }
  }

  // Nếu có gclid từ Google Ads nhưng chưa gắn utm_source, tự động gán nguồn là Google Ads (cpc)
  if (currentParams.gclid && !currentParams.utm_source) {
    currentParams.utm_source = "google";
    currentParams.utm_medium = "cpc";
    if (!currentParams.utm_campaign) {
      currentParams.utm_campaign = "Google Search Ads";
    }
    hasNewParams = true;
  }

  // Tự động nhận diện nguồn tìm kiếm tự nhiên qua Referrer nếu không có tham số UTM trong URL
  if (!currentParams.utm_source && typeof document !== "undefined" && document.referrer) {
    const ref = document.referrer.toLowerCase();
    try {
      const refUrl = new URL(document.referrer);
      const queryParam = refUrl.searchParams.get("q") || refUrl.searchParams.get("query");
      if (queryParam && !currentParams.utm_term) {
        currentParams.utm_term = queryParam;
        hasNewParams = true;
      }
    } catch {}

    if (ref.includes("google.")) {
      currentParams.utm_source = "google";
      currentParams.utm_medium = "organic";
      currentParams.utm_campaign = "Google Search (Tự nhiên / SEO)";
      hasNewParams = true;
    } else if (ref.includes("coccoc.com")) {
      currentParams.utm_source = "coccoc";
      currentParams.utm_medium = "organic";
      currentParams.utm_campaign = "Cốc Cốc Search";
      hasNewParams = true;
    } else if (ref.includes("bing.com")) {
      currentParams.utm_source = "bing";
      currentParams.utm_medium = "organic";
      currentParams.utm_campaign = "Bing Search";
      hasNewParams = true;
    } else if (ref.includes("facebook.com") || ref.includes("fb.com")) {
      currentParams.utm_source = "facebook";
      currentParams.utm_medium = "social";
      hasNewParams = true;
    } else if (ref.includes("zalo.me")) {
      currentParams.utm_source = "zalo";
      currentParams.utm_medium = "social";
      hasNewParams = true;
    } else if (ref.includes("tiktok.com")) {
      currentParams.utm_source = "tiktok";
      currentParams.utm_medium = "social";
      hasNewParams = true;
    }
  }

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
