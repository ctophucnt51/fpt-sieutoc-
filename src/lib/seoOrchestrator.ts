import { AUDITED_ROUTES, runQaSafetyCheck } from "./seoAuditor";
import { getAllArticles } from "./articleStorage";
import { getSeoConfig, saveSeoConfig } from "./seoStorage";
import { readTrafficStore } from "./trafficStorage";
import { getAllLeads } from "./leadStorage";
import { sendSeoReportAlert } from "./telegram";
import {
  initializeSeoMemory,
  readMemoryFile,
  writeMemoryFile,
  enqueueSeoTask,
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

  return [
    {
      id: "agent-master",
      name: "SEO Master Agent",
      role: "Điều phối 8 bước: Collect → Analyze → Prioritize → Plan → Execute → Validate → Measure → Learn",
      scope: "data/seo-memory/* & Task Queue",
      permissions: "Read/Write Memory, Dispatch Tasks (Không tự sửa code/URL prod)",
      status: "active",
    },
    {
      id: "agent-technical",
      name: "Technical SEO Agent",
      role: "Audit Canonical, Robots, Sitemap, HTTP Status & Core Web Vitals",
      scope: "Routes SSG/Static, sitemap.ts, robots.ts",
      permissions: "Read-only Code, Propose fixes via Approval Center",
      status: "ready",
    },
    {
      id: "agent-research",
      name: "Keyword & Competitor Research Agent",
      role: "Quét Top 3 đối thủ Cần Thơ/Sóc Trăng/Hậu Giang & quản lý Keyword Mapping",
      scope: "GSC Queries, Serper.dev SERP, keywords.json",
      permissions: "Read/Write keywords.json & competitors.json (Untrusted HTML/Snippet guard)",
      status: hasSerper || hasGsc ? "active" : "waiting_config",
    },
    {
      id: "agent-content",
      name: "Content SEO Agent",
      role: "Biên tập bài viết chuẩn Clean & Minimal Editorial dựa trên fpt_knowledge.json",
      scope: "articles.json (Draft / Approval Queue)",
      permissions: "Tạo bản nháp & đề xuất (Cấm tự bịa giá/khuyến mãi)",
      status: "ready",
    },
    {
      id: "agent-onpage",
      name: "Onpage Optimization Agent",
      role: "Tối ưu Title, Meta Description, Schema & Internal Links cho trang CTR thấp",
      scope: "pageMetaOverrides (seoConfig.json)",
      permissions: "Chỉ áp dụng sau khi duyệt qua Approval Center + Snapshot Rollback",
      status: hasGsc ? "active" : "waiting_config",
    },
    {
      id: "agent-local",
      name: "Authority & Local SEO Agent",
      role: "Kiểm tra nhất quán NAP (Số 10 Phan Văn Trị, 0878 800 400, PhucNT51@fpt.com) & Local SEO",
      scope: "LocalBusiness Schema & Cụm bài Cần Thơ–Sóc Trăng–Hậu Giang",
      permissions: "Read-only Audit (Cấm spam backlink / đánh giá giả)",
      status: "ready",
    },
    {
      id: "agent-analytics",
      name: "Analytics Agent",
      role: "Tổng hợp GSC + Traffic Organic + Lead chuyển đổi ẩn danh (không PII)",
      scope: "GSC API, traffic-stats.json, leads.json (ẩn danh)",
      permissions: "Read-only Analytics (Cấm xuất SĐT/tên khách vào log/LLM)",
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

  // 1. COLLECT: Rebuild inventory.json from real routes + articles
  const inventory: SeoInventoryItem[] = [
    ...AUDITED_ROUTES.map((r) => ({
      url: `https://gofpt.vn${r.route === "/" ? "" : r.route}`,
      route: r.route,
      type: (r.route === "/tin-tuc" ? "dynamic" : "static") as "static" | "dynamic",
      indexable: true,
      hasCanonical: true,
      title: seo.pageMetaOverrides?.[r.route]?.title || r.name,
      description: seo.pageMetaOverrides?.[r.route]?.description || "",
    })),
    ...articles.map((a) => ({
      url: `https://gofpt.vn/tin-tuc/${a.slug}`,
      route: `/tin-tuc/${a.slug}`,
      type: "ssg" as const,
      indexable: a.published,
      hasCanonical: true,
      title: a.title,
      description: a.excerpt,
    })),
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

  // Check Local SEO gaps
  const localAreas = [
    { slugHint: "ninh-kieu", name: "Quận Ninh Kiều, Cần Thơ" },
    { slugHint: "cai-rang", name: "Quận Cái Răng, Cần Thơ" },
    { slugHint: "binh-thuy", name: "Quận Bình Thủy, Cần Thơ" },
    { slugHint: "soc-trang", name: "Thành phố Sóc Trăng" },
    { slugHint: "hau-giang", name: "Tỉnh Hậu Giang" },
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
  for (const art of articles) {
    const qa = runQaSafetyCheck({
      title: art.title,
      description: art.excerpt,
      contentHtml: art.content,
    });
    if (!qa.passed) {
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
    if ((t.status === "pending" || t.status === "in_progress") && resolvedDedupKeys.has(t.dedupKey)) {
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
      ga4Configured: Boolean(process.env.NEXT_PUBLIC_GA4_ID),
    },
  };
}

export function decideSeoApproval(
  approvalId: string,
  decision: "approve" | "reject"
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
      appliedBy: "Admin Approval",
      appliedAt: new Date().toISOString(),
    });
    writeMemoryFile("changes.json", changes.slice(0, 100));
  }

  item.status = "approved";
  item.decidedAt = new Date().toISOString();
  writeMemoryFile("approvals.json", approvals);
  return { success: true, message: "Đã phê duyệt và lưu bản sao khôi phục vào Change History!" };
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
