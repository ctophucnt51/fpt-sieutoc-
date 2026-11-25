import fs from "fs";
import path from "path";

export interface DailyTrafficBucket {
  date: string; // YYYY-MM-DD (UTC+7 / VN)
  pageviews: number;
  sessions: number;
  mobile: number;
  desktop: number;
  sources: Record<string, number>;
  pages: Record<string, number>;
}

export interface RecentVisit {
  id: string;
  timestamp: string;
  path: string;
  source: string;
  device: "mobile" | "desktop";
  campaign?: string;
}

export interface TrafficStore {
  daily: Record<string, DailyTrafficBucket>;
  recent: RecentVisit[];
}

const PERSISTENT_DIR = path.join(process.cwd(), "data");
const TRAFFIC_FILE = path.join(PERSISTENT_DIR, "traffic-stats.json");
const MAX_DAYS = 90;
const MAX_RECENT = 80;

function ensureTrafficFile(): void {
  if (!fs.existsSync(PERSISTENT_DIR)) {
    fs.mkdirSync(PERSISTENT_DIR, { recursive: true });
  }
  if (!fs.existsSync(TRAFFIC_FILE)) {
    const initial: TrafficStore = { daily: {}, recent: [] };
    fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

function getVnDateKey(date = new Date()): string {
  // UTC+7 Vietnam date YYYY-MM-DD
  const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return vnTime.toISOString().slice(0, 10);
}

export function readTrafficStore(): TrafficStore {
  ensureTrafficFile();
  try {
    const raw = fs.readFileSync(TRAFFIC_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      daily: parsed?.daily && typeof parsed.daily === "object" ? parsed.daily : {},
      recent: Array.isArray(parsed?.recent) ? parsed.recent : [],
    };
  } catch {
    return { daily: {}, recent: [] };
  }
}

export function recordPageview(input: {
  path: string;
  source: string;
  device: "mobile" | "desktop";
  isNewSession: boolean;
  campaign?: string;
}): void {
  ensureTrafficFile();
  const store = readTrafficStore();
  const dateKey = getVnDateKey();

  const bucket: DailyTrafficBucket = store.daily[dateKey] || {
    date: dateKey,
    pageviews: 0,
    sessions: 0,
    mobile: 0,
    desktop: 0,
    sources: {},
    pages: {},
  };

  bucket.pageviews += 1;
  if (input.isNewSession) {
    bucket.sessions += 1;
  }
  if (input.device === "mobile") {
    bucket.mobile += 1;
  } else {
    bucket.desktop += 1;
  }

  bucket.sources[input.source] = (bucket.sources[input.source] || 0) + 1;
  bucket.pages[input.path] = (bucket.pages[input.path] || 0) + 1;
  store.daily[dateKey] = bucket;

  // Keep only last MAX_DAYS
  const sortedDates = Object.keys(store.daily).sort().reverse();
  if (sortedDates.length > MAX_DAYS) {
    for (const oldDate of sortedDates.slice(MAX_DAYS)) {
      delete store.daily[oldDate];
    }
  }

  const visit: RecentVisit = {
    id: `pv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    path: input.path,
    source: input.source,
    device: input.device,
    campaign: input.campaign,
  };

  store.recent = [visit, ...store.recent].slice(0, MAX_RECENT);
  fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(store, null, 2), "utf8");
}

export function clearTrafficStore(): void {
  ensureTrafficFile();
  const empty: TrafficStore = { daily: {}, recent: [] };
  fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(empty, null, 2), "utf8");
}
