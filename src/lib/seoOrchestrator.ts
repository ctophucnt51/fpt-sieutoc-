import { AUDITED_ROUTES, auditSingleRoute, runQaSafetyCheck } from "./seoAuditor";
import { getAllArticles, saveAllArticles, Article } from "./articleStorage";
import { getSeoConfig, saveSeoConfig } from "./seoStorage";
import { readTrafficStore } from "./trafficStorage";
import { getAllLeads } from "./leadStorage";
import { sendSeoReportAlert } from "./telegram";
import {
  fetchGscAnalytics,
  submitSitemapToGoogle,
  publishUrlToGoogleIndexingApi,
} from "./googleSearchConsole";
import { checkKeywordSerp } from "./serpChecker";
import { runPageSpeedCheck } from "./pageSpeedClient";
import { fetchGa4OrganicSummary } from "./ga4Client";
import { pingIndexNow } from "./indexNow";
import { syncFptVnImagePool } from "./fptImageFetcher";
import {
  generateMetaOptimizationProposal,
  generateSeoArticleDraft,
  isAiConfigured,
  isGeminiConfigured,
  pickThumbnail,
  researchSeoKeywords,
} from "./seoAiEngine";
import {
  initializeSeoMemory,
  readMemoryFile,
  writeMemoryFile,
  enqueueSeoTask,
  checkAndIncrementApiUsage,
  SeoInventoryItem,
  SeoKeywordMapItem,
  SeoBaselineRecord,
  SeoCompetitorRecord,
  FptProductKnowledge,
  SeoTaskItem,
  SeoApprovalItem,
  SeoChangeRecord,
  SeoPerformanceEntry,
  SeoLessonEntry,
  SeoApiUsageStore,
} from "./seoMemory";

export interface AgentStatusSpec {
  id: string;
  name: string;
  role: string;
  scope: string;
  permissions: string;
  status: "ready" | "active" | "waiting_config";
  lastRunAt?: string;
}

export interface OrganicConversionSummary {
  totalLeads: number;
  organicLeads: number;
  googleAdsLeads: number;
  byLandingPage: { path: string; totalLeads: number; organicLeads: number }[];
  topKeywords: { keyword: string; count: number }[];
}

export function getAgentRoster(): AgentStatusSpec[] {
  const seo = getSeoConfig();
  const hasGsc = Boolean(seo.gscSettings?.connected);
  const hasSerper = Boolean(seo.serperSettings?.connected);
  const hasAi = isAiConfigured();

  return [
    {
      id: "agent-master",
      name: "SEO Master Agent",
      role: "Điều phối 8 bước: Collect → Analyze → Prioritize → Plan → Execute → Validate → Measure → Learn",
      scope: "data/seo-memory/* & Task Queue",
      permissions: "Read/Write Memory, Auto-Pilot Publish & Dispatch Tasks",
      status: "active",
    },
    {
      id: "agent-technical",
      name: "Technical SEO Agent",
      role: "Audit Canonical, Robots, Sitemap, HTTP Status & Core Web Vitals tự động mỗi 24h",
      scope: "Routes SSG/Static, sitemap.ts, robots.ts",
      permissions: "Auto-Audit Routes & PageSpeed, Propose fixes via Approval Center",
      status: "active",
    },
    {
      id: "agent-research",
      name: "Keyword & Competitor Research Agent",
      role: "Quét Top 3 đối thủ Cần Thơ/Sóc Trăng/Hậu Giang & tự mở rộng Keyword Mapping từ GSC",
      scope: "GSC Queries, Serper.dev SERP, keywords.json",
      permissions: "Read/Write keywords.json & competitors.json (Untrusted HTML/Snippet guard)",
      status: hasSerper || hasGsc ? "active" : "waiting_config",
    },
    {
      id: "agent-content",
      name: "Content SEO Agent",
      role: "Tự động viết bài chuẩn Clean Editorial + tạo ảnh bìa AI phù hợp nội dung",
      scope: "articles.json (Draft / Auto-Publish QA Gate)",
      permissions: "Tạo bản nháp & ảnh AI (Cấm tự bịa giá/khuyến mãi)",
      status: hasAi ? "active" : "waiting_config",
    },
    {
      id: "agent-onpage",
      name: "Onpage Optimization Agent",
      role: "Tối ưu Title, Meta Description, Schema & Internal Links cho trang CTR thấp",
      scope: "pageMetaOverrides (seoConfig.json)",
      permissions: "Áp dụng qua QA Gate + Snapshot Rollback + IndexNow Ping",
      status: hasGsc || hasAi ? "active" : "waiting_config",
    },
    {
      id: "agent-local",
      name: "Authority & Local SEO Agent",
      role: "Kiểm tra nhất quán NAP (Số 10 Phan Văn Trị, 0878 800 400), Local SEO & IndexNow Ping",
      scope: "LocalBusiness Schema, Cụm bài ĐBSCL & IndexNow API",
      permissions: "Audit NAP & Ping IndexNow khi xuất bản (Cấm spam backlink)",
      status: "active",
    },
    {
      id: "agent-analytics",
      name: "Analytics Agent",
      role: "Tổng hợp GSC + GA4 + Traffic Organic + Lead chuyển đổi ẩn danh (không PII)",
      scope: "GSC API, GA4 API, traffic-stats.json, leads.json (ẩn danh)",
      permissions: "Read-only Analytics & Learn Loop (Cấm xuất SĐT/tên khách vào log/LLM)",
      status: "active",
    },
    {
      id: "agent-qa",
      name: "QA & Safety Agent",
      role: "Cổng kiểm duyệt chính sách Google Ads, kiểm tra NAP & Rollback Gate",
      scope: "Mọi đề xuất trước khi vào Production",
      permissions: "Quyền VETO từ chối mọi nội dung vi phạm Google Ads hoặc sai NAP",
      status: "active",
    },
  ];
}

export function getAnonymizedConversionSummary(): OrganicConversionSummary {
  const leads = getAllLeads();
  let organicLeads = 0;
  let googleAdsLeads = 0;
  const pageMap = new Map<string, { totalLeads: number; organicLeads: number }>();
  const kwMap = new Map<string, number>();

  for (const lead of leads) {
    const src = (lead.utm_source || "").toLowerCase();
    const med = (lead.utm_medium || "").toLowerCase();
    const isOrganic = med === "organic" || (src === "google" && med !== "cpc" && !lead.gclid);
    const isAds = Boolean(lead.gclid) || med === "cpc" || med === "ppc";

    if (isOrganic) organicLeads++;
    if (isAds) googleAdsLeads++;

    const path = (lead.landingPage || "/").split("?")[0] || "/";
    const curr = pageMap.get(path) || { totalLeads: 0, organicLeads: 0 };
    curr.totalLeads += 1;
    if (isOrganic) curr.organicLeads += 1;
    pageMap.set(path, curr);

    if (lead.utm_term) {
      const kw = lead.utm_term.trim();
      kwMap.set(kw, (kwMap.get(kw) || 0) + 1);
    }
  }

  return {
    totalLeads: leads.length,
    organicLeads,
    googleAdsLeads,
    byLandingPage: Array.from(pageMap.entries())
      .map(([path, v]) => ({ path, ...v }))
      .sort((a, b) => b.totalLeads - a.totalLeads)
      .slice(0, 15),
    topKeywords: Array.from(kwMap.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15),
  };
}

