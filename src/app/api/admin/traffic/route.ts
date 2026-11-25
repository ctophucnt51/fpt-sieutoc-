import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import {
  readTrafficStore,
  clearTrafficStore,
  analyzeClickFraud,
  updateIpStatus,
} from "@/lib/trafficStorage";

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  const store = readTrafficStore();
  const suspiciousIps = analyzeClickFraud(store);
  return NextResponse.json({
    success: true,
    daily: store.daily,
    recent: store.recent,
    suspiciousIps,
    blockedIps: store.blockedIps || [],
    whitelistedIps: store.whitelistedIps || [],
  });
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const ip = typeof body?.ip === "string" ? body.ip.trim() : "";
    const action = body?.action as "blocked" | "whitelisted" | "reset";
    if (!ip || !["blocked", "whitelisted", "reset"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin IP hoặc hành động không hợp lệ." },
        { status: 400 }
      );
    }

    const store = updateIpStatus(ip, action);
    return NextResponse.json({
      success: true,
      suspiciousIps: analyzeClickFraud(store),
      blockedIps: store.blockedIps || [],
      whitelistedIps: store.whitelistedIps || [],
    });
  } catch {
    return NextResponse.json({ success: false, message: "Lỗi xử lý." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  clearTrafficStore();
  return NextResponse.json({
    success: true,
    message: "Đã đặt lại thống kê lưu lượng truy cập.",
  });
}
