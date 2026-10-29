import { NextRequest, NextResponse } from "next/server";
import { getDynamicConfig, saveDynamicConfig, resetDynamicConfig } from "@/lib/configStorage";
import { verifyAdminAuth } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, message: "Chưa xác thực quyền quản trị." }, { status: 401 });
  }

  const config = getDynamicConfig();
  return NextResponse.json({
    success: true,
    config,
  });
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, message: "Chưa xác thực quyền quản trị." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = saveDynamicConfig(body);

    return NextResponse.json({
      success: true,
      message: "Lưu cấu hình hệ thống thành công!",
      config: updated,
    });
  } catch (error) {
    console.error("Config update error:", error);
    return NextResponse.json({
      success: false,
      message: "Lỗi trong quá trình lưu cấu hình.",
    }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, message: "Chưa xác thực quyền quản trị." }, { status: 401 });
  }

  try {
    const { action } = await request.json();
    if (action === "reset") {
      const resetConfig = resetDynamicConfig();
      return NextResponse.json({
        success: true,
        message: "Đã khôi phục toàn bộ cấu hình về cài đặt gốc!",
        config: resetConfig,
      });
    }

    return NextResponse.json({ success: false, message: "Hành động không được hỗ trợ." }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, message: "Lỗi xử lý yêu cầu." }, { status: 400 });
  }
}
