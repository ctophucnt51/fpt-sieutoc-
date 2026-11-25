import { getGoogleAccessToken } from "./googleSearchConsole";
import { checkAndIncrementApiUsage } from "./seoMemory";

export interface Ga4OrganicReport {
  propertyId: string;
  sessions: number;
  organicSessions: number;
  conversions: number;
  fetchedAt: string;
  error?: string;
}

/**
 * Fetch real Organic Search sessions & conversions from Google Analytics 4 Data API v1beta.
 * Reuses Service Account JWT RS256 from googleSearchConsole.ts (zero external deps, zero mock data).
 */
export async function fetchGa4OrganicSummary(params: {
  propertyId: string;
  serviceAccountEmail: string;
  privateKey: string;
}): Promise<Ga4OrganicReport> {
  const { propertyId, serviceAccountEmail, privateKey } = params;
  const cleanPropertyId = propertyId.replace(/^properties\//, "").trim();

  if (!cleanPropertyId || !serviceAccountEmail || !privateKey) {
    return {
      propertyId: cleanPropertyId,
      sessions: 0,
      organicSessions: 0,
      conversions: 0,
      fetchedAt: new Date().toISOString(),
      error: "Chưa cấu hình đầy đủ GA4_PROPERTY_ID hoặc Google Service Account.",
    };
  }

  const budget = checkAndIncrementApiUsage("ga4");
  if (!budget.allowed) {
    return {
      propertyId: cleanPropertyId,
      sessions: 0,
      organicSessions: 0,
      conversions: 0,
      fetchedAt: new Date().toISOString(),
      error: `Đã đạt giới hạn GA4 API hôm nay (${budget.usedToday}/${budget.limitToday}).`,
    };
  }

  try {
    const accessToken = await getGoogleAccessToken(
      serviceAccountEmail,
      privateKey,
      "https://www.googleapis.com/auth/analytics.readonly"
    );

    const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(
      cleanPropertyId
    )}:runReport`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }, { name: "conversions" }],
      }),
      signal: AbortSignal.timeout(15000),
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        propertyId: cleanPropertyId,
        sessions: 0,
        organicSessions: 0,
        conversions: 0,
        fetchedAt: new Date().toISOString(),
        error: json?.error?.message || `GA4 API trả về HTTP ${res.status}.`,
      };
    }

    let sessions = 0;
    let organicSessions = 0;
    let conversions = 0;

    for (const row of json.rows || []) {
      const channel = (row.dimensionValues?.[0]?.value || "").toLowerCase();
      const s = Number(row.metricValues?.[0]?.value || 0);
      const c = Number(row.metricValues?.[1]?.value || 0);
      sessions += s;
      conversions += c;
      if (channel.includes("organic search")) {
        organicSessions += s;
      }
    }

    return {
      propertyId: cleanPropertyId,
      sessions,
      organicSessions,
      conversions,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      propertyId: cleanPropertyId,
      sessions: 0,
      organicSessions: 0,
      conversions: 0,
      fetchedAt: new Date().toISOString(),
      error: err?.message || "Không thể kết nối GA4 Data API.",
    };
  }
}
