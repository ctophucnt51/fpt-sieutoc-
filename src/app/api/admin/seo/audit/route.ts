import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { runFullSiteAudit } from "@/lib/seoAuditor";

export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  try {
    const reqUrl = new URL(request.url);
    const origin =
      process.env.INTERNAL_ORIGIN ||
      `${reqUrl.protocol}//${reqUrl.host}` ||
      "http://127.0.0.1:3000";

    const results = await runFullSiteAudit(origin);
    const avgScore =
      results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
        : 0;

    return NextResponse.json({
      success: true,
      avgScore,
      results,
      auditedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("SEO Audit error:", error);
    return NextResponse.json(
      { success: false, message: "Không thể chạy kiểm tra SEO On-Page." },
      { status: 500 }
    );
  }
}
