"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { SiteConfigType } from "@/lib/configStorage";
import { getAdminHeaders } from "@/lib/clientAdminAuth";
import type {
  DailyTrafficBucket,
  RecentVisit,
  SuspiciousIpReport,
} from "@/lib/trafficStorage";
import {
  BarChart3,
  Users,
  Eye,
  Smartphone,
  Monitor,
  RefreshCw,
  Trash2,
  Globe,
  Save,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Activity,
  MapPin,
  ShieldAlert,
  Copy,
  Ban,
  ShieldCheck,
} from "lucide-react";

interface TrafficManagementProps {
  config: SiteConfigType;
  onSaveConfig: (updatedConfig: Partial<SiteConfigType>) => Promise<boolean>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

function getVnDateKey(offsetDays = 0): string {
  const now = new Date();
  const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000 - offsetDays * 86400000);
  return vnTime.toISOString().slice(0, 10);
}

function formatRelativeMinutes(iso: string): string | null {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 0 || diffMs > 30 * 60 * 1000) return null;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Vừa xong";
  return `${mins} phút trước`;
}

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}p ${s}s` : `${m}p`;
}

export default function TrafficManagement({
  showToast,
}: TrafficManagementProps) {
  const [daily, setDaily] = useState<Record<string, DailyTrafficBucket>>({});
  const [recent, setRecent] = useState<RecentVisit[]>([]);
  const [suspiciousIps, setSuspiciousIps] = useState<SuspiciousIpReport[]>([]);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rangeDays, setRangeDays] = useState<1 | 7 | 30>(7);

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
        setSuspiciousIps(data.suspiciousIps || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleIpAction = async (
    ip: string,
    action: "blocked" | "whitelisted" | "reset"
  ) => {
    try {
      const res = await fetch("/api/admin/traffic", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify({ ip, action }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuspiciousIps(data.suspiciousIps || []);
        showToast(
          action === "blocked"
            ? `Đã đánh dấu chặn IP ${ip}`
            : action === "whitelisted"
            ? `Đã đánh dấu IP ${ip} an toàn`
            : `Đã đặt lại trạng thái IP ${ip}`
        );
      }
    } catch {
      showToast("Không thể cập nhật trạng thái IP.", "error");
    }
  };

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Đã copy ${label} vào bộ nhớ tạm!`);
    } catch {
      showToast("Trình duyệt không cho phép copy tự động.", "error");
    }
  };

  const suspiciousIpMap = useMemo(() => {
    const map = new Map<string, SuspiciousIpReport>();
    for (const item of suspiciousIps) {
      if (item.status !== "whitelisted") {
        map.set(item.ip, item);
      }
    }
    return map;
  }, [suspiciousIps]);

  const googleOnlyRecent = useMemo(() => {
    return recent.filter(
      (v) => v.source === "Google Ads" || v.source === "Google Search"
    );
  }, [recent]);

  const displayedRecent = useMemo(() => {
    return showAllRecent ? recent.slice(0, 100) : googleOnlyRecent.slice(0, 50);
  }, [showAllRecent, recent, googleOnlyRecent]);

  useEffect(() => {
    fetchTraffic();
  }, [fetchTraffic]);

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

    // 30-minute real-time window
    const cutoff30m = Date.now() - 30 * 60 * 1000;
    const visits30m = recent.filter((v) => new Date(v.timestamp).getTime() >= cutoff30m);
    const uniqueVisitors30m = new Set(
      visits30m.map((v) => v.sessionId || v.ip || v.id)
    ).size;

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
      last30mPageviews: visits30m.length,
      last30mVisitors: uniqueVisitors30m,
      sortedSources,
      sortedPages,
      maxDailyPv,
    };
  }, [daily, dateKeys, recent]);

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
            <span>Tổng Quan Lưu Lượng Truy Cập Website</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi lượt truy cập 30 phút gần nhất, IP, vị trí, thiết bị và nguồn truy cập chi tiết (đã lọc bỏ bot &amp; trang Admin).
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
              title="Xóa dữ liệu truy cập"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. 4 Main Traffic KPI Cards (Không hiển thị Lead) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 30-Minute Live Traffic */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              30 Phút Gần Nhất
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {summary.last30mVisitors}
            <span className="text-xs font-bold text-emerald-600 ml-1.5">khách</span>
          </div>
          <p className="text-[11px] text-emerald-800/80 mt-1">
            <strong>{summary.last30mPageviews}</strong> lượt xem trang trong 30 phút qua
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tổng Lượt Xem
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
            Phiên người dùng thực tế
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
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <h4 className="font-bold text-sm text-slate-900 mb-4">
            Biểu Đồ Lượt Xem Theo Ngày
          </h4>
          <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-4 border-b border-slate-100">
            {dateKeys.map((k) => {
              const pv = daily[k]?.pageviews || 0;
              const pct = Math.max(4, Math.round((pv / summary.maxDailyPv) * 100));
              const shortLabel = k.slice(5);
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

      {/* 3.5. Anti-Click-Fraud Shield (Google Ads) */}
      <div className="bg-white rounded-2xl border border-red-200/90 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>Lá Chắn Chống Click Tặc (Google Ads)</span>
                {suspiciousIps.filter((i) => i.status === "pending").length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black">
                    {suspiciousIps.filter((i) => i.status === "pending").length} IP cần xử lý
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Tự động phát hiện IP bấm quảng cáo lặp lại bất thường (&ge; 2 lượt Ads hoặc nhiều mã GCLID khác nhau), gửi cảnh báo về Telegram và hỗ trợ copy nhanh vào mục Loại trừ IP của Google Ads.
              </p>
            </div>
          </div>

          {suspiciousIps.filter((i) => i.status === "pending").length > 0 && (
            <button
              type="button"
              onClick={() =>
                handleCopyText(
                  suspiciousIps
                    .filter((i) => i.status === "pending")
                    .map((i) => i.ip)
                    .join("\n"),
                  "danh sách IP nghi vấn"
                )
              }
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Tất Cả IP Chặn</span>
            </button>
          )}
        </div>

        {suspiciousIps.length === 0 ? (
          <div className="py-5 px-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Chưa phát hiện IP nào bấm quảng cáo lặp lại bất thường. Hệ thống vẫn đang giám sát realtime và sẽ báo về Telegram ngay khi có nghi vấn.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                  <th className="py-2.5 pr-3">IP &amp; Vị trí</th>
                  <th className="py-2.5 px-3">Mức độ nghi vấn</th>
                  <th className="py-2.5 px-3">Tần suất Ads</th>
                  <th className="py-2.5 px-3">Từ khóa đã bấm</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 pl-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suspiciousIps.map((item) => (
                  <tr
                    key={item.ip}
                    className={
                      item.status === "pending" && item.riskLevel === "high"
                        ? "bg-red-50/40 hover:bg-red-50/70"
                        : "hover:bg-slate-50/70"
                    }
                  >
                    <td className="py-2.5 pr-3">
                      <div className="font-mono text-xs font-black text-slate-900">
                        {item.ip}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.location} • {item.device}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.riskLevel === "high" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10.5px] border border-red-200">
                          🔴 Nghi vấn cao
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10.5px] border border-amber-200">
                          🟠 Cần theo dõi
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">
                        {item.totalAdsClicks} lượt Ads
                      </div>
                      <div className="text-[10.5px] text-slate-500">
                        {item.uniqueGclids > 0
                          ? `${item.uniqueGclids} mã GCLID riêng`
                          : `${item.uniqueSessions} phiên`}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {item.keywords.map((kw) => (
                            <span
                              key={kw}
                              className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10.5px] font-semibold"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {item.status === "blocked" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-white text-[10.5px] font-bold">
                          Đã chặn Ads
                        </span>
                      ) : item.status === "whitelisted" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-bold">
                          Đã bỏ qua
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-[10.5px] font-bold">
                          Chờ xử lý
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 pl-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyText(item.ip, `IP ${item.ip}`)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                          title="Copy IP để dán vào Google Ads"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                        {item.status !== "blocked" && (
                          <button
                            type="button"
                            onClick={() => handleIpAction(item.ip, "blocked")}
                            className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                            title="Đánh dấu đã đưa IP vào danh sách chặn Google Ads"
                          >
                            <Ban className="w-3 h-3" />
                            <span>Đã chặn</span>
                          </button>
                        )}
                        {item.status !== "whitelisted" ? (
                          <button
                            type="button"
                            onClick={() => handleIpAction(item.ip, "whitelisted")}
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-[11px] cursor-pointer"
                            title="Đánh dấu IP an toàn"
                          >
                            Bỏ qua
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleIpAction(item.ip, "reset")}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-[11px] cursor-pointer"
                          >
                            Hoàn tác
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Recent Visits Feed with IP, Location & Exact Source */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              Chi Tiết Từng Lượt Truy Cập (Realtime &amp; 30 Phút Gần Nhất)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {showAllRecent
                ? `Đang mở rộng xem đầy đủ tất cả nguồn (${recent.length} lượt gần nhất).`
                : `Mặc định chỉ hiển thị nguồn Google Ads & Google Search (${googleOnlyRecent.length} lượt) để dễ theo dõi.`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              30 phút qua: {summary.last30mPageviews} lượt
            </span>
            <button
              type="button"
              onClick={() => setShowAllRecent((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                showAllRecent
                  ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                  : "bg-orange-50 text-fpt-orange border-orange-200 hover:bg-orange-100"
              }`}
            >
              {showAllRecent
                ? "Thu gọn (Chỉ Google Ads & Search)"
                : `Chi tiết mở rộng (Xem tất cả ${recent.length})`}
            </button>
          </div>
        </div>

        {displayedRecent.length === 0 ? (
          <div className="text-xs text-slate-500 py-6 px-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <p>
              {showAllRecent
                ? "Chưa có lượt truy cập mới được ghi nhận."
                : "Chưa có lượt truy cập nào từ nguồn Google Ads hoặc Google Search trong danh sách gần nhất."}
            </p>
            {!showAllRecent && recent.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAllRecent(true)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 cursor-pointer"
              >
                Mở rộng xem {recent.length} lượt từ nguồn khác (Direct, Facebook, Zalo...)
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                  <th className="py-2.5 pr-3">Thời gian &amp; Ở lại</th>
                  <th className="py-2.5 px-3">IP &amp; Vị trí</th>
                  <th className="py-2.5 px-3">Trang &amp; Hành động</th>
                  <th className="py-2.5 px-3">Nguồn truy cập</th>
                  <th className="py-2.5 pl-3">Thiết bị &amp; Mạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedRecent.map((v) => {
                  const rel = formatRelativeMinutes(v.timestamp);
                  const fraudInfo = v.ip ? suspiciousIpMap.get(v.ip) : undefined;
                  const actions = v.actions && v.actions.length > 0 ? v.actions : [];
                  return (
                    <tr
                      key={v.id}
                      className={
                        fraudInfo
                          ? "bg-red-50/35 hover:bg-red-50/60"
                          : "hover:bg-slate-50/70"
                      }
                    >
                      <td className="py-2.5 pr-3 whitespace-nowrap">
                        <div className="text-slate-700 font-medium">
                          {new Date(v.timestamp).toLocaleTimeString("vi-VN")}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {rel ? (
                            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {rel}
                            </span>
                          ) : (
                            <span className="text-[10.5px] text-slate-400">
                              {new Date(v.timestamp).toLocaleDateString("vi-VN")}
                            </span>
                          )}
                          <span className="inline-block text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            {formatDuration(v.durationSeconds)}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-mono text-[11px] font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                          <span>{v.ip || "—"}</span>
                          {fraudInfo && (
                            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 font-sans text-[9.5px] font-black">
                              ⚠️ Lặp {fraudInfo.totalAdsClicks}x
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#F37021] shrink-0" />
                          <span>{v.location || "Không xác định"}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-mono text-[11px] text-slate-800">{v.path}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {actions.length > 0 ? (
                            actions.map((act) => (
                              <span
                                key={act}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                  act === "Gửi form"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                              >
                                {act}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400">Chỉ xem</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800">{v.source}</div>
                        <div className="text-[11px] text-slate-500">
                          {v.sourceDetail || "—"}
                        </div>
                        {(v.campaign || v.term) && (
                          <div className="text-[10.5px] text-blue-700 font-mono mt-0.5">
                            {v.campaign ? `Camp: ${v.campaign}` : ""}{" "}
                            {v.term ? `• KW: ${v.term}` : ""}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 pl-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {v.device === "mobile" ? (
                              <>
                                <Smartphone className="w-3 h-3" /> Mobile
                              </>
                            ) : (
                              <>
                                <Monitor className="w-3 h-3" /> Desktop
                              </>
                            )}
                          </span>
                          {v.networkType && v.networkType !== "Không rõ" && (
                            <span className="px-1.5 py-0.5 rounded-md bg-orange-50 text-fpt-orange border border-orange-200 font-bold text-[10px]">
                              {v.networkType}
                            </span>
                          )}
                        </div>
                        <div className="text-[10.5px] text-slate-500 mt-0.5">
                          {[v.browser, v.os].filter(Boolean).join(" • ") || "—"}
                          {v.visitorId ? ` • ${v.visitorId.slice(0, 8)}` : ""}
                        </div>
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
  );
}
