"use client";

import { LeadRecord } from "@/lib/types";
import { Users, PhoneCall, CheckCircle, TrendingUp, Sparkles, MapPin, Package, ArrowRight, Clock } from "lucide-react";

interface LeadStats {
  total: number;
  todayCount: number;
  statusCount: {
    new: number;
    contacted: number;
    surveyed: number;
    completed: number;
    cancelled: number;
  };
  conversionRate: number;
  packageBreakdown: Record<string, number>;
  areaBreakdown: Record<string, number>;
  utmBreakdown: Record<string, number>;
}

interface DashboardOverviewProps {
  stats: LeadStats;
  recentLeads: LeadRecord[];
  onNavigateToLeads: (statusFilter?: string) => void;
}

export default function DashboardOverview({
  stats,
  recentLeads,
  onNavigateToLeads,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Leads */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Đơn Lead</span>
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-fpt-orange flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.total}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>Tất cả khách hàng đã gửi form</span>
          </div>
        </div>

        {/* Today's Leads */}
        <div
          onClick={() => onNavigateToLeads("new")}
          className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50/50 border border-red-200/80 shadow-2xs cursor-pointer hover:border-red-300 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Lead Mới Hôm Nay</span>
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600">
            {stats.todayCount}
          </div>
          <div className="text-xs text-red-700/80 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Cần nhân viên liên hệ ngay</span>
          </div>
        </div>

        {/* Completed Deals */}
        <div
          onClick={() => onNavigateToLeads("completed")}
          className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 shadow-2xs cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Đã Ký Hợp Đồng</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {stats.statusCount.completed}
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            <span>Đã triển khai thành công</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ Lệ Chốt Lead</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600">
            {stats.conversionRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span>{stats.statusCount.completed} / {stats.total} khách hàng chốt</span>
          </div>
        </div>
      </div>

      {/* Status Progress Funnel */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Quy Trình Xử Lý Khách Hàng (Funnel)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            onClick={() => onNavigateToLeads("new")}
            className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200 cursor-pointer hover:bg-red-100/70 transition-all"
          >
            <span className="text-xs font-bold text-red-600 block">Mới Nhận</span>
            <span className="text-xl font-black text-red-700 mt-0.5 block">{stats.statusCount.new}</span>
            <span className="text-[11px] text-red-600/80">Chưa xử lý</span>
          </div>

          <div
            onClick={() => onNavigateToLeads("contacted")}
            className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 cursor-pointer hover:bg-amber-100/70 transition-all"
          >
            <span className="text-xs font-bold text-amber-700 block">Đang Liên Hệ</span>
            <span className="text-xl font-black text-amber-800 mt-0.5 block">{stats.statusCount.contacted}</span>
            <span className="text-[11px] text-amber-600/80">Đã gọi trao đổi</span>
          </div>

          <div
            onClick={() => onNavigateToLeads("surveyed")}
            className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 cursor-pointer hover:bg-blue-100/70 transition-all"
          >
            <span className="text-xs font-bold text-blue-700 block">Khảo Sát Tuyến</span>
            <span className="text-xl font-black text-blue-800 mt-0.5 block">{stats.statusCount.surveyed}</span>
            <span className="text-[11px] text-blue-600/80">Kỹ thuật viên đi đo</span>
          </div>

          <div
            onClick={() => onNavigateToLeads("completed")}
            className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 cursor-pointer hover:bg-emerald-100/70 transition-all"
          >
            <span className="text-xs font-bold text-emerald-700 block">Đã Chốt HĐ</span>
            <span className="text-xl font-black text-emerald-800 mt-0.5 block">{stats.statusCount.completed}</span>
            <span className="text-[11px] text-emerald-600/80">Lắp đặt xong</span>
          </div>

          <div
            onClick={() => onNavigateToLeads("cancelled")}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all col-span-2 sm:col-span-1"
          >
            <span className="text-xs font-bold text-slate-500 block">Hủy / Trùng</span>
            <span className="text-xl font-black text-slate-700 mt-0.5 block">{stats.statusCount.cancelled}</span>
            <span className="text-[11px] text-slate-400">Không có nhu cầu</span>
          </div>
        </div>
      </div>

      {/* 2 Distribution Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Packages */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-fpt-orange" />
              <span>Gói Cước Khách Quan Tâm</span>
            </h3>
            <span className="text-xs text-slate-500">{Object.keys(stats.packageBreakdown).length} gói cước</span>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.packageBreakdown).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Chưa có dữ liệu</p>
            ) : (
              Object.entries(stats.packageBreakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count]) => {
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={name}>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-800 font-bold truncate pr-2">{name}</span>
                        <span className="text-slate-600 shrink-0 font-semibold">{count} đơn ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-fpt-orange to-amber-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Top Areas */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Phân Bổ Theo Khu Vực</span>
            </h3>
            <span className="text-xs text-slate-500">Thành phố Cần Thơ</span>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.areaBreakdown).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Chưa có dữ liệu</p>
            ) : (
              Object.entries(stats.areaBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([area, count]) => {
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={area}>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-800 font-bold">{area}</span>
                        <span className="text-slate-600 font-semibold">{count} đơn ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Recent Leads Preview */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-fpt-dark" />
              <span>Đơn Đăng Ký Mới Nhất</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Khách hàng vừa gửi thông tin qua landing page</p>
          </div>
          <button
            onClick={() => onNavigateToLeads()}
            className="text-xs font-bold text-fpt-orange hover:text-fpt-dark flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Xem Tất Cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentLeads.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">Chưa có đơn lead nào trong hệ thống.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{lead.fullName}</span>
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-xs font-bold text-fpt-orange hover:underline inline-flex items-center gap-0.5"
                    >
                      <PhoneCall className="w-3 h-3" />
                      {lead.phone}
                    </a>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>{lead.area || "Chưa chọn khu vực"}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{lead.packageInterested}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      lead.status === "completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : lead.status === "contacted"
                        ? "bg-amber-100 text-amber-800"
                        : lead.status === "surveyed"
                        ? "bg-blue-100 text-blue-800"
                        : lead.status === "cancelled"
                        ? "bg-slate-100 text-slate-700"
                        : "bg-red-100 text-red-700 animate-pulse"
                    }`}
                  >
                    {lead.status === "completed"
                      ? "Đã Chốt HĐ"
                      : lead.status === "contacted"
                      ? "Đang Gọi"
                      : lead.status === "surveyed"
                      ? "Đã Khảo Sát"
                      : lead.status === "cancelled"
                      ? "Đã Hủy"
                      : "Mới"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
