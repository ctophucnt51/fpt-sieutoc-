"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminHeaders } from "@/lib/clientAdminAuth";
import type { WatchlistKeyword, GscCacheData } from "@/lib/seoStorage";
import type { PageAuditResult } from "@/lib/seoAuditor";
import {
  Search,
  TrendingUp,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Settings,
  BarChart3,
  Globe,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  FileSearch,
} from "lucide-react";

interface PublicSeoConfig {
  gscSettings: {
    siteUrl: string;
    serviceAccountEmail: string;
    hasPrivateKey: boolean;
    connected: boolean;
    lastSyncedAt?: string;
    lastError?: string;
  };
  watchlistKeywords: WatchlistKeyword[];
  gscCache: GscCacheData | null;
}

interface SeoManagementProps {
  onShowToast: (msg: string, type?: "success" | "error") => void;
}

export default function SeoManagement({ onShowToast }: SeoManagementProps) {
  const [subTab, setSubTab] = useState<"ranks" | "audit" | "settings">("ranks");
  const [seoData, setSeoData] = useState<PublicSeoConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dateRange, setDateRange] = useState<"7d" | "28d" | "90d">("28d");

  // Watchlist add state
  const [newKeyword, setNewKeyword] = useState("");
  const [newTargetUrl, setNewTargetUrl] = useState("/");
  const [querySearch, setQuerySearch] = useState("");

  // GSC Settings state
  const [siteUrl, setSiteUrl] = useState("https://gofpt.vn/");
  const [serviceAccountEmail, setServiceAccountEmail] = useState("");
  const [serviceAccountJson, setServiceAccountJson] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Site Audit state
  const [auditResults, setAuditResults] = useState<PageAuditResult[]>([]);
  const [avgAuditScore, setAvgAuditScore] = useState<number | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const loadSeoData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/seo", { headers: getAdminHeaders() });
      const data = await res.json();
      if (res.ok && data.seo) {
        setSeoData(data.seo);
        setSiteUrl(data.seo.gscSettings.siteUrl || "https://gofpt.vn/");
        setServiceAccountEmail(data.seo.gscSettings.serviceAccountEmail || "");
        if (data.seo.gscCache?.dateRange) {
          setDateRange(data.seo.gscCache.dateRange);
        }
      }
    } catch {
      onShowToast("Không thể tải dữ liệu SEO.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    loadSeoData();
  }, [loadSeoData]);

  const handleSyncGsc = async (range = dateRange) => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify({ action: "sync_gsc", dateRange: range }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeoData(data.seo);
        onShowToast(data.message || "Đồng bộ Google Search Console thành công!", "success");
      } else {
        if (!seoData?.gscSettings.connected) {
          setSubTab("settings");
        }
        onShowToast(data.message || "Chưa thể đồng bộ Google Search Console.", "error");
      }
    } catch {
      onShowToast("Lỗi kết nối tới máy chủ.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify({
          action: "save_gsc_settings",
          siteUrl,
          serviceAccountEmail,
          serviceAccountJson: serviceAccountJson.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeoData(data.seo);
        setServiceAccountJson("");
        onShowToast("Đã lưu cấu hình Google Search Console API!", "success");
      } else {
        onShowToast(data.message || "Lỗi lưu cấu hình.", "error");
      }
    } catch {
      onShowToast("Lỗi kết nối máy chủ.", "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify({
          action: "add_keyword",
          keyword: newKeyword.trim(),
          targetUrl: newTargetUrl.trim() || "/",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeoData(data.seo);
        setNewKeyword("");
        onShowToast(data.message, "success");
      } else {
        onShowToast(data.message || "Không thể thêm từ khóa.", "error");
      }
    } catch {
      onShowToast("Lỗi kết nối máy chủ.", "error");
    }
  };

  const handleRemoveKeyword = async (id: string) => {
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify({ action: "remove_keyword", id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeoData(data.seo);
        onShowToast("Đã xóa từ khóa.", "success");
      }
    } catch {
      onShowToast("Lỗi kết nối máy chủ.", "error");
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch("/api/admin/seo/audit", {
        method: "POST",
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuditResults(data.results || []);
        setAvgAuditScore(data.avgScore);
        onShowToast(`Đã kiểm tra xong ${data.results?.length || 0} trang!`, "success");
      } else {
        onShowToast(data.message || "Lỗi kiểm tra SEO On-Page.", "error");
      }
    } catch {
      onShowToast("Lỗi kết nối máy chủ.", "error");
    } finally {
      setIsAuditing(false);
    }
  };

  const renderPositionBadge = (pos: number | null) => {
    if (pos === null || pos === undefined || pos === 0) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
          Chưa có dữ liệu
        </span>
      );
    }
    if (pos <= 3) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black">
          Top #{pos}
        </span>
      );
    }
    if (pos <= 10) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-black">
          Top #{pos}
        </span>
      );
    }
    if (pos <= 30) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold">
          Top #{pos}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
        Top #{pos}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="py-16 flex items-center justify-center text-slate-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#F37021]" />
        <span className="text-sm font-medium">Đang tải trung tâm SEO...</span>
      </div>
    );
  }

  const gscCache = seoData?.gscCache;
  const gscSettings = seoData?.gscSettings;
  const watchlist = seoData?.watchlistKeywords || [];
  const filteredQueries = (gscCache?.topQueries || []).filter((q) =>
    q.query.toLowerCase().includes(querySearch.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Subtabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Trung Tâm SEO &amp; Thứ Hạng Google
            </h2>
            {gscSettings?.connected ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                Đã kết nối GSC
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                <AlertCircle className="w-3 h-3" />
                Chưa kết nối GSC API
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi thứ hạng từ khóa thực tế từ Google Search Console, kiểm tra SEO On-Page và tuân thủ Google Ads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubTab("ranks")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              subTab === "ranks"
                ? "bg-[#F37021] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Top Từ Khóa</span>
          </button>

          <button
            onClick={() => setSubTab("audit")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              subTab === "audit"
                ? "bg-[#F37021] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Kiểm Tra On-Page</span>
          </button>

          <button
            onClick={() => setSubTab("settings")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              subTab === "settings"
                ? "bg-[#F37021] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Kết Nối GSC API</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: KEYWORD RANK TRACKER & GSC DATA */}
      {subTab === "ranks" && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Khoảng thời gian:</span>
              {(["7d", "28d", "90d"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setDateRange(r);
                    if (gscSettings?.connected) handleSyncGsc(r);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    dateRange === r
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {r === "7d" ? "7 ngày" : r === "28d" ? "28 ngày" : "90 ngày"}
                </button>
              ))}
              {gscSettings?.lastSyncedAt && (
                <span className="text-[11px] text-slate-400 hidden sm:inline ml-2">
                  Cập nhật: {new Date(gscSettings.lastSyncedAt).toLocaleString("vi-VN")}
                </span>
              )}
            </div>

            <button
              onClick={() => handleSyncGsc(dateRange)}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F37021] to-[#FF7A00] hover:from-[#E05D10] hover:to-[#F37021] text-white text-xs font-extrabold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Đang đồng bộ..." : "Đồng bộ Google Search Console"}</span>
            </button>
          </div>

          {!gscSettings?.connected && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Chưa kết nối Google Search Console API:</strong>{" "}
                  Vui lòng vào tab <strong>Kết Nối GSC API</strong> để dán file JSON Service Account và xem thứ hạng từ khóa thực tế từ Google.
                </div>
              </div>
              <button
                onClick={() => setSubTab("settings")}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                Cấu hình ngay →
              </button>
            </div>
          )}

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Tổng Lượt Click (SEO)</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {gscCache ? gscCache.totals.clicks.toLocaleString("vi-VN") : "—"}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">Từ tìm kiếm Google</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Tổng Lượt Hiển Thị</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {gscCache ? gscCache.totals.impressions.toLocaleString("vi-VN") : "—"}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Impressions</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Tỷ Lệ Nhấp (CTR)</span>
              <div className="text-2xl font-black text-[#F37021] mt-1">
                {gscCache ? `${gscCache.totals.ctr}%` : "—"}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Trung bình toàn trang</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Vị Trí Trung Bình Web</span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {gscCache && gscCache.totals.position > 0 ? `#${gscCache.totals.position}` : "—"}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Thứ hạng Google TB</span>
            </div>
          </div>

          {/* Watchlist Target Keywords */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Từ Khóa Mục Tiêu Đang Theo Dõi ({watchlist.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Tự động đối chiếu vị trí hiện tại của từng từ khóa khi đồng bộ Google Search Console.
                </p>
              </div>

              <form onSubmit={handleAddKeyword} className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Nhập từ khóa mới..."
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#F37021] min-w-[180px]"
                />
                <input
                  type="text"
                  value={newTargetUrl}
                  onChange={(e) => setNewTargetUrl(e.target.value)}
                  placeholder="URL đích (VD: /bang-gia)"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#F37021] w-[140px]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Key</span>
                </button>
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Từ khóa mục tiêu</th>
                    <th className="py-3 px-4">Vị trí Top</th>
                    <th className="py-3 px-4">Biến động</th>
                    <th className="py-3 px-4">Clicks / Hiển thị</th>
                    <th className="py-3 px-4">CTR</th>
                    <th className="py-3 px-4">URL Đích</th>
                    <th className="py-3 px-4 text-right">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {watchlist.map((kw) => {
                    const diff =
                      kw.lastPosition !== null && kw.previousPosition !== null
                        ? Number((kw.previousPosition - kw.lastPosition).toFixed(1))
                        : null;
                    return (
                      <tr key={kw.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div>{kw.keyword}</div>
                          {kw.matchedQuery && kw.matchedQuery !== kw.keyword && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              Khớp GSC: &quot;{kw.matchedQuery}&quot;
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">{renderPositionBadge(kw.lastPosition)}</td>
                        <td className="py-3 px-4">
                          {diff === null || diff === 0 ? (
                            <span className="text-slate-400">—</span>
                          ) : diff > 0 ? (
                            <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold">
                              <ArrowUpRight className="w-3.5 h-3.5" />+{diff}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-red-600 font-bold">
                              <ArrowDownRight className="w-3.5 h-3.5" />
                              {diff}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {kw.clicks} / {kw.impressions.toLocaleString("vi-VN")}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">{kw.ctr}%</td>
                        <td className="py-3 px-4 text-blue-600 font-mono text-[11px]">
                          {kw.targetUrl}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleRemoveKeyword(kw.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Xóa từ khóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* All Top Queries from GSC + Top Pages */}
          {gscCache && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Top Queries */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#F37021]" />
                    <span>Top Từ Khóa Thực Tế (GSC)</span>
                  </h3>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={querySearch}
                      onChange={(e) => setQuerySearch(e.target.value)}
                      placeholder="Lọc từ khóa..."
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#F37021]"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[380px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0">
                      <tr>
                        <th className="py-2.5 px-4">Từ khóa tìm kiếm</th>
                        <th className="py-2.5 px-3">Top #</th>
                        <th className="py-2.5 px-3">Clicks</th>
                        <th className="py-2.5 px-3">Hiển thị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredQueries.slice(0, 50).map((q, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-medium text-slate-800">{q.query}</td>
                          <td className="py-2.5 px-3">{renderPositionBadge(q.position)}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{q.clicks}</td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {q.impressions.toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Pages */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Top Trang Đang Lên Hạng</span>
                  </h3>
                </div>
                <div className="overflow-x-auto max-h-[380px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0">
                      <tr>
                        <th className="py-2.5 px-4">Đường dẫn (URL)</th>
                        <th className="py-2.5 px-3">Top #</th>
                        <th className="py-2.5 px-3">Clicks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {gscCache.topPages.slice(0, 25).map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono text-[11px] text-blue-700 truncate max-w-[220px]">
                            {p.page.replace(/^https?:\/\/[^/]+/, "") || "/"}
                          </td>
                          <td className="py-2.5 px-3">{renderPositionBadge(p.position)}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{p.clicks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: ON-PAGE SEO AUDITOR */}
      {subTab === "audit" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Kiểm Tra Sức Khỏe SEO On-Page &amp; Google Ads
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quét trực tiếp tất cả trang con: Title, Meta Description, H1, Alt ảnh, OpenGraph và cụm từ nhạy cảm Google Ads.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {avgAuditScore !== null && (
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
                  Điểm TB: {avgAuditScore}/100
                </div>
              )}
              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <FileSearch className={`w-4 h-4 ${isAuditing ? "animate-pulse" : ""}`} />
                <span>{isAuditing ? "Đang quét 13 trang..." : "Quét Toàn Bộ Website"}</span>
              </button>
            </div>
          </div>

          {auditResults.length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {auditResults.map((item) => (
                <div
                  key={item.route}
                  className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          item.score >= 90
                            ? "bg-emerald-100 text-emerald-800"
                            : item.score >= 70
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.score}/100đ
                      </span>
                      <span className="font-bold text-sm text-slate-900">{item.name}</span>
                      <span className="font-mono text-xs text-blue-600">{item.route}</span>
                      {item.googleAdsSafe ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          Chuẩn Google Ads
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">
                          Cảnh báo Google Ads
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 truncate">
                      <strong>Title ({item.titleLength}):</strong> {item.title || "—"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      <strong>Desc ({item.descriptionLength}):</strong> {item.description || "—"}
                    </p>

                    {item.issues.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 text-[11px] text-amber-700 font-medium">
                        {item.issues.map((iss, i) => (
                          <li key={i}>• {iss}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                      H1: {item.h1Count} • Thiếu Alt: {item.imagesWithoutAlt}
                    </span>
                    <a
                      href={item.route}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="Mở trang"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: GOOGLE SEARCH CONSOLE SETTINGS */}
      {subTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <form
            onSubmit={handleSaveSettings}
            className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs"
          >
            <h3 className="text-base font-black text-slate-900">
              Cấu Hình Kết Nối Google Search Console API
            </h3>

            {gscSettings?.lastError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                <strong>Lỗi kết nối gần nhất:</strong> {gscSettings.lastError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Site URL trên Google Search Console *
              </label>
              <input
                type="text"
                required
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="VD: https://gofpt.vn/ hoặc sc-domain:gofpt.vn"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-[#F37021]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Phải khớp chính xác 100% với tên miền thuộc tính (Property) trong Google Search Console của bạn.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Service Account Email (client_email)
              </label>
              <input
                type="text"
                value={serviceAccountEmail}
                onChange={(e) => setServiceAccountEmail(e.target.value)}
                placeholder="VD: fpt-seo@my-project.iam.gserviceaccount.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#F37021] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dán toàn bộ nội dung file JSON Service Account{" "}
                {gscSettings?.hasPrivateKey && (
                  <span className="text-emerald-600 font-bold">(Đã lưu Private Key an toàn)</span>
                )}
              </label>
              <textarea
                rows={6}
                value={serviceAccountJson}
                onChange={(e) => setServiceAccountJson(e.target.value)}
                placeholder='Dán nội dung file .json tải từ Google Cloud Console vào đây ({"type": "service_account", "client_email": "...", "private_key": "..."})'
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono outline-none focus:border-[#F37021]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-5 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#E05D10] text-white text-xs font-extrabold cursor-pointer disabled:opacity-60"
              >
                {isSavingSettings ? "Đang lưu..." : "Lưu Cấu Hình API"}
              </button>

              <button
                type="button"
                onClick={() => handleSyncGsc(dateRange)}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer disabled:opacity-60"
              >
                {isSyncing ? "Đang kiểm tra..." : "Kiểm Tra & Đồng Bộ Ngay"}
              </button>
            </div>
          </form>

          {/* Setup Guide + Sitemap Links */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
              <h3 className="text-sm font-black text-slate-900">
                Hướng dẫn kết nối trong 3 bước (Miễn phí 100%)
              </h3>
              <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
                <li>
                  Vào <strong>Google Cloud Console</strong> ➔ Bật API{" "}
                  <code className="bg-slate-100 px-1 py-0.5 rounded">Google Search Console API</code>.
                </li>
                <li>
                  Vào mục <strong>Credentials ➔ Create Service Account</strong> ➔ Tạo key dạng{" "}
                  <strong>JSON</strong> và tải về máy.
                </li>
                <li>
                  Mở <strong>Google Search Console</strong> của website ➔{" "}
                  <strong>Cài đặt ➔ Người dùng và quyền</strong> ➔ Thêm email của Service Account (quyền <em>Restricted / Bị hạn chế</em> hoặc <em>Full</em>).
                </li>
                <li>Mở file JSON vừa tải, copy toàn bộ dán vào ô bên trái và bấm Lưu.</li>
              </ol>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2.5 shadow-2xs">
              <h3 className="text-sm font-black text-slate-900">Kiểm tra Sitemap &amp; Robots</h3>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <span>Xem sitemap.xml</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <span>Xem robots.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