/**
 * Chu trình SEO Master Agent: Collect -> Analyze -> Prioritize -> Plan -> Validate
 */
export function runSeoMasterCycle(): {
  newTasksAdded: number;
  newApprovalsAdded: number;
  autoResolvedCount: number;
  summary: string;
} {
  initializeSeoMemory();
  const seo = getSeoConfig();
  const articles = getAllArticles(false);
  const traffic = readTrafficStore();
  const conversions = getAnonymizedConversionSummary();

  // 1. COLLECT: Rebuild inventory.json from real routes + articles (preserving prior technical audit scores)
  const prevInventory = readMemoryFile<SeoInventoryItem[]>("inventory.json", []);
  const prevByRoute = new Map(prevInventory.map((i) => [i.route, i]));

  const inventory: SeoInventoryItem[] = [
    ...AUDITED_ROUTES.map((r) => {
      const prev = prevByRoute.get(r.route);
      return {
        url: `https://gofpt.vn${r.route === "/" ? "" : r.route}`,
        route: r.route,
        type: (r.route === "/tin-tuc" ? "dynamic" : "static") as "static" | "dynamic",
        indexable: true,
        hasCanonical: prev?.hasCanonical ?? true,
        title: seo.pageMetaOverrides?.[r.route]?.title || r.name,
        description: seo.pageMetaOverrides?.[r.route]?.description || "",
        lastAuditedAt: prev?.lastAuditedAt,
        score: prev?.score,
        googleAdsSafe: prev?.googleAdsSafe,
      };
    }),
    ...articles.map((a) => {
      const route = `/tin-tuc/${a.slug}`;
      const prev = prevByRoute.get(route);
      return {
        url: `https://gofpt.vn${route}`,
        route,
        type: "ssg" as const,
        indexable: a.published,
        hasCanonical: prev?.hasCanonical ?? true,
        title: a.title,
        description: a.excerpt,
        lastAuditedAt: prev?.lastAuditedAt,
        score: prev?.score,
        googleAdsSafe: prev?.googleAdsSafe,
      };
    }),
  ];
  writeMemoryFile("inventory.json", inventory);

  // Update competitors.json from watchlist Serper results
  const competitors: SeoCompetitorRecord[] = (seo.watchlistKeywords || [])
    .filter((kw) => kw.topCompetitors && kw.topCompetitors.length > 0)
    .map((kw) => ({
      keyword: kw.keyword,
      checkedAt: kw.serpCheckedAt || new Date().toISOString(),
      topDomains: (kw.topCompetitors || []).map((c) => ({
        position: c.position,
        domain: c.domain,
        title: c.title,
        link: c.link,
      })),
    }));
  if (competitors.length > 0) {
    writeMemoryFile("competitors.json", competitors);
  }

  // Update baseline & performance
  const organicSessions = Object.values(traffic.daily || {}).reduce(
    (sum, d) => sum + (d.sources?.["Google Search"] || 0),
    0
  );

  const existingBaseline = readMemoryFile<SeoBaselineRecord | null>("baseline.json", null);
  if (!existingBaseline) {
    writeMemoryFile<SeoBaselineRecord>("baseline.json", {
      capturedAt: new Date().toISOString(),
      totalOrganicClicks28d: seo.gscCache?.totals.clicks ?? 0,
      totalOrganicImpressions28d: seo.gscCache?.totals.impressions ?? 0,
      avgPosition28d: seo.gscCache?.totals.position ?? null,
      totalOrganicLeads30d: conversions.organicLeads,
      mobilePageSpeedScore: null,
      desktopPageSpeedScore: null,
    });
  }

  const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const perfList = readMemoryFile<SeoPerformanceEntry[]>("performance.json", []);
  const todayEntry: SeoPerformanceEntry = {
    date: today,
    clicks: seo.gscCache?.totals.clicks ?? 0,
    impressions: seo.gscCache?.totals.impressions ?? 0,
    avgPosition: seo.gscCache?.totals.position ?? null,
    organicSessions,
    organicLeads: conversions.organicLeads,
  };
  const filteredPerf = perfList.filter((p) => p.date !== today);
  writeMemoryFile("performance.json", [todayEntry, ...filteredPerf].slice(0, 90));

  // 2. ANALYZE & PRIORITIZE & PLAN
  let newTasksAdded = 0;
  let newApprovalsAdded = 0;
  const resolvedDedupKeys = new Set<string>();

  if (!seo.gscSettings?.connected) {
    const res = enqueueSeoTask({
      dedupKey: "config-gsc-connection",
      title: "Kết nối Google Search Console API để đồng bộ dữ liệu thứ hạng thực",
      ownerAgent: "Analytics Agent",
      priority: "P0",
      evidence: "gscSettings.connected = false trong seoConfig.json",
      estimatedCost: "0đ (Miễn phí Google API)",
      acceptanceCriteria: "GSC trả về dữ liệu clicks/impressions/queries hợp lệ",
    });
    if (res.added) newTasksAdded++;
  } else {
    resolvedDedupKeys.add("config-gsc-connection");
  }

  if (!seo.serperSettings?.connected) {
    const res = enqueueSeoTask({
      dedupKey: "config-serper-connection",
      title: "Kết nối Serper.dev API để theo dõi Top 3 đối thủ tại Cần Thơ",
      ownerAgent: "Keyword & Competitor Research Agent",
      priority: "P1",
      evidence: "serperSettings.connected = false trong seoConfig.json",
      estimatedCost: "0đ (Gói Free 2.500 queries)",
      acceptanceCriteria: "Kiểm tra được Top 30 SERP & Top 3 đối thủ cho từ khóa mục tiêu",
    });
    if (res.added) newTasksAdded++;
  } else {
    resolvedDedupKeys.add("config-serper-connection");
  }

  // Check Local SEO gaps (Theo đơn vị hành chính 2 cấp sau sáp nhập 07/2025: 31 Phường & 72 Xã thuộc TP. Cần Thơ)
  const localAreas = [
    { slugHint: "ninh-kieu", name: "Phường Ninh Kiều, TP. Cần Thơ" },
    { slugHint: "cai-rang", name: "Phường Cái Răng, TP. Cần Thơ" },
    { slugHint: "binh-thuy", name: "Phường Bình Thủy, TP. Cần Thơ" },
    { slugHint: "o-mon", name: "Phường Ô Môn, TP. Cần Thơ" },
    { slugHint: "thot-not", name: "Phường Thốt Nốt, TP. Cần Thơ" },
    { slugHint: "phong-dien", name: "Xã Phong Điền, TP. Cần Thơ" },
    { slugHint: "soc-trang", name: "Phường Sóc Trăng, TP. Cần Thơ" },
    { slugHint: "vi-thanh", name: "Phường Vị Thanh, TP. Cần Thơ" },
  ];

  for (const area of localAreas) {
    const covered = articles.some(
      (a) =>
        a.slug.includes(area.slugHint) ||
        a.title.toLowerCase().includes(area.name.toLowerCase().split(",")[0])
    );
    if (!covered) {
      const res = enqueueSeoTask({
        dedupKey: `local-seo-${area.slugHint}`,
        title: `Viết bài Local SEO chuẩn Clean Editorial cho khu vực ${area.name}`,
        ownerAgent: "Content SEO Agent",
        priority: "P1",
        evidence: `Chưa có bài viết chuyên sâu cho khu vực ${area.name} trong articles.json`,
        estimatedCost: "0đ (Antigravity Agent)",
        acceptanceCriteria: `Bài viết đạt QA Google Ads Safe, có FAQ & Canonical`,
        targetUrl: `/tin-tuc/lap-mang-fpt-${area.slugHint}`,
      });
      if (res.added) newTasksAdded++;
    } else {
      resolvedDedupKeys.add(`local-seo-${area.slugHint}`);
    }
  }

  // QA Audit existing articles
  const approvals = readMemoryFile<SeoApprovalItem[]>("approvals.json", []);
  const failingQaTargets = new Set<string>();
  for (const art of articles) {
    const qa = runQaSafetyCheck({
      title: art.title,
      description: art.excerpt,
      contentHtml: art.content,
    });
    if (!qa.passed) {
      failingQaTargets.add(`/tin-tuc/${art.slug}`);
      const res = enqueueSeoTask({
        dedupKey: `qa-fix-${art.id}`,
        title: `Sửa vi phạm Google Ads / NAP trong bài "${art.title}"`,
        ownerAgent: "QA & Safety Agent",
        priority: "P0",
        evidence: qa.violations.join("; "),
        estimatedCost: "0đ",
        acceptanceCriteria: "runQaSafetyCheck trả về passed: true",
        targetUrl: `/tin-tuc/${art.slug}`,
      });
      if (res.added) newTasksAdded++;
    } else {
      resolvedDedupKeys.add(`qa-fix-${art.id}`);
    }
  }

  // GSC Quick Wins (Top 4-15 or low CTR) -> Create Approval Proposal
  if (seo.gscCache?.topQueries) {
    for (const q of seo.gscCache.topQueries.slice(0, 20)) {
      if (q.impressions >= 50 && q.position >= 4 && q.position <= 15) {
        const res = enqueueSeoTask({
          dedupKey: `quick-win-${q.query.toLowerCase()}`,
          title: `Tối ưu từ khóa Quick-Win "${q.query}" (đang Top ${q.position.toFixed(1)})`,
          ownerAgent: "Onpage Optimization Agent",
          priority: "P1",
          evidence: `${q.impressions} impressions, ${q.clicks} clicks, CTR ${(q.ctr * 100).toFixed(1)}%`,
          estimatedCost: "0đ",
          acceptanceCriteria: "Cải thiện vị trí vào Top 1-3 hoặc CTR tăng >= 20%",
        });
        if (res.added) newTasksAdded++;
      }
    }
  }

  // Auto-resolve any pending tasks whose condition is now satisfied
  let autoResolvedCount = 0;
  const currentTasks = readMemoryFile<SeoTaskItem[]>("tasks.json", []);
  const nowIso = new Date().toISOString();
  let tasksModified = false;
  for (const t of currentTasks) {
    const isResolvedQa =
      t.dedupKey.startsWith("qa-fix-") && (!t.targetUrl || !failingQaTargets.has(t.targetUrl));
    if (
      (t.status === "pending" || t.status === "in_progress") &&
      (resolvedDedupKeys.has(t.dedupKey) || isResolvedQa)
    ) {
      t.status = "completed";
      t.updatedAt = nowIso;
      autoResolvedCount++;
      tasksModified = true;
    }
  }
  if (tasksModified) {
    writeMemoryFile("tasks.json", currentTasks);
  }

  // Ensure approvals file exists
  writeMemoryFile("approvals.json", approvals);

  return {
    newTasksAdded,
    newApprovalsAdded,
    autoResolvedCount,
    summary: `Đã đồng bộ ${inventory.length} URL vào bộ nhớ, phát hiện ${newTasksAdded} nhiệm vụ mới, tự động hoàn tất ${autoResolvedCount} nhiệm vụ đã xử lý.`,
  };
}

