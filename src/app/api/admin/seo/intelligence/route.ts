import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import {
  getFullSeoIntelligenceState,
  runSeoMasterCycle,
  decideSeoApproval,
  rollbackSeoChange,
  dispatchTelegramSeoSummary,
} from "@/lib/seoOrchestrator";
import {
  readMemoryFile,
  writeMemoryFile,
  SeoKeywordMapItem,
  SeoTaskItem,
  SeoApprovalItem,
} from "@/lib/seoMemory";
import { runQaSafetyCheck } from "@/lib/seoAuditor";
import { runPageSpeedCheck } from "@/lib/pageSpeedClient";

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  // Ensure initial sync of inventory/baseline/fptKnowledge if empty
  const state = getFullSeoIntelligenceState();
  if (state.inventory.length === 0) {
    runSeoMasterCycle();
  }

  return NextResponse.json({
    success: true,
    intelligence: getFullSeoIntelligenceState(),
  });
}

export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "run_orchestrator") {
      const result = runSeoMasterCycle();
      return NextResponse.json({
        success: true,
        message: result.summary,
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    if (action === "add_keyword_map") {
      const keyword = String(body.keyword || "").trim();
      const targetUrl = String(body.targetUrl || "/").trim();
      const intent = (body.intent || "local") as "transactional" | "local" | "informational";
      const priority = (body.priority || "P1") as "P0" | "P1" | "P2";

      if (!keyword) {
        return NextResponse.json({ success: false, message: "Vui lòng nhập từ khóa." }, { status: 400 });
      }

      const list = readMemoryFile<SeoKeywordMapItem[]>("keywords.json", []);
      if (list.some((k) => k.keyword.toLowerCase() === keyword.toLowerCase())) {
        return NextResponse.json(
          { success: false, message: "Từ khóa này đã có trong Keyword Mapping." },
          { status: 400 }
        );
      }

      list.unshift({
        id: `kw_${Date.now()}`,
        keyword,
        targetUrl,
        intent,
        priority,
        currentPosition: null,
      });
      writeMemoryFile("keywords.json", list);
      return NextResponse.json({
        success: true,
        message: `Đã thêm từ khóa "${keyword}" → ${targetUrl}`,
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    if (action === "delete_keyword_map") {
      const id = String(body.id || "");
      const list = readMemoryFile<SeoKeywordMapItem[]>("keywords.json", []);
      writeMemoryFile("keywords.json", list.filter((k) => k.id !== id));
      return NextResponse.json({
        success: true,
        message: "Đã xóa từ khóa khỏi Mapping.",
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    if (action === "propose_meta_approval") {
      const route = String(body.route || "/").trim();
      const title = String(body.title || "").trim();
      const description = String(body.description || "").trim();
      const keywords = String(body.keywords || "").trim();

      const qa = runQaSafetyCheck({ title, description });
      const approvals = readMemoryFile<SeoApprovalItem[]>("approvals.json", []);
      approvals.unshift({
        id: `apr_${Date.now()}`,
        type: "meta_override",
        target: route,
        proposedBy: "Onpage Optimization Agent",
        summary: `Cập nhật Meta Title/Description cho ${route}`,
        beforeSnapshot: null,
        afterProposal: { route, title, description, keywords },
        qaPassed: qa.passed,
        qaNotes: qa.passed ? "Đạt chuẩn Google Ads & NAP" : qa.violations.join(" "),
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      writeMemoryFile("approvals.json", approvals.slice(0, 100));

      return NextResponse.json({
        success: true,
        message: qa.passed
          ? "Đã gửi đề xuất vào Approval Center (QA Google Ads: Đạt)."
          : "Đã gửi vào Approval Center (Cảnh báo QA không đạt).",
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    if (action === "decide_approval") {
      const res = decideSeoApproval(String(body.id || ""), body.decision);
      return NextResponse.json(
        {
          ...res,
          intelligence: getFullSeoIntelligenceState(),
        },
        { status: res.success ? 200 : 400 }
      );
    }

    if (action === "rollback_change") {
      const res = rollbackSeoChange(String(body.id || ""));
      return NextResponse.json(
        {
          ...res,
          intelligence: getFullSeoIntelligenceState(),
        },
        { status: res.success ? 200 : 400 }
      );
    }

    if (action === "update_task_status") {
      const id = String(body.id || "");
      const status = body.status as SeoTaskItem["status"];
      const tasks = readMemoryFile<SeoTaskItem[]>("tasks.json", []);
      const found = tasks.find((t) => t.id === id);
      if (found) {
        found.status = status;
        found.updatedAt = new Date().toISOString();
        writeMemoryFile("tasks.json", tasks);
      }
      return NextResponse.json({
        success: true,
        message: "Đã cập nhật trạng thái nhiệm vụ.",
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    if (action === "send_telegram_report") {
      const ok = await dispatchTelegramSeoSummary();
      return NextResponse.json({
        success: ok,
        message: ok
          ? "Đã gửi báo cáo SEO tổng hợp về Telegram!"
          : "Không thể gửi Telegram (kiểm tra cấu hình Bot Token / Chat ID).",
      });
    }

    if (action === "check_pagespeed") {
      const url = String(body.url || "https://gofpt.vn/").trim();
      const strategy = body.strategy === "desktop" ? "desktop" : "mobile";
      const psi = await runPageSpeedCheck(url, strategy);
      return NextResponse.json({
        success: psi.performanceScore !== null,
        message:
          psi.performanceScore !== null
            ? `PageSpeed (${strategy}): Hiệu năng ${psi.performanceScore}/100, SEO ${psi.seoScore}/100 (LCP: ${psi.lcpDisplay || "-"})`
            : psi.error || "Không thể đo PageSpeed.",
        pagespeed: psi,
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    return NextResponse.json({ success: false, message: "Hành động không hợp lệ." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Lỗi xử lý SEO Intelligence." },
      { status: 500 }
    );
  }
}
