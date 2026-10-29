import { NextRequest } from "next/server";
import crypto from "crypto";

const AUTH_COOKIE_NAME = "fpt_admin_auth";

function getExpectedToken(): string {
  const secret = process.env.SESSION_SECRET || "fpt_sieutoc_secret_key_2026";
  return crypto.createHmac("sha256", secret).update("admin_authenticated").digest("hex");
}

export function verifyAdminAuth(request: NextRequest): boolean {
  // Allow bypassing if explicitly disabled in local dev or token matches
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const headerToken = request.headers.get("authorization")?.replace("Bearer ", "");
  const expected = getExpectedToken();

  return cookieToken === expected || headerToken === expected;
}

export const isAdminAuthenticated = verifyAdminAuth;
