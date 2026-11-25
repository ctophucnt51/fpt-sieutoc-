import { getDynamicConfig } from "./configStorage";

export interface TelegramLeadData {
  fullName: string;
  phone: string;
  address?: string;
  area?: string;
  packageInterested?: string;
  note?: string;
  landingPage?: string;
  leadLocation?: string;
  eventId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  gclid?: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

/**
 * Get active Telegram credentials from dynamic config or environment variables
 */
export function getTelegramConfig(): TelegramConfig {
  try {
    const config = getDynamicConfig();
    const telegramFromConfig = (config as any).telegram || {};
    
    const botToken =
      telegramFromConfig.botToken ||
      process.env.TELEGRAM_BOT_TOKEN ||
      "";
    const chatId =
      telegramFromConfig.chatId ||
      process.env.TELEGRAM_CHAT_ID ||
      "";
    const enabled =
      typeof telegramFromConfig.enabled === "boolean"
        ? telegramFromConfig.enabled
        : true;

    return {
      botToken: botToken.trim(),
      chatId: chatId.trim(),
      enabled,
    };
  } catch {
    return {
      botToken: process.env.TELEGRAM_BOT_TOKEN || "",
      chatId: process.env.TELEGRAM_CHAT_ID || "",
      enabled: true,
    };
  }
}

/**
 * Send lead notification to Telegram Bot
 */
export async function sendTelegramNotification(lead: TelegramLeadData): Promise<{
  success: boolean;
  message?: string;
}> {
  const { botToken, chatId, enabled } = getTelegramConfig();

  if (!enabled) {
    return { success: false, message: "Thông báo Telegram đang tắt trong cấu hình." };
  }

  if (!botToken || !chatId) {
    return {
      success: false,
      message: "Chưa cấu hình Telegram Bot Token hoặc Chat ID.",
    };
  }

  const nowStr = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });

  const fullAddress = [lead.address, lead.area].filter(Boolean).join(", ") || "Chưa cung cấp";

  const messageText = `
🔔 <b>CÓ ĐƠN ĐĂNG KÝ LẮP MẠNG FPT MỚI!</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Khách hàng:</b> ${escapeHtml(lead.fullName || "Khách hàng")}
📞 <b>Số điện thoại:</b> <a href="tel:${lead.phone}">${lead.phone}</a>
📍 <b>Địa chỉ:</b> ${escapeHtml(fullAddress)}
📦 <b>Gói quan tâm:</b> ${escapeHtml(lead.packageInterested || "Chưa chọn gói")}
${lead.note ? `📝 <b>Ghi chú:</b> ${escapeHtml(lead.note)}\n` : ""}⏰ <b>Thời gian:</b> ${nowStr}
🌐 <b>Trang tiếp nhận:</b> ${escapeHtml(lead.landingPage || "/")} (${escapeHtml(lead.leadLocation || "form")})
${lead.utmTerm ? `🔍 <b>Từ khóa tìm kiếm:</b> <code>${escapeHtml(lead.utmTerm)}</code>\n` : ""}${lead.utmSource ? `🎯 <b>Nguồn truy cập:</b> ${escapeHtml(lead.utmSource)} ${lead.utmMedium ? `(${escapeHtml(lead.utmMedium)})` : ""} ${lead.utmCampaign ? `- ${escapeHtml(lead.utmCampaign)}` : ""}\n` : ""}${lead.gclid ? `🔗 <b>Google Ads:</b> Khách từ quảng cáo Google Search\n` : ""}━━━━━━━━━━━━━━━━━━
<i>Hệ thống tự động tiếp nhận từ gofpt.vn</i>
`.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000), // 8 giây timeout
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      console.warn("Telegram sendMessage error:", data);
      return {
        success: false,
        message: data.description || "Lỗi gửi Telegram Bot API",
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("sendTelegramNotification exception:", error);
    return {
      success: false,
      message: error?.message || "Lỗi kết nối tới Telegram API",
    };
  }
}

/**
 * Send a quick test message to verify Telegram Bot credentials
 */
