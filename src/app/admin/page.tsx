"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { LeadRecord } from "@/lib/types";
import { SiteConfigType } from "@/lib/configStorage";
import { Article } from "@/lib/articleStorage";
import { getAdminHeaders, clearAdminToken } from "@/lib/clientAdminAuth";
import AdminLogin from "@/components/admin/AdminLogin";
import DashboardOverview from "@/components/admin/DashboardOverview";
import LeadManagement from "@/components/admin/LeadManagement";
import ArticleManagement from "@/components/admin/ArticleManagement";
import GeneralConfigEditor from "@/components/admin/GeneralConfigEditor";
import PricingConfigEditor from "@/components/admin/PricingConfigEditor";
import AreaConfigEditor from "@/components/admin/AreaConfigEditor";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  DollarSign,
  MapPin,
  ExternalLink,
  LogOut,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Sparkles,
  RefreshCw,
  GitBranch,
} from "lucide-react";

type AdminTab = "overview" | "leads" | "articles" | "config" | "pricing" | "areas";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [leadsStatusFilter, setLeadsStatusFilter] = useState<string>("all");

  // Data states
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [config, setConfig] = useState<SiteConfigType | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [commitInfo, setCommitInfo] = useState<string>("");

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Check Authentication on Mount
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth", {
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      setIsAuthenticated(Boolean(data.authenticated));
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 2. Fetch Leads, Articles & Config
  const fetchData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [leadsRes, configRes, articlesRes] = await Promise.all([
        fetch("/api/admin/leads", { headers: getAdminHeaders() }),
        fetch("/api/admin/config", { headers: getAdminHeaders() }),
        fetch("/api/admin/articles", { headers: getAdminHeaders() }),
      ]);

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads || []);
        setStats(leadsData.stats || null);
      }

      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData.config || null);
      }

      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        setArticles(articlesData.articles || []);
      }

      // Fetch git version
      try {
        const syncRes = await fetch("/api/admin/sync", { headers: getAdminHeaders() });
        if (syncRes.ok) {
          const syncData = await syncRes.json();
          if (syncData.commit) setCommitInfo(syncData.commit);
        }
      } catch {}
    } catch (err) {
      console.error("Failed to load admin data:", err);
      showToast("Không thể tải dữ liệu mới nhất.", "error");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // 3. Handle Logout
  const handleLogout = async () => {
    clearAdminToken();
    try {
      await fetch("/api/admin/auth", {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  };

  // 4. Update Lead Action
  const handleUpdateLead = async (id: string, updates: Partial<LeadRecord>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: getAdminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        const data = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === id ? data.lead : l)));
        // Refresh stats
        fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // 5. Delete Lead Action
  const handleDeleteLead = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // 6. Update Config Action
  const handleSaveConfig = async (updatedConfig: Partial<SiteConfigType>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: getAdminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(updatedConfig),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // 7. Reset Config Action
  const handleResetConfig = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: getAdminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // 8. Sync GitHub Action
  const handleSyncGithub = async () => {
    if (isSyncing) return;
    const confirmed = window.confirm(
      "Hệ thống sẽ kéo phiên bản mới nhất từ GitHub về hosting và khởi động lại ứng dụng.\n\nBạn có muốn thực hiện ngay không?"
    );
    if (!confirmed) return;

    setIsSyncing(true);
    showToast("Đang kéo mã nguồn từ GitHub và cập nhật hệ thống...", "success");

    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: getAdminHeaders(),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(data.message || "Đồng bộ thành công! Ứng dụng đã cập nhật.", "success");
        if (data.commit) setCommitInfo(data.commit);
        // Refresh data
        setTimeout(() => fetchData(), 2000);
      } else {
        showToast(data.message || "Đồng bộ thất bại.", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi đồng bộ.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  // Switch to Leads tab from Dashboard shortcut
  const handleNavigateToLeads = (filter = "all") => {
    setLeadsStatusFilter(filter);
    setActiveTab("leads");
  };

  // Loading Screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-fpt-orange" />
          <p className="text-xs font-medium text-slate-400">Đang khởi tạo hệ thống quản trị...</p>
        </div>
      </div>
    );
  }

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-bold ${
              toast.type === "success"
                ? "bg-slate-900 text-white border border-emerald-500/40"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2">
              <img
                src="/images/logo-ftel.svg"
                alt="FPT Telecom"
                width={85}
                height={28}
                className="h-6 w-auto object-contain"
              />
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
                Admin <span className="text-fpt-orange">Center</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-orange-100 text-fpt-dark text-[10px] font-black uppercase">
              v2.0 PRO
            </span>
          </div>

          {/* Quick Info & Action Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            {config && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                <PhoneCall className="w-3.5 h-3.5 text-fpt-orange" />
                <span>Hotline: {config.contact.hotlineDisplay}</span>
              </div>
            )}

            {/* Nút Đồng bộ GitHub 1-Click */}
            <button
              type="button"
              onClick={handleSyncGithub}
              disabled={isSyncing}
              className={`py-1.5 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                isSyncing
                  ? "bg-orange-50 border-orange-200 text-fpt-orange cursor-wait"
                  : "border-slate-200 hover:bg-orange-50 hover:border-orange-200 hover:text-fpt-orange text-slate-700"
              }`}
              title="Đồng bộ mã nguồn mới nhất từ GitHub"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-fpt-orange" : ""}`} />
              <span className="hidden sm:inline">{isSyncing ? "Đang đồng bộ..." : "Đồng Bộ GitHub"}</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span>Xem Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thoát</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher Bar - Clean Grid on Mobile (No Horizontal Scroll), Flex on Desktop */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 grid grid-cols-3 sm:flex sm:items-center gap-1 text-xs font-bold border-t border-slate-100 py-2 sm:py-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 sm:py-3 px-2 sm:px-3.5 rounded-xl sm:rounded-none sm:border-b-2 flex items-center justify-center sm:justify-start gap-1 sm:gap-2 transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-orange-50 text-fpt-orange sm:bg-orange-50/40 sm:border-fpt-orange font-black"
                : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50 sm:hover:bg-transparent"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Tổng Quan (Dashboard)</span>
            <span className="sm:hidden truncate">Tổng quan</span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`py-2 sm:py-3 px-2 sm:px-3.5 rounded-xl sm:rounded-none sm:border-b-2 flex items-center justify-center sm:justify-start gap-1 sm:gap-2 transition-all cursor-pointer ${
              activeTab === "leads"
                ? "bg-orange-50 text-fpt-orange sm:bg-orange-50/40 sm:border-fpt-orange font-black"
                : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50 sm:hover:bg-transparent"
            }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Quản Lý Leads</span>
            <span className="sm:hidden truncate">Leads</span>
            <span className="px-1.5 py-0.2 rounded-full bg-fpt-orange text-white text-[10px] font-black shrink-0">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("articles")}
            className={`py-2 sm:py-3 px-2 sm:px-3.5 rounded-xl sm:rounded-none sm:border-b-2 flex items-center justify-center sm:justify-start gap-1 sm:gap-2 transition-all cursor-pointer ${
              activeTab === "articles"
                ? "bg-orange-50 text-fpt-orange sm:bg-orange-50/40 sm:border-fpt-orange font-black"
                : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50 sm:hover:bg-transparent"
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Soạn Thảo Bài Viết</span>
            <span className="sm:hidden truncate">Bài viết</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-white text-[10px] font-black shrink-0">
              {articles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("config")}
            className={`py-2 sm:py-3 px-2 sm:px-3.5 rounded-xl sm:rounded-none sm:border-b-2 flex items-center justify-center sm:justify-start gap-1 sm:gap-2 transition-all cursor-pointer ${
              activeTab === "config"
                ? "bg-orange-50 text-fpt-orange sm:bg-orange-50/40 sm:border-fpt-orange font-black"
                : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50 sm:hover:bg-transparent"
            }`}
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Hotline &amp; Cấu Hình Chung</span>
            <span className="sm:hidden truncate">Cấu hình</span>
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={`py-2 sm:py-3 px-2 sm:px-3.5 rounded-xl sm:rounded-none sm:border-b-2 flex items-center justify-center sm:justify-start gap-1 sm:gap-2 transition-all cursor-pointer ${
              activeTab === "pricing"
                ? "bg-orange-50 text-fpt-orange sm:bg-orange-50/40 sm:border-fpt-orange font-black"
                : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50 sm:hover:bg-transparent"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Bảng Giá &amp; Gói Cước</span>
            <span className="sm:hidden truncate">Bảng giá</span>
          </button>

          <button
            onClick={() => setActiveTab("areas")}
            className={`py-2 sm:py-3 px-2 sm:px-3.5 rounded-xl sm:rounded-none sm:border-b-2 flex items-center justify-center sm:justify-start gap-1 sm:gap-2 transition-all cursor-pointer ${
              activeTab === "areas"
                ? "bg-orange-50 text-fpt-orange sm:bg-orange-50/40 sm:border-fpt-orange font-black"
                : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50 sm:hover:bg-transparent"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Khu Vực Phục Vụ</span>
            <span className="sm:hidden truncate">Khu vực</span>
          </button>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {isLoadingData && !config && (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-fpt-orange" />
            <p className="text-xs text-slate-500">Đang đồng bộ dữ liệu...</p>
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === "overview" && stats && (
          <DashboardOverview
            stats={stats}
            recentLeads={leads}
            onNavigateToLeads={handleNavigateToLeads}
            onSyncGithub={handleSyncGithub}
            isSyncing={isSyncing}
            commitInfo={commitInfo}
          />
        )}

        {/* Tab 2: Leads Management */}
        {activeTab === "leads" && (
          <LeadManagement
            leads={leads}
            onUpdateLead={handleUpdateLead}
            onDeleteLead={handleDeleteLead}
            onRefresh={fetchData}
            initialStatusFilter={leadsStatusFilter}
            showToast={showToast}
          />
        )}

        {/* Tab 3: Articles & CMS Management */}
        {activeTab === "articles" && (
          <ArticleManagement
            articles={articles}
            onRefresh={fetchData}
            showToast={showToast}
          />
        )}

        {/* Tab 3: General Config Editor */}
        {activeTab === "config" && config && (
          <GeneralConfigEditor
            config={config}
            onSave={handleSaveConfig}
            onReset={handleResetConfig}
            showToast={showToast}
          />
        )}

        {/* Tab 4: Pricing Packages Editor */}
        {activeTab === "pricing" && config && (
          <PricingConfigEditor
            config={config}
            onSave={handleSaveConfig}
            showToast={showToast}
          />
        )}

        {/* Tab 5: Areas Editor */}
        {activeTab === "areas" && config && (
          <AreaConfigEditor
            config={config}
            onSave={handleSaveConfig}
            showToast={showToast}
          />
        )}
      </main>
    </div>
  );
}
