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
  sourceDetail?: string;
  device: "mobile" | "desktop";
  browser?: string;
  os?: string;
  networkType?: string;
  durationSeconds?: number;
  actions?: string[];
  ip?: string;
  location?: string;
  campaign?: string;
  term?: string;
  sessionId?: string;
  gclid?: string;
  visitorId?: string;
}

export interface FraudBlockPolicy {
  blockForm: boolean;
  blockCall: boolean;
  blockZalo: boolean;
}

export const DEFAULT_FRAUD_POLICY: FraudBlockPolicy = {
  blockForm: true,
  blockCall: true,
  blockZalo: true,
};

export interface SuspiciousIpReport {
  ip: string;
  targetType?: "ip" | "visitor";
  visitorId?: string;
  visitorIds?: string[];
  ips?: string[];
  location: string;
  totalAdsClicks: number;
  uniqueGclids: number;
  uniqueSessions: number;
  uniqueVisitors: number;
  keywords: string[];
  campaigns: string[];
  device: string;
  firstSeen: string;
  lastSeen: string;
  conversionActions?: string[];
  hasConversion?: boolean;
  riskLevel: "high" | "medium";
  status: "pending" | "blocked" | "whitelisted";
}

export interface TrafficStore {
  daily: Record<string, DailyTrafficBucket>;
  recent: RecentVisit[];
  alertedIps?: Record<string, string>;
  blockedIps?: string[];
  whitelistedIps?: string[];
  blockedVisitors?: string[];
  whitelistedVisitors?: string[];
  fraudPolicy?: FraudBlockPolicy;
}

const PERSISTENT_DIR = path.join(process.cwd(), "data");
const TRAFFIC_FILE = path.join(PERSISTENT_DIR, "traffic-stats.json");
const MAX_DAYS = 90;
const MAX_RECENT = 500;

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
      alertedIps:
        parsed?.alertedIps && typeof parsed.alertedIps === "object"
          ? parsed.alertedIps
          : {},
      blockedIps: Array.isArray(parsed?.blockedIps) ? parsed.blockedIps : [],
      whitelistedIps: Array.isArray(parsed?.whitelistedIps) ? parsed.whitelistedIps : [],
      blockedVisitors: Array.isArray(parsed?.blockedVisitors) ? parsed.blockedVisitors : [],
      whitelistedVisitors: Array.isArray(parsed?.whitelistedVisitors)
        ? parsed.whitelistedVisitors
        : [],
      fraudPolicy: {
        ...DEFAULT_FRAUD_POLICY,
        ...(parsed?.fraudPolicy && typeof parsed.fraudPolicy === "object"
          ? parsed.fraudPolicy
          : {}),
      },
    };
  } catch {
    return {
      daily: {},
      recent: [],
      alertedIps: {},
      blockedIps: [],
      whitelistedIps: [],
      blockedVisitors: [],
      whitelistedVisitors: [],
      fraudPolicy: { ...DEFAULT_FRAUD_POLICY },
    };
  }
}

export interface ClickFraudTrigger {
  ip: string;
  location: string;
  totalAdsClicks: number;
  uniqueGclids: number;
  device: string;
  keywords: string[];
  campaign?: string;
}

