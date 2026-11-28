import { NextRequest, NextResponse } from "next/server";
import { recordPageview, updateVisitActivity } from "@/lib/trafficStorage";
import { sendClickFraudAlert, sendGoogleTrafficAlert } from "@/lib/telegram";
import { lookupIpIntel, resolveCombinedNetworkLabel } from "@/lib/ipIntel";

const notifiedGoogleSessions = new Set<string>();

const BOT_REGEX =
  /bot|crawler|spider|slurp|mediapartners|lighthouse|pagespeed|headless|curl|wget|python|pingdom|uptime/i;

function extractClientIp(request: NextRequest): string {
  const raw =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";
  return raw.replace(/^::ffff:/, "").trim();
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

function parseUserAgent(ua: string): { browser: string; os: string } {
  let browser = "Khác";
  if (/zalo/i.test(ua)) browser = "Zalo";
  else if (/fban|fbav|fb_iab/i.test(ua)) browser = "Facebook";
  else if (/coc_coc_browser/i.test(ua)) browser = "Cốc Cốc";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/opr|opera/i.test(ua)) browser = "Opera";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";

  let os = "Khác";
  if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/mac os x|macintosh/i.test(ua)) os = "macOS";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/linux/i.test(ua)) os = "Linux";

  return { browser, os };
}

export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get("user-agent") || "";
    if (BOT_REGEX.test(userAgent)) {
      return NextResponse.json({ success: true, ignored: "bot" });
    }

    const body = await request.json();

    if (body.mode === "update" && typeof body.visitId === "string") {
      updateVisitActivity({
        visitId: body.visitId.slice(0, 64),
        durationSeconds: typeof body.durationSeconds === "number" ? body.durationSeconds : undefined,
        action: typeof body.action === "string" ? body.action.slice(0, 40) : undefined,
      });
      return NextResponse.json({ success: true });
    }

    const rawPath = typeof body.path === "string" ? body.path.split("?")[0] : "/";
    if (rawPath.startsWith("/admin") || rawPath.startsWith("/api")) {
      return NextResponse.json({ success: true, ignored: "admin" });
    }

    const device: "mobile" | "desktop" =
      body.device === "mobile" || /mobile|android|iphone|ipad/i.test(userAgent)
        ? "mobile"
        : "desktop";
    const { browser, os } = parseUserAgent(userAgent);

    const ip = extractClientIp(request);
    const ipIntel = await lookupIpIntel(ip, {
      city: request.headers.get("cf-ipcity") || request.headers.get("x-vercel-ip-city"),
      country: request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country"),
    });
    const location = ipIntel.location;
    const clientNetworkType =
      typeof body.networkType === "string" ? body.networkType.slice(0, 32) : undefined;
    const resolvedNetworkType = resolveCombinedNetworkLabel(clientNetworkType, ipIntel);
    const networkDetail =
      typeof body.networkDetail === "string" && body.networkDetail.trim()
        ? body.networkDetail.trim().slice(0, 48)
        : undefined;

    const { source, sourceDetail } = classifySource({
      gclid: body.gclid,
      fbclid: body.fbclid,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      referrer: body.referrer,
    });

    const { fraudAlert } = recordPageview({
      id: typeof body.visitId === "string" ? body.visitId.slice(0, 64) : undefined,
      path: rawPath.slice(0, 160) || "/",
      source,
      sourceDetail,
      device,
      browser,
      os,
      networkType: resolvedNetworkType,
      networkDetail,
      isp: ipIntel.isp !== "Không xác định" ? ipIntel.isp : undefined,
      asn: ipIntel.asn || undefined,
      ipCategory: ipIntel.category,
      isNewSession: Boolean(body.isNewSession),
      ip,
      location,
      campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 120) : undefined,
      term: body.utm_term ? String(body.utm_term).slice(0, 120) : undefined,
      sessionId: body.sessionId ? String(body.sessionId).slice(0, 64) : undefined,
      gclid: body.gclid ? String(body.gclid).slice(0, 120) : undefined,
      visitorId: body.visitorId ? String(body.visitorId).slice(0, 64) : undefined,
    });

    if (fraudAlert) {
      sendClickFraudAlert(fraudAlert).catch((err) =>
        console.warn("Click fraud Telegram alert error:", err)
      );
    }

    // Gửi thông báo tức thì khi có khách truy cập mới từ Google Ads hoặc Google Search (bỏ qua Direct/nhập link trực tiếp)
    const isGoogleTraffic = source === "Google Ads" || source === "Google Search";
    const sessionKey = typeof body.sessionId === "string" && body.sessionId ? body.sessionId.slice(0, 64) : "";
    const shouldNotifySession = Boolean(body.isNewSession) && (!sessionKey || !notifiedGoogleSessions.has(sessionKey));

    if (isGoogleTraffic && shouldNotifySession) {
      if (sessionKey) {
        notifiedGoogleSessions.add(sessionKey);
        if (notifiedGoogleSessions.size > 500) {
          const oldest = notifiedGoogleSessions.values().next().value;
          if (oldest) notifiedGoogleSessions.delete(oldest);
        }
      }

      sendGoogleTrafficAlert({
        source: source as "Google Ads" | "Google Search",
        sourceDetail,
        path: rawPath.slice(0, 160) || "/",
        ip,
        location,
        isp: ipIntel.isp,
        asn: ipIntel.asn,
        ipCategory: ipIntel.category,
        device,
        browser,
        os,
        networkType: resolvedNetworkType,
        networkDetail,
        campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 120) : undefined,
        term: body.utm_term ? String(body.utm_term).slice(0, 120) : undefined,
        gclid: body.gclid ? String(body.gclid).slice(0, 120) : undefined,
      }).catch((err) => console.warn("Google traffic Telegram alert error:", err));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
