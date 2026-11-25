import fs from "fs";
import path from "path";
import { siteConfig } from "@/config/siteConfig";

export const SEO_MEMORY_DIR = path.join(process.cwd(), "data", "seo-memory");

export type AgentName =
  | "SEO Master Agent"
  | "Technical SEO Agent"
  | "Keyword & Competitor Research Agent"
  | "Content SEO Agent"
  | "Onpage Optimization Agent"
  | "Authority & Local SEO Agent"
  | "Analytics Agent"
  | "QA & Safety Agent";

export interface SeoInventoryItem {
  url: string;
  route: string;
  type: "static" | "ssg" | "dynamic";
  indexable: boolean;
  hasCanonical: boolean;
  title?: string;
  description?: string;
  lastAuditedAt?: string;
  score?: number;
  googleAdsSafe?: boolean;
}

export interface SeoKeywordMapItem {
  id: string;
  keyword: string;
  targetUrl: string;
  intent: "transactional" | "local" | "informational";
  priority: "P0" | "P1" | "P2";
  currentPosition: number | null;
  lastCheckedAt?: string;
}

export interface SeoBaselineRecord {
  capturedAt: string;
  totalOrganicClicks28d: number;
  totalOrganicImpressions28d: number;
  avgPosition28d: number | null;
  totalOrganicLeads30d: number;
  mobilePageSpeedScore: number | null;
  desktopPageSpeedScore: number | null;
}

export interface SeoCompetitorRecord {
  keyword: string;
  checkedAt: string;
  topDomains: { position: number; domain: string; title: string; link: string }[];
}

export interface FptProductKnowledge {
  brandName: string;
  domain: string;
  hotline: string;
  zaloUrl: string;
  supportEmail: string;
  address: string;
  serviceAreas: string[];
  packages: { name: string; price: string; speed: string; highlight: string }[];
  policyNotice: string;
  syncedAt: string;
}

