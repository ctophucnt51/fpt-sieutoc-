import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { lookupIpIntel } from "@/lib/ipIntel";

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  const ip = request.nextUrl.searchParams.get("ip")?.trim() || "";
  if (!ip) {
    return NextResponse.json(
      { success: false, message: "Thiếu địa chỉ IP cần tra cứu." },
      { status: 400 }
    );
  }

  const intel = await lookupIpIntel(ip);
  return NextResponse.json({
    success: true,
    intel,
  });
}
