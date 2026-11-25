import fs from "fs";
import path from "path";

export interface GoogleAdsConversionEvent {
  id: string;
  timestamp: string;
  eventType: "form_submit" | "hotline_click" | "zalo_click" | "test";
  sendTo: string;
  conversionLabel?: string;
  leadId?: string;
  packageName?: string;
  value: number;
  currency: string;
  gclid?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_term?: string;
  pagePath?: string;
  gtagReady: boolean;
}

const PERSISTENT_DIR = path.join(process.cwd(), "data");
const EVENTS_FILE = path.join(PERSISTENT_DIR, "google-ads-conversions.json");
const MAX_EVENTS = 300;

function ensureEventsFile(): void {
  if (!fs.existsSync(PERSISTENT_DIR)) {
    fs.mkdirSync(PERSISTENT_DIR, { recursive: true });
  }
  if (!fs.existsSync(EVENTS_FILE)) {
    fs.writeFileSync(EVENTS_FILE, "[]", "utf8");
  }
}

export function getGoogleAdsEvents(): GoogleAdsConversionEvent[] {
  ensureEventsFile();
  try {
    const raw = fs.readFileSync(EVENTS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendGoogleAdsEvent(
  event: Omit<GoogleAdsConversionEvent, "id" | "timestamp">
): GoogleAdsConversionEvent {
  ensureEventsFile();
  const current = getGoogleAdsEvents();
  const record: GoogleAdsConversionEvent = {
    ...event,
    id: `gads_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  const next = [record, ...current].slice(0, MAX_EVENTS);
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(next, null, 2), "utf8");
  return record;
}

export function clearGoogleAdsEvents(): void {
  ensureEventsFile();
  fs.writeFileSync(EVENTS_FILE, "[]", "utf8");
}
