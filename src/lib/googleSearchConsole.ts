import crypto from "crypto";
import { GscCacheData, GscPageRow, GscQueryRow } from "./seoStorage";

function base64UrlEncode(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * Generates an OAuth2 Access Token from a Google Cloud Service Account using Node.js native crypto (zero external deps).
 */
export async function getGoogleAccessToken(
  serviceAccountEmail: string,
  privateKeyPem: string,
  scope = "https://www.googleapis.com/auth/webmasters.readonly"
): Promise<string> {
  const normalizedKey = privateKeyPem.replace(/\\n/g, "\n").trim();
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: serviceAccountEmail.trim(),
    scope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(payload)
  )}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(normalizedKey);
  const jwt = `${unsignedToken}.${base64UrlEncode(signature)}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok || !tokenJson.access_token) {
    throw new Error(
      tokenJson.error_description || tokenJson.error || "Không thể xác thực Google Service Account."
    );
  }

  return tokenJson.access_token;
}

function formatDateYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Fetch Search Analytics data (Queries, Pages, Totals) from Google Search Console API.
 */
export async function fetchGscAnalytics(params: {
  siteUrl: string;
  serviceAccountEmail: string;
  privateKey: string;
  dateRange: "7d" | "28d" | "90d";
}): Promise<GscCacheData> {
  const { siteUrl, serviceAccountEmail, privateKey, dateRange } = params;
  const accessToken = await getGoogleAccessToken(serviceAccountEmail, privateKey);

  // GSC data typically has a 2-day lag
  const end = new Date();
  end.setDate(end.getDate() - 2);
  const start = new Date(end);
  const days = dateRange === "7d" ? 7 : dateRange === "90d" ? 90 : 28;
  start.setDate(start.getDate() - days);

  const startDate = formatDateYMD(start);
  const endDate = formatDateYMD(end);

  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    siteUrl.trim()
  )}/searchAnalytics/query`;

  const queryGsc = async (dimensions: string[], rowLimit: number) => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        rowLimit,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data?.error?.message || `Google Search Console trả về lỗi (${res.status})`;
      throw new Error(msg);
    }
    return data.rows || [];
  };

  const [totalsRows, queryRowsRaw, pageRowsRaw] = await Promise.all([
    queryGsc([], 1),
    queryGsc(["query"], 100),
    queryGsc(["page"], 50),
  ]);

  const totalsRow = totalsRows[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };

  const topQueries: GscQueryRow[] = queryRowsRaw.map((r: any) => ({
    query: r.keys?.[0] || "",
    clicks: r.clicks || 0,
    impressions: r.impressions || 0,
    ctr: Number(((r.ctr || 0) * 100).toFixed(2)),
    position: Number((r.position || 0).toFixed(1)),
  }));

  const topPages: GscPageRow[] = pageRowsRaw.map((r: any) => ({
    page: r.keys?.[0] || "",
    clicks: r.clicks || 0,
    impressions: r.impressions || 0,
    ctr: Number(((r.ctr || 0) * 100).toFixed(2)),
    position: Number((r.position || 0).toFixed(1)),
  }));

  return {
    dateRange,
    startDate,
    endDate,
    totals: {
      clicks: totalsRow.clicks || 0,
      impressions: totalsRow.impressions || 0,
      ctr: Number(((totalsRow.ctr || 0) * 100).toFixed(2)),
      position: Number((totalsRow.position || 0).toFixed(1)),
    },
    topQueries,
    topPages,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Gửi lại sitemap.xml lên Google Search Console (yêu cầu Service Account có quyền Full/Owner trong GSC).
 */
export async function submitSitemapToGoogle(params: {
  siteUrl: string;
  serviceAccountEmail: string;
  privateKey: string;
  sitemapUrl?: string;
}): Promise<{ success: boolean; status?: number; error?: string }> {
  try {
    const accessToken = await getGoogleAccessToken(
      params.serviceAccountEmail,
      params.privateKey,
      "https://www.googleapis.com/auth/webmasters"
    );
    const sitemapUrl = params.sitemapUrl || "https://gofpt.vn/sitemap.xml";
    const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      params.siteUrl.trim()
    )}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok || res.status === 204) {
      return { success: true, status: res.status };
    }
    const data = await res.json().catch(() => ({}));
    return {
      success: false,
      status: res.status,
      error: data?.error?.message || `GSC Sitemap API trả về HTTP ${res.status}`,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi khi gửi Sitemap lên Google Search Console." };
  }
}

/**
 * Ping trực tiếp URL mới/cập nhật qua Google Indexing API (yêu cầu bật Web Search Indexing API trên GCP).
 */
export async function publishUrlToGoogleIndexingApi(params: {
  serviceAccountEmail: string;
  privateKey: string;
  url: string;
}): Promise<{ success: boolean; status?: number; error?: string }> {
  try {
    const accessToken = await getGoogleAccessToken(
      params.serviceAccountEmail,
      params.privateKey,
      "https://www.googleapis.com/auth/indexing"
    );
    const fullUrl = params.url.startsWith("http")
      ? params.url
      : `https://gofpt.vn${params.url.startsWith("/") ? params.url : `/${params.url}`}`;

    const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: fullUrl, type: "URL_UPDATED" }),
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      return { success: true, status: res.status };
    }
    const data = await res.json().catch(() => ({}));
    return {
      success: false,
      status: res.status,
      error: data?.error?.message || `Google Indexing API trả về HTTP ${res.status}`,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi khi gọi Google Indexing API." };
  }
}
