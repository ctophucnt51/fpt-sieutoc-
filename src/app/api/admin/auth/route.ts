import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const DEFAULT_PIN = process.env.ADMIN_PIN || "8888";
const AUTH_COOKIE_NAME = "fpt_admin_auth";

// Simple deterministic session token for local/admin instance
function generateSessionToken(): string {
  const secret = process.env.SESSION_SECRET || "fpt_sieutoc_secret_key_2026";
  return crypto.createHmac("sha256", secret).update("admin_authenticated").digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    if (!pin || String(pin).trim() !== DEFAULT_PIN) {
      return NextResponse.json(
        { success: false, message: "Mã PIN truy cập không chính xác." },
        { status: 401 }
      );
    }

    const token = generateSessionToken();
    const response = NextResponse.json({
      success: true,
      message: "Đăng nhập hệ thống quản trị thành công.",
      token,
    });

    // Only mark cookie secure when accessed over HTTPS (allows local IP testing over HTTP)
    const isHttps =
      request.nextUrl.protocol === "https:" ||
      request.headers.get("x-forwarded-proto") === "https";

    // Set HTTP-only session cookie (valid 7 days)
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Yêu cầu không hợp lệ." },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const tokenFromCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const tokenFromHeader = request.headers.get("authorization")?.replace("Bearer ", "");
  const validToken = generateSessionToken();

  const isAuthenticated =
    tokenFromCookie === validToken || tokenFromHeader === validToken;

  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Đã đăng xuất khỏi hệ thống quản trị.",
  });

  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
