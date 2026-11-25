import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { runSeoMasterCycleAsync, dispatchTelegramSeoSummary } from "@/lib/seoOrchestrator";
import { checkAndIncrementApiUsage } from "@/lib/seoMemory";

/**
 * Lightweight Server Cron Endpoint for cPanel Cron Jobs
 * Trigger via: curl -X POST https://gofpt.vn/api/cron/seo-tick -H "Authorization: Bearer <CRON_SECRET>"
 */
export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET || "";
  const authHeader = request.headers.get("authorization") || "";
  const bearer = authHeader.replace("Bearer ", "").trim();

  const isCronAuthorized = Boolean(cronSecret && bearer === cronSecret);
  const isAdminAuthorized = verifyAdminAuth(request);

  if (!isCronAuthorized && !isAdminAuthorized) {
    return NextResponse.json(
      { success: false, message: "Không có quyền chạy SEO Cron." },
      { status: 401 }
    );
  }

  const budget = checkAndIncrementApiUsage("cron_tick");
  if (!budget.allowed) {
    return NextResponse.json({
      success: false,
      message: `Đã đạt giới hạn chạy tự động trong ngày (${budget.usedToday}/${budget.limitToday}).`,
    });
  }

  const cycleResult = await runSeoMasterCycleAsync({ collectLive: true, runAi: true });
  let telegramSent = false;
  if (cycleResult.newTasksAdded > 0 || cycleResult.newApprovalsAdded > 0) {
    telegramSent = await dispatchTelegramSeoSummary();
  }

  return NextResponse.json({
    success: true,
    ...cycleResult,
    telegramSent,
    executedAt: new Date().toISOString(),
  });
}
