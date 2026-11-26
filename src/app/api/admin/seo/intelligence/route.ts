import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import {
  getFullSeoIntelligenceState,
  runSeoMasterCycle,
  runSeoMasterCycleAsync,
  runKeywordResearchNow,
  runInternalLinkAuditAndFix,
  notifySearchEnginesOnPublish,
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
  FptProductKnowledge,
} from "@/lib/seoMemory";
import { runQaSafetyCheck } from "@/lib/seoAuditor";
import { runPageSpeedCheck } from "@/lib/pageSpeedClient";
import { fetchGa4OrganicSummary } from "@/lib/ga4Client";
import { getSeoConfig, saveSeoConfig } from "@/lib/seoStorage";
import { generateSeoArticleDraft, pickThumbnail } from "@/lib/seoAiEngine";
import { generateArticleCoverImage } from "@/lib/seoImageGenerator";
import { syncFptVnImagePool } from "@/lib/fptImageFetcher";
import { getAllArticles } from "@/lib/articleStorage";

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
      const result = await runSeoMasterCycleAsync({ collectLive: true, runAi: true });
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

    if (action === "sync_ga4") {
      const seo = getSeoConfig();
      const propertyId = String(body.propertyId || process.env.GA4_PROPERTY_ID || "").trim();
      const ga4 = await fetchGa4OrganicSummary({
        propertyId,
        serviceAccountEmail: seo.gscSettings?.serviceAccountEmail || "",
        privateKey: seo.gscSettings?.privateKey || "",
      });
      return NextResponse.json({
        success: !ga4.error,
        message: ga4.error
          ? ga4.error
          : `GA4 (28 ngày): ${ga4.organicSessions} phiên Organic / ${ga4.sessions} tổng phiên, ${ga4.conversions} chuyển đổi.`,
        ga4,
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    if (action === "ai_generate_article_draft") {
      const keyword = String(body.keyword || "").trim();
      const areaName = String(body.areaName || "Cần Thơ").trim();
      const generateImage = body.generateImage !== false;
      if (!keyword) {
        return NextResponse.json({ success: false, message: "Vui lòng nhập từ khóa mục tiêu." }, { status: 400 });
      }
      const knowledge = readMemoryFile<FptProductKnowledge | null>("fpt_knowledge.json", null);
      const draftRes = await generateSeoArticleDraft({ keyword, areaName, knowledge, generateImage });
      if (!draftRes.success || !draftRes.article) {
        return NextResponse.json(
          { success: false, message: draftRes.error || "Không thể tạo bản nháp bài viết." },
          { status: 400 }
        );
      }

      const approvals = readMemoryFile<SeoApprovalItem[]>("approvals.json", []);
      approvals.unshift({
        id: `app_art_${Date.now()}`,
        type: "article_draft",
        target: `/tin-tuc/${draftRes.article.slug}`,
        proposedBy: "Content SEO Agent",
        summary: `AI soạn bài viết mới cho từ khóa "${keyword}" (${areaName}) — Ảnh: ${draftRes.article.imageGeneratedBy || "fallback"}`,
        beforeSnapshot: null,
        afterProposal: draftRes.article,
        qaPassed: true,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      writeMemoryFile("approvals.json", approvals);

      return NextResponse.json({
        success: true,
        message: `Đã đưa bài nháp "${draftRes.article.title}" vào Approval Center chờ duyệt!`,
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    if (action === "ai_generate_image") {
      const keyword = String(body.keyword || "").trim();
      const areaName = String(body.areaName || "Cần Thơ").trim();
      const title = String(body.title || "").trim();
      const excludeUrl = String(body.excludeUrl || "").trim();
      if (!keyword) {
        return NextResponse.json({ success: false, message: "Vui lòng nhập từ khóa hoặc chủ đề ảnh." }, { status: 400 });
      }
      const recentThumbnails = getAllArticles(true)
        .slice(0, 8)
        .map((a) => a.thumbnail)
        .filter(Boolean);
      if (excludeUrl) recentThumbnails.unshift(excludeUrl);
      const fallbackThumbnail = pickThumbnail(keyword);
      const imgRes = await generateArticleCoverImage({
        keyword,
        title: title || keyword,
        areaName,
        slugHint: keyword,
        usedUrls: recentThumbnails,
        fallbackThumbnail,
      });
      return NextResponse.json({
        success: true,
        image: imgRes,
        message: imgRes.success
          ? `Đã tạo ảnh (${imgRes.generatedBy}) thành công!`
          : imgRes.error || "Sử dụng ảnh dự phòng phù hợp chủ đề.",
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    if (action === "sync_fpt_images") {
      const pool = await syncFptVnImagePool(true);
      return NextResponse.json({
        success: pool.length > 0,
        count: pool.length,
        pool,
        message:
          pool.length > 0
            ? `Đã đồng bộ ${pool.length} ảnh banner & sản phẩm mới nhất từ fpt.vn!`
            : "Không lấy được ảnh mới từ fpt.vn lúc này.",
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    if (action === "ai_research_keywords") {
      const res = await runKeywordResearchNow();
      return NextResponse.json(
        {
          ...res,
          intelligence: getFullSeoIntelligenceState(),
        },
        { status: res.success ? 200 : 400 }
      );
    }

    if (action === "run_internal_link_audit") {
      const autoApply = Boolean(body.autoApply);
      const res = runInternalLinkAuditAndFix(autoApply);
      return NextResponse.json({
        success: true,
        ...res,
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    if (action === "submit_google_indexing") {
      const articles = getAllArticles(false).slice(0, 3).map((a) => `/tin-tuc/${a.slug}`);
      const urls = articles.length > 0 ? articles : ["/"];
      const res = await notifySearchEnginesOnPublish(urls);
      return NextResponse.json({
        success: res.googleSitemapSubmitted || res.googleUrlsSubmitted > 0 || res.indexNowSubmitted > 0,
        ...res,
        message: `Đã gửi: Google Sitemap (${res.googleSitemapSubmitted ? "Thành công" : "Chưa đủ quyền/lỗi"}), Google Indexing API (${res.googleUrlsSubmitted} URL), IndexNow (${res.indexNowSubmitted} URL).${
          res.notes.length > 0 ? " Lưu ý: " + res.notes[0] : ""
        }`,
        intelligence: getFullSeoIntelligenceState(),
      });
    }

    if (action === "toggle_autopilot") {
      const seo = getSeoConfig();
      const current = seo.autoPilotSettings || {
        enabled: true,
        autoApproveMeta: true,
        autoApproveArticles: true,
        autoGenerateImages: true,
        maxArticlesPerCycle: 1,
      };
      seo.autoPilotSettings = {
        ...current,
        enabled: typeof body.enabled === "boolean" ? body.enabled : current.enabled,
        autoApproveMeta: typeof body.autoApproveMeta === "boolean" ? body.autoApproveMeta : current.autoApproveMeta,
        autoApproveArticles: typeof body.autoApproveArticles === "boolean" ? body.autoApproveArticles : current.autoApproveArticles,
        autoGenerateImages: typeof body.autoGenerateImages === "boolean" ? body.autoGenerateImages : current.autoGenerateImages,
      };
      saveSeoConfig(seo);
      return NextResponse.json({
        success: true,
        message: `Đã cập nhật chế độ Auto-Pilot (${seo.autoPilotSettings.enabled ? "Bật" : "Tắt"}).`,
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
