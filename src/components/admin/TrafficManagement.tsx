"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { LeadRecord } from "@/lib/types";
import { SiteConfigType } from "@/lib/configStorage";
import { getAdminHeaders } from "@/lib/clientAdminAuth";
import type { DailyTrafficBucket, RecentVisit } from "@/lib/trafficStorage";
import {
  BarChart3,
  Users,
  Eye,
  Smartphone,
  Monitor,
  TrendingUp,
  RefreshCw,
  Trash2,
  Globe,
  Save,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface TrafficManagementProps {
  config: SiteConfigType;
  leads: LeadRecord[];
  onSaveConfig: (updatedConfig: Partial<SiteConfigType>) => Promise<boolean>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

function getVnDateKey(offsetDays = 0): string {
  const now = new Date();
  const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000 - offsetDays * 86400000);
  return vnTime.toISOString().slice(0, 10);
}

export default function TrafficManagement({
  config,
  leads,
  onSaveConfig,
  showToast,
}: TrafficManagementProps) {
  const [daily, setDaily] = useState<Record<string, DailyTrafficBucket>>({});
  const [recent, setRecent] = useState<RecentVisit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rangeDays, setRangeDays] = useState<1 | 7 | 30>(7);

  const [ga4Id, setGa4Id] = useState<string>(
    (config.tracking as any)?.googleAnalyticsId || ""
  );
  const [enableGa4, setEnableGa4] = useState<boolean>(
    Boolean((config.tracking as any)?.enableGa4)
  );
  const [isSavingGa4, setIsSavingGa4] = useState(false);

  const fetchTraffic = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/traffic", {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setDaily(data.daily || {});
        setRecent(data.recent || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTraffic();
  }, [fetchTraffic]);

  useEffect(() => {
    setGa4Id((config.tracking as any)?.googleAnalyticsId || "");
    setEnableGa4(Boolean((config.tracking as any)?.enableGa4));
  }, [config]);

  // Build ordered date keys for selected range
  const dateKeys = useMemo(() => {
    const keys: string[] = [];
    for (let i = rangeDays - 1; i >= 0; i -= 1) {
      keys.push(getVnDateKey(i));
    }
    return keys;
  }, [rangeDays]);

  const summary = useMemo(() => {
    let pageviews = 0;
    let sessions = 0;
    let mobile = 0;
    let desktop = 0;
    const sources: Record<string, number> = {};
    const pages: Record<string, number> = {};

    for (const key of dateKeys) {
      const b = daily[key];
      if (!b) continue;
      pageviews += b.pageviews;
      sessions += b.sessions;
      mobile += b.mobile;
      desktop += b.desktop;
      for (const [src, cnt] of Object.entries(b.sources || {})) {
        sources[src] = (sources[src] || 0) + cnt;
      }
      for (const [pg, cnt] of Object.entries(b.pages || {})) {
        pages[pg] = (pages[pg] || 0) + cnt;
      }
    }

    const totalDevices = mobile + desktop;
    const mobilePct = totalDevices > 0 ? Math.round((mobile / totalDevices) * 100) : 0;

    // Leads created within dateKeys
    const keySet = new Set(dateKeys);
    const periodLeads = leads.filter((l) => {
      const vnDate = new Date(new Date(l.createdAt).getTime() + 7 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      return keySet.has(vnDate);
    }).length;

    const trafficToLeadRate =
      sessions > 0 ? ((periodLeads / sessions) * 100).toFixed(1) : "0.0";

    const sortedSources = Object.entries(sources).sort((a, b) => b[1] - a[1]);
    const sortedPages = Object.entries(pages).sort((a, b) => b[1] - a[1]);
    const maxDailyPv = Math.max(
      1,
      ...dateKeys.map((k) => daily[k]?.pageviews || 0)
    );

    return {
      pageviews,
      sessions,
      mobile,
      desktop,
      mobilePct,
      periodLeads,
      trafficToLeadRate,
      sortedSources,
      sortedPages,
      maxDailyPv,
    };
  }, [daily, dateKeys, leads]);

  const handleSaveGa4 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGa4(true);
    const ok = await onSaveConfig({
      tracking: {
        ...config.tracking,
        googleAnalyticsId: ga4Id.trim(),
        enableGa4,
      } as any,
    });
    setIsSavingGa4(false);
    if (ok) {
      showToast("Đã lưu cấu hình Google Analytics 4!", "success");
    } else {
      showToast("Lỗi khi lưu cấu hình GA4.", "error");
    }
  };

  const handleClearTraffic = async () => {
    if (!window.confirm("Bạn muốn xóa toàn bộ dữ liệu thống kê truy cập nội bộ?")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/traffic", {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        setDaily({});
        setRecent([]);
        showToast("Đã đặt lại dữ liệu lưu lượng truy cập.", "success");
      }
    } catch {
      showToast("Không thể xóa dữ liệu.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Range Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#F37021]" />
            <span>Thống Kê Lưu Lượng Truy Cập &amp; Chuyển Đổi Website</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Đo lường tự động mọi lượt xem thực (bỏ qua bot &amp; trang Admin, không bị AdBlock chặn).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 gap-1">
            {[
              { days: 1 as const, label: "Hôm nay" },
              { days: 7 as const, label: "7 ngày" },
              { days: 30 as const, label: "30 ngày" },
            ].map((opt) => (
              <button
                key={opt.days}
                type="button"
                onClick={() => setRangeDays(opt.days)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  rangeDays === opt.days
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchTraffic}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>

          {recent.length > 0 && (
            <button
              type="button"
              onClick={handleClearTraffic}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. 4 Main Traffic KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Lượt Xem Trang
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F37021] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary.pageviews.toLocaleString("vi-VN")}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Trong {rangeDays === 1 ? "hôm nay" : `${rangeDays} ngày qua`}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Phiên Truy Cập
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary.sessions.toLocaleString("vi-VN")}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Khách truy cập thực tế
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Traffic → Lead
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {summary.trafficToLeadRate}%
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-1">
            <strong>{summary.periodLeads}</strong> đơn đăng ký từ{" "}
            <strong>{summary.sessions}</strong> phiên
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Thiết Bị (Mobile / PC)
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>{summary.mobilePct}%</span>
            <span className="text-xs font-semibold text-slate-400">Mobile</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> {summary.mobile}
            </span>
            <span className="inline-flex items-center gap-1">
              <Monitor className="w-3 h-3" /> {summary.desktop}
            </span>
          </p>
        </div>
      </div>

      {/* 3. Daily Trend Chart + Sources + Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Daily Bar Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <h4 className="font-bold text-sm text-slate-900 mb-4">
            Biểu Đồ Lượt Xem Theo Ngày
          </h4>
          <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-4 border-b border-slate-100">
            {dateKeys.map((k) => {
              const pv = daily[k]?.pageviews || 0;
              const pct = Math.max(4, Math.round((pv / summary.maxDailyPv) * 100));
              const shortLabel = k.slice(5); // MM-DD
              return (
                <div
                  key={k}
                  className="flex-1 flex flex-col items-center justify-end h-full group"
                  title={`${k}: ${pv} lượt xem (${daily[k]?.sessions || 0} phiên)`}
                >
                  <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {pv}
                  </span>
                  <div
                    className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-[#F37021] to-[#FF9B54] transition-all group-hover:opacity-85"
                    style={{ height: `${pv === 0 ? 4 : pct}%`, opacity: pv === 0 ? 0.25 : 1 }}
                  />
                  {rangeDays <= 7 && (
                    <span className="text-[10px] text-slate-400 mt-1.5 font-medium">
                      {shortLabel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {rangeDays === 30 && (
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>{dateKeys[0]}</span>
              <span>{dateKeys[dateKeys.length - 1]}</span>
            </div>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <h4 className="font-bold text-sm text-slate-900 mb-3">
            Nguồn Truy Cập
          </h4>
          {summary.sortedSources.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">Chưa có dữ liệu.</p>
          ) : (
            <div className="space-y-2.5">
              {summary.sortedSources.map(([src, count]) => {
                const pct =
                  summary.pageviews > 0
                    ? Math.round((count / summary.pageviews) * 100)
                    : 0;
                return (
                  <div key={src} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{src}</span>
                      <span className="font-bold text-slate-600">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#F37021]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Pages */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <h4 className="font-bold text-sm text-slate-900 mb-3">
            Trang Xem Nhiều Nhất
          </h4>
          {summary.sortedPages.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">Chưa có dữ liệu.</p>
          ) : (
            <div className="space-y-2">
              {summary.sortedPages.slice(0, 7).map(([pg, count]) => (
                <div
                  key={pg}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0"
                >
                  <span className="font-mono text-[11px] text-slate-700 truncate max-w-[160px]">
                    {pg}
                  </span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Google Analytics 4 (GA4) Config Card */}
      <form
        onSubmit={handleSaveGa4}
        className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>Kết Nối Google Analytics 4 (GA4)</span>
                {enableGa4 && ga4Id ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Đang bật ({ga4Id})
                  </span>
                ) : null}
              </h4>
              <p className="text-xs text-slate-500">
                Dán mã đo lường <code>G-XXXXXXXXXX</code> từ Google Analytics để xem báo cáo chuyên sâu và liên kết Remarketing với Google Ads.
              </p>
            </div>
          </div>
          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
          >
            <span>Mở Google Analytics</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              GA4 Measurement ID
            </label>
            <input
              type="text"
              value={ga4Id}
              onChange={(e) => setGa4Id(e.target.value)}
              placeholder="VD: G-ABC123XYZ9"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#F37021] focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 sm:pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={enableGa4}
                onChange={(e) => setEnableGa4(e.target.checked)}
                className="w-4 h-4 text-[#F37021] rounded border-slate-300 focus:ring-[#F37021] cursor-pointer"
              />
              <span>Kích hoạt Google Analytics 4</span>
            </label>

            <button
              type="submit"
              disabled={isSavingGa4}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer disabled:opacity-60"
            >
              {isSavingGa4 ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Lưu GA4</span>
            </button>
          </div>
        </div>
      </form>

      {/* 5. Recent Visits Feed */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
        <h4 className="font-bold text-sm text-slate-900 mb-3">
          Lượt Truy Cập Gần Đây (Realtime)
        </h4>
        {recent.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Chưa có lượt truy cập mới được ghi nhận. Khi khách vào trang chủ hoặc các trang gói cước, dữ liệu sẽ cập nhật ngay tại đây.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                  <th className="py-2 pr-3">Thời gian</th>
                  <th className="py-2 px-3">Trang đã xem</th>
                  <th className="py-2 px-3">Nguồn</th>
                  <th className="py-2 px-3">Thiết bị</th>
                  <th className="py-2 pl-3">Chiến dịch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.slice(0, 25).map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70">
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-500">
                      {new Date(v.timestamp).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-800">
                      {v.path}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-700">
                      {v.source}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {v.device === "mobile" ? "Mobile" : "Desktop"}
                    </td>
                    <td className="py-2 pl-3 text-slate-500 font-mono text-[11px]">
                      {v.campaign || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
