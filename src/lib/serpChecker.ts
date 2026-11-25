import { SerpCompetitorItem } from "./seoStorage";

export interface SerpCheckResult {
  keyword: string;
  ourPosition: number | null;
  ourMatchedUrl?: string;
  topCompetitors: SerpCompetitorItem[];
  checkedAt: string;
}

function normalizeDomain(input: string): string {
  return input
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .trim();
}

function extractDomain(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return urlStr;
  }
}

/**
 * Query Google SERP in real-time via Serper.dev API (1 credit per 30 organic results).
 */
export async function checkKeywordSerp(params: {
  keyword: string;
  apiKey: string;
  targetDomain: string;
  location?: string;
}): Promise<SerpCheckResult> {
  const { keyword, apiKey, targetDomain, location = "Can Tho, Vietnam" } = params;

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey.trim(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: keyword,
      gl: "vn",
      hl: "vi",
      location: location || "Can Tho, Vietnam",
      num: 30,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || `Serper.dev trả về lỗi (${res.status}).`);
  }

  const organic: any[] = Array.isArray(data.organic) ? data.organic : [];
  const normTarget = normalizeDomain(targetDomain);

  const topCompetitors: SerpCompetitorItem[] = organic.slice(0, 3).map((item, idx) => ({
    position: typeof item.position === "number" ? item.position : idx + 1,
    title: String(item.title || ""),
    link: String(item.link || ""),
    domain: extractDomain(String(item.link || "")),
    snippet: item.snippet ? String(item.snippet) : undefined,
  }));

  let ourPosition: number | null = null;
  let ourMatchedUrl: string | undefined;

  if (normTarget) {
    for (let i = 0; i < organic.length; i++) {
      const link = String(organic[i].link || "").toLowerCase();
      if (link.includes(normTarget)) {
        ourPosition = typeof organic[i].position === "number" ? organic[i].position : i + 1;
        ourMatchedUrl = String(organic[i].link || "");
        break;
      }
    }
  }

  return {
    keyword,
    ourPosition,
    ourMatchedUrl,
    topCompetitors,
    checkedAt: new Date().toISOString(),
  };
}
