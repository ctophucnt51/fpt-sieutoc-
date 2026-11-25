import { checkAndIncrementApiUsage, readMemoryFile, writeMemoryFile, SeoBaselineRecord } from "./seoMemory";

export interface PageSpeedCheckResult {
  url: string;
  strategy: "mobile" | "desktop";
  performanceScore: number | null;
  seoScore: number | null;
  lcpDisplay?: string;
  tbtDisplay?: string;
  checkedAt: string;
  cached?: boolean;
  error?: string;
}

/**
 * Fetch real Core Web Vitals & SEO score from Google PageSpeed Insights v5 API (zero mock data)
 */
export async function runPageSpeedCheck(
  url: string,
  strategy: "mobile" | "desktop" = "mobile"
): Promise<PageSpeedCheckResult> {
  const budget = checkAndIncrementApiUsage("pagespeed");
  if (!budget.allowed) {
    return {
      url,
      strategy,
      performanceScore: null,
      seoScore: null,
      checkedAt: new Date().toISOString(),
      error: `Đã đạt giới hạn PageSpeed API hôm nay (${budget.usedToday}/${budget.limitToday}).`,
    };
  }

  try {
    const apiKey = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_API_KEY || "";
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&strategy=${strategy}&category=performance&category=seo${apiKey ? `&key=${encodeURIComponent(apiKey)}` : ""}`;

    const res = await fetch(apiUrl, {
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) {
      const errorMsg =
        res.status === 429 && !apiKey
          ? "PageSpeed API đạt giới hạn IP công cộng (HTTP 429). Có thể thêm PAGESPEED_API_KEY vào .env.local trên máy chủ."
          : `PageSpeed API trả về HTTP ${res.status}.`;
      return {
        url,
        strategy,
        performanceScore: null,
        seoScore: null,
        checkedAt: new Date().toISOString(),
        error: errorMsg,
      };
    }

    const data = await res.json();
    const cats = data?.lighthouseResult?.categories || {};
    const audits = data?.lighthouseResult?.audits || {};

    const performanceScore =
      typeof cats.performance?.score === "number"
        ? Math.round(cats.performance.score * 100)
        : null;
    const seoScore =
      typeof cats.seo?.score === "number" ? Math.round(cats.seo.score * 100) : null;

    const baseline = readMemoryFile<SeoBaselineRecord | null>("baseline.json", null);
    if (baseline && performanceScore !== null) {
      if (strategy === "mobile") baseline.mobilePageSpeedScore = performanceScore;
      else baseline.desktopPageSpeedScore = performanceScore;
      writeMemoryFile("baseline.json", baseline);
    }

    return {
      url,
      strategy,
      performanceScore,
      seoScore,
      lcpDisplay: audits["largest-contentful-paint"]?.displayValue,
      tbtDisplay: audits["total-blocking-time"]?.displayValue,
      checkedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      url,
      strategy,
      performanceScore: null,
      seoScore: null,
      checkedAt: new Date().toISOString(),
      error: err?.message || "Timeout khi gọi PageSpeed API.",
    };
  }
}
