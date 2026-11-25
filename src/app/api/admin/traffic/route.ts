import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { readTrafficStore, clearTrafficStore } from "@/lib/trafficStorage";

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  const store = readTrafficStore();
  return NextResponse.json({
    success: true,
    daily: store.daily,
    recent: store.recent,
  });
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
