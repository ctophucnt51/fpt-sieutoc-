"use client";

import { useState } from "react";
import { useSiteConfig } from "@/context/ConfigContext";
import { useLeadModal } from "@/context/LeadModalContext";
import { PackageItem } from "@/config/siteConfig";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Zap,
  Users,
  Cpu,
} from "lucide-react";

interface PricingSectionProps {
  initialTab?: "all" | "internet" | "combo" | "highspeed";
  title?: string;
  subtitle?: string;
}

export default function PricingSection({
  initialTab = "all",
  title = "Bảng Giá Gói Cước Internet & Combo FPT Mới Nhất",
  subtitle = "Giá cước minh bạch đã bao gồm 10% VAT • Hỗ trợ khảo sát hạ tầng & ký hợp đồng tại nhà",
}: PricingSectionProps) {
  const siteConfig = useSiteConfig();
  const { openLeadModal } = useLeadModal();
  const [activeTab, setActiveTab] = useState<"all" | "internet" | "combo" | "highspeed">(
    initialTab
  );
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const allPackages: PackageItem[] = [
    ...siteConfig.packages.internet,
    ...siteConfig.packages.combo,
  ];

  const filteredPackages = allPackages.filter((pkg) => {
    if (activeTab === "all") return true;
    if (activeTab === "highspeed") {
      return (
        pkg.speed.toLowerCase().includes("1 gbps") ||
        pkg.speed.toLowerCase().includes("1000") ||
        pkg.id.includes("game") ||
        pkg.name.toLowerCase().includes("meta") ||
        pkg.name.toLowerCase().includes("sky")
      );
    }
    return pkg.category === activeTab;
  });

  const handleSelectPackage = (pkgName: string) => {
    openLeadModal(pkgName);
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStartingPrice = (priceStr: string) => {
    if (priceStr.includes(" - ")) {
      return priceStr.split(" - ")[0];
    }
    return priceStr;
  };

  return (
    <section id="bang-gia" className="py-8 sm:py-12 lg:py-16 bg-[#F4F6FB] relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Filter Segment Tabs */}
        <div className="text-left sm:text-center max-w-3xl mx-auto mb-5 sm:mb-9">
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white text-[#9A3412] border border-[#E4E8ED] font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-2 shadow-2xs">
            <img
              src="/images/icons/svg/bang-gia.svg"
              alt="Bảng Giá"
              width={16}
              height={16}
              loading="lazy"
              decoding="async"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0"
            />
            <span>Bảng Giá Minh Bạch &bull; Chính Hãng FPT</span>
          </span>
          <h2 className="text-[21px] sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight leading-snug sm:leading-tight">
            {title}
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
            {subtitle}
          </p>

          {/* Responsive Filter Pills (Scroll-safe on small screens) */}
          <div className="mt-4 sm:mt-7 flex sm:inline-flex p-1 sm:p-1.5 rounded-2xl sm:rounded-full bg-white border border-[#E4E8ED] shadow-xs w-full sm:w-auto overflow-x-auto no-scrollbar sm:mx-auto gap-1">
            {[
              { id: "all", label: "Tất Cả" },
              { id: "internet", label: "Chỉ Internet" },
              { id: "combo", label: "Combo TV & EPL" },
              { id: "highspeed", label: "Tốc Độ 1 Gbps" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-3.5 sm:px-5 rounded-xl sm:rounded-full text-xs sm:text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#F37021] to-[#FF7A00] text-white shadow-[0_2px_10px_rgba(243,112,33,0.3)]"
                      : "text-[#475569] hover:text-[#0F172A] hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Packages Grid - Tối ưu cả PC (3 cột thẳng hàng) và Mobile (gọn gàng, dễ quét mắt) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch">
          {filteredPackages.map((pkg) => {
            const isCombo = pkg.category === "combo";
            const startingPrice = getStartingPrice(pkg.priceDisplay);
            const hasRange = pkg.priceDisplay.includes(" - ");
            const isExpanded = Boolean(expandedCards[pkg.id]);

            return (
              <div
                key={pkg.id}
                className={`rounded-2xl sm:rounded-3xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                  pkg.highlight
                    ? "bg-white border-2 border-[#F37021] shadow-[0_12px_36px_rgba(243,112,33,0.14)]"
                    : "bg-white border border-[#E4E8ED] shadow-2xs hover:border-[#F37021]/70 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)] lg:hover:-translate-y-1"
                }`}
              >
                {/* Top Card Header (Nền nổi bật nhẹ, hiển thị Tên gói + Tốc độ + Giá rõ ràng trong 1 giây) */}
                <div
                  className={`p-4 sm:p-6 pb-4 border-b border-slate-100 ${
                    pkg.highlight
                      ? "bg-gradient-to-br from-[#FFF6EF] via-white to-white"
                      : "bg-gradient-to-br from-[#F8FAFC] via-white to-white"
                  }`}
                >
                  {/* Row 1: Category & Highlight Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#334155] border border-slate-200 whitespace-nowrap">
                      <span>{isCombo ? "Combo Internet + TV" : "Internet Wi-Fi 6"}</span>
                    </span>
                    {pkg.badge && (
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                          pkg.highlight
                            ? "bg-[#F37021] text-white shadow-2xs"
                            : "bg-[#FFF4ED] text-[#9A3412] border border-orange-200"
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  {/* Row 2: Package Name + Big Speed Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight leading-snug">
                      {pkg.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 text-white text-xs sm:text-[13px] font-black whitespace-nowrap shrink-0 shadow-2xs">
                      <Zap className="w-3.5 h-3.5 text-[#FFCC00] fill-current" />
                      <span>{pkg.speed}</span>
                    </span>
                  </div>

                  {/* Row 3: Big Price + VAT pill */}
                  <div className="mt-3.5 flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1 whitespace-nowrap">
                      <span className="text-2xl sm:text-3xl font-black text-[#9A3412] tracking-tight leading-none">
                        {startingPrice}
                      </span>
                      <span className="text-xs text-[#475569] font-semibold">
                        {pkg.billingCycle}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Đã gồm VAT
                    </span>
                  </div>

                  {hasRange && (
                    <p className="text-[11px] text-[#475569] mt-1">
                      Giá tham khảo {pkg.priceDisplay} tùy khu vực
                    </p>
                  )}
                </div>

                {/* Card Body (Scannable & Compact on Mobile) */}
                <div className="p-4 sm:p-6 pt-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3.5">
                    {/* Compact Target Audience Tag */}
                    <div className="flex items-start gap-2 text-xs text-[#334155] bg-[#F8FAFC] px-3 py-2 rounded-xl border border-slate-200/70">
                      <Users className="w-3.5 h-3.5 text-[#F37021] shrink-0 mt-0.5" />
                      <span className="leading-snug">
                        <strong className="text-[#0F172A]">Phù hợp:</strong> {pkg.idealFor}
                      </span>
                    </div>

                    {/* Top 3 Core Features (Always visible), extras collapsible on mobile */}
                    <ul className="space-y-2 text-xs sm:text-[13px] text-[#2F364A]">
                      {pkg.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </span>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}

                      {pkg.features.slice(3).map((feat, idx) => (
                        <li
                          key={`extra-${idx}`}
                          className={`${isExpanded ? "flex" : "hidden md:flex"} items-start gap-2`}
                        >
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </span>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Equipment Compact Chips (Always visible on Desktop, collapsible on Mobile) */}
                    <div className={`${isExpanded ? "block" : "hidden md:block"} pt-2 border-t border-slate-100`}>
                      <span className="text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5 mb-2">
                        <Cpu className="w-3.5 h-3.5 text-[#F37021]" />
                        <span>Thiết bị kèm theo:</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.equipment.map((eq, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFF4ED]/70 border border-orange-200/70 text-[11px] font-semibold text-[#9A3412]"
                          >
                            <ShieldCheck className="w-3 h-3 text-[#F37021] shrink-0" />
                            <span>{eq}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Expand/Collapse Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(pkg.id)}
                      className="md:hidden w-full py-1 text-[11px] font-bold text-[#475569] hover:text-[#F37021] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? "Thu gọn chi tiết" : "Xem thiết bị & chi tiết"}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-2 mt-auto">
                    <button
                      onClick={() => handleSelectPackage(pkg.name)}
                      className={`w-full py-3 px-5 rounded-full font-extrabold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.98] ${
                        pkg.highlight
                          ? "bg-gradient-to-r from-[#F37021] to-[#FF7A00] hover:from-[#E05D10] hover:to-[#F37021] text-white shadow-[0_6px_18px_rgba(243,112,33,0.32)]"
                          : "bg-slate-900 hover:bg-[#F37021] text-white shadow-2xs"
                      }`}
                    >
                      <span>Đăng Ký Gói Này</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Transparency Note */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E8ED] shadow-2xs text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <img src="/images/icons/svg/modem.svg" alt="Modem" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] object-contain" />
            <img src="/images/icons/svg/camera-ai.svg" alt="Camera" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] object-contain" />
            <img src="/images/icons/svg/lap-dat.svg" alt="Lắp đặt" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] object-contain" />
          </div>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal text-center sm:text-left">
            <strong className="text-[#0F172A] font-bold">Chính sách minh bạch:</strong> Bảng giá tham khảo đã bao gồm 10% VAT. Chính sách trang bị Modem Wi-Fi 6, tặng Camera FPT AI và tháng cước ưu đãi áp dụng theo điều kiện từng gói cước, hình thức trả trước và khu vực lắp đặt.
          </p>
        </div>
      </div>
    </section>
  );
}
