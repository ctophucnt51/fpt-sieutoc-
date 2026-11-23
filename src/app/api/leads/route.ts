import { NextRequest, NextResponse } from "next/server";
import { LeadPayload, ApiResponse } from "@/lib/types";
import { saveLead, checkRateLimit } from "@/lib/leadStorage";
import { sendMetaConversionsApiEvent } from "@/lib/metaCapi";
import { sendTelegramNotification } from "@/lib/telegram";
import crypto from "crypto";

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. Extract client IP & User Agent
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // 2. Enforce Rate Limiting
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          message: "Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau 10 phút hoặc gọi trực tiếp Hotline.",
        },
        { status: 429 }
      );
    }

    // 3. Parse JSON body
    const body: LeadPayload = await request.json();

    // 4. Ensure an eventId is assigned for Pixel / CAPI deduplication
    const eventId = body.eventId || `lead_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    body.eventId = eventId;

    // 5. Save lead
    const result = await saveLead(body, clientIp, userAgent);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 400 }
      );
    }

    // 6. Trigger Telegram & Meta CAPI notifications
    if (result.leadRecord && !result.isDuplicate) {
      // Bắn thông báo tức thì về Telegram Bot
      sendTelegramNotification({
        fullName: result.leadRecord.fullName,
        phone: result.leadRecord.phone,
        address: result.leadRecord.address,
        area: result.leadRecord.area,
        packageInterested: result.leadRecord.packageInterested,
        note: result.leadRecord.note,
        landingPage: body.landingPage,
        leadLocation: body.leadLocation,
        eventId,
        utmSource: body.utm_source,
        utmMedium: body.utm_medium,
        utmCampaign: body.utm_campaign,
      }).catch((err) => console.warn("Telegram dispatch non-fatal error:", err));

      // Bắn sự kiện lên Meta Conversions API
      sendMetaConversionsApiEvent({
        eventId,
        phone: result.leadRecord.phone,
        clientIp,
        userAgent,
        fbc: body.fbc,
        fbp: body.fbp,
        sourceUrl: body.landingPage || request.url,
        packageName: body.packageInterested,
      }).catch((err) => console.warn("CAPI dispatch non-fatal error:", err));
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      leadId: result.leadRecord ? result.leadRecord.id : undefined,
      eventId,
    });
  } catch (error) {
    console.error("API /api/leads error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra trong quá trình xử lý yêu cầu. Vui lòng liên hệ Hotline 0878 800 400.",
      },
      { status: 500 }
    );
  }
}
