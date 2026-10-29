import fs from "fs";
import path from "path";
import crypto from "crypto";
import { LeadPayload, LeadRecord } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

// In-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Vietnam Phone Number Validation Regex
// Matches 10-digit VN mobile numbers starting with 03, 05, 07, 08, 09 or +84
export function isValidVietnamPhone(phone: string): boolean {
  const sanitized = phone.replace(/\s+/g, "").replace(/[-.]/g, "");
  const vnPhoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return vnPhoneRegex.test(sanitized);
}

// Normalize phone to standard format (e.g., 0888165008)
export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("84") && cleaned.length === 11) {
    cleaned = "0" + cleaned.substring(2);
  }
  return cleaned;
}

// Ensure the data directory and leads file exist
function ensureLeadsFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

// Read all leads securely
export function getAllLeads(): LeadRecord[] {
  ensureLeadsFile();
  try {
    const raw = fs.readFileSync(LEADS_FILE, "utf8");
    return JSON.parse(raw) as LeadRecord[];
  } catch (error) {
    console.error("Error reading leads file:", error);
    return [];
  }
}

// Check if IP exceeds rate limit
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

// Check if phone was submitted recently (duplicate prevention within 30 mins)
export function isDuplicateSubmission(normalizedPhone: string): boolean {
  const leads = getAllLeads();
  const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;

  return leads.some((lead) => {
    const leadPhone = normalizePhone(lead.phone);
    const leadTime = new Date(lead.createdAt).getTime();
    return leadPhone === normalizedPhone && leadTime > thirtyMinutesAgo;
  });
}

// Extensible Webhook Dispatcher (Google Sheets / CRM / Zapier / Make)
async function dispatchExternalWebhook(record: LeadRecord): Promise<void> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (error) {
    console.warn("External CRM Webhook notification warning:", error);
    // Non-blocking: local lead was already saved securely
  }
}

// Save a new lead record atomically
export async function saveLead(
  payload: LeadPayload,
  clientIp: string,
  userAgent: string
): Promise<{ success: boolean; leadRecord?: LeadRecord; message: string; isDuplicate?: boolean }> {
  ensureLeadsFile();

  // 1. Honeypot check
  if (payload.website && payload.website.trim().length > 0) {
    // Bot filled hidden honeypot field: pretend success without saving
    return {
      success: true,
      message: "Đăng ký thành công!",
    };
  }

  // 2. Format & Validate Phone
  const cleanedPhone = normalizePhone(payload.phone);
  if (!isValidVietnamPhone(cleanedPhone)) {
    return {
      success: false,
      message: "Số điện thoại không đúng định dạng di động Việt Nam. Vui lòng kiểm tra lại (gồm 10 chữ số).",
    };
  }

  // 3. Name check
  if (!payload.fullName || payload.fullName.trim().length < 2) {
    return {
      success: false,
      message: "Vui lòng nhập họ và tên của bạn để nhân viên tiện xưng hô.",
    };
  }

  // 4. Consent check
  if (!payload.agreeConsent) {
    return {
      success: false,
      message: "Vui lòng tích chọn đồng ý để chuyên viên FPT liên hệ tư vấn theo quy định bảo vệ dữ liệu.",
    };
  }

  // 5. Duplicate Check (within 30 minutes)
  if (isDuplicateSubmission(cleanedPhone)) {
    return {
      success: true,
      isDuplicate: true,
      message: "Hệ thống đã nhận yêu cầu của bạn trước đó ít phút. Chuyên viên FPT đang chuẩn bị cuộc gọi tư vấn!",
    };
  }

  // 6. Generate Lead Record
  const newRecord: LeadRecord = {
    ...payload,
    phone: cleanedPhone,
    fullName: payload.fullName.trim(),
    id: `FPT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
    createdAt: new Date().toISOString(),
    clientIp,
    userAgent,
    status: "new",
  };

  // 7. Atomic file append
  try {
    const leads = getAllLeads();
    leads.unshift(newRecord); // newest first
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");

    // 8. Fire-and-forget webhook
    dispatchExternalWebhook(newRecord).catch(() => {});

    return {
      success: true,
      leadRecord: newRecord,
      message: "Đăng ký tư vấn thành công! Chuyên viên FPT sẽ liên hệ lại ngay trong 5 - 15 phút.",
    };
  } catch (error) {
    console.error("Failed to save lead record:", error);
    return {
      success: false,
      message: "Có lỗi xảy ra khi lưu thông tin. Vui lòng gọi trực tiếp hotline để được hỗ trợ tức thì.",
    };
  }
}

// Update lead status or sales notes
export function updateLead(
  id: string,
  updates: Partial<Pick<LeadRecord, "status" | "salesNotes">>
): LeadRecord | null {
  ensureLeadsFile();
  try {
    const leads = getAllLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return null;

    leads[index] = {
      ...leads[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
    return leads[index];
  } catch (err) {
    console.error("Error updating lead:", err);
    return null;
  }
}

// Delete a lead
export function deleteLead(id: string): boolean {
  ensureLeadsFile();
  try {
    const leads = getAllLeads();
    const filtered = leads.filter((l) => l.id !== id);
    if (filtered.length === leads.length) return false;

    fs.writeFileSync(LEADS_FILE, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error deleting lead:", err);
    return false;
  }
}

// Calculate dashboard KPIs and breakdowns
export function getLeadStats() {
  const leads = getAllLeads();
  const total = leads.length;

  const statusCount = {
    new: 0,
    contacted: 0,
    surveyed: 0,
    completed: 0,
    cancelled: 0,
  };

  const packageBreakdown: Record<string, number> = {};
  const areaBreakdown: Record<string, number> = {};
  const utmBreakdown: Record<string, number> = {};

  // Today counter
  const todayStr = new Date().toISOString().slice(0, 10);
  let todayCount = 0;

  for (const lead of leads) {
    if (lead.createdAt && lead.createdAt.slice(0, 10) === todayStr) {
      todayCount++;
    }

    if (lead.status && statusCount[lead.status] !== undefined) {
      statusCount[lead.status]++;
    } else {
      statusCount.new++;
    }

    const pkg = lead.packageInterested || "Chưa rõ";
    packageBreakdown[pkg] = (packageBreakdown[pkg] || 0) + 1;

    // Group area broadly
    const areaName = lead.area || "Khác";
    const areaKey = areaName.includes("Cần Thơ")
      ? "Cần Thơ"
      : areaName.includes("Hậu Giang")
      ? "Hậu Giang"
      : areaName.includes("Sóc Trăng")
      ? "Sóc Trăng"
      : "Khu vực khác";
    areaBreakdown[areaKey] = (areaBreakdown[areaKey] || 0) + 1;

    const source = lead.utm_source || "Trực tiếp / Khác";
    utmBreakdown[source] = (utmBreakdown[source] || 0) + 1;
  }

  const conversionRate = total > 0 ? Math.round((statusCount.completed / total) * 100) : 0;

  return {
    total,
    todayCount,
    statusCount,
    conversionRate,
    packageBreakdown,
    areaBreakdown,
    utmBreakdown,
  };
}