/**
 * Research & Keyword Spy Agent: Chủ động tìm từ khóa mới chưa phủ, thêm vào Mapping + Watchlist + Task Queue.
 */
export async function runKeywordResearchNow(): Promise<{
  success: boolean;
  addedCount: number;
  keywords: string[];
  message: string;
}> {
  if (!isAiConfigured()) {
    return { success: false, addedCount: 0, keywords: [], message: "Chưa cấu hình AI API Key." };
  }

  const kwList = readMemoryFile<SeoKeywordMapItem[]>("keywords.json", []);
  const articles = getAllArticles(false);
  const competitors = readMemoryFile<SeoCompetitorRecord[]>("competitors.json", []);
  const compTitles = competitors.flatMap((c) => c.topDomains.map((d) => d.title));

  const res = await researchSeoKeywords({
    existingKeywords: kwList.map((k) => k.keyword),
    existingTitles: articles.map((a) => a.title),
    competitorSnippets: compTitles,
  });

  if (!res.success || !res.suggestions || res.suggestions.length === 0) {
    return {
      success: false,
      addedCount: 0,
      keywords: [],
      message: res.error || "Không tìm thấy từ khóa mới phù hợp.",
    };
  }

  const seo = getSeoConfig();
  const addedKeywords: string[] = [];

  for (const s of res.suggestions) {
    if (kwList.some((k) => k.keyword.toLowerCase() === s.keyword.toLowerCase())) continue;

    kwList.unshift({
      id: `kw_ai_${Date.now()}_${addedKeywords.length}`,
      keyword: s.keyword,
      targetUrl: s.targetUrl,
      intent: s.intent,
      priority: s.priority,
      currentPosition: null,
      lastCheckedAt: new Date().toISOString(),
    });

    if (!(seo.watchlistKeywords || []).some((w) => w.keyword.toLowerCase() === s.keyword.toLowerCase())) {
      seo.watchlistKeywords.push({
        id: `wl_${Date.now()}_${addedKeywords.length}`,
        keyword: s.keyword,
        targetUrl: s.targetUrl,
        lastPosition: null,
        previousPosition: null,
        clicks: 0,
        impressions: 0,
        ctr: 0,
      });
    }

    enqueueSeoTask({
      dedupKey: `ai-kw-${s.keyword.toLowerCase()}`,
      title: `Viết bài SEO cho từ khóa "${s.keyword}" tại khu vực ${s.areaName}`,
      ownerAgent: "Content SEO Agent",
      priority: s.priority,
      evidence: s.rationale || "Đề xuất bởi Research & Keyword Spy Agent",
      estimatedCost: "0đ (AI Agent)",
      acceptanceCriteria: "Bài viết đạt QA Google Ads, có ảnh bìa AI & Internal Link",
      targetUrl: s.targetUrl,
    });

    addedKeywords.push(s.keyword);
  }

  if (addedKeywords.length > 0) {
    writeMemoryFile("keywords.json", kwList);
    saveSeoConfig(seo);
  }

  return {
    success: true,
    addedCount: addedKeywords.length,
    keywords: addedKeywords,
    message:
      addedKeywords.length > 0
        ? `Keyword Spy Agent đã tìm & thêm ${addedKeywords.length} từ khóa mới: ${addedKeywords.join(", ")}`
        : "Tất cả từ khóa gợi ý đã có sẵn trong Mapping.",
  };
}

