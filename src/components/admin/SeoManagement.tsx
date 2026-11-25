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
  Zap,
  Trophy,
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
  serperSettings: {
    hasApiKey: boolean;
    targetDomain: string;
    location: string;
    connected: boolean;
    lastCheckedAt?: string;
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
  const [isCheckingAllSerp, setIsCheckingAllSerp] = useState(false);
  const [checkingSingleId, setCheckingSingleId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"7d" | "28d" | "90d">("28d");

  // Watchlist add state
  const [newKeyword, setNewKeyword] = useState("");
  const [newTargetUrl, setNewTargetUrl] = useState("/");
  const [querySearch, setQuerySearch] = useState("");

  // GSC Settings state
  const [siteUrl, setSiteUrl] = useState("https://gofpt.vn/");
  const [serviceAccountEmail, setServiceAccountEmail] = useState("");
  const [serviceAccountJson, setServiceAccountJson] = useState("");
  const [isSavingGsc, setIsSavingGsc] = useState(false);

  // Serper.dev Settings state
  const [serperApiKey, setSerperApiKey] = useState("");
  const [serperDomain, setSerperDomain] = useState("gofpt.vn");
  const [serperLocation, setSerperLocation] = useState("Can Tho, Vietnam");
  const [isSavingSerper, setIsSavingSerper] = useState(false);

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
        if (data.seo.serperSettings) {
          setSerperDomain(data.seo.serperSettings.targetDomain || "gofpt.vn");
          setSerperLocation(data.seo.serperSettings.location || "Can Tho, Vietnam");
        }
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

  const handleCheckAllSerp = async () => {
    if (!seoData?.serperSettings?.connected) {
      setSubTab("settings");
      onShowToast("Vui lòng nhập Serper.dev API Key trước khi quét Top đối thủ!", "error");
      return;
    }
    setIsCheckingAllSerp(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify({ action: "check_serp_all" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeoData(data.seo);
        onShowToast(data.message || "Đã check Top đối thủ thành công!", "success");
      } else {
        onShowToast(data.message || "Lỗi khi check Top đối thủ.", "error");
      }
    } catch {
      onShowToast("Lỗi kết nối tới máy chủ.", "error");
    } finally {
      setIsCheckingAllSerp(false);
    }
  };

  const handleCheckSingleSerp = async (id: string) => {
    if (!seoData?.serperSettings?.connected) {
      setSubTab("settings");
      onShowToast("Vui lòng nhập Serper.dev API Key trước khi quét!", "error");
      return;
    }
    setCheckingSingleId(id);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify({ action: "check_serp_single", id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeoData(data.seo);
        onShowToast(data.message, "success");
      } else {
        onShowToast(data.message || "Lỗi khi check từ khóa.", "error");
      }
    } catch {
      onShowToast("Lỗi kết nối tới máy chủ.", "error");
    } finally {
      setCheckingSingleId(null);
    }
  };

  const handleSaveGscSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGsc(true);
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
      setIsSavingGsc(false);
    }
  };

  const handleSaveSerperSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSerper(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify({
          action: "save_serper_settings",
          apiKey: serperApiKey.trim() || undefined,
          targetDomain: serperDomain.trim(),
          location: serperLocation.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeoData(data.seo);
        setSerperApiKey("");
        onShowToast("Đã lưu cấu hình Serper.dev SERP API!", "success");
      } else {
        onShowToast(data.message || "Lỗi lưu cấu hình Serper.dev.", "error");
      }
    } catch {
      onShowToast("Lỗi kết nối máy chủ.", "error");
    } finally {
      setIsSavingSerper(false);
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

  const renderPositionBadge = (pos: number | null | undefined, emptyLabel = "Chưa có") => {
    if (pos === null || pos === undefined || pos === 0) {
      return (
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold whitespace-nowrap">
          {emptyLabel}
        </span>
      );
    }
    if (pos <= 3) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black whitespace-nowrap">
          Top #{pos}
        </span>
      );
    }
    if (pos <= 10) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-black whitespace-nowrap">
          Top #{pos}
        </span>
      );
    }
    if (pos <= 30) {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold whitespace-nowrap">
          Top #{pos}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold whitespace-nowrap">
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
  const serperSettings = seoData?.serperSettings;
  const watchlist = seoData?.watchlistKeywords || [];
  const filteredQueries = (gscCache?.topQueries || []).filter((q) =>
    q.query.toLowerCase().includes(querySearch.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Subtabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Trung Tâm SEO &amp; Thứ Hạng Google
            </h2>
            {serperSettings?.connected ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                <Zap className="w-3 h-3" />
                Serper Live Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                Chưa cài Serper
              </span>
            )}
            {gscSettings?.connected ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                GSC Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                <AlertCircle className="w-3 h-3" />
                Chưa cài GSC
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Check Top 1–3 đối thủ theo thời gian thực (Serper.dev), đồng bộ Google Search Console và kiểm tra SEO On-Page.
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
            <span>Top Từ Khóa &amp; Đối Thủ</span>
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
            <span>Kết Nối API</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: KEYWORD RANK TRACKER & SERP COMPETITORS */}
      {subTab === "ranks" && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Khung GSC:</span>
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
              {serperSettings?.lastCheckedAt && (
                <span className="text-[11px] text-slate-400 ml-1">
                  • Check SERP lúc {new Date(serperSettings.lastCheckedAt).toLocaleTimeString("vi-VN")}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCheckAllSerp}
                disabled={isCheckingAllSerp}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
              >
                <Zap className={`w-3.5 h-3.5 text-amber-400 ${isCheckingAllSerp ? "animate-spin" : ""}`} />
                <span>
                  {isCheckingAllSerp ? "Đang quét Google..." : "Check Top Đối Thủ (Realtime)"}
                </span>
              </button>

              <button
                onClick={() => handleSyncGsc(dateRange)}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F37021] to-[#FF7A00] hover:from-[#E05D10] hover:to-[#F37021] text-white text-xs font-extrabold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Đang đồng bộ..." : "Đồng bộ GSC"}</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Tổng Lượt Click (GSC)</span>
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

          {/* Watchlist Target Keywords + Top 1-3 Competitors */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#F37021]" />
                  <span>Bảng Theo Dõi Thứ Hạng &amp; Top 1–3 Đối Thủ ({watchlist.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kiểm tra tức thì website của bạn đang đứng Top mấy và ai đang chiếm Top 1–3 trên Google khu vực{" "}
                  <strong>{serperSettings?.location || "Can Tho, Vietnam"}</strong>.
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
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#F37021] w-[130px]"
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
                    <th className="py-3 px-4">Top Live (SERP)</th>
                    <th className="py-3 px-4">Top 1–3 Đối Thủ Đang Đứng Đầu</th>
                    <th className="py-3 px-4">Top GSC (TB)</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {watchlist.map((kw) => {
                    const serpDiff =
                      kw.serpPosition !== null &&
                      kw.serpPosition !== undefined &&
                      kw.serpPreviousPosition !== null &&
                      kw.serpPreviousPosition !== undefined
                        ? kw.serpPreviousPosition - kw.serpPosition
                        : null;

                    return (
                      <tr key={kw.id} className="hover:bg-slate-50/60 align-top">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-xs sm:text-[13px]">
                            {kw.keyword}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            Đích: {kw.targetUrl}
                          </div>
                          {kw.serpMatchedUrl && (
                            <a
                              href={kw.serpMatchedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium hover:underline mt-0.5"
                            >
                              <span>URL lên top: {kw.serpMatchedUrl.replace(/^https?:\/\/[^/]+/, "") || "/"}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {renderPositionBadge(
                              kw.serpPosition,
                              kw.serpCheckedAt ? "Ngoài Top 30" : "Chưa check"
                            )}
                            {serpDiff !== null && serpDiff !== 0 && (
                              <span
                                className={`inline-flex items-center text-[11px] font-bold ${
                                  serpDiff > 0 ? "text-emerald-600" : "text-red-600"
                                }`}
                              >
                                {serpDiff > 0 ? (
                                  <>
                                    <ArrowUpRight className="w-3 h-3" />+{serpDiff}
                                  </>
                                ) : (
                                  <>
                                    <ArrowDownRight className="w-3 h-3" />
                                    {serpDiff}
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                          {kw.serpCheckedAt && (
                            <span className="block text-[10px] text-slate-400 mt-1">
                              {new Date(kw.serpCheckedAt).toLocaleTimeString("vi-VN")}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 min-w-[260px]">
                          {kw.topCompetitors && kw.topCompetitors.length > 0 ? (
                            <div className="space-y-1">
                              {kw.topCompetitors.map((comp) => (
                                <a
                                  key={comp.position}
                                  href={comp.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={comp.title}
                                  className="flex items-center gap-1.5 group text-[11px]"
                                >
                                  <span
                                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                                      comp.position === 1
                                        ? "bg-amber-400 text-slate-900"
                                        : comp.position === 2
                                        ? "bg-slate-300 text-slate-800"
                                        : "bg-orange-200 text-orange-900"
                                    }`}
                                  >
                                    {comp.position}
                                  </span>
                                  <span className="font-bold text-slate-700 group-hover:text-[#F37021] truncate max-w-[140px]">
                                    {comp.domain}
                                  </span>
                                  <span className="text-slate-400 truncate max-w-[160px] hidden sm:inline">
                                    — {comp.title}
                                  </span>
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">
                              Bấm &quot;Check&quot; để xem Top 1–3 đối thủ
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div>{renderPositionBadge(kw.lastPosition)}</div>
                          <div className="text-[11px] text-slate-500 mt-1 whitespace-nowrap">
                            {kw.clicks} click • {kw.impressions.toLocaleString("vi-VN")} hiển thị
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleCheckSingleSerp(kw.id)}
                              disabled={checkingSingleId === kw.id}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                              title="Check Top 1-3 từ khóa này ngay"
                            >
                              {checkingSingleId === kw.id ? "..." : "Check"}
                            </button>
                            <button
                              onClick={() => handleRemoveKeyword(kw.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              title="Xóa từ khóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* SUBTAB 3: API SETTINGS (SERPER.DEV + GOOGLE SEARCH CONSOLE) */}
      {subTab === "settings" && (
        <div className="space-y-6">
          {/* 1. SERPER.DEV REAL-TIME SERP API CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <form
              onSubmit={handleSaveSerperSettings}
              className="lg:col-span-7 bg-white rounded-2xl border border-blue-200/80 p-5 space-y-4 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>1. Serper.dev API (Check Top 1–3 Đối Thủ Realtime)</span>
                </h3>
                {serperSettings?.connected && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                    Đã kết nối
                  </span>
                )}
              </div>

              {serperSettings?.lastError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  <strong>Lỗi Serper gần nhất:</strong> {serperSettings.lastError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Serper.dev API Key{" "}
                  {serperSettings?.hasApiKey && (
                    <span className="text-emerald-600 font-bold">(Đã lưu API Key an toàn)</span>
                  )}
                </label>
                <input
                  type="password"
                  value={serperApiKey}
                  onChange={(e) => setSerperApiKey(e.target.value)}
                  placeholder={
                    serperSettings?.hasApiKey
                      ? "•••••••••••••••••••••••• (Để trống nếu giữ key cũ)"
                      : "Dán API Key từ serper.dev vào đây..."
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên miền của bạn (để dò Top)
                  </label>
                  <input
                    type="text"
                    required
                    value={serperDomain}
                    onChange={(e) => setSerperDomain(e.target.value)}
                    placeholder="VD: gofpt.vn"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Khu vực tìm kiếm Google
                  </label>
                  <input
                    type="text"
                    value={serperLocation}
                    onChange={(e) => setSerperLocation(e.target.value)}
                    placeholder="VD: Can Tho, Vietnam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isSavingSerper}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer disabled:opacity-60"
                >
                  {isSavingSerper ? "Đang lưu..." : "Lưu Serper API"}
                </button>
                <button
                  type="button"
                  onClick={handleCheckAllSerp}
                  disabled={isCheckingAllSerp}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer disabled:opacity-60"
                >
                  {isCheckingAllSerp ? "Đang quét..." : "Quét Top Đối Thủ Ngay"}
                </button>
              </div>
            </form>

            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
              <h3 className="text-sm font-black text-slate-900">
                Lấy 2.500 lượt Check miễn phí tại Serper.dev (1 phút)
              </h3>
              <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
                <li>
                  Truy cập{" "}
                  <a
                    href="https://serper.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-bold underline"
                  >
                    https://serper.dev
                  </a>{" "}
                  và đăng nhập nhanh bằng tài khoản Google.
                </li>
                <li>
                  Hệ thống tặng ngay <strong>2.500 credits miễn phí</strong> (không cần thẻ tín dụng).
                </li>
                <li>
                  Vào mục <strong>API Key</strong>, copy mã key dán vào ô bên trái và bấm{" "}
                  <strong>Lưu Serper API</strong>.
                </li>
              </ol>
            </div>
          </div>

          {/* 2. GOOGLE SEARCH CONSOLE API CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <form
              onSubmit={handleSaveGscSettings}
              className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs"
            >
              <h3 className="text-base font-black text-slate-900">
                2. Google Search Console API (Dữ liệu Click &amp; Hiển thị)
              </h3>

              {gscSettings?.lastError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  <strong>Lỗi GSC gần nhất:</strong> {gscSettings.lastError}
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
                  rows={5}
                  value={serviceAccountJson}
                  onChange={(e) => setServiceAccountJson(e.target.value)}
                  placeholder='Dán nội dung file .json tải từ Google Cloud Console vào đây...'
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono outline-none focus:border-[#F37021]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isSavingGsc}
                  className="px-5 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#E05D10] text-white text-xs font-extrabold cursor-pointer disabled:opacity-60"
                >
                  {isSavingGsc ? "Đang lưu..." : "Lưu Cấu Hình GSC"}
                </button>

                <button
                  type="button"
                  onClick={() => handleSyncGsc(dateRange)}
                  disabled={isSyncing}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer disabled:opacity-60"
                >
                  {isSyncing ? "Đang kiểm tra..." : "Đồng Bộ GSC Ngay"}
                </button>
              </div>
            </form>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                <h3 className="text-sm font-black text-slate-900">
                  Sitemap &amp; Robots.txt
                </h3>
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
        </div>
      )}
    </div>
  );
}
