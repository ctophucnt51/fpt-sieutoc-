"use client";

import { useState } from "react";
import { AreaOption } from "@/config/siteConfig";
import { SiteConfigType } from "@/lib/configStorage";
import { Plus, Trash2, Save, MapPin, Search, Star } from "lucide-react";

interface AreaConfigEditorProps {
  config: SiteConfigType;
  onSave: (updatedConfig: Partial<SiteConfigType>) => Promise<boolean>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function AreaConfigEditor({
  config,
  onSave,
  showToast,
}: AreaConfigEditorProps) {
  const [areas, setAreas] = useState<AreaOption[]>(config.popularAreas);
  const [activeRegion, setActiveRegion] = useState<"all" | "phuong" | "xa" | "other">("all");
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filtered = areas.filter((a) => {
    if (activeRegion === "all") return true;
    if (activeRegion === "phuong") return a.code.startsWith("CT-P-") || a.name.includes("Phường");
    if (activeRegion === "xa") return a.code.startsWith("CT-X-") || a.name.includes("Xã");
    if (activeRegion === "other") return a.code === "OTHER";
    return true;
  });

  const handleTogglePopular = (code: string) => {
    setAreas(
      areas.map((a) => (a.code === code ? { ...a, isPopular: !a.isPopular } : a))
    );
  };

  const handleDeleteArea = (code: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa khu vực "${name}"?`)) return;
    setAreas(areas.filter((a) => a.code !== code));
    showToast(`Đã xóa khu vực ${name}.`, "success");
  };

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast("Vui lòng nhập tên khu vực.", "error");
      return;
    }

    const code = newCode.trim() || `AREA-${Date.now().toString(36).toUpperCase()}`;
    if (areas.some((a) => a.code === code)) {
      showToast("Mã khu vực này đã tồn tại.", "error");
      return;
    }

    setAreas([...areas, { code, name: newName.trim(), isPopular: true }]);
    setNewCode("");
    setNewName("");
    showToast("Đã thêm khu vực mới. Nhớ bấm 'Lưu Khu Vực'!", "success");
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const formattedAreas = areas.map((a) => ({
      code: a.code,
      name: a.name,
      isPopular: Boolean(a.isPopular),
    }));
    const ok = await onSave({ popularAreas: formattedAreas });
    setIsSaving(false);
    if (ok) {
      showToast("Cập nhật danh sách khu vực thành công!", "success");
    } else {
      showToast("Lỗi khi lưu khu vực.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header filter & save */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Region filter pills (Wrap on mobile, zero horizontal scroll) */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 text-xs font-bold">
          <button
            onClick={() => setActiveRegion("all")}
            className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
              activeRegion === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tất Cả ({areas.length})
          </button>
          <button
            onClick={() => setActiveRegion("phuong")}
            className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
              activeRegion === "phuong" ? "bg-white text-fpt-orange shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            31 Phường TP. Cần Thơ ({areas.filter((a) => a.code.startsWith("CT-P-") || a.name.includes("Phường")).length})
          </button>
          <button
            onClick={() => setActiveRegion("xa")}
            className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
              activeRegion === "xa" ? "bg-white text-fpt-orange shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Các Xã TP. Cần Thơ ({areas.filter((a) => a.code.startsWith("CT-X-") || a.name.includes("Xã")).length})
          </button>
          <button
            onClick={() => setActiveRegion("other")}
            className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
              activeRegion === "other" ? "bg-white text-fpt-orange shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Khu Vực Khác ({areas.filter((a) => a.code === "OTHER").length})
          </button>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-fpt-orange to-fpt-dark hover:opacity-95 text-white text-xs font-extrabold shadow-cta flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Đang lưu..." : "LƯU KHU VỰC PHỤC VỤ"}</span>
        </button>
      </div>

      {/* Add New Area Row */}
      <form onSubmit={handleAddArea} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-fpt-orange" />
          <span>Thêm Khu Vực / Xã Phường Mới</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="Mã Code (VD: CT-P-MOI, CT-X-MOI...)"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-fpt-orange"
            />
          </div>
          <div className="sm:col-span-6">
            <input
              type="text"
              required
              placeholder="Tên Xã / Phường (VD: Cần Thơ - Phường Mới...)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-fpt-orange"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm</span>
            </button>
          </div>
        </div>
      </form>

      {/* Areas Table (Responsive Cards on Mobile, Table on Desktop) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Mobile View: Stacked Cards (Zero horizontal scroll) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.map((item) => (
            <div key={item.code} className="p-3.5 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-xs text-slate-900 block truncate">
                  {item.name}
                </span>
                <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                  {item.code}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleTogglePopular(item.code)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
                    item.isPopular ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-slate-400 bg-slate-50"
                  }`}
                  title="Bật/Tắt ưu tiên hiển thị"
                >
                  <Star className={`w-4 h-4 ${item.isPopular ? "fill-current" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteArea(item.code, item.name)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center bg-slate-50"
                  title="Xóa khu vực này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Mã Code</th>
                <th className="py-3 px-4">Tên Khu Vực Hiển Thị Trong Form</th>
                <th className="py-3 px-4 text-center">Nổi Bật</th>
                <th className="py-3 px-4 text-right">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.code} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-xs text-slate-600">
                    {item.code}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleTogglePopular(item.code)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        item.isPopular ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-slate-400"
                      }`}
                      title="Bật/Tắt ưu tiên hiển thị"
                    >
                      <Star className={`w-4 h-4 ${item.isPopular ? "fill-current" : ""}`} />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteArea(item.code, item.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Xóa khu vực này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
