import fs from "fs";
import path from "path";

export interface WatchlistKeyword {
  id: string;
  keyword: string;
  targetUrl: string;
  lastPosition: number | null;
  previousPosition: number | null;
  clicks: number;
  impressions: number;
  ctr: number;
  matchedQuery?: string;
  updatedAt?: string;
}

export interface GscQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscPageRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscCacheData {
  dateRange: "7d" | "28d" | "90d";
  startDate: string;
  endDate: string;
  totals: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
  topQueries: GscQueryRow[];
  topPages: GscPageRow[];
  fetchedAt: string;
}

export interface PageMetaOverride {
  route: string;
  title: string;
  description: string;
  keywords: string;
  updatedAt: string;
}

export interface SeoConfigData {
  gscSettings: {
    siteUrl: string;
    serviceAccountEmail: string;
    privateKey: string;
    connected: boolean;
    lastSyncedAt?: string;
    lastError?: string;
  };
  watchlistKeywords: WatchlistKeyword[];
  pageMetaOverrides: Record<string, PageMetaOverride>;
  gscCache: GscCacheData | null;
}

const PERSISTENT_DIR = path.join(process.cwd(), "data");
const SEO_FILE = path.join(PERSISTENT_DIR, "seoConfig.json");

const defaultSeoConfig: SeoConfigData = {
  gscSettings: {
    siteUrl: "https://gofpt.vn/",
    serviceAccountEmail: "",
    privateKey: "",
    connected: false,
  },
  watchlistKeywords: [
    {
      id: "kw-1",
      keyword: "lắp mạng fpt cần thơ",
      targetUrl: "/lap-mang-fpt",
      lastPosition: null,
      previousPosition: null,
      clicks: 0,
      impressions: 0,
      ctr: 0,
    },
    {
      id: "kw-2",
      keyword: "lắp wifi fpt",
      targetUrl: "/",
      lastPosition: null,
      previousPosition: null,
      clicks: 0,
      impressions: 0,
      ctr: 0,
    },
    {
      id: "kw-3",
      keyword: "combo ngoại hạng anh fpt",
      targetUrl: "/combo-ngoai-hang-anh",
      lastPosition: null,
      previousPosition: null,
      clicks: 0,
      impressions: 0,
      ctr: 0,
    },
    {
      id: "kw-4",
      keyword: "camera fpt ai",
      targetUrl: "/camera-fpt",
      lastPosition: null,
      previousPosition: null,
      clicks: 0,
      impressions: 0,
      ctr: 0,
    },
    {
      id: "kw-5",
      keyword: "bảng giá cước fpt",
      targetUrl: "/bang-gia",
      lastPosition: null,
      previousPosition: null,
      clicks: 0,
      impressions: 0,
      ctr: 0,
    },
    {
      id: "kw-6",
      keyword: "wifi 6 fpt",
      targetUrl: "/wifi-6",
      lastPosition: null,
      previousPosition: null,
      clicks: 0,
      impressions: 0,
      ctr: 0,
    },
  ],
  pageMetaOverrides: {},
  gscCache: null,
};

function ensureSeoFile(): void {
  if (!fs.existsSync(PERSISTENT_DIR)) {
    fs.mkdirSync(PERSISTENT_DIR, { recursive: true });
  }
  if (!fs.existsSync(SEO_FILE)) {
    fs.writeFileSync(SEO_FILE, JSON.stringify(defaultSeoConfig, null, 2), "utf8");
  }
}

export function getSeoConfig(): SeoConfigData {
  ensureSeoFile();
  try {
    const raw = fs.readFileSync(SEO_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...defaultSeoConfig,
      ...parsed,
      gscSettings: {
        ...defaultSeoConfig.gscSettings,
        ...(parsed.gscSettings || {}),
      },
      watchlistKeywords: Array.isArray(parsed.watchlistKeywords)
        ? parsed.watchlistKeywords
        : defaultSeoConfig.watchlistKeywords,
      pageMetaOverrides: parsed.pageMetaOverrides || {},
      gscCache: parsed.gscCache || null,
    };
  } catch (err) {
    console.error("Error reading seoConfig.json:", err);
    return defaultSeoConfig;
  }
}

export function saveSeoConfig(next: SeoConfigData): SeoConfigData {
  ensureSeoFile();
  fs.writeFileSync(SEO_FILE, JSON.stringify(next, null, 2), "utf8");
  return next;
}

export function getPublicSafeSeoConfig(data: SeoConfigData) {
  return {
    gscSettings: {
      siteUrl: data.gscSettings.siteUrl,
      serviceAccountEmail: data.gscSettings.serviceAccountEmail,
      hasPrivateKey: Boolean(data.gscSettings.privateKey && data.gscSettings.privateKey.length > 20),
      connected: data.gscSettings.connected,
      lastSyncedAt: data.gscSettings.lastSyncedAt,
      lastError: data.gscSettings.lastError,
    },
    watchlistKeywords: data.watchlistKeywords,
    pageMetaOverrides: data.pageMetaOverrides,
    gscCache: data.gscCache,
  };
}
