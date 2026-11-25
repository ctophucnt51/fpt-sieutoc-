"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { LeadRecord } from "@/lib/types";
import { SiteConfigType } from "@/lib/configStorage";
import { getAdminHeaders } from "@/lib/clientAdminAuth";
import { googleTracker } from "@/components/tracking/GoogleAds";
import type { GoogleAdsConversionEvent } from "@/lib/googleAdsStorage";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Save,
  Loader2,
  Zap,
  PhoneCall,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  Target,
  TrendingUp,
  MousePointerClick,
  Search,
  ExternalLink,
} from "lucide-react";

interface GoogleAdsManagementProps {
  config: SiteConfigType;
  leads: LeadRecord[];
  onSaveConfig: (updatedConfig: Partial<SiteConfigType>) => Promise<boolean>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

function isGoogleAdsLead(lead: LeadRecord): boolean {
  if (lead.gclid && lead.gclid.trim().length > 0) return true;
  const src = (lead.utm_source || "").toLowerCase();
  const med = (lead.utm_medium || "").toLowerCase();
  return (
    src.includes("google") ||
    src.includes("gads") ||
    src.includes("adwords") ||
    med === "cpc" ||
    med === "ppc"
  );
}

const STATUS_BADGE: Record<LeadRecord["status"], { label: string; cls: string }> = {
  new: { label: "Mới", cls: "bg-red-50 text-red-700 border-red-200" },
  contacted: { label: "Đã gọi", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  surveyed: { label: "Đã khảo sát", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  completed: { label: "Đã ký HĐ", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Hủy", cls: "bg-slate-100 text-slate-600 border-slate-200" },
};

const EVENT_TYPE_LABEL: Record<GoogleAdsConversionEvent["eventType"], { label: string; cls: string }> = {
  form_submit: { label: "Gửi Form", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  hotline_click: { label: "Gọi Hotline", cls: "bg-orange-50 text-[#C44D06] border-orange-200" },
  zalo_click: { label: "Chat Zalo", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  test: { label: "Test Admin", cls: "bg-purple-50 text-purple-700 border-purple-200" },
};

export default function GoogleAdsManagement({
  config,
  leads,
  onSaveConfig,
  showToast,
}: GoogleAdsManagementProps) {
  const [trackingForm, setTrackingForm] = useState({
    googleAdsId: config.tracking.googleAdsId || "",
    googleAdsConversionLabel: config.tracking.googleAdsConversionLabel || "",
    googleAdsCallConversionLabel: config.tracking.googleAdsCallConversionLabel || "",
    googleAdsConversionValue: config.tracking.googleAdsConversionValue ?? 1,
    enableGoogleAds: Boolean(config.tracking.enableGoogleAds),
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [events, setEvents] = useState<GoogleAdsConversionEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [subView, setSubView] = useState<"analytics" | "logs" | "settings">("analytics");

  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const res = await fetch("/api/admin/google-ads", {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    setTrackingForm({
      googleAdsId: config.tracking.googleAdsId || "",
      googleAdsConversionLabel: config.tracking.googleAdsConversionLabel || "",
      googleAdsCallConversionLabel: config.tracking.googleAdsCallConversionLabel || "",
      googleAdsConversionValue: config.tracking.googleAdsConversionValue ?? 1,
      enableGoogleAds: Boolean(config.tracking.enableGoogleAds),
    });
  }, [config]);

  const googleLeads = useMemo(() => leads.filter(isGoogleAdsLead), [leads]);
  const gclidLeads = useMemo(
    () => leads.filter((l) => Boolean(l.gclid && l.gclid.trim())),
    [leads]
  );
  const completedGoogleLeads = useMemo(
    () => googleLeads.filter((l) => l.status === "completed"),
    [googleLeads]
  );

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayEventsCount = useMemo(
    () =>
      events.filter(
        (e) => e.eventType !== "test" && e.timestamp.slice(0, 10) === todayStr
      ).length,
    [events, todayStr]
  );
  const realEventsCount = useMemo(
    () => events.filter((e) => e.eventType !== "test").length,
    [events]
  );

  const googleConversionRate =
    googleLeads.length > 0
      ? Math.round((completedGoogleLeads.length / googleLeads.length) * 100)
      : 0;

  // Campaign breakdown from Google Ads leads
  const campaignRows = useMemo(() => {
    const map: Record<
      string,
      { campaign: string; total: number; gclid: number; completed: number; keywords: Set<string> }
    > = {};

    for (const lead of googleLeads) {
      const key = lead.utm_campaign?.trim() || "(Chưa gắn utm_campaign)";
      if (!map[key]) {
        map[key] = { campaign: key, total: 0, gclid: 0, completed: 0, keywords: new Set() };
      }
      map[key].total += 1;
      if (lead.gclid) map[key].gclid += 1;
      if (lead.status === "completed") map[key].completed += 1;
      if (lead.utm_term) map[key].keywords.add(lead.utm_term);
    }

    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [googleLeads]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const ok = await onSaveConfig({
      tracking: {
        ...config.tracking,
        googleAdsId: trackingForm.googleAdsId.trim(),
        googleAdsConversionLabel: trackingForm.googleAdsConversionLabel.trim(),
        googleAdsCallConversionLabel: trackingForm.googleAdsCallConversionLabel.trim(),
        googleAdsConversionValue: Number(trackingForm.googleAdsConversionValue) || 1,
        enableGoogleAds: trackingForm.enableGoogleAds,
      },
    });
    setIsSaving(false);
    if (ok) {
      showToast("Đã lưu cấu hình chuyển đổi Google Ads!", "success");
    } else {
      showToast("Lỗi khi lưu cấu hình Google Ads.", "error");
    }
  };

  const handleTestConversion = async () => {
    if (!trackingForm.googleAdsId.trim()) {
      showToast("Vui lòng nhập Google Ads Conversion ID (AW-...) trước khi test.", "error");
      setSubView("settings");
      return;
    }

    setIsTesting(true);
    googleTracker.testConversion({
      googleAdsId: trackingForm.googleAdsId.trim(),
      googleAdsConversionLabel: trackingForm.googleAdsConversionLabel.trim(),
      googleAdsCallConversionLabel: trackingForm.googleAdsCallConversionLabel.trim(),
      googleAdsConversionValue: Number(trackingForm.googleAdsConversionValue) || 1,
      enableGoogleAds: true,
    });

    setTimeout(async () => {
      await fetchEvents();
      setIsTesting(false);
      showToast("Đã bắn tín hiệu chuyển đổi thử và ghi nhận vào nhật ký!", "success");
    }, 500);
  };

  const handleClearEvents = async () => {
    if (!window.confirm("Bạn muốn xóa toàn bộ nhật ký sự kiện chuyển đổi?")) return;
    try {
      const res = await fetch("/api/admin/google-ads", {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        setEvents([]);
        showToast("Đã xóa nhật ký chuyển đổi.", "success");
      }
    } catch {
      showToast("Không thể xóa nhật ký.", "error");
    }
  };

  // Export Offline Conversions CSV formatted for Google Ads Import
  const handleExportOfflineCsv = () => {
    const exportRows = gclidLeads.filter(
      (l) => l.status === "completed" || l.status === "surveyed" || l.status === "contacted"
    );

    if (exportRows.length === 0) {
      showToast("Chưa có Lead nào có mã GCLID để xuất file Offline Conversion.", "error");
      return;
    }

    const header = [
      "Google Click ID",
      "Conversion Name",
      "Conversion Time",
      "Conversion Value",
      "Conversion Currency",
    ];
    const convName = trackingForm.googleAdsConversionLabel || "Lead_FPT_Completed";
    const convVal = Number(trackingForm.googleAdsConversionValue) || 220000;

    const rows = exportRows.map((l) => [
      l.gclid || "",
      convName,
      new Date(l.createdAt).toISOString().replace("T", " ").slice(0, 19) + "+0000",
      String(convVal),
      "VND",
    ]);

    const csv =
      "Parameters:TimeZone=UTC\n" +
      [header, ...rows]
        .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `google-ads-offline-conversions-${todayStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Đã xuất ${exportRows.length} GCLID Offline Conversions!`, "success");
  };

  const isConfigured =
    Boolean(trackingForm.enableGoogleAds) && Boolean(trackingForm.googleAdsId);

  return (
    <div className="space-y-6">
      {/* 1. Connection Status Banner */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isConfigured
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-amber-50 text-amber-600 border border-amber-200"
            }`}
          >
            {isConfigured ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black text-base text-slate-900">
                Trung Tâm Chuyển Đổi Google Ads
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                GTM-N4VB2HJ6 Đã Nhúng
              </span>
              {isConfigured ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Đang Bật ({trackingForm.googleAdsId})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Chưa Bật Conversion ID
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tự động đo lường chuyển đổi khi khách gửi Form, bấm gọi Hotline hoặc Chat Zalo, đồng thời lưu mã <strong>GCLID</strong> và <strong>UTM Campaign</strong> để tối ưu quảng cáo.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleTestConversion}
            disabled={isTesting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-60"
          >
            {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
            <span>Bắn Chuyển Đổi Thử</span>
          </button>
          <button
            type="button"
            onClick={handleExportOfflineCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Xuất CSV GCLID</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Main Google Ads KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Lead Từ Google Ads
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {googleLeads.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Có <strong>{gclidLeads.length}</strong> đơn gắn mã GCLID thực tế
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tín Hiệu Đã Bắn
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F37021] flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F37021]">
            {realEventsCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Hôm nay: <strong>{todayEventsCount}</strong> sự kiện chuyển đổi
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Đơn Chốt Google Ads
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {completedGoogleLeads.length}
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-1">
            Tỷ lệ chốt: <strong>{googleConversionRate}%</strong> tổng lead Ads
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Giá Trị / Chuyển Đổi
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {Number(trackingForm.googleAdsConversionValue || 1).toLocaleString("vi-VN")}đ
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Gửi kèm currency: <code>VND</code>
          </p>
        </div>
      </div>

      {/* 3. Sub-navigation Tabs */}
      <div className="inline-flex p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs gap-1">
        {[
          { id: "analytics", label: `Phân Tích & Lead Ads (${googleLeads.length})` },
          { id: "logs", label: `Nhật Ký Bắn Tín Hiệu (${events.length})` },
          { id: "settings", label: "Cấu Hình Mã Google Ads" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubView(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subView === tab.id
                ? "bg-[#F37021] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4A. Sub-view: Analytics & Google Ads Leads */}
      {subView === "analytics" && (
        <div className="space-y-6">
          {/* Campaign Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
            <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#F37021]" />
              <span>Hiệu Quả Theo Chiến Dịch (utm_campaign) &amp; Từ Khóa (utm_term)</span>
            </h4>
            {campaignRows.length === 0 ? (
              <div className="text-xs text-slate-500 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Chưa có đơn Lead nào ghi nhận <code>gclid</code> hoặc <code>utm_source=google</code>. Khi khách bấm từ quảng cáo Google Ads vào web và đăng ký, dữ liệu chiến dịch &amp; từ khóa sẽ hiển thị tại đây.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                      <th className="py-2.5 pr-4">Chiến dịch (Campaign)</th>
                      <th className="py-2.5 px-3">Từ khóa (utm_term)</th>
                      <th className="py-2.5 px-3 text-center">Tổng Lead</th>
                      <th className="py-2.5 px-3 text-center">Có GCLID</th>
                      <th className="py-2.5 pl-3 text-center">Đã Chốt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {campaignRows.map((row) => (
                      <tr key={row.campaign} className="hover:bg-slate-50/70">
                        <td className="py-2.5 pr-4 font-bold text-slate-900">
                          {row.campaign}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {row.keywords.size > 0
                            ? Array.from(row.keywords).join(", ")
                            : "—"}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                          {row.total}
                        </td>
                        <td className="py-2.5 px-3 text-center font-semibold text-blue-700">
                          {row.gclid}
                        </td>
                        <td className="py-2.5 pl-3 text-center font-bold text-emerald-700">
                          {row.completed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Google Ads Leads Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h4 className="font-bold text-sm text-slate-900">
                Danh Sách Khách Hàng Từ Google Ads
              </h4>
              <span className="text-[11px] text-slate-500">
                Hiển thị {googleLeads.length} khách hàng gần nhất
              </span>
            </div>

            {googleLeads.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Chưa có khách hàng nào đến từ Google Ads.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                      <th className="py-2.5 pr-3">Thời gian</th>
                      <th className="py-2.5 px-3">Khách hàng</th>
                      <th className="py-2.5 px-3">Gói quan tâm</th>
                      <th className="py-2.5 px-3">Chiến dịch / Nguồn</th>
                      <th className="py-2.5 px-3">GCLID</th>
                      <th className="py-2.5 pl-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {googleLeads.slice(0, 50).map((lead) => {
                      const badge = STATUS_BADGE[lead.status] || STATUS_BADGE.new;
                      return (
                        <tr key={lead.id} className="hover:bg-slate-50/70">
                          <td className="py-2.5 pr-3 whitespace-nowrap text-slate-500">
                            {new Date(lead.createdAt).toLocaleString("vi-VN")}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{lead.fullName}</div>
                            <div className="text-[11px] text-slate-500">{lead.phone}</div>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#C44D06]">
                            {lead.packageInterested}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            <div>{lead.utm_campaign || lead.utm_source || "google"}</div>
                            {lead.utm_term && (
                              <div className="text-[10.5px] text-slate-400">
                                KW: {lead.utm_term}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[10.5px] text-blue-700 max-w-[140px] truncate">
                            {lead.gclid || "—"}
                          </td>
                          <td className="py-2.5 pl-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${badge.cls}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4B. Sub-view: Realtime Conversion Event Log */}
      {subView === "logs" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Nhật Ký Tín Hiệu Chuyển Đổi Đã Bắn (Realtime)
              </h4>
              <p className="text-xs text-slate-500">
                Ghi nhận mỗi lần website gọi <code>gtag(&apos;event&apos;, &apos;conversion&apos;)</code> và đẩy sự kiện vào <code>dataLayer</code>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchEvents}
                disabled={isLoadingEvents}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEvents ? "animate-spin" : ""}`} />
                <span>Làm mới</span>
              </button>
              {events.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearEvents}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa nhật ký</span>
                </button>
              )}
            </div>
          </div>

          {events.length === 0 ? (
            <div className="text-xs text-slate-500 py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Chưa có sự kiện chuyển đổi nào được ghi nhận. Bạn có thể bấm nút <strong>&ldquo;Bắn Chuyển Đổi Thử&rdquo;</strong> ở góc trên để kiểm tra ngay.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                    <th className="py-2.5 pr-3">Thời gian</th>
                    <th className="py-2.5 px-3">Loại</th>
                    <th className="py-2.5 px-3">Send To</th>
                    <th className="py-2.5 px-3">Nội dung / Gói</th>
                    <th className="py-2.5 px-3">GCLID</th>
                    <th className="py-2.5 px-3">Trang</th>
                    <th className="py-2.5 pl-3">gtag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((ev) => {
                    const typeMeta = EVENT_TYPE_LABEL[ev.eventType] || EVENT_TYPE_LABEL.form_submit;
                    return (
                      <tr key={ev.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 pr-3 whitespace-nowrap text-slate-500">
                          {new Date(ev.timestamp).toLocaleString("vi-VN")}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${typeMeta.cls}`}
                          >
                            {typeMeta.label}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-800">
                          {ev.sendTo}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          <div>{ev.packageName || "—"}</div>
                          {ev.leadId && (
                            <div className="text-[10.5px] text-slate-400 font-mono">
                              {ev.leadId}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[10.5px] text-blue-700 max-w-[120px] truncate">
                          {ev.gclid || "—"}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{ev.pagePath || "/"}</td>
                        <td className="py-2.5 pl-3">
                          {ev.gtagReady ? (
                            <span className="text-emerald-600 font-bold">OK</span>
                          ) : (
                            <span className="text-amber-600 font-semibold">dataLayer</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4C. Sub-view: Configuration Form */}
      {subView === "settings" && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5"
        >
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-base text-slate-900">
                Cấu Hình Mã Chuyển Đổi Google Ads (Động Trên Toàn Web)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Thay đổi tại đây sẽ áp dụng trực tiếp trên trang chủ và toàn bộ landing page mà không cần sửa code.
              </p>
            </div>
            <a
              href="https://ads.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
            >
              <span>Mở Google Ads</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Google Ads Conversion ID
              </label>
              <input
                type="text"
                value={trackingForm.googleAdsId}
                onChange={(e) =>
                  setTrackingForm((prev) => ({ ...prev, googleAdsId: e.target.value }))
                }
                placeholder="VD: AW-123456789"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#F37021] focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Lấy trong Google Ads &gt; Mục tiêu &gt; Thiết lập thẻ Google (bắt đầu bằng <code>AW-</code>).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Giá trị mỗi chuyển đổi (VND)
              </label>
              <input
                type="number"
                min={1}
                value={trackingForm.googleAdsConversionValue}
                onChange={(e) =>
                  setTrackingForm((prev) => ({
                    ...prev,
                    googleAdsConversionValue: Number(e.target.value) || 1,
                  }))
                }
                placeholder="VD: 220000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#F37021] focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Giá trị gửi kèm về Google Ads (VD: <code>1</code> hoặc <code>220000</code>).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nhãn chuyển đổi Gửi Form (Conversion Label)
              </label>
              <input
                type="text"
                value={trackingForm.googleAdsConversionLabel}
                onChange={(e) =>
                  setTrackingForm((prev) => ({
                    ...prev,
                    googleAdsConversionLabel: e.target.value,
                  }))
                }
                placeholder="VD: AbC_D-efGhIjKlMnOpQ"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#F37021] focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Kích hoạt ngay khi khách điền form tư vấn thành công.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nhãn chuyển đổi Bấm Gọi / Zalo (Tùy chọn)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={trackingForm.googleAdsCallConversionLabel}
                  onChange={(e) =>
                    setTrackingForm((prev) => ({
                      ...prev,
                      googleAdsCallConversionLabel: e.target.value,
                    }))
                  }
                  placeholder="VD: XyZ_1234567890"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#F37021] focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
                />
                <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Kích hoạt khi khách bấm nút gọi Hotline hoặc chat Zalo trên web.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-bold text-slate-800">
              <input
                type="checkbox"
                checked={trackingForm.enableGoogleAds}
                onChange={(e) =>
                  setTrackingForm((prev) => ({ ...prev, enableGoogleAds: e.target.checked }))
                }
                className="w-4 h-4 text-[#F37021] rounded border-slate-300 focus:ring-[#F37021] cursor-pointer"
              />
              <span>Kích hoạt theo dõi chuyển đổi Google Ads trên toàn website</span>
            </label>
          </div>

          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1.5">
            <div className="font-bold">Mã sự kiện sẽ tự động chạy khi khách hàng đăng ký:</div>
            <code className="block font-mono text-[11px] bg-white p-2.5 rounded-lg border border-blue-200 overflow-x-auto">
              gtag(&apos;event&apos;, &apos;conversion&apos;, &#123; send_to: &apos;
              {trackingForm.googleAdsId || "AW-XXXXXXXX"}/
              {trackingForm.googleAdsConversionLabel || "FORM_LABEL"}&apos;, value:{" "}
              {Number(trackingForm.googleAdsConversionValue) || 1}, currency: &apos;VND&apos; &#125;);
            </code>
            <div className="text-[11px] text-blue-700">
              Đồng thời đẩy <code>event: &quot;fpt_lead_conversion&quot;</code> lên <code>dataLayer</code> để GTM (<strong>GTM-N4VB2HJ6</strong>) bắt được ngay.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F37021] to-[#FF7A00] text-white font-bold text-xs sm:text-sm shadow-sm hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Lưu Cấu Hình Google Ads</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
