import { NextRequest, NextResponse } from "next/server";
import { recordPageview } from "@/lib/trafficStorage";

const BOT_REGEX =
  /bot|crawler|spider|slurp|mediapartners|lighthouse|pagespeed|headless|curl|wget|python|pingdom|uptime/i;

// Simple in-memory GeoIP cache (IP -> location string) to avoid repeated lookups
const geoCache = new Map<string, { location: string; expiresAt: number }>();

function extractClientIp(request: NextRequest): string {
  const raw =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";
  return raw.replace(/^::ffff:/, "").trim();
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

async function resolveLocation(request: NextRequest, ip: string): Promise<string> {
  // 1. Check Cloudflare / Vercel proxy headers first (0ms)
  const cfCity = request.headers.get("cf-ipcity");
  const cfCountry = request.headers.get("cf-ipcountry");
  const vercelCity = request.headers.get("x-vercel-ip-city");
  const vercelCountry = request.headers.get("x-vercel-ip-country");

  const headerCity = cfCity || vercelCity;
  const headerCountry = cfCountry || vercelCountry;
  if (headerCity || headerCountry) {
    return [headerCity ? decodeURIComponent(headerCity) : "", headerCountry]
      .filter(Boolean)
      .join(", ");
  }

  if (!ip || isPrivateIp(ip)) {
    return "Localhost / Nội bộ";
  }

  // 2. Check cache
  const cached = geoCache.get(ip);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.location;
  }

  // 3. Fast non-blocking GeoIP lookup (1200ms timeout)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city&lang=vi`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (data?.status === "success") {
        const loc = [data.city || data.regionName, data.country]
          .filter(Boolean)
          .join(", ");
        if (loc) {
          geoCache.set(ip, { location: loc, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
          return loc;
        }
      }
    }
  } catch {
    // Ignore GeoIP timeout/network errors
  }

  return "Không xác định";
}

function classifySource(body: {
  gclid?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  referrer?: string;
}): { source: string; sourceDetail: string } {
  const src = (body.utm_source || "").toLowerCase();
  const med = (body.utm_medium || "").toLowerCase();
  const refRaw = body.referrer || "";
  const ref = refRaw.toLowerCase();

  let refHost = "";
  if (refRaw) {
    try {
      refHost = new URL(refRaw).hostname.replace(/^www\./, "");
    } catch {
      refHost = refRaw.slice(0, 60);
    }
  }

  if (body.gclid || med === "cpc" || med === "ppc" || src.includes("gads") || src.includes("adwords")) {
    return {
      source: "Google Ads",
      sourceDetail: body.gclid ? `Google Ads (GCLID)` : refHost || "Quảng cáo Google",
    };
  }
  if (src.includes("google") || ref.includes("google.")) {
    return {
      source: "Google Search",
      sourceDetail: refHost || "google.com",
    };
  }
  if (body.fbclid || src.includes("facebook") || src === "fb" || ref.includes("facebook.") || ref.includes("fb.com")) {
    return {
      source: "Facebook",
      sourceDetail: body.fbclid ? "Facebook (fbclid)" : refHost || "facebook.com",
    };
  }
  if (src.includes("zalo") || ref.includes("zalo.")) {
    return {
      source: "Zalo",
      sourceDetail: refHost || "zalo.me",
    };
  }
  if (src.includes("tiktok") || ref.includes("tiktok.")) {
    return {
      source: "TikTok",
      sourceDetail: refHost || "tiktok.com",
    };
  }
  if (!ref || ref.includes("gofpt.vn") || ref.includes("localhost")) {
    return {
      source: "Trực tiếp (Direct)",
      sourceDetail: "Gõ thẳng URL / Bookmark",
    };
  }
  return {
    source: "Nguồn khác",
    sourceDetail: refHost || src || "Referral",
  };
}

export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get("user-agent") || "";
    if (BOT_REGEX.test(userAgent)) {
      return NextResponse.json({ success: true, ignored: "bot" });
    }

    const body = await request.json();
    const rawPath = typeof body.path === "string" ? body.path.split("?")[0] : "/";
    if (rawPath.startsWith("/admin") || rawPath.startsWith("/api")) {
      return NextResponse.json({ success: true, ignored: "admin" });
    }

    const device: "mobile" | "desktop" =
      body.device === "mobile" || /mobile|android|iphone|ipad/i.test(userAgent)
        ? "mobile"
        : "desktop";

    const ip = extractClientIp(request);
    const location = await resolveLocation(request, ip);
    const { source, sourceDetail } = classifySource({
      gclid: body.gclid,
      fbclid: body.fbclid,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      referrer: body.referrer,
    });

    recordPageview({
      path: rawPath.slice(0, 160) || "/",
      source,
      sourceDetail,
      device,
      isNewSession: Boolean(body.isNewSession),
      ip,
      location,
      campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 120) : undefined,
      term: body.utm_term ? String(body.utm_term).slice(0, 120) : undefined,
      sessionId: body.sessionId ? String(body.sessionId).slice(0, 64) : undefined,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