/**
 * Internal Link Agent (`seo-internal-link`): Kiểm tra & bổ sung liên kết nội bộ về các trang dịch vụ chính.
 */
export function runInternalLinkAuditAndFix(autoApply = false): {
  checkedCount: number;
  fixedCount: number;
  flaggedCount: number;
  message: string;
} {
  const articles = getAllArticles(true);
  const coreRoutes = ["/lap-mang-fpt", "/combo-ngoai-hang-anh", "/bang-gia", "/camera-fpt"];
  let fixedCount = 0;
  let flaggedCount = 0;
  let articlesModified = false;
  const changes = readMemoryFile<SeoChangeRecord[]>("changes.json", []);

  for (const art of articles) {
    if (!art.published) continue;
    const presentLinks = coreRoutes.filter((r) => art.content.includes(`href="${r}"`) || art.content.includes(`href='${r}'`));
    if (presentLinks.length >= 2) continue;

    if (autoApply) {
      const missing = coreRoutes.filter((r) => !presentLinks.includes(r)).slice(0, 2);
      const linkLabels: Record<string, string> = {
        "/lap-mang-fpt": "Đăng ký Lắp Mạng FPT Wi-Fi 6 tốc độ 1 Gbps",
        "/combo-ngoai-hang-anh": "Gói Combo Internet + Ngoại Hạng Anh 220.000đ/tháng",
        "/bang-gia": "Bảng giá cước Internet FPT mới nhất 2026",
        "/camera-fpt": "Camera FPT AI an ninh lưu trữ Cloud",
      };
      const linkItems = missing
        .map((r) => `<li><a href="${r}" class="text-fpt-orange font-semibold hover:underline">${linkLabels[r] || r}</a></li>`)
        .join("");

      const linkBlock = `\n<div class="not-prose my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">\n  <p class="font-bold text-slate-900 mb-1.5">Xem thêm dịch vụ FPT Telecom liên quan:</p>\n  <ul class="list-disc pl-5 space-y-1">${linkItems}</ul>\n</div>\n`;
      const updatedContent = `${art.content}${linkBlock}`;
      const qa = runQaSafetyCheck({ title: art.title, description: art.excerpt, contentHtml: updatedContent });
      if (qa.passed) {
        changes.unshift({
          id: `chg_il_${Date.now()}_${fixedCount}`,
          target: `/tin-tuc/${art.slug}`,
          changeType: "internal_link",
          beforeSnapshot: { contentLength: art.content.length },
          afterSnapshot: { addedLinks: missing },
          appliedBy: "Internal Link Agent",
          appliedAt: new Date().toISOString(),
        });
        art.content = updatedContent;
        art.updatedAt = new Date().toISOString();
        articlesModified = true;
        fixedCount++;
      }
    } else {
      enqueueSeoTask({
        dedupKey: `internal-link-${art.id}`,
        title: `Bổ sung liên kết nội bộ cho bài "${art.title}"`,
        ownerAgent: "Onpage Optimization Agent",
        priority: "P2",
        evidence: `Mới có ${presentLinks.length}/2 internal link tới trang dịch vụ đích`,
        estimatedCost: "0đ",
        acceptanceCriteria: "Có tối thiểu 2 internal links tự nhiên tới trang gói cước",
        targetUrl: `/tin-tuc/${art.slug}`,
      });
      flaggedCount++;
    }
  }

  if (articlesModified) {
    saveAllArticles(articles);
    writeMemoryFile("changes.json", changes.slice(0, 100));
  }

  return {
    checkedCount: articles.filter((a) => a.published).length,
    fixedCount,
    flaggedCount,
    message: autoApply
      ? `Internal Link Agent đã kiểm tra ${articles.filter((a) => a.published).length} bài và tự động bổ sung liên kết cho ${fixedCount} bài.`
      : `Đã kiểm tra ${articles.filter((a) => a.published).length} bài, phát hiện ${flaggedCount} bài thiếu internal link.`,
  };
}

/**
 * Gửi thông báo lập chỉ mục đồng thời tới IndexNow (Bing/Yandex/Naver) + Google (GSC Sitemap & Indexing API).
 */
export async function notifySearchEnginesOnPublish(urls: string[]): Promise<{
  indexNowSubmitted: number;
  googleSitemapSubmitted: boolean;
  googleUrlsSubmitted: number;
  notes: string[];
}> {
  const notes: string[] = [];
  const idxRes = await pingIndexNow(urls);
  const indexNowSubmitted = idxRes.submittedCount;

  let googleSitemapSubmitted = false;
  let googleUrlsSubmitted = 0;

  const seo = getSeoConfig();
  if (
    seo.gscSettings?.connected &&
    seo.gscSettings.serviceAccountEmail &&
    seo.gscSettings.privateKey
  ) {
    const smRes = await submitSitemapToGoogle({
      siteUrl: seo.gscSettings.siteUrl,
      serviceAccountEmail: seo.gscSettings.serviceAccountEmail,
      privateKey: seo.gscSettings.privateKey,
      sitemapUrl: "https://gofpt.vn/sitemap.xml",
    });
    googleSitemapSubmitted = smRes.success;
    if (!smRes.success && smRes.error) {
      notes.push(`GSC Sitemap: ${smRes.error}`);
    }

    for (const u of urls.slice(0, 3)) {
      const pubRes = await publishUrlToGoogleIndexingApi({
        serviceAccountEmail: seo.gscSettings.serviceAccountEmail,
        privateKey: seo.gscSettings.privateKey,
        url: u,
      });
      if (pubRes.success) {
        googleUrlsSubmitted++;
      } else if (pubRes.error) {
        notes.push(`Google Indexing: ${pubRes.error}`);
        break;
      }
    }
  }

  return {
    indexNowSubmitted,
    googleSitemapSubmitted,
    googleUrlsSubmitted,
    notes,
  };
}

/**
 * Learn Loop: Đánh giá hiệu quả các thay đổi đã áp dụng >= 7 ngày và lưu bài học vào lessons.json.
 */
