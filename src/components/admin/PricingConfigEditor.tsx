"use client";

import { useState } from "react";
import { PackageItem } from "@/config/siteConfig";
import { SiteConfigType } from "@/lib/configStorage";
import { Plus, Trash2, Save, Wifi, Tv, Camera, Sparkles, Check, AlertCircle } from "lucide-react";

interface PricingConfigEditorProps {
  config: SiteConfigType;
  onSave: (updatedConfig: Partial<SiteConfigType>) => Promise<boolean>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function PricingConfigEditor({
  config,
  onSave,
  showToast,
}: PricingConfigEditorProps) {
  const [activeCategory, setActiveCategory] = useState<"internet" | "combo">("internet");
  const [packages, setPackages] = useState(config.packages);
  const [isSaving, setIsSaving] = useState(false);

  const currentList = packages[activeCategory] || [];

  const handleUpdatePackage = (index: number, updates: Partial<PackageItem>) => {
    const updatedCategoryList = [...currentList];
    updatedCategoryList[index] = {
      ...updatedCategoryList[index],
      ...updates,
    };
    setPackages({
      ...packages,
      [activeCategory]: updatedCategoryList,
    });
  };

  const handleAddPackage = () => {
    const newPkg: PackageItem = {
      id: `${activeCategory}-new-${Date.now().toString(36)}`,
      name: `Gói Mới ${currentList.length + 1}`,
      category: activeCategory,
      speed: "1 Gbps",
      priceDisplay: "200.000đ",
      priceValue: 200000,
      billingCycle: "/tháng",
      badge: "Mới ra mắt",
      highlight: false,
      idealFor: "Mô tả đối tượng phù hợp...",
      features: ["Trang bị modem Wi-Fi 6 miễn phí", "Lắp đặt trong 24h"],
      equipment: ["1 Modem chính hãng"],
    };

    setPackages({
      ...packages,
      [activeCategory]: [...currentList, newPkg],
    });
    showToast("Đã thêm gói mới. Vui lòng bấm 'Lưu Bảng Giá' sau khi chỉnh sửa xong.", "success");
  };

  const handleDeletePackage = (index: number) => {
    const pkg = currentList[index];
    if (!window.confirm(`Bạn có chắc muốn xóa gói "${pkg.name}" khỏi danh mục ${activeCategory}?`)) {
      return;
    }
    const updatedCategoryList = currentList.filter((_, i) => i !== index);
    setPackages({
      ...packages,
      [activeCategory]: updatedCategoryList,
    });
    showToast(`Đã xóa gói ${pkg.name}.`, "success");
  };

  const handleFeatureChange = (pkgIndex: number, featIndex: number, text: string) => {
    const pkg = currentList[pkgIndex];
    const newFeatures = [...pkg.features];
    newFeatures[featIndex] = text;
    handleUpdatePackage(pkgIndex, { features: newFeatures });
  };

  const handleAddFeature = (pkgIndex: number) => {
    const pkg = currentList[pkgIndex];
    const newFeatures = [...pkg.features, "Ưu đãi mới..."];
    handleUpdatePackage(pkgIndex, { features: newFeatures });
  };

  const handleRemoveFeature = (pkgIndex: number, featIndex: number) => {
    const pkg = currentList[pkgIndex];
    const newFeatures = pkg.features.filter((_, i) => i !== featIndex);
    handleUpdatePackage(pkgIndex, { features: newFeatures });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const ok = await onSave({ packages });
    setIsSaving(false);
    if (ok) {
      showToast("Cập nhật bảng giá gói cước thành công!", "success");
    } else {
      showToast("Lỗi khi lưu bảng giá.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs & Save Header */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 max-w-md w-full sm:w-auto">
          <button
            onClick={() => setActiveCategory("internet")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
              activeCategory === "internet"
                ? "bg-white text-fpt-orange shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Internet Wi-Fi 6</span>
          </button>
          <button
            onClick={() => setActiveCategory("combo")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
              activeCategory === "combo"
                ? "bg-white text-fpt-orange shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Combo Ngoại Hạng Anh</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddPackage}
            className="flex-1 sm:flex-none py-2.5 px-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Gói Cước</span>
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-gradient-to-r from-fpt-orange to-fpt-dark hover:opacity-95 text-white text-xs font-extrabold shadow-cta flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60 min-h-[44px]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Đang lưu..." : "LƯU BẢNG GIÁ"}</span>
          </button>
        </div>
      </div>

      {/* Package Cards Editor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentList.map((pkg, idx) => (
          <div
            key={pkg.id || idx}
            className={`rounded-3xl p-6 bg-white border transition-all duration-200 relative ${
              pkg.highlight
                ? "border-2 border-fpt-orange shadow-md"
                : "border-slate-200/90 shadow-2xs"
            }`}
          >
            {/* Top Bar with Delete & Highlight Check */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={pkg.highlight || false}
                  onChange={(e) => handleUpdatePackage(idx, { highlight: e.target.checked })}
                  className="w-4 h-4 text-fpt-orange rounded border-slate-300 focus:ring-fpt-orange cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <span>Gói Nổi Bật (Highlight)</span>
                  {pkg.highlight && <Sparkles className="w-3 h-3 text-amber-500 fill-current" />}
                </span>
              </label>

              <button
                type="button"
                onClick={() => handleDeletePackage(idx)}
                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Xóa gói này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Input Grid */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tên Gói Cước
                  </label>
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => handleUpdatePackage(idx, { name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm font-black text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tốc Độ / Băng Thông
                  </label>
                  <input
                    type="text"
                    value={pkg.speed}
                    onChange={(e) => handleUpdatePackage(idx, { speed: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Giá Hiển Thị Trên Web
                  </label>
                  <input
                    type="text"
                    value={pkg.priceDisplay}
                    onChange={(e) => handleUpdatePackage(idx, { priceDisplay: e.target.value })}
                    placeholder="VD: 200.000đ - 220.000đ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm font-bold text-fpt-dark outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Giá Số (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={pkg.priceValue}
                    onChange={(e) => handleUpdatePackage(idx, { priceValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Huy Hiệu (Badge)
                </label>
                <input
                  type="text"
                  value={pkg.badge || ""}
                  onChange={(e) => handleUpdatePackage(idx, { badge: e.target.value })}
                  placeholder="VD: Bán chạy nhất; Tiết kiệm nhất..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phù Hợp Cho Đối Tượng
                </label>
                <input
                  type="text"
                  value={pkg.idealFor}
                  onChange={(e) => handleUpdatePackage(idx, { idealFor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs text-slate-700 outline-none"
                />
              </div>

              {/* Bullet Features */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Các Tính Năng &amp; Ưu Đãi
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddFeature(idx)}
                    className="text-[11px] font-bold text-fpt-orange hover:text-fpt-dark flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm dòng</span>
                  </button>
                </div>
                <div className="space-y-1.5">
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, fIdx, e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-fpt-orange"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx, fIdx)}
                        className="p-1 rounded text-slate-400 hover:text-red-500"
                        title="Xóa dòng này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