export interface SeoTaskItem {
  id: string;
  dedupKey: string;
  title: string;
  ownerAgent: AgentName;
  priority: "P0" | "P1" | "P2";
  status: "pending" | "in_progress" | "awaiting_approval" | "completed" | "rejected_by_qa" | "failed";
  evidence: string;
  estimatedCost: string;
  acceptanceCriteria: string;
  targetUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeoApprovalItem {
  id: string;
  taskId?: string;
  type: "meta_override" | "article_draft" | "technical_fix";
  target: string;
  proposedBy: AgentName;
  summary: string;
  beforeSnapshot: any;
  afterProposal: any;
  qaPassed: boolean;
  qaNotes?: string;
  status: "pending" | "approved" | "rejected" | "rolled_back";
  createdAt: string;
  decidedAt?: string;
}

export interface SeoChangeRecord {
  id: string;
  approvalId?: string;
  target: string;
  changeType: string;
  beforeSnapshot: any;
  afterSnapshot: any;
  appliedBy: string;
  appliedAt: string;
  rolledBack?: boolean;
  rolledBackAt?: string;
}

export interface SeoPerformanceEntry {
  date: string;
  clicks: number;
  impressions: number;
  avgPosition: number | null;
  organicSessions: number;
  organicLeads: number;
}

export interface SeoLessonEntry {
  id: string;
  category: string;
  lesson: string;
  evidence: string;
  createdAt: string;
}

export interface SeoApiUsageStore {
  monthKey: string;
  dayKey: string;
  dailyCounts: Record<string, number>;
  monthlyCounts: Record<string, number>;
  dailyLimits: Record<string, number>;
}

function ensureSeoMemoryDir(): void {
  if (!fs.existsSync(SEO_MEMORY_DIR)) {
    fs.mkdirSync(SEO_MEMORY_DIR, { recursive: true });
  }
}

export function readMemoryFile<T>(filename: string, fallback: T): T {
  ensureSeoMemoryDir();
  const filePath = path.join(SEO_MEMORY_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

export function writeMemoryFile<T>(filename: string, data: T): void {
  ensureSeoMemoryDir();
  const filePath = path.join(SEO_MEMORY_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function getDefaultFptKnowledge(): FptProductKnowledge {
  return {
    brandName: siteConfig.brand.name,
    domain: siteConfig.brand.domain,
    hotline: siteConfig.contact.hotlineDisplay,
    zaloUrl: siteConfig.contact.zaloUrl,
    supportEmail: "PhucNT51@fpt.com",
    address: "Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ",
    serviceAreas: [
      "Quận Ninh Kiều, Cần Thơ",
      "Quận Cái Răng, Cần Thơ",
      "Quận Bình Thủy, Cần Thơ",
      "Quận Ô Môn, Cần Thơ",
      "Quận Thốt Nốt, Cần Thơ",
      "Huyện Phong Điền, Cần Thơ",
      "Tỉnh Sóc Trăng",
      "Tỉnh Hậu Giang",
    ],
    packages: [
      ...siteConfig.packages.internet,
      ...siteConfig.packages.combo,
      ...siteConfig.packages.camera,
    ].map((p) => ({
      name: p.name,
      price: p.priceDisplay,
      speed: p.speed,
      highlight: p.idealFor || p.badge || "",
    })),
    policyNotice: siteConfig.disclaimer.officialDisclaimer,
    syncedAt: new Date().toISOString(),
  };
}

function getDefaultKeywords(): SeoKeywordMapItem[] {
  return [
    {
      id: "kw-lap-mang-fpt-can-tho",
      keyword: "lắp mạng fpt cần thơ",
      targetUrl: "/lap-mang-fpt",
      intent: "local",
      priority: "P0",
      currentPosition: null,
    },
    {
      id: "kw-lap-mang-fpt",
      keyword: "lắp mạng fpt",
      targetUrl: "/",
      intent: "transactional",
      priority: "P0",
      currentPosition: null,
    },
    {
      id: "kw-combo-ngoai-hang-anh-fpt",
      keyword: "combo ngoại hạng anh fpt",
      targetUrl: "/combo-ngoai-hang-anh",
      intent: "transactional",
      priority: "P0",
      currentPosition: null,
    },
    {
      id: "kw-bang-gia-cuoc-fpt",
      keyword: "bảng giá cước fpt",
      targetUrl: "/bang-gia",
      intent: "transactional",
      priority: "P1",
      currentPosition: null,
    },
    {
      id: "kw-wifi-6-fpt",
      keyword: "wifi 6 fpt",
      targetUrl: "/wifi-6",
      intent: "informational",
      priority: "P1",
      currentPosition: null,
    },
    {
      id: "kw-fpt-ninh-kieu",
      keyword: "lắp mạng fpt ninh kiều",
      targetUrl: "/tin-tuc/lap-mang-fpt-ninh-kieu-can-tho",
      intent: "local",
      priority: "P0",
      currentPosition: null,
    },
    {
      id: "kw-fpt-cai-rang",
      keyword: "lắp mạng fpt cái răng",
      targetUrl: "/tin-tuc/lap-mang-fpt-cai-rang-can-tho",
      intent: "local",
      priority: "P1",
      currentPosition: null,
    },
    {
      id: "kw-fpt-binh-thuy",
      keyword: "lắp mạng fpt bình thủy",
      targetUrl: "/tin-tuc/lap-mang-fpt-binh-thuy-can-tho",
      intent: "local",
      priority: "P1",
      currentPosition: null,
    },
    {
      id: "kw-fpt-soc-trang",
      keyword: "lắp mạng fpt sóc trăng",
      targetUrl: "/tin-tuc/lap-mang-fpt-soc-trang",
      intent: "local",
      priority: "P0",
      currentPosition: null,
    },
    {
      id: "kw-fpt-hau-giang",
      keyword: "lắp mạng fpt hậu giang",
      targetUrl: "/tin-tuc/lap-mang-fpt-hau-giang",
      intent: "local",
      priority: "P1",
      currentPosition: null,
    },
    {
      id: "kw-fpt-o-mon",
      keyword: "lắp mạng fpt ô môn",
      targetUrl: "/tin-tuc/lap-mang-fpt-o-mon-can-tho",
      intent: "local",
      priority: "P1",
      currentPosition: null,
    },
    {
      id: "kw-fpt-thot-not",
      keyword: "lắp mạng fpt thốt nốt",
      targetUrl: "/tin-tuc/lap-mang-fpt-thot-not-can-tho",
      intent: "local",
      priority: "P1",
      currentPosition: null,
    },
  ];
}

export function initializeSeoMemory(): void {
  readMemoryFile<SeoInventoryItem[]>("inventory.json", []);
  readMemoryFile<SeoKeywordMapItem[]>("keywords.json", getDefaultKeywords());
  readMemoryFile<SeoBaselineRecord | null>("baseline.json", null);
  readMemoryFile<SeoCompetitorRecord[]>("competitors.json", []);
  writeMemoryFile<FptProductKnowledge>("fpt_knowledge.json", getDefaultFptKnowledge());
  readMemoryFile<SeoTaskItem[]>("tasks.json", []);
  readMemoryFile<SeoApprovalItem[]>("approvals.json", []);
  readMemoryFile<SeoChangeRecord[]>("changes.json", []);
  readMemoryFile<SeoPerformanceEntry[]>("performance.json", []);
  readMemoryFile<SeoLessonEntry[]>("lessons.json", [
    {
      id: "lesson-init-1",
      category: "Google Ads & Editorial",
      lesson:
        "Bài viết tin tức sử dụng bố cục Clean & Minimal Editorial (H2 cam, H3 đen đậm, nền sáng, bảng thanh lịch) và tránh từ cấm Google Ads ('tuyệt đối', 'trọn đời').",
      evidence: "AGENTS.md & Commit 8cffc1a",
      createdAt: new Date().toISOString(),
    },
  ]);

  const now = new Date();
  const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const dayKey = vnTime.toISOString().slice(0, 10);
  const monthKey = dayKey.slice(0, 7);

  readMemoryFile<SeoApiUsageStore>("api_usage.json", {
    monthKey,
    dayKey,
    dailyCounts: {},
    monthlyCounts: {},
    dailyLimits: { serper: 30, pagespeed: 20, gsc: 50, ga4: 50, ai_llm: 20 },
  });
}

export function enqueueSeoTask(
  input: Omit<SeoTaskItem, "id" | "createdAt" | "updatedAt" | "status">
): { added: boolean; task: SeoTaskItem } {
  const tasks = readMemoryFile<SeoTaskItem[]>("tasks.json", []);
  const existing = tasks.find(
    (t) =>
      t.dedupKey === input.dedupKey &&
      (t.status === "pending" || t.status === "in_progress" || t.status === "awaiting_approval")
  );
  if (existing) {
    return { added: false, task: existing };
  }

  const now = new Date().toISOString();
  const newTask: SeoTaskItem = {
    ...input,
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  tasks.unshift(newTask);
  writeMemoryFile("tasks.json", tasks.slice(0, 200));
  return { added: true, task: newTask };
}

export function checkAndIncrementApiUsage(provider: string): {
  allowed: boolean;
  usedToday: number;
  limitToday: number;
} {
  const now = new Date();
  const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const dayKey = vnTime.toISOString().slice(0, 10);
  const monthKey = dayKey.slice(0, 7);

  const usage = readMemoryFile<SeoApiUsageStore>("api_usage.json", {
    monthKey,
    dayKey,
    dailyCounts: {},
    monthlyCounts: {},
    dailyLimits: { serper: 30, pagespeed: 20, gsc: 50, ga4: 50, ai_llm: 20 },
  });

  if (usage.dayKey !== dayKey) {
    usage.dayKey = dayKey;
    usage.dailyCounts = {};
  }
  if (usage.monthKey !== monthKey) {
    usage.monthKey = monthKey;
    usage.monthlyCounts = {};
  }

  const limitToday = usage.dailyLimits[provider] ?? 50;
  const usedToday = usage.dailyCounts[provider] ?? 0;

  if (usedToday >= limitToday) {
    return { allowed: false, usedToday, limitToday };
  }

  usage.dailyCounts[provider] = usedToday + 1;
  usage.monthlyCounts[provider] = (usage.monthlyCounts[provider] ?? 0) + 1;
  writeMemoryFile("api_usage.json", usage);
  return { allowed: true, usedToday: usedToday + 1, limitToday };
}
