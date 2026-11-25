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
import SeoManagement from "@/components/admin/SeoManagement";
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
  Zap,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

type AdminTab = "overview" | "leads" | "articles" | "seo" | "config" | "pricing" | "areas";

const TAB_META: Record<AdminTab, { title: string; subtitle: string }> = {
  overview: {
    title: "Tổng Quan Hệ Thống",
    subtitle: "Theo dõi nhanh hiệu suất tiếp nhận khách hàng và chuyển đổi.",
  },
  leads: {
    title: "Quản Lý Khách Hàng (Leads)",
    subtitle: "Theo dõi, lọc trạng thái và chăm sóc danh sách khách hàng đăng ký.",
  },
  articles: {
    title: "Bài Viết & Tin Tức",
    subtitle: "Soạn thảo, xuất bản và quản lý bài viết chuẩn SEO trên website.",
  },
  seo: {
    title: "SEO & Thứ Hạng Google",
    subtitle: "Theo dõi Top từ khóa qua Google Search Console API và kiểm tra SEO On-Page.",
  },
  pricing: {
    title: "Bảng Giá & Gói Cước",
    subtitle: "Chỉnh sửa giá cước, băng thông và các chương trình ưu đãi hiển thị trên web.",
  },
  areas: {
    title: "Khu Vực Phục Vụ",
    subtitle: "Quản lý danh sách phường, xã và khu vực tiếp nhận lắp đặt.",
  },
  config: {
    title: "Hotline & Cài Đặt Chung",
    subtitle: "Cấu hình Hotline, Email, Địa chỉ, Telegram, Tracking và Đồng bộ hệ thống.",
  },
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // 8.1. Giải phóng & dọn dẹp bảng tiến trình (Processes) trên hosting cPanel
  const [isCleaningProcesses, setIsCleaningProcesses] = useState(false);
  const handleCleanupProcesses = async () => {
    if (isCleaningProcesses) return;
    setIsCleaningProcesses(true);
    showToast("Đang quét và giải phóng các tiến trình treo trên hosting cPanel...", "success");

    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { ...getAdminHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cleanup" }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(data.message || "Đã giải phóng các tiến trình treo thành công!", "success");
      } else {
        showToast(data.message || "Không thể dọn dẹp tiến trình.", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi giải phóng tiến trình.", "error");
    } finally {
      setIsCleaningProcesses(false);
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

  const selectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const navGroups: {
    label: string;
    items: {
      id: AdminTab;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      label: "Kinh doanh & Khách hàng",
      items: [
        {
          id: "overview",
          label: "Tổng Quan",
          icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
        },
        {
          id: "leads",
          label: "Quản Lý Leads",
          icon: <Users className="w-4 h-4 shrink-0" />,
          badge: leads.length,
          badgeColor: "bg-[#F37021] text-white",
        },
      ],
    },
    {
      label: "Nội dung & Tăng trưởng",
      items: [
        {
          id: "articles",
          label: "Bài Viết & Tin Tức",
          icon: <FileText className="w-4 h-4 shrink-0" />,
          badge: articles.length,
          badgeColor: "bg-slate-800 text-white",
        },
        {
          id: "seo",
          label: "SEO & Thứ Hạng",
          icon: <TrendingUp className="w-4 h-4 shrink-0" />,
          badge: "GSC",
          badgeColor: "bg-emerald-100 text-emerald-700",
        },
      ],
    },
    {
      label: "Cấu hình Hệ thống",
      items: [
        {
          id: "pricing",
          label: "Bảng Giá & Gói Cước",
          icon: <DollarSign className="w-4 h-4 shrink-0" />,
        },
        {
          id: "areas",
          label: "Khu Vực Phục Vụ",
          icon: <MapPin className="w-4 h-4 shrink-0" />,
        },
        {
          id: "config",
          label: "Hotline & Cài Đặt",
          icon: <Settings className="w-4 h-4 shrink-0" />,
        },
      ],
    },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img
            src="/images/logo-ftel.svg"
            alt="FPT Telecom"
            width={85}
            height={28}
            className="h-6 w-auto object-contain"
          />
          <div className="flex flex-col leading-none">
            <span className="font-black text-sm tracking-tight text-slate-900">
              Admin <span className="text-[#F37021]">Center</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 mt-0.5">v2.0 PRO</span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Đóng menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Grouped Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#FFF4ED] text-[#C44D06] shadow-2xs ring-1 ring-orange-200/70"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={isActive ? "text-[#F37021]" : "text-slate-400"}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                          item.badgeColor || "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom System Actions */}
      <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/70 shrink-0">
        {commitInfo && (
          <div className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 truncate">
            <GitBranch className="w-3 h-3 text-[#F37021] shrink-0" />
            <span className="truncate">{commitInfo}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleSyncGithub}
          disabled={isSyncing}
          className="w-full py-2 px-3 rounded-xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-700 hover:text-[#C44D06] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-[#F37021]" : ""}`} />
          <span>{isSyncing ? "Đang đồng bộ..." : "Đồng Bộ GitHub"}</span>
        </button>

        <button
          type="button"
          onClick={handleCleanupProcesses}
          disabled={isCleaningProcesses}
          className="w-full py-2 px-3 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          title="Quét và tắt các tiến trình Git/Node treo trên cPanel"
        >
          <Zap className={`w-3.5 h-3.5 ${isCleaningProcesses ? "animate-spin" : "fill-current"}`} />
          <span>{isCleaningProcesses ? "Đang dọn..." : "Giải Phóng Processes"}</span>
        </button>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href="/"
            target="_blank"
            className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Xem Web</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="py-2 px-2.5 rounded-xl bg-slate-200/70 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Thoát</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-slate-900 flex font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-[100] animate-in slide-in-from-top duration-200">
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

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-slate-200/80 flex-col sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Slide-Over Sidebar Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85%] bg-white h-full shadow-2xl z-10 flex flex-col">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Right Main Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Clean Sticky Topbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shrink-0"
              aria-label="Mở menu quản trị"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-black text-slate-900 truncate">
                {TAB_META[activeTab].title}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate">
                {TAB_META[activeTab].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {config && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                <PhoneCall className="w-3.5 h-3.5 text-[#F37021]" />
                <span>{config.contact.hotlineDisplay}</span>
              </div>
            )}
            <button
              type="button"
              onClick={fetchData}
              disabled={isLoadingData}
              className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? "animate-spin text-[#F37021]" : ""}`} />
              <span className="hidden sm:inline">Làm mới</span>
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

        {/* Tab 3B: SEO Center & Google Search Console */}
        {activeTab === "seo" && <SeoManagement onShowToast={showToast} />}

        {/* Tab 4: General Config Editor */}
        {activeTab === "config" && config && (
          <GeneralConfigEditor
            config={config}
            onSave={handleSaveConfig}
            onReset={handleResetConfig}
            showToast={showToast}
            onSyncGithub={handleSyncGithub}
            isSyncing={isSyncing}
            onCleanupProcesses={handleCleanupProcesses}
            isCleaningProcesses={isCleaningProcesses}
            commitInfo={commitInfo}
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
    </div>
  );
}
