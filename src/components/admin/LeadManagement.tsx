"use client";

import { useState } from "react";
import { LeadRecord } from "@/lib/types";
import {
  Search,
  Download,
  PhoneCall,
  MessageSquare,
  Trash2,
  Edit,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  MapPin,
  Tag,
  ChevronDown,
  X,
  FileSpreadsheet,
} from "lucide-react";

interface LeadManagementProps {
  leads: LeadRecord[];
  onUpdateLead: (id: string, updates: Partial<LeadRecord>) => Promise<boolean>;
  onDeleteLead: (id: string) => Promise<boolean>;
  onRefresh: () => void;
  initialStatusFilter?: string;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function LeadManagement({
  leads,
  onUpdateLead,
  onDeleteLead,
  onRefresh,
  initialStatusFilter = "all",
  showToast,
}: LeadManagementProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [activeNoteLead, setActiveNoteLead] = useState<LeadRecord | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Filtered Leads
  const filtered = leads.filter((lead) => {
    const matchStatus = statusFilter === "all" || lead.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      lead.fullName.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      lead.id.toLowerCase().includes(q) ||
      (lead.area && lead.area.toLowerCase().includes(q)) ||
      (lead.packageInterested && lead.packageInterested.toLowerCase().includes(q)) ||
      (lead.salesNotes && lead.salesNotes.toLowerCase().includes(q));

    return matchStatus && matchSearch;
  });

  // Handle Quick Status Change
  const handleStatusChange = async (id: string, newStatus: LeadRecord["status"]) => {
    setIsUpdating(true);
    const ok = await onUpdateLead(id, { status: newStatus });
    setIsUpdating(false);
    if (ok) {
      showToast("Đã cập nhật trạng thái khách hàng!", "success");
    } else {
      showToast("Không thể cập nhật trạng thái.", "error");
    }
  };

  // Open Notes Modal
  const openNotesModal = (lead: LeadRecord) => {
    setActiveNoteLead(lead);
    setNoteText(lead.salesNotes || "");
  };

  // Save Sales Note
  const handleSaveNote = async () => {
    if (!activeNoteLead) return;
    setIsUpdating(true);
    const ok = await onUpdateLead(activeNoteLead.id, { salesNotes: noteText.trim() });
    setIsUpdating(false);
    if (ok) {
      showToast("Đã lưu ghi chú kinh doanh!", "success");
      setActiveNoteLead(null);
    } else {
      showToast("Lỗi khi lưu ghi chú.", "error");
    }
  };

  // Handle Delete
  const handleDelete = async (lead: LeadRecord) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${lead.fullName} (${lead.phone})"?`)) {
      return;
    }
    const ok = await onDeleteLead(lead.id);
    if (ok) {
      showToast("Đã xóa khách hàng khỏi danh sách.", "success");
    } else {
      showToast("Không thể xóa khách hàng.", "error");
    }
  };

  // Export to CSV with UTF-8 BOM
  const handleExportCsv = () => {
    if (leads.length === 0) {
      showToast("Không có dữ liệu để xuất file.", "error");
      return;
    }

    const headers = [
      "Mã Lead",
      "Thời Gian",
      "Họ và Tên",
      "Số Điện Thoại",
      "Khu Vực (Xã/Phường)",
      "Địa Chỉ Chi Tiết",
      "Gói Cước Quan Tâm",
      "Ghi Chú Khách",
      "Trạng Thái",
      "Ghi Chú Sales",
      "UTM Source",
      "UTM Campaign",
      "Trang Đích",
    ];

    const statusMap: Record<string, string> = {
      new: "Mới",
      contacted: "Đang liên hệ",
      surveyed: "Đã khảo sát",
      completed: "Đã chốt HĐ",
      cancelled: "Đã hủy",
    };

    const rows = filtered.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toLocaleString("vi-VN")}"`,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"'${l.phone}"`, // prepended with ' so Excel treats as text
      `"${(l.area || "").replace(/"/g, '""')}"`,
      `"${(l.address || "").replace(/"/g, '""')}"`,
      `"${(l.packageInterested || "").replace(/"/g, '""')}"`,
      `"${(l.note || "").replace(/"/g, '""')}"`,
      `"${statusMap[l.status] || l.status}"`,
      `"${(l.salesNotes || "").replace(/"/g, '""')}"`,
      `"${l.utm_source || ""}"`,
      `"${l.utm_campaign || ""}"`,
      `"${l.landingPage || ""}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Leads_FPT_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã xuất ${filtered.length} dòng dữ liệu ra file CSV!`, "success");
  };

  return (
    <div className="space-y-5">
      {/* Search & Actions Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo Tên, SĐT, Mã đơn, Gói cước, Khu vực..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 bg-slate-50/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCsv}
              className="py-2.5 px-3.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors border border-emerald-200 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Excel ({filtered.length})</span>
            </button>
            <button
              onClick={onRefresh}
              className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Làm mới"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>

        {/* Status Filter Pills (Wrap on mobile, zero horizontal scroll) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: "all", label: "Tất Cả", count: leads.length },
            { id: "new", label: "Mới Nhận", count: leads.filter((l) => l.status === "new").length, color: "text-red-600" },
            { id: "contacted", label: "Đang Gọi", count: leads.filter((l) => l.status === "contacted").length, color: "text-amber-600" },
            { id: "surveyed", label: "Đã Khảo Sát", count: leads.filter((l) => l.status === "surveyed").length, color: "text-blue-600" },
            { id: "completed", label: "Đã Chốt HĐ", count: leads.filter((l) => l.status === "completed").length, color: "text-emerald-600" },
            { id: "cancelled", label: "Đã Hủy", count: leads.filter((l) => l.status === "cancelled").length, color: "text-slate-500" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === item.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span className={statusFilter === item.id ? "text-white" : item.color}>{item.label}</span>
              <span className="ml-1.5 opacity-80 text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Leads List & Table */}
      <div className="space-y-3">
        {/* Mobile Cards (Visible on screens < md) */}
        <div className="block md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-slate-400 text-xs border border-slate-200/90 shadow-2xs">
              Không tìm thấy khách hàng nào phù hợp với bộ lọc.
            </div>
          ) : (
            filtered.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3"
              >
                {/* Header: ID, Time & Status */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-slate-500">#{lead.id}</span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      {new Date(lead.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadRecord["status"])}
                    className={`text-xs font-bold rounded-xl px-2.5 py-1.5 outline-none border transition-colors cursor-pointer ${
                      lead.status === "completed"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : lead.status === "contacted"
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : lead.status === "surveyed"
                        ? "bg-blue-50 text-blue-800 border-blue-300"
                        : lead.status === "cancelled"
                        ? "bg-slate-100 text-slate-600 border-slate-300"
                        : "bg-red-50 text-red-700 border-red-300 font-extrabold animate-pulse"
                    }`}
                  >
                    <option value="new">Mới nhận</option>
                    <option value="contacted">Đang gọi</option>
                    <option value="surveyed">Đã khảo sát</option>
                    <option value="completed">Đã chốt HĐ</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                {/* Customer Name */}
                <div>
                  <h4 className="font-black text-slate-900 text-base">{lead.fullName}</h4>
                </div>

                {/* Quick Touch Actions: Call & Zalo */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${lead.phone}`}
                    className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Gọi {lead.phone}</span>
                  </a>
                  <a
                    href={`https://zalo.me/${lead.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat Zalo</span>
                  </a>
                </div>

                {/* Package & Area Info */}
                <div className="bg-slate-50/80 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-fpt-orange shrink-0 mt-0.5" />
                    <span className="font-bold text-slate-800">
                      {lead.packageInterested || "Chưa chọn gói"}
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">
                      {lead.area || "Cần Thơ"}
                      {lead.address && <span className="text-slate-500 font-medium"> ({lead.address})</span>}
                    </span>
                  </div>

                  {lead.note && (
                    <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                      Ghi chú khách: &quot;{lead.note}&quot;
                    </div>
                  )}
                </div>

                {/* Sales Notes Preview & Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => openNotesModal(lead)}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors text-left truncate"
                  >
                    <Edit className="w-3 h-3 text-fpt-orange shrink-0" />
                    <span className="truncate">
                      {lead.salesNotes ? lead.salesNotes : "+ Thêm ghi chú kinh doanh"}
                    </span>
                  </button>

                  <button
                    onClick={() => handleDelete(lead)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                    title="Xóa đơn lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table (Hidden on screens < md) */}
        <div className="hidden md:block bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Thời Gian &amp; Mã</th>
                  <th className="py-3 px-4">Khách Hàng (SĐT)</th>
                  <th className="py-3 px-4">Khu Vực</th>
                  <th className="py-3 px-4">Gói Cước Quan Tâm</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4">Ghi Chú Sales</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                      Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Time & ID */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-[11px] font-bold text-slate-500">{lead.id}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(lead.createdAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Customer Info & Direct Action */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{lead.fullName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${lead.phone}`}
                            className="font-bold text-fpt-orange hover:underline inline-flex items-center gap-1 text-xs"
                            title="Gọi ngay"
                          >
                            <PhoneCall className="w-3 h-3 text-emerald-600" />
                            <span>{lead.phone}</span>
                          </a>
                          <a
                            href={`https://zalo.me/${lead.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-[10px] font-bold inline-flex items-center gap-0.5"
                            title="Chat Zalo trực tiếp"
                          >
                            <MessageSquare className="w-2.5 h-2.5" />
                            <span>Zalo</span>
                          </a>
                        </div>
                      </td>

                      {/* Area & Address */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-slate-800 leading-snug">
                          {lead.area || "Chưa rõ"}
                        </div>
                        {lead.address && (
                          <div className="text-[11px] text-fpt-orange font-medium mt-0.5">
                            Đ/c: {lead.address}
                          </div>
                        )}
                      </td>

                      {/* Package & Note */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 text-xs truncate">
                          {lead.packageInterested}
                        </div>
                        {lead.note && (
                          <div className="text-[11px] text-slate-500 mt-0.5 italic line-clamp-1">
                            Khách: &quot;{lead.note}&quot;
                          </div>
                        )}
                        {lead.utm_source && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Ads: <span className="font-semibold">{lead.utm_source}</span>
                            {lead.utm_campaign ? ` / ${lead.utm_campaign}` : ""}
                          </div>
                        )}
                      </td>

                      {/* Status Select */}
                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadRecord["status"])}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 outline-none border transition-colors cursor-pointer ${
                            lead.status === "completed"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : lead.status === "contacted"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : lead.status === "surveyed"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : lead.status === "cancelled"
                              ? "bg-slate-50 text-slate-600 border-slate-200"
                              : "bg-red-50 text-red-700 border-red-300 animate-pulse"
                          }`}
                        >
                          <option value="new">Mới nhận</option>
                          <option value="contacted">Đang gọi</option>
                          <option value="surveyed">Đã khảo sát</option>
                          <option value="completed">Đã chốt HĐ</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </td>

                      {/* Sales Notes */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div
                          onClick={() => openNotesModal(lead)}
                          className="cursor-pointer group flex items-start gap-1 p-1 rounded hover:bg-slate-100 transition-colors"
                          title="Click để chỉnh sửa ghi chú"
                        >
                          <Edit className="w-3 h-3 text-slate-400 group-hover:text-fpt-orange shrink-0 mt-0.5" />
                          <span className="text-[11px] text-slate-600 line-clamp-2">
                            {lead.salesNotes ? lead.salesNotes : <span className="text-slate-400 italic">+ Thêm ghi chú</span>}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa đơn lead này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Note Edit Modal */}
      {activeNoteLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Ghi Chú Chăm Sóc Khách Hàng</h3>
                <p className="text-xs text-slate-500">{activeNoteLead.fullName} - {activeNoteLead.phone}</p>
              </div>
              <button
                onClick={() => setActiveNoteLead(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="VD: Khách hẹn 15h gọi lại, cần tư vấn thêm combo tivi, đã hẹn ký hợp đồng sáng mai..."
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400"
            />

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setActiveNoteLead(null)}
                className="flex-1 py-2.5 px-3.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 min-h-[44px] flex items-center justify-center"
              >
                Hủy / Đóng
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleSaveNote}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-fpt-orange hover:bg-fpt-dark text-white shadow-xs transition-colors min-h-[44px] flex items-center justify-center"
              >
                {isUpdating ? "Đang lưu..." : "Lưu Ghi Chú"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