export function recordPageview(input: {
  id?: string;
  path: string;
  source: string;
  sourceDetail?: string;
  device: "mobile" | "desktop";
  browser?: string;
  os?: string;
  networkType?: string;
  isNewSession: boolean;
  ip?: string;
  location?: string;
  campaign?: string;
  term?: string;
  sessionId?: string;
  gclid?: string;
  visitorId?: string;
}): { fraudAlert?: ClickFraudTrigger } {
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

  const sortedDates = Object.keys(store.daily).sort().reverse();
  if (sortedDates.length > MAX_DAYS) {
    for (const oldDate of sortedDates.slice(MAX_DAYS)) {
      delete store.daily[oldDate];
    }
  }

  const visit: RecentVisit = {
    id: input.id || `pv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    path: input.path,
    source: input.source,
    sourceDetail: input.sourceDetail,
    device: input.device,
    browser: input.browser,
    os: input.os,
    networkType: input.networkType,
    durationSeconds: 0,
    actions: [],
    ip: input.ip,
    location: input.location,
    campaign: input.campaign,
    term: input.term,
    sessionId: input.sessionId,
    gclid: input.gclid,
    visitorId: input.visitorId,
  };

  store.recent = [visit, ...store.recent].slice(0, MAX_RECENT);

  // Check for suspicious repeat Google Ads clicks on the same IP (last 24 hours)
  let fraudAlert: ClickFraudTrigger | undefined;
  if (
    input.source === "Google Ads" &&
    input.ip &&
    input.ip !== "127.0.0.1" &&
    input.ip !== "::1" &&
    !(store.whitelistedIps || []).includes(input.ip)
  ) {
    const cutoff24h = Date.now() - 24 * 60 * 60 * 1000;
    const ipAdsVisits = store.recent.filter(
      (v) =>
        v.ip === input.ip &&
        v.source === "Google Ads" &&
        new Date(v.timestamp).getTime() >= cutoff24h
    );

    const uniqueGclids = new Set(ipAdsVisits.map((v) => v.gclid).filter(Boolean));
    const isSuspicious = uniqueGclids.size >= 2 || ipAdsVisits.length >= 3;

    if (isSuspicious) {
      const alertedIps = store.alertedIps || {};
      const lastAlertTs = alertedIps[input.ip] ? new Date(alertedIps[input.ip]).getTime() : 0;
      const sixHoursMs = 6 * 60 * 60 * 1000;

      if (Date.now() - lastAlertTs > sixHoursMs) {
        alertedIps[input.ip] = new Date().toISOString();
        store.alertedIps = alertedIps;
        const keywords = Array.from(
          new Set(ipAdsVisits.map((v) => v.term).filter((t): t is string => Boolean(t)))
        );
        fraudAlert = {
          ip: input.ip,
          location: input.location || "Không xác định",
          totalAdsClicks: ipAdsVisits.length,
          uniqueGclids: uniqueGclids.size,
          device: input.device === "mobile" ? "Mobile" : "Desktop",
          keywords,
          campaign: input.campaign,
        };
      }
    }
  }

  fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(store, null, 2), "utf8");
  return { fraudAlert };
}

const CONVERSION_ACTIONS = new Set(["Bấm gọi", "Bấm Zalo", "Bấm Messenger", "Gửi form"]);

export function analyzeClickFraud(store: TrafficStore): SuspiciousIpReport[] {
  const adsVisits = store.recent.filter((v) => v.source === "Google Ads");

  const byIp = new Map<string, RecentVisit[]>();
  const byVisitor = new Map<string, RecentVisit[]>();
  for (const v of adsVisits) {
    if (v.ip && v.ip !== "127.0.0.1" && v.ip !== "::1") {
      const list = byIp.get(v.ip) || [];
      list.push(v);
      byIp.set(v.ip, list);
    }
    if (v.visitorId) {
      const vList = byVisitor.get(v.visitorId) || [];
      vList.push(v);
      byVisitor.set(v.visitorId, vList);
    }
  }

  const blockedSet = new Set(store.blockedIps || []);
  const whitelistSet = new Set(store.whitelistedIps || []);
  const blockedVisitorSet = new Set(store.blockedVisitors || []);
  const whitelistVisitorSet = new Set(store.whitelistedVisitors || []);
  const reports: SuspiciousIpReport[] = [];
  const flaggedSingleIpVisitors = new Set<string>();

  for (const [ip, list] of Array.from(byIp.entries())) {
    const uniqueGclids = new Set(list.map((v) => v.gclid).filter(Boolean));
    const uniqueSessions = new Set(list.map((v) => v.sessionId).filter(Boolean));
    const uniqueVisitors = new Set(list.map((v) => v.visitorId).filter(Boolean));

    // Flag IP if >= 2 total Ads visits or >= 2 unique GCLIDs
    if (list.length < 2 && uniqueGclids.size < 2) continue;

    for (const vid of Array.from(uniqueVisitors)) {
      if (vid) flaggedSingleIpVisitors.add(vid);
    }

    const riskLevel: "high" | "medium" =
      uniqueGclids.size >= 2 || list.length >= 3 ? "high" : "medium";

    const status: "pending" | "blocked" | "whitelisted" = blockedSet.has(ip)
      ? "blocked"
      : whitelistSet.has(ip)
      ? "whitelisted"
      : "pending";

    const keywords = Array.from(
      new Set(list.map((v) => v.term).filter((t): t is string => Boolean(t)))
    );
    const campaigns = Array.from(
      new Set(list.map((v) => v.campaign).filter((c): c is string => Boolean(c)))
    );
    const timestamps = list.map((v) => v.timestamp).sort();
    const conversionActions = Array.from(
      new Set(list.flatMap((v) => v.actions || []).filter((a) => CONVERSION_ACTIONS.has(a)))
    );

    reports.push({
      ip,
      targetType: "ip",
      visitorIds: Array.from(uniqueVisitors).filter((x): x is string => Boolean(x)),
      ips: [ip],
      location: list[0]?.location || "Không xác định",
      totalAdsClicks: list.length,
      uniqueGclids: uniqueGclids.size,
      uniqueSessions: uniqueSessions.size,
      uniqueVisitors: uniqueVisitors.size,
      keywords,
      campaigns,
      device: list[0]?.device === "mobile" ? "Mobile" : "Desktop",
      firstSeen: timestamps[0],
      lastSeen: timestamps[timestamps.length - 1],
      conversionActions,
      hasConversion: conversionActions.length > 0,
      riskLevel,
      status,
    });
  }

  // Flag repeat devices (visitorId) across changing IPs (e.g. 4G/Wi-Fi hopping)
  for (const [visitorId, list] of Array.from(byVisitor.entries())) {
    const uniqueGclids = new Set(list.map((v) => v.gclid).filter(Boolean));
    const uniqueSessions = new Set(list.map((v) => v.sessionId).filter(Boolean));
    const uniqueIps = new Set(
      list.map((v) => v.ip).filter((ip): ip is string => Boolean(ip && ip !== "127.0.0.1" && ip !== "::1"))
    );

    if (list.length < 2 && uniqueGclids.size < 2) continue;
    // Skip if all visits came from 1 IP that is already reported as an IP row
    if (uniqueIps.size <= 1 && flaggedSingleIpVisitors.has(visitorId)) continue;

    const riskLevel: "high" | "medium" =
      uniqueGclids.size >= 2 || list.length >= 3 || uniqueIps.size >= 2 ? "high" : "medium";

    const status: "pending" | "blocked" | "whitelisted" = blockedVisitorSet.has(visitorId)
      ? "blocked"
      : whitelistVisitorSet.has(visitorId)
      ? "whitelisted"
      : "pending";

    const keywords = Array.from(
      new Set(list.map((v) => v.term).filter((t): t is string => Boolean(t)))
    );
    const campaigns = Array.from(
      new Set(list.map((v) => v.campaign).filter((c): c is string => Boolean(c)))
    );
    const timestamps = list.map((v) => v.timestamp).sort();
    const ipsArr = Array.from(uniqueIps);
    const conversionActions = Array.from(
      new Set(list.flatMap((v) => v.actions || []).filter((a) => CONVERSION_ACTIONS.has(a)))
    );

    reports.push({
      ip: ipsArr.length > 0 ? ipsArr.slice(0, 2).join(", ") + (ipsArr.length > 2 ? ` (+${ipsArr.length - 2})` : "") : "Thiết bị lặp lại",
      targetType: "visitor",
      visitorId,
      visitorIds: [visitorId],
      ips: ipsArr,
      location: list[0]?.location || "Không xác định",
      totalAdsClicks: list.length,
      uniqueGclids: uniqueGclids.size,
      uniqueSessions: uniqueSessions.size,
      uniqueVisitors: 1,
      keywords,
      campaigns,
      device: list[0]?.device === "mobile" ? "Mobile" : "Desktop",
      firstSeen: timestamps[0],
      lastSeen: timestamps[timestamps.length - 1],
      conversionActions,
      hasConversion: conversionActions.length > 0,
      riskLevel,
      status,
    });
  }

  return reports.sort((a, b) => {
    if (a.status !== b.status) {
      if (a.status === "pending") return -1;
      if (b.status === "pending") return 1;
    }
    if (a.riskLevel !== b.riskLevel) {
      return a.riskLevel === "high" ? -1 : 1;
    }
    return b.totalAdsClicks - a.totalAdsClicks;
  });
}

export function updateIpStatus(
  ip: string,
  action: "blocked" | "whitelisted" | "reset"
): TrafficStore {
  ensureTrafficFile();
  const store = readTrafficStore();
  const blocked = new Set(store.blockedIps || []);
  const whitelisted = new Set(store.whitelistedIps || []);

  blocked.delete(ip);
  whitelisted.delete(ip);

  if (action === "blocked") blocked.add(ip);
  if (action === "whitelisted") whitelisted.add(ip);

  store.blockedIps = Array.from(blocked);
  store.whitelistedIps = Array.from(whitelisted);
  fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(store, null, 2), "utf8");
  return store;
}

export function updateVisitActivity(input: {
  visitId: string;
  durationSeconds?: number;
  action?: string;
}): void {
  if (!input.visitId) return;
  const store = readTrafficStore();
  const visit = store.recent.find((v) => v.id === input.visitId);
  if (!visit) return;

  let changed = false;
  if (typeof input.durationSeconds === "number" && input.durationSeconds > (visit.durationSeconds || 0)) {
    visit.durationSeconds = Math.min(3600, Math.round(input.durationSeconds));
    changed = true;
  }
  if (input.action) {
    const acts = new Set(visit.actions || []);
    if (!acts.has(input.action)) {
      acts.add(input.action);
      visit.actions = Array.from(acts).slice(0, 10);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(store, null, 2), "utf8");
  }
}

export function updateVisitorStatus(
  visitorId: string,
  action: "blocked" | "whitelisted" | "reset"
): TrafficStore {
  ensureTrafficFile();
  const store = readTrafficStore();
  const blocked = new Set(store.blockedVisitors || []);
  const whitelisted = new Set(store.whitelistedVisitors || []);

  blocked.delete(visitorId);
  whitelisted.delete(visitorId);

  if (action === "blocked") blocked.add(visitorId);
  if (action === "whitelisted") whitelisted.add(visitorId);

  store.blockedVisitors = Array.from(blocked);
  store.whitelistedVisitors = Array.from(whitelisted);
  fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(store, null, 2), "utf8");
  return store;
}

export function updateFraudPolicy(patch: Partial<FraudBlockPolicy>): TrafficStore {
  ensureTrafficFile();
  const store = readTrafficStore();
  store.fraudPolicy = {
    ...DEFAULT_FRAUD_POLICY,
    ...(store.fraudPolicy || {}),
    ...(typeof patch.blockForm === "boolean" ? { blockForm: patch.blockForm } : {}),
    ...(typeof patch.blockCall === "boolean" ? { blockCall: patch.blockCall } : {}),
    ...(typeof patch.blockZalo === "boolean" ? { blockZalo: patch.blockZalo } : {}),
  };
  fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(store, null, 2), "utf8");
  return store;
}

export function extractClientIp(headers: { get(name: string): string | null }): string {
  const forwardedFor = headers.get("x-forwarded-for");
  return (
    headers.get("cf-connecting-ip") ||
    (forwardedFor ? forwardedFor.split(",")[0].trim() : "") ||
    headers.get("x-real-ip") ||
    "127.0.0.1"
  )
    .replace(/^::ffff:/, "")
    .trim();
}

export function getClientBlockStatus(
  ip: string,
  visitorId?: string
): { blocked: boolean; reason?: "ip" | "visitor"; policy: FraudBlockPolicy } {
  const store = readTrafficStore();
  const policy: FraudBlockPolicy = {
    ...DEFAULT_FRAUD_POLICY,
    ...(store.fraudPolicy || {}),
  };
  if (ip && (store.blockedIps || []).includes(ip)) {
    return { blocked: true, reason: "ip", policy };
  }
  if (visitorId && (store.blockedVisitors || []).includes(visitorId)) {
    return { blocked: true, reason: "visitor", policy };
  }
  return { blocked: false, policy };
}

export function isIpBlocked(ip: string): boolean {
  if (!ip) return false;
  const store = readTrafficStore();
  return (store.blockedIps || []).includes(ip);
}

export function clearTrafficStore(): void {
  ensureTrafficFile();
  const empty: TrafficStore = {
    daily: {},
    recent: [],
    alertedIps: {},
    blockedIps: [],
    whitelistedIps: [],
    blockedVisitors: [],
    whitelistedVisitors: [],
    fraudPolicy: { ...DEFAULT_FRAUD_POLICY },
  };
  fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(empty, null, 2), "utf8");
}
