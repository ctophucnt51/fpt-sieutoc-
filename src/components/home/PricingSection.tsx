"use client";

import { useState } from "react";
import { useSiteConfig } from "@/context/ConfigContext";
import { useLeadModal } from "@/context/LeadModalContext";
import { PackageItem } from "@/config/siteConfig";
import { Wifi, Tv, Check, ArrowRight, Zap, ShieldCheck, Sparkles } from "lucide-react";

interface PricingSectionProps {
  initialTab?: "all" | "internet" | "combo";
  title?: string;
  subtitle?: string;
}

export default function PricingSection({
  initialTab = "all",
  title = "Bảng Giá Gói Cước Internet & Combo FPT Ưu Đãi Mới Nhất",
  subtitle = "Trang bị Modem Wi-Fi 6 thế hệ mới • Miễn phí khảo sát & ký hợp đồng tại nhà",
}: PricingSectionProps) {
  const siteConfig = useSiteConfig();
  const { openLeadModal } = useLeadModal();
  const [activeTab, setActiveTab] = useState<"all" | "internet" | "combo">(initialTab);

  const allPackages: PackageItem[] = [
    ...siteConfig.packages.internet,
    ...siteConfig.packages.combo,
  ];

  const filteredPackages = allPackages.filter((pkg) => {
    if (activeTab === "all") return true;
    return pkg.category === activeTab;
  });

  const handleSelectPackage = (pkgName: string) => {
    openLeadModal(pkgName);
  };

  const getStartingPrice = (priceStr: string) => {
    if (priceStr.includes(" - ")) {
      return priceStr.split(" - ")[0];
    }
    return priceStr;
  };

  return (
    <section id="bang-gia" className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-fpt-orange border border-orange-200/80 font-bold text-xs uppercase tracking-wider mb-2 shadow-2xs backdrop-blur-md">
            Bảng Giá Minh Bạch
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-normal">
            {subtitle}
          </p>

          {/* Category Tabs - Tối ưu cho mobile không bị tràn chữ */}
          <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-2xs max-w-sm sm:max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap text-center cursor-pointer ${
                activeTab === "all"
                  ? "bg-fpt-orange text-white shadow-[0_2px_10px_rgba(243,112,33,0.3)]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>Tất Cả</span>
            </button>
            <button
              onClick={() => setActiveTab("internet")}
              className={`py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "internet"
                  ? "bg-fpt-orange text-white shadow-[0_2px_10px_rgba(243,112,33,0.3)]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Wifi className="w-3.5 h-3.5 shrink-0 hidden sm:inline-block" />
              <span>Chỉ Internet</span>
            </button>
            <button
              onClick={() => setActiveTab("combo")}
              className={`py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "combo"
                  ? "bg-fpt-orange text-white shadow-[0_2px_10px_rgba(243,112,33,0.3)]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Tv className="w-3.5 h-3.5 shrink-0 hidden sm:inline-block" />
              <span>Combo TV &amp; Net</span>
            </button>
          </div>
        </div>

        {/* Packages Grid - White Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {filteredPackages.map((pkg) => {
            const isCombo = pkg.category === "combo";
            const startingPrice = getStartingPrice(pkg.priceDisplay);
            const hasRange = pkg.priceDisplay.includes(" - ");

            return (
              <div
                key={pkg.id}
                className={`rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between relative ${
                  pkg.highlight
                    ? "bg-white/95 backdrop-blur-2xl border-2 border-fpt-orange shadow-[0_12px_40px_rgba(243,112,33,0.15)] ring-4 ring-orange-500/10"
                    : "bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-lg hover:border-orange-300"
                }`}
              >
                {/* Highlight Badge */}
                {pkg.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-fpt-orange text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(243,112,33,0.35)] tracking-wider flex items-center gap-1 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>Gói Cước Bán Chạy Nhất</span>
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="border-b border-slate-100 pb-4 mb-4">
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-fpt-orange uppercase tracking-wider">
                        {isCombo ? "Combo Internet + TV" : "Internet Wi-Fi 6"}
                      </span>
                      {pkg.badge && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      Tốc độ tải lên đến {pkg.speed}
                    </p>

                    {/* Price Block */}
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-fpt-orange tracking-tight">
                        {startingPrice}
                      </span>
                      <span className="text-xs text-slate-500 font-normal whitespace-nowrap">{pkg.billingCycle}</span>
                    </div>

                    {hasRange && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        (Giá dao động {pkg.priceDisplay} theo khu vực)
                      </p>
                    )}

                    {/* Speed Badge */}
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 text-xs font-semibold">
                      <Zap className="w-3.5 h-3.5 text-fpt-orange fill-current shrink-0" />
                      <span className="truncate">Tốc độ: {pkg.speed}</span>
                    </div>
                  </div>

                  {/* Ideal for */}
                  <div className="mb-3.5 text-xs text-slate-700 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                    <strong className="text-slate-900 block mb-0.5 font-bold">Phù hợp nhu cầu:</strong>
                    {pkg.idealFor}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 mb-4 text-xs sm:text-sm text-slate-700">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Equipment included */}
                  <div className="mb-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <span className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-fpt-orange shrink-0" />
                      Thiết bị kèm theo:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {pkg.equipment.map((eq, i) => (
                        <li key={i}>{eq}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSelectPackage(pkg.name)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    pkg.highlight
                      ? "bg-fpt-orange hover:bg-fpt-hover text-white shadow-[0_4px_16px_rgba(243,112,33,0.3)] hover:shadow-[0_6px_20px_rgba(243,112,33,0.4)]"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                  }`}
                >
                  <span>ĐĂNG KÝ GÓI NÀY</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Pricing Transparency Note - White Glass Card */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-2xs text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            <strong className="text-slate-900 font-bold">Chương trình khuyến mãi:</strong> Khách hàng đăng ký gói cước mới được trang bị miễn phí Modem Wi-Fi 6 thế hệ mới, <strong className="text-fpt-orange font-bold">tặng kèm Camera FPT AI an ninh thông minh miễn phí</strong> và hỗ trợ khảo sát lắp đặt tận nhà trong 24 giờ.
          </p>
        </div>
      </div>
    </section>
  );
}
