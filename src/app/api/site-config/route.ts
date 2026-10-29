import { NextResponse } from "next/server";
import { getDynamicConfig } from "@/lib/configStorage";

export async function GET() {
  const config = getDynamicConfig();
  return NextResponse.json({
    success: true,
    config,
  });
}
