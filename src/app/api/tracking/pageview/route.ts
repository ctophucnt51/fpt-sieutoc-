import { NextRequest, NextResponse } from "next/server";
import { recordPageview } from "@/lib/trafficStorage";

const BOT_REGEX =
  /bot|crawler|spider|slurp|mediapartners|lighthouse|pagespeed|headless|curl|wget|python|pingdom|uptime/i;

function classifySource(body: {
  gclid?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  referrer?: string;
}): string {
  const src = (body.utm_source || "").toLowerCase();
  const med = (body.utm_medium || "").toLowerCase();
  const ref = (body.referrer || "").toLowerCase();

  if (body.gclid || med === "cpc" || med === "ppc" || src.includes("gads") || src.includes("adwords")) {
    return "Google Ads";
  }
  if (src.includes("google") || ref.includes("google.")) {
    return "Google Search";
  }
  if (body.fbclid || src.includes("facebook") || src === "fb" || ref.includes("facebook.") || ref.includes("fb.com")) {
    return "Facebook";
  }
  if (src.includes("zalo") || ref.includes("zalo.")) {
    return "Zalo";
  }
  if (src.includes("tiktok") || ref.includes("tiktok.")) {
    return "TikTok";
  }
  if (!ref || ref.includes("gofpt.vn") || ref.includes("localhost")) {
    return "Trực tiếp (Direct)";
  }
  return "Nguồn khác";
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

    const source = classifySource({
      gclid: body.gclid,
      fbclid: body.fbclid,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      referrer: body.referrer,
    });

    recordPageview({
      path: rawPath.slice(0, 160) || "/",
      source,
      device,
      isNewSession: Boolean(body.isNewSession),
      campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 120) : undefined,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
