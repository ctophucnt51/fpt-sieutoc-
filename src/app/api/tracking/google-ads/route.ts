import { NextRequest, NextResponse } from "next/server";
import { appendGoogleAdsEvent } from "@/lib/googleAdsStorage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const eventType =
      body.eventType === "hotline_click" ||
      body.eventType === "zalo_click" ||
      body.eventType === "test"
        ? body.eventType
        : "form_submit";

    if (!body.sendTo || typeof body.sendTo !== "string") {
      return NextResponse.json({ success: false, message: "Missing sendTo" }, { status: 400 });
    }

    const record = appendGoogleAdsEvent({
      eventType,
      sendTo: String(body.sendTo).slice(0, 120),
      conversionLabel: body.conversionLabel ? String(body.conversionLabel).slice(0, 120) : undefined,
      leadId: body.leadId ? String(body.leadId).slice(0, 80) : undefined,
      packageName: body.packageName ? String(body.packageName).slice(0, 160) : undefined,
      value: Number(body.value) || 1,
      currency: "VND",
      gclid: body.gclid ? String(body.gclid).slice(0, 200) : undefined,
      utm_source: body.utm_source ? String(body.utm_source).slice(0, 100) : undefined,
      utm_campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 160) : undefined,
      utm_term: body.utm_term ? String(body.utm_term).slice(0, 160) : undefined,
      pagePath: body.pagePath ? String(body.pagePath).slice(0, 200) : "/",
      gtagReady: Boolean(body.gtagReady),
    });

    return NextResponse.json({ success: true, event: record });
  } catch (error) {
    console.error("Error logging Google Ads conversion:", error);
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}
