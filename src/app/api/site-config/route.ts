import { NextResponse } from "next/server";
import { getDynamicConfig } from "@/lib/configStorage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const config = getDynamicConfig();
  return NextResponse.json(
    {
      success: true,
      config,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