function runLearnLoop(): number {
  const changes = readMemoryFile<SeoChangeRecord[]>("changes.json", []);
  const perf = readMemoryFile<SeoPerformanceEntry[]>("performance.json", []);
  const lessons = readMemoryFile<SeoLessonEntry[]>("lessons.json", []);
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  let newLessons = 0;

  const latestPerf = perf[0];
  for (const chg of changes) {
    if (chg.evaluatedForLearn || chg.rolledBack) continue;
    if (Date.now() - new Date(chg.appliedAt).getTime() < sevenDaysMs) continue;

    const appliedDate = chg.appliedAt.slice(0, 10);
    const baselinePerf = perf.find((p) => p.date <= appliedDate) || perf[perf.length - 1];

    let lessonText = "";
    let evidenceText = "";

    if (latestPerf && baselinePerf && latestPerf.date !== baselinePerf.date) {
      const clickDelta = latestPerf.clicks - baselinePerf.clicks;
      const impDelta = latestPerf.impressions - baselinePerf.impressions;
      const trend = clickDelta > 0 ? "tăng trưởng tích cực" : clickDelta < 0 ? "chưa tăng clicks, cần tinh chỉnh tiêu đề/CTA" : "ổn định";
      lessonText = `Thay đổi ${chg.changeType} tại ${chg.target} sau 7 ngày cho thấy ${trend} (${clickDelta >= 0 ? "+" : ""}${clickDelta} clicks, ${impDelta >= 0 ? "+" : ""}${impDelta} impressions).`;
      evidenceText = `So sánh ${baselinePerf.date} → ${latestPerf.date}`;
    } else {
      lessonText = `Thay đổi ${chg.changeType} tại ${chg.target} đã chạy ổn định trên production sau 7 ngày không cần rollback.`;
      evidenceText = `Applied at ${chg.appliedAt}`;
    }

    lessons.unshift({
      id: `lesson_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      category: chg.changeType === "article_draft" ? "Content SEO" : "Onpage CTR",
      lesson: lessonText,
      evidence: evidenceText,
      createdAt: new Date().toISOString(),
    });
    chg.evaluatedForLearn = true;
    newLessons++;
  }

  if (newLessons > 0) {
    writeMemoryFile("changes.json", changes);
    writeMemoryFile("lessons.json", lessons.slice(0, 50));
  }
  return newLessons;
}

/**
 * Full Autonomous SEO Master Cycle:
 * Collect (GSC/Serper/GA4/Technical/Keywords) -> Analyze -> Execute AI (Onpage + Content + Image) -> Auto-Approve & IndexNow -> Measure & Learn.
 */
export async function runSeoMasterCycleAsync(options?: {
  collectLive?: boolean;
  runAi?: boolean;
}): Promise<{
  newTasksAdded: number;
  newApprovalsAdded: number;
  autoApprovedCount: number;
  autoResolvedCount: number;
  gscSynced: boolean;
  serpCheckedCount: number;
  technicalAuditedCount: number;
  indexNowSubmitted: number;
  newLessonsCount: number;
  summary: string;
}> {
  const collectLive = options?.collectLive !== false;
  const runAi = options?.runAi !== false;
  let gscSynced = false;
  let serpCheckedCount = 0;
  let technicalAuditedCount = 0;
  let autoApprovedCount = 0;
  let indexNowSubmitted = 0;

  // 1. LIVE COLLECT (GSC + Serper + GA4 + Technical Audit + Keyword Discovery)
  if (collectLive) {
    const seo = getSeoConfig();
    const gscFetchedAt = seo.gscCache?.fetchedAt ? new Date(seo.gscCache.fetchedAt).getTime() : 0;
    const sixHoursMs = 6 * 60 * 60 * 1000;
    if (
      seo.gscSettings?.connected &&
      seo.gscSettings.serviceAccountEmail &&
      seo.gscSettings.privateKey &&
      Date.now() - gscFetchedAt > sixHoursMs
    ) {
      const budget = checkAndIncrementApiUsage("gsc");
      if (budget.allowed) {
        try {
          const gscData = await fetchGscAnalytics({
            siteUrl: seo.gscSettings.siteUrl,
            serviceAccountEmail: seo.gscSettings.serviceAccountEmail,
            privateKey: seo.gscSettings.privateKey,
            dateRange: "28d",
          });
          seo.gscCache = gscData;
          saveSeoConfig(seo);
          gscSynced = true;
        } catch {
          // keep cached GSC data on transient error
        }
      }
    }

    // Serper SERP check (up to 2 watchlist keywords per cycle, 24h cache)
    if (seo.serperSettings?.connected && seo.serperSettings.apiKey) {
      const dayMs = 24 * 60 * 60 * 1000;
      for (const kw of seo.watchlistKeywords || []) {
        if (serpCheckedCount >= 2) break;
        const checkedAt = kw.serpCheckedAt ? new Date(kw.serpCheckedAt).getTime() : 0;
        if (Date.now() - checkedAt < dayMs) continue;
        const budget = checkAndIncrementApiUsage("serper");
        if (!budget.allowed) break;
        try {
          const res = await checkKeywordSerp({
            keyword: kw.keyword,
            apiKey: seo.serperSettings.apiKey,
            targetDomain: "gofpt.vn",
          });
          kw.serpPreviousPosition = kw.serpPosition ?? null;
          kw.serpPosition = res.ourPosition;
          kw.serpMatchedUrl = res.ourMatchedUrl;
          kw.topCompetitors = res.topCompetitors;
          kw.serpCheckedAt = res.checkedAt;
          serpCheckedCount++;
        } catch {
          // continue on transient SERP error
        }
      }
      if (serpCheckedCount > 0) {
        saveSeoConfig(seo);
      }
    }

    // Research Agent: Auto-discover unmapped GSC queries into keywords.json (max 3/cycle)
    if (seo.gscCache?.topQueries && seo.gscCache.topQueries.length > 0) {
      const kwList = readMemoryFile<SeoKeywordMapItem[]>("keywords.json", []);
      let addedKw = 0;
      for (const q of seo.gscCache.topQueries) {
        if (addedKw >= 3) break;
        if (q.impressions < 30) continue;
        const exists = kwList.some((k) => k.keyword.toLowerCase() === q.query.toLowerCase());
        if (!exists) {
          kwList.push({
            id: `kw_gsc_${Date.now()}_${addedKw}`,
            keyword: q.query,
            targetUrl: q.query.includes("combo") || q.query.includes("ngoại hạng") ? "/combo-ngoai-hang-anh" : "/lap-mang-fpt",
            intent: q.query.includes("giá") || q.query.includes("đăng ký") ? "transactional" : "local",
            priority: q.impressions >= 100 ? "P0" : "P1",
            currentPosition: Number(q.position.toFixed(1)),
            lastCheckedAt: new Date().toISOString(),
          });
          addedKw++;
        }
      }
      if (addedKw > 0) {
        writeMemoryFile("keywords.json", kwList);
      }
    }

    // Analytics Agent: GA4 sync (12h cache)
    const ga4PropertyId = (seo.ga4PropertyId || process.env.GA4_PROPERTY_ID || "").trim();
    const lastGa4At = seo.autoPilotSettings?.lastGa4SyncAt
      ? new Date(seo.autoPilotSettings.lastGa4SyncAt).getTime()
      : 0;
    if (
      ga4PropertyId &&
      seo.gscSettings?.serviceAccountEmail &&
      seo.gscSettings?.privateKey &&
      Date.now() - lastGa4At > 12 * 60 * 60 * 1000
    ) {
      try {
        const ga4Res = await fetchGa4OrganicSummary({
          propertyId: ga4PropertyId,
          serviceAccountEmail: seo.gscSettings.serviceAccountEmail,
          privateKey: seo.gscSettings.privateKey,
        });
        const latestSeo = getSeoConfig();
        if (!ga4Res.error) {
          latestSeo.ga4Cache = {
            propertyId: ga4Res.propertyId,
            sessions: ga4Res.sessions,
            organicSessions: ga4Res.organicSessions,
            conversions: ga4Res.conversions,
            fetchedAt: ga4Res.fetchedAt,
          };
        }
        if (latestSeo.autoPilotSettings) {
          latestSeo.autoPilotSettings.lastGa4SyncAt = new Date().toISOString();
        }
        saveSeoConfig(latestSeo);
      } catch {
        // non-blocking
      }
    }

    // Technical SEO Agent: Rotate audit across all core routes (4 routes/cycle) + PageSpeed
    const lastTechAt = seo.autoPilotSettings?.lastTechnicalAuditAt
      ? new Date(seo.autoPilotSettings.lastTechnicalAuditAt).getTime()
      : 0;
    if (Date.now() - lastTechAt > 24 * 60 * 60 * 1000) {
      const inv = readMemoryFile<SeoInventoryItem[]>("inventory.json", []);
      const invByRoute = new Map(inv.map((i) => [i.route, i]));
      const sortedRoutes = [...AUDITED_ROUTES].sort((a, b) => {
        const ta = invByRoute.get(a.route)?.lastAuditedAt || "";
        const tb = invByRoute.get(b.route)?.lastAuditedAt || "";
        return ta.localeCompare(tb);
      });
      const targetRoutes = sortedRoutes.slice(0, 4);
      for (const r of targetRoutes) {
        try {
          const audit = await auditSingleRoute("https://gofpt.vn", r);
          technicalAuditedCount++;
          const invItem = invByRoute.get(r.route);
          if (invItem) {
            invItem.score = audit.score;
            invItem.hasCanonical = audit.hasCanonical;
            invItem.googleAdsSafe = audit.googleAdsSafe;
            invItem.lastAuditedAt = new Date().toISOString();
          }
          if (audit.score < 80 || !audit.googleAdsSafe || !audit.hasCanonical) {
            enqueueSeoTask({
              dedupKey: `tech-audit-${r.route}`,
              title: `Khắc phục lỗi Technical SEO trên ${r.route} (Điểm ${audit.score}/100)`,
              ownerAgent: "Technical SEO Agent",
              priority: audit.score < 70 ? "P0" : "P1",
              evidence: audit.issues.slice(0, 3).join("; ") || `Score ${audit.score}/100`,
              estimatedCost: "0đ",
              acceptanceCriteria: "Score >= 85, Canonical & Google Ads Safe đạt chuẩn",
              targetUrl: r.route,
            });
          }
        } catch {
          // ignore transient network error in audit
        }
      }
      if (technicalAuditedCount > 0) {
        writeMemoryFile("inventory.json", inv);
      }

      if (process.env.PAGESPEED_API_KEY) {
        try {
          const psi = await runPageSpeedCheck("https://gofpt.vn/", "mobile");
          if (psi.performanceScore !== null) {
            const baseline = readMemoryFile<SeoBaselineRecord | null>("baseline.json", null);
            if (baseline) {
              baseline.mobilePageSpeedScore = psi.performanceScore;
              writeMemoryFile("baseline.json", baseline);
            }
          }
        } catch {
          // non-blocking
        }
      }

      const latestSeo = getSeoConfig();
      if (latestSeo.autoPilotSettings) {
        latestSeo.autoPilotSettings.lastTechnicalAuditAt = new Date().toISOString();
        saveSeoConfig(latestSeo);
      }
    }

    // Image Pool Sync: Cập nhật kho ảnh từ fpt.vn (cache 24h)
    try {
      await syncFptVnImagePool(false);
    } catch {
      // non-blocking
    }
  }

  // 2. ANALYZE & AUTO-RESOLVE
  const syncRes = runSeoMasterCycle();
  let newApprovalsAdded = syncRes.newApprovalsAdded;

  // 3. AI EXECUTE (Onpage Optimization Agent + Content SEO Agent with AI Image Gen)
  const seoAfterSync = getSeoConfig();
  const autoPilot = seoAfterSync.autoPilotSettings || {
    enabled: true,
    autoApproveMeta: true,
    autoApproveArticles: true,
    autoGenerateImages: true,
    maxArticlesPerCycle: 1,
  };

  let draftedCount = 0;
  let contentErrorNote = "";
  if (runAi && isAiConfigured()) {
    const approvals = readMemoryFile<SeoApprovalItem[]>("approvals.json", []);
    const keywordsMap = readMemoryFile<SeoKeywordMapItem[]>("keywords.json", []);
    const competitors = readMemoryFile<SeoCompetitorRecord[]>("competitors.json", []);
    const lessons = readMemoryFile<SeoLessonEntry[]>("lessons.json", []).slice(0, 4).map((l) => l.lesson);

    // 3a. Onpage Optimization Agent: Up to 2 Quick-Win Meta proposals mapped to real routes
    const quickWins = (seoAfterSync.gscCache?.topQueries || []).filter(
      (q) => q.impressions >= 30 && q.position >= 4 && q.position <= 15
    );
    let metaProposalsCreated = 0;
    for (const targetQuery of quickWins) {
      if (metaProposalsCreated >= 2) break;
      const mappedKw = keywordsMap.find(
        (k) => k.keyword.toLowerCase() === targetQuery.query.toLowerCase()
      );
      const targetRoute = mappedKw?.targetUrl || "/lap-mang-fpt";

      const alreadyPending = approvals.some(
        (a) => a.status === "pending" && a.type === "meta_override" && a.target === targetRoute
      );
      if (alreadyPending) continue;

      const comp = competitors.find((c) =>
        c.keyword.toLowerCase().includes(targetQuery.query.toLowerCase()) ||
        targetQuery.query.toLowerCase().includes(c.keyword.toLowerCase())
      );
      const competitorTitles = (comp?.topDomains || []).map((d) => d.title).slice(0, 3);

      const currentMeta = seoAfterSync.pageMetaOverrides[targetRoute];
      const aiMeta = await generateMetaOptimizationProposal({
        route: targetRoute,
        query: targetQuery.query,
        position: targetQuery.position,
        impressions: targetQuery.impressions,
        ctr: targetQuery.ctr,
        currentTitle: currentMeta?.title || "Lắp Mạng FPT Cần Thơ Wi-Fi 6 Siêu Tốc",
        currentDesc: currentMeta?.description || "Đăng ký lắp mạng FPT Wi-Fi 6 từ 195.000đ/tháng, lắp đặt trong 24h.",
        competitorTitles,
        lessons,
      });
      if (aiMeta.success && aiMeta.title && aiMeta.description) {
        approvals.unshift({
          id: `app_ai_meta_${Date.now()}_${metaProposalsCreated}`,
          type: "meta_override",
          target: targetRoute,
          proposedBy: "Onpage Optimization Agent",
          summary: `AI tối ưu CTR cho "${targetQuery.query}" (Top ${targetQuery.position.toFixed(1)}): ${aiMeta.rationale || ""}`,
          beforeSnapshot: currentMeta || null,
          afterProposal: {
            title: aiMeta.title,
            description: aiMeta.description,
            keywords: targetQuery.query,
          },
          qaPassed: true,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
        newApprovalsAdded++;
        metaProposalsCreated++;
      }
    }

    // 3b. Content SEO Agent: Auto-draft 1 pending Content task (if none pending, run Keyword Spy first)
    const maxArticles = Math.max(0, Math.min(2, autoPilot.maxArticlesPerCycle ?? 1));
    if (maxArticles > 0) {
      let tasks = readMemoryFile<SeoTaskItem[]>("tasks.json", []);
      let pendingContentTasks = tasks.filter(
        (t) => t.status === "pending" && t.ownerAgent === "Content SEO Agent"
      );

      if (pendingContentTasks.length === 0 && autoPilot.enabled) {
        await runKeywordResearchNow();
        tasks = readMemoryFile<SeoTaskItem[]>("tasks.json", []);
        pendingContentTasks = tasks.filter(
          (t) => t.status === "pending" && t.ownerAgent === "Content SEO Agent"
        );
      }

      const knowledge = readMemoryFile<FptProductKnowledge | null>("fpt_knowledge.json", null);

      for (const task of pendingContentTasks) {
        if (draftedCount >= maxArticles) break;
        const areaMatch = task.title.match(/khu vực\s+(.+)$/i);
        const areaName = areaMatch ? areaMatch[1].trim() : "TP. Cần Thơ";
        const kwMatch = task.title.match(/từ khóa\s+"([^"]+)"/i);
        const keyword = kwMatch
          ? kwMatch[1].trim()
          : `lắp mạng fpt ${areaName.split(",")[0].replace(/^(Phường|Xã|Quận|Huyện|Thành phố|TP\.|Tỉnh)\s+/i, "").trim().toLowerCase()}`;

        const alreadyDrafted = approvals.some(
          (a) =>
            a.type === "article_draft" &&
            (a.status === "pending" || a.status === "approved") &&
            a.taskId === task.id
        );
        if (alreadyDrafted) continue;

        const draftRes = await generateSeoArticleDraft({
          keyword,
          areaName,
          knowledge,
          lessons,
          generateImage: autoPilot.autoGenerateImages !== false,
        });

        if (draftRes.success && draftRes.article) {
          approvals.unshift({
            id: `app_art_${Date.now()}_${draftedCount}`,
            taskId: task.id,
            type: "article_draft",
            target: `/tin-tuc/${draftRes.article.slug}`,
            proposedBy: "Content SEO Agent",
            summary: `AI tự soạn bài "${draftRes.article.title}" (${areaName}) — Ảnh: ${draftRes.article.imageGeneratedBy || "fallback"}`,
            beforeSnapshot: null,
            afterProposal: draftRes.article,
            qaPassed: true,
            qaNotes: "Đạt chuẩn Google Ads & NAP",
            status: "pending",
            createdAt: new Date().toISOString(),
          });
          task.status = "awaiting_approval";
          task.updatedAt = new Date().toISOString();
          newApprovalsAdded++;
          draftedCount++;
        } else if (draftRes.error) {
          contentErrorNote = `Content Agent lỗi: ${draftRes.error}`;
        }
      }
      if (draftedCount > 0) {
        writeMemoryFile("tasks.json", tasks);
      }
    }

    if (newApprovalsAdded > 0) {
      writeMemoryFile("approvals.json", approvals.slice(0, 100));
    }
  }

  // 4. AUTO-PILOT APPROVE & PUBLISH + INDEXNOW PING
  const publishedUrls: string[] = [];
  let googleSitemapSubmitted = false;
  let googleUrlsSubmitted = 0;
  if (autoPilot.enabled) {
    const pendingApprovals = readMemoryFile<SeoApprovalItem[]>("approvals.json", []).filter(
      (a) => a.status === "pending" && a.qaPassed
    );
    for (const item of pendingApprovals) {
      const shouldApprove =
        (item.type === "meta_override" && autoPilot.autoApproveMeta) ||
        (item.type === "article_draft" && autoPilot.autoApproveArticles);
      if (!shouldApprove) continue;

      const res = decideSeoApproval(item.id, "approve", "SEO Master Auto-Pilot");
      if (res.success) {
        autoApprovedCount++;
        publishedUrls.push(item.target);
        if (item.taskId) {
          const tasks = readMemoryFile<SeoTaskItem[]>("tasks.json", []);
          const linked = tasks.find((t) => t.id === item.taskId);
          if (linked) {
            linked.status = "completed";
            linked.updatedAt = new Date().toISOString();
            writeMemoryFile("tasks.json", tasks);
          }
        }
      }
    }

    if (publishedUrls.length > 0) {
      const notifyRes = await notifySearchEnginesOnPublish(publishedUrls);
      indexNowSubmitted = notifyRes.indexNowSubmitted;
      googleSitemapSubmitted = notifyRes.googleSitemapSubmitted;
      googleUrlsSubmitted = notifyRes.googleUrlsSubmitted;
    }
  }

  // 4b. Internal Link Agent: Tự động kiểm tra & bổ sung internal links cho bài đã xuất bản
  const ilRes = runInternalLinkAuditAndFix(Boolean(autoPilot.enabled));

  // 5. MEASURE & LEARN LOOP
  const newLessonsCount = runLearnLoop();

  return {
    ...syncRes,
    newApprovalsAdded,
    autoApprovedCount,
    gscSynced,
    serpCheckedCount,
    technicalAuditedCount,
    indexNowSubmitted,
    newLessonsCount,
    summary: `${syncRes.summary}${gscSynced ? " Đã đồng bộ GSC." : ""}${
      serpCheckedCount > 0 ? ` Check ${serpCheckedCount} từ khóa SERP.` : ""
    }${technicalAuditedCount > 0 ? ` Audit kỹ thuật ${technicalAuditedCount} trang.` : ""}${
      newApprovalsAdded > 0 ? ` AI tạo ${newApprovalsAdded} đề xuất.` : ""
    }${autoApprovedCount > 0 ? ` Auto-Pilot đã duyệt & xuất bản ${autoApprovedCount} mục.` : ""}${
      ilRes.fixedCount > 0 ? ` Bổ sung Internal Link cho ${ilRes.fixedCount} bài.` : ""
    }${indexNowSubmitted > 0 ? ` Đã gửi ${indexNowSubmitted} URL tới IndexNow.` : ""}${
      googleSitemapSubmitted ? " Đã gửi Sitemap lên Google." : ""
    }${googleUrlsSubmitted > 0 ? ` Đã ping ${googleUrlsSubmitted} URL tới Google Indexing API.` : ""}${
      newLessonsCount > 0 ? ` Rút ra ${newLessonsCount} bài học mới.` : ""
    }${contentErrorNote ? ` (${contentErrorNote})` : ""}`,
  };
}

export function getFullSeoIntelligenceState() {
  initializeSeoMemory();
  const seo = getSeoConfig();
  return {
    inventory: readMemoryFile<SeoInventoryItem[]>("inventory.json", []),
    keywords: readMemoryFile<SeoKeywordMapItem[]>("keywords.json", []),
    baseline: readMemoryFile<SeoBaselineRecord | null>("baseline.json", null),
    competitors: readMemoryFile<SeoCompetitorRecord[]>("competitors.json", []),
    fptKnowledge: readMemoryFile<FptProductKnowledge | null>("fpt_knowledge.json", null),
    tasks: readMemoryFile<SeoTaskItem[]>("tasks.json", []),
    approvals: readMemoryFile<SeoApprovalItem[]>("approvals.json", []),
    changes: readMemoryFile<SeoChangeRecord[]>("changes.json", []),
    performance: readMemoryFile<SeoPerformanceEntry[]>("performance.json", []),
    lessons: readMemoryFile<SeoLessonEntry[]>("lessons.json", []),
    apiUsage: readMemoryFile<SeoApiUsageStore | null>("api_usage.json", null),
    agents: getAgentRoster(),
    conversions: getAnonymizedConversionSummary(),
    connections: {
      gscConnected: Boolean(seo.gscSettings?.connected),
      serperConnected: Boolean(seo.serperSettings?.connected),
      ga4Configured: Boolean(seo.ga4PropertyId || process.env.GA4_PROPERTY_ID || process.env.NEXT_PUBLIC_GA4_ID),
      geminiConfigured: isGeminiConfigured(),
      aiConfigured: isAiConfigured(),
    },
    ga4PropertyId: seo.ga4PropertyId || process.env.GA4_PROPERTY_ID || "",
    ga4Cache: seo.ga4Cache || null,
    gscServiceAccountEmail: seo.gscSettings?.serviceAccountEmail || "",
    autoPilotSettings: seo.autoPilotSettings,
  };
}

export function decideSeoApproval(
  approvalId: string,
  decision: "approve" | "reject",
  appliedBy = "Admin Approval"
): { success: boolean; message: string } {
  const approvals = readMemoryFile<SeoApprovalItem[]>("approvals.json", []);
  const item = approvals.find((a) => a.id === approvalId);
  if (!item) {
    return { success: false, message: "Không tìm thấy đề xuất cần duyệt." };
  }
  if (item.status !== "pending") {
    return { success: false, message: "Đề xuất này đã được xử lý trước đó." };
  }

  if (decision === "reject") {
    item.status = "rejected";
    item.decidedAt = new Date().toISOString();
    writeMemoryFile("approvals.json", approvals);
    return { success: true, message: "Đã từ chối đề xuất." };
  }

  // Re-validate with QA Gate before applying
  if (item.type === "meta_override") {
    const proposal = item.afterProposal || {};
    const qa = runQaSafetyCheck({
      title: proposal.title,
      description: proposal.description,
    });
    if (!qa.passed) {
      return {
        success: false,
        message: `QA & Safety Agent chặn duyệt: ${qa.violations.join(" ")}`,
      };
    }

    const seo = getSeoConfig();
    const beforeSnapshot = seo.pageMetaOverrides[item.target] || null;
    seo.pageMetaOverrides[item.target] = {
      route: item.target,
      title: proposal.title || "",
      description: proposal.description || "",
      keywords: proposal.keywords || "",
      updatedAt: new Date().toISOString(),
    };
    saveSeoConfig(seo);

    const changes = readMemoryFile<SeoChangeRecord[]>("changes.json", []);
    changes.unshift({
      id: `chg_${Date.now()}`,
      approvalId: item.id,
      target: item.target,
      changeType: "meta_override",
      beforeSnapshot,
      afterSnapshot: seo.pageMetaOverrides[item.target],
      appliedBy,
      appliedAt: new Date().toISOString(),
    });
    writeMemoryFile("changes.json", changes.slice(0, 100));
  } else if (item.type === "article_draft") {
    const draft = item.afterProposal || {};
    const qa = runQaSafetyCheck({
      title: draft.title,
      description: draft.excerpt,
      contentHtml: draft.content,
    });
    if (!qa.passed) {
      return {
        success: false,
        message: `QA & Safety Agent chặn xuất bản: ${qa.violations.join(" ")}`,
      };
    }

    const articles = getAllArticles(true);
    const nowIso = new Date().toISOString();
    const newArticle: Article = {
      id: `art-ai-${Date.now()}`,
      slug: String(draft.slug || `bai-viet-seo-${Date.now()}`),
      title: String(draft.title || ""),
      excerpt: String(draft.excerpt || ""),
      content: String(draft.content || ""),
      category: draft.category || "huong-dan",
      categoryName: draft.categoryName || "Hướng Dẫn Kỹ Thuật",
      thumbnail: draft.thumbnail || pickThumbnail(String(draft.title || draft.slug || ""), draft.category),
      author: "FPT Telecom Cần Thơ",
      published: true,
      featured: false,
      views: 1,
      readTimeMinutes: 4,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const filtered = articles.filter((a) => a.slug !== newArticle.slug);
    saveAllArticles([newArticle, ...filtered]);

    const changes = readMemoryFile<SeoChangeRecord[]>("changes.json", []);
    changes.unshift({
      id: `chg_${Date.now()}`,
      approvalId: item.id,
      target: `/tin-tuc/${newArticle.slug}`,
      changeType: "article_draft",
      beforeSnapshot: null,
      afterSnapshot: { id: newArticle.id, slug: newArticle.slug, title: newArticle.title },
      appliedBy,
      appliedAt: nowIso,
    });
    writeMemoryFile("changes.json", changes.slice(0, 100));
  }

  item.status = "approved";
  item.decidedAt = new Date().toISOString();
  writeMemoryFile("approvals.json", approvals);
  if (appliedBy === "Admin Approval") {
    void notifySearchEnginesOnPublish([item.target]);
  }
  return { success: true, message: "Đã phê duyệt, gửi Google/IndexNow và lưu bản sao khôi phục vào Change History!" };
}

export function rollbackSeoChange(changeId: string): { success: boolean; message: string } {
  const changes = readMemoryFile<SeoChangeRecord[]>("changes.json", []);
  const chg = changes.find((c) => c.id === changeId);
  if (!chg) {
    return { success: false, message: "Không tìm thấy bản ghi thay đổi." };
  }
  if (chg.rolledBack) {
    return { success: false, message: "Thay đổi này đã được khôi phục trước đó." };
  }

  if (chg.changeType === "meta_override") {
    const seo = getSeoConfig();
    if (chg.beforeSnapshot) {
      seo.pageMetaOverrides[chg.target] = chg.beforeSnapshot;
    } else {
      delete seo.pageMetaOverrides[chg.target];
    }
    saveSeoConfig(seo);
  } else if (chg.changeType === "article_draft") {
    const slug = chg.afterSnapshot?.slug || chg.target.replace(/^\/tin-tuc\//, "");
    const articles = getAllArticles(true);
    saveAllArticles(articles.filter((a) => a.slug !== slug));
  }

  chg.rolledBack = true;
  chg.rolledBackAt = new Date().toISOString();
  writeMemoryFile("changes.json", changes);

  return { success: true, message: `Đã khôi phục thành công cấu hình trước đó cho ${chg.target}!` };
}

export async function dispatchTelegramSeoSummary(): Promise<boolean> {
  const state = getFullSeoIntelligenceState();
  const pendingTasks = state.tasks.filter((t) => t.status === "pending").slice(0, 3);
  const seo = getSeoConfig();

  return sendSeoReportAlert({
    summaryTitle: "Tổng Hợp Hệ Thống AI SEO GoFPT.vn",
    totalClicks: seo.gscCache?.totals.clicks,
    totalImpressions: seo.gscCache?.totals.impressions,
    avgPosition: seo.gscCache?.totals.position,
    highlights: [
      `Tổng URL đang theo dõi: ${state.inventory.length}`,
      `Từ khóa trong Mapping: ${state.keywords.length}`,
      `Lead từ Organic Search: ${state.conversions.organicLeads}/${state.conversions.totalLeads}`,
    ],
    actionItems: pendingTasks.map((t) => `[${t.priority}] ${t.title}`),
  });
}
