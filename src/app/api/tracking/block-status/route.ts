import { NextRequest, NextResponse } from "next/server";
import { extractClientIp, getClientBlockStatus } from "@/lib/trafficStorage";

export async function GET(request: NextRequest) {
  const clientIp = extractClientIp(request.headers);
  const visitorId = (request.nextUrl.searchParams.get("visitorId") || "").trim();
  const status = getClientBlockStatus(clientIp, visitorId);

  return NextResponse.json(
    {
      success: true,
      blocked: status.blocked,
      reason: status.reason || null,
      policy: status.policy,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
