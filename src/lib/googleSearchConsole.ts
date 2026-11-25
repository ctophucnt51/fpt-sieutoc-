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
  privateKeyPem: string
): Promise<string> {
  const normalizedKey = privateKeyPem.replace(/\\n/g, "\n").trim();
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: serviceAccountEmail.trim(),
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
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
