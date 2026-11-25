import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getGoogleAdsEvents, clearGoogleAdsEvents } from "@/lib/googleAdsStorage";

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  const events = getGoogleAdsEvents();
  return NextResponse.json({
    success: true,
    events,
  });
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  clearGoogleAdsEvents();
  return NextResponse.json({
    success: true,
    message: "Đã xóa nhật ký sự kiện chuyển đổi Google Ads.",
  });
}