export async function testTelegramConnection(
  botToken: string,
  chatId: string
): Promise<{ success: boolean; message: string }> {
  if (!botToken.trim() || !chatId.trim()) {
    return { success: false, message: "Vui lòng nhập đầy đủ Bot Token và Chat ID!" };
  }

  const testMsg = `
✅ <b>KẾT NỐI TELEGRAM BOT THÀNH CÔNG!</b>
━━━━━━━━━━━━━━━━━━
Hệ thống tiếp nhận thông báo đơn hàng của <b>gofpt.vn</b> đã kết nối thành công với Bot Telegram của bạn.
⏰ <b>Thời gian kiểm tra:</b> ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
━━━━━━━━━━━━━━━━━━
<i>Khi khách hàng điền form, thông tin sẽ được gửi tức thì vào nhóm/kênh này!</i>
`.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken.trim()}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text: testMsg,
        parse_mode: "HTML",
      }),
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json();
    if (res.ok && data.ok) {
      return { success: true, message: "Đã gửi tin nhắn thử nghiệm thành công vào Telegram!" };
    } else {
      return {
        success: false,
        message: `Telegram báo lỗi: ${data.description || "Token hoặc Chat ID không chính xác"}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Không thể kết nối Telegram API: ${error?.message || "Timeout hoặc lỗi mạng"}`,
    };
  }
}

export interface ClickFraudAlertData {
  ip: string;
  location: string;
  totalAdsClicks: number;
  uniqueGclids: number;
  device: string;
  keywords: string[];
  campaign?: string;
}

/**
 * Send instant anti-click-fraud alert to Telegram Bot when suspicious repeat Google Ads clicks are detected
 */
export async function sendClickFraudAlert(data: ClickFraudAlertData): Promise<boolean> {
  const { botToken, chatId, enabled } = getTelegramConfig();
  if (!enabled || !botToken || !chatId) return false;

  const nowStr = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });

  const kwText = data.keywords.length > 0 ? data.keywords.join(", ") : "Không rõ";

  const alertText = `
🚨 <b>CẢNH BÁO NGHI VẤN CLICK TẶC GOOGLE ADS!</b>
━━━━━━━━━━━━━━━━━━
🌐 <b>IP nghi vấn:</b> <code>${escapeHtml(data.ip)}</code>
📍 <b>Vị trí:</b> ${escapeHtml(data.location || "Không xác định")}
🔁 <b>Tần suất:</b> ${data.totalAdsClicks} lượt truy cập Ads (${data.uniqueGclids > 0 ? `${data.uniqueGclids} mã GCLID` : "cùng phiên/lặp"})
🔍 <b>Từ khóa:</b> <code>${escapeHtml(kwText)}</code>
${data.campaign ? `🎯 <b>Chiến dịch:</b> ${escapeHtml(data.campaign)}\n` : ""}📱 <b>Thiết bị:</b> ${escapeHtml(data.device)}
⏰ <b>Thời gian:</b> ${nowStr}
━━━━━━━━━━━━━━━━━━
👉 <i>Hãy copy IP <code>${escapeHtml(data.ip)}</code> đưa vào mục <b>Loại trừ IP</b> trên Google Ads hoặc kiểm tra tại https://gofpt.vn/admin</i>
`.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: alertText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(6000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface SeoReportTelegramData {
  summaryTitle: string;
  totalClicks?: number;
  totalImpressions?: number;
  avgPosition?: number;
  highlights: string[];
  actionItems?: string[];
}

/**
 * Send SEO rank & audit summary report from the Auto-SEO Agent to Telegram
 */
export async function sendSeoReportAlert(data: SeoReportTelegramData): Promise<boolean> {
  const { botToken, chatId, enabled } = getTelegramConfig();
  if (!enabled || !botToken || !chatId) return false;

  const nowStr = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });

  const statsLine =
    data.totalClicks !== undefined || data.totalImpressions !== undefined
      ? `📊 <b>GSC:</b> ${data.totalClicks ?? 0} Clicks | ${data.totalImpressions ?? 0} Hiển thị${
          data.avgPosition ? ` | Top TB: ${data.avgPosition.toFixed(1)}` : ""
        }\n`
      : "";

  const highlightsBlock =
    data.highlights.length > 0
      ? `📌 <b>Điểm nổi bật:</b>\n${data.highlights.map((h) => `• ${escapeHtml(h)}`).join("\n")}\n`
      : "";

  const actionsBlock =
    data.actionItems && data.actionItems.length > 0
      ? `🚀 <b>Đề xuất tối ưu:</b>\n${data.actionItems.map((a) => `→ ${escapeHtml(a)}`).join("\n")}\n`
      : "";

  const msg = `
📈 <b>BÁO CÁO HỆ THỐNG AUTO-SEO (GOFPT.VN)</b>
━━━━━━━━━━━━━━━━━━
🏷️ <b>${escapeHtml(data.summaryTitle)}</b>
${statsLine}${highlightsBlock}${actionsBlock}⏰ <b>Thời gian:</b> ${nowStr}
━━━━━━━━━━━━━━━━━━
<i>Tự động tổng hợp bởi Hệ thống Multi-Agent SEO</i>
`.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: msg,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(6000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
