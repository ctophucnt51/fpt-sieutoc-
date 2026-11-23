import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { testTelegramConnection } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Không có quyền truy cập." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { botToken, chatId } = body;

    const result = await testTelegramConnection(botToken, chatId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Lỗi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}
