"use client";

import { useState } from "react";
import { useSiteConfig } from "@/context/ConfigContext";
import { useLeadModal } from "@/context/LeadModalContext";
import { PackageItem } from "@/config/siteConfig";
import { Check, ArrowRight, ShieldCheck, ChevronRight } from "lucide-react";

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-fpt-orange border border-orange-200/80 font-bold text-xs uppercase tracking-wider mb-2 shadow-2xs backdrop-blur-md">
            <img
              src="/images/icons/liquid-glass/bang-gia.webp"
              alt="Bảng Giá"
              width={16}
              height={16}
              className="w-4 h-4 object-contain shrink-0"
            />
            <span>Bảng Giá Minh Bạch</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-normal">
            {subtitle}
          </p>

          {/* Category Tabs - Viettel Vx Pill Style */}
          <div className="mt-5 sm:mt-7 inline-flex p-1.5 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-xs max-w-sm sm:max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-2 px-3.5 sm:px-5 rounded-full text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "all"
                  ? "bg-fpt-orange text-white shadow-[0_2px_12px_rgba(243,112,33,0.35)]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              <img
                src="/images/icons/liquid-glass/bang-gia.webp"
                alt="Tất cả"
                width={15}
                height={15}
                className="w-3.5 h-3.5 object-contain shrink-0 hidden sm:inline-block"
              />
              <span>Tất Cả</span>
            </button>
            <button
              onClick={() => setActiveTab("internet")}
              className={`py-2 px-3.5 sm:px-5 rounded-full text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "internet"
                  ? "bg-fpt-orange text-white shadow-[0_2px_12px_rgba(243,112,33,0.35)]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              <img
                src="/images/icons/liquid-glass/wifi-6.webp"
                alt="Internet"
                width={15}
                height={15}
                className="w-3.5 h-3.5 object-contain shrink-0 hidden sm:inline-block"
              />
              <span>Chỉ Internet</span>
            </button>
            <button
              onClick={() => setActiveTab("combo")}
              className={`py-2 px-3.5 sm:px-5 rounded-full text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "combo"
                  ? "bg-fpt-orange text-white shadow-[0_2px_12px_rgba(243,112,33,0.35)]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              <img
                src="/images/icons/liquid-glass/fpt-play.webp"
                alt="Combo TV"
                width={15}
                height={15}
                className="w-3.5 h-3.5 object-contain shrink-0 hidden sm:inline-block"
              />
              <span>Combo TV &amp; Net</span>
            </button>
          </div>
        </div>

        {/* Packages Grid - Viettel Vx Wave Header Cards in FPT Orange */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {filteredPackages.map((pkg) => {
            const isCombo = pkg.category === "combo";
            const startingPrice = getStartingPrice(pkg.priceDisplay);
            const hasRange = pkg.priceDisplay.includes(" - ");
            const pkgIcon = pkg.id === "f-game" || pkg.name.toLowerCase().includes("game")
              ? "/images/icons/liquid-glass/gaming.webp"
              : pkg.name.toLowerCase().includes("mesh")
              ? "/images/icons/liquid-glass/wifi-mesh.webp"
              : isCombo
              ? "/images/icons/liquid-glass/fpt-play.webp"
              : "/images/icons/liquid-glass/wifi-6.webp";

            return (
              <div
                key={pkg.id}
                className={`rounded-3xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden bg-white ${
                  pkg.highlight
                    ? "shadow-[0_12px_45px_rgba(243,112,33,0.18)] ring-2 ring-fpt-orange"
                    : "shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(243,112,33,0.12)] border border-slate-100"
                }`}
              >
                {/* Viettel Vx Signature Organic Wave Header in FPT Orange */}
                <div className="relative bg-gradient-to-br from-[#ff6b00] via-fpt-orange to-[#d4560b] text-white pt-5 pb-7 px-5 sm:px-6 overflow-hidden">
                  {/* Subtle circular accents for depth */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="absolute top-1/2 -left-10 w-24 h-24 bg-black/10 rounded-full blur-lg pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/95 uppercase tracking-wider">
                        <img
                          src={pkgIcon}
                          alt={isCombo ? "Combo" : "Internet"}
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5 object-contain brightness-0 invert"
                        />
                        <span>{isCombo ? "Combo Internet + TV" : "Internet Wi-Fi 6"}</span>
                      </span>
                      {pkg.badge && (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white text-fpt-orange shadow-xs uppercase tracking-tight">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-white/90 font-medium mt-0.5">
                      Tốc độ tải {pkg.speed}
                    </p>
                  </div>

                  {/* Organic Wave Bottom Curve */}
                  <div className="absolute -bottom-1 inset-x-0 w-full overflow-hidden leading-none pointer-events-none">
                    <svg
                      className="relative block w-full h-5 text-white"
                      viewBox="0 0 360 24"
                      fill="currentColor"
                      preserveAspectRatio="none"
                    >
                      <path d="M0,0 C120,24 240,0 360,20 L360,24 L0,24 Z" />
                    </svg>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Price Block */}
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                        {startingPrice}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{pkg.billingCycle}</span>
                    </div>

                    {hasRange && (
                      <p className="text-[11px] text-slate-400 mb-2">
                        (Giá dao động {pkg.priceDisplay} theo khu vực)
                      </p>
                    )}

                    {/* Speed Badge */}
                    <div className="mt-2.5 mb-3.5 flex flex-wrap items-center gap-1.5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/70 text-slate-800 text-xs font-semibold">
                        <img
                          src={
                            pkg.name.toLowerCase().includes("meta")
                              ? "/images/icons/liquid-glass/bang-thong-doi-xung.webp"
                              : pkg.id === "net-fgame" || pkg.name.toLowerCase().includes("game")
                              ? "/images/icons/liquid-glass/ultra-fast.webp"
                              : "/images/icons/liquid-glass/toc-do.webp"
                          }
                          alt="Tốc độ"
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5 object-contain shrink-0"
                        />
                        <span className="truncate">Tốc độ: {pkg.speed}</span>
                      </div>
                      {pkg.name.toLowerCase().includes("meta") && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold">
                          <img
                            src="/images/icons/liquid-glass/bang-thong-doi-xung.webp"
                            alt="Băng thông đối xứng"
                            width={13}
                            height={13}
                            className="w-3 h-3 object-contain shrink-0"
                          />
                          <span>Băng thông đối xứng 1:1</span>
                        </div>
                      )}
                      {(pkg.id === "net-fgame" || pkg.name.toLowerCase().includes("game")) && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-bold">
                          <img
                            src="/images/icons/liquid-glass/ultra-fast.webp"
                            alt="Ultra Fast"
                            width={13}
                            height={13}
                            className="w-3 h-3 object-contain shrink-0"
                          />
                          <span>Ultra Fast Giảm Ping</span>
                        </div>
                      )}
                    </div>

                    {/* Ideal for box */}
                    <div className="mb-3.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                      <strong className="text-slate-900 block mb-0.5 font-bold">Phù hợp nhu cầu:</strong>
                      {pkg.idealFor}
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 mb-4 text-xs sm:text-[13px] text-slate-700">
                      {pkg.features.map((feat, idx) => {
                        const lower = feat.toLowerCase();
                        let featIcon = null;
                        if (lower.includes("đối xứng")) {
                          featIcon = "/images/icons/liquid-glass/bang-thong-doi-xung.webp";
                        } else if (lower.includes("ultra fast") || lower.includes("giảm ping")) {
                          featIcon = "/images/icons/liquid-glass/ultra-fast.webp";
                        } else if (lower.includes("download") || lower.includes("tải về") || lower.includes("tải xuống")) {
                          featIcon = "/images/icons/liquid-glass/tai-xuong.webp";
                        } else if (lower.includes("upload") || lower.includes("tải lên")) {
                          featIcon = "/images/icons/liquid-glass/tai-len.webp";
                        } else if (lower.includes("smart tv") || lower.includes("không cần box")) {
                          featIcon = "/images/icons/liquid-glass/smart-tv.webp";
                        } else if (lower.includes("kênh truyền hình")) {
                          featIcon = "/images/icons/liquid-glass/kenh-truyen-hinh.webp";
                        }

                        return (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                              {featIcon ? (
                                <img
                                  src={featIcon}
                                  alt="Icon"
                                  width={14}
                                  height={14}
                                  className="w-3.5 h-3.5 object-contain"
                                />
                              ) : (
                                <Check className="w-3 h-3 stroke-[2.5]" />
                              )}
                            </div>
                            <span className="leading-snug">{feat}</span>
                          </li>
                        );
                      })}
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

                  {/* Viettel Vx Style Pill CTA Button & View Details Link */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleSelectPackage(pkg.name)}
                      className="w-full py-3.5 px-6 rounded-full font-extrabold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-orange-500 via-fpt-orange to-[#d4560b] hover:from-orange-600 hover:to-fpt-orange text-white shadow-[0_6px_20px_rgba(243,112,33,0.3)] hover:shadow-[0_8px_25px_rgba(243,112,33,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>ĐĂNG KÝ GÓI NÀY</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPackage(pkg.name)}
                      className="text-xs font-bold text-fpt-orange hover:text-fpt-hover flex items-center justify-center gap-1 mx-auto mt-2.5 cursor-pointer group"
                    >
                      <span>Xem chi tiết ưu đãi</span>
                      <span className="text-fpt-orange group-hover:translate-x-0.5 transition-transform">&gt;</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Transparency Note - White Glass Card */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-2xs text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <img src="/images/icons/liquid-glass/modem.webp" alt="Modem" width={22} height={22} className="w-[22px] h-[22px] object-contain" />
            <img src="/images/icons/liquid-glass/camera-ai.webp" alt="Camera" width={22} height={22} className="w-[22px] h-[22px] object-contain" />
            <img src="/images/icons/liquid-glass/lap-dat.webp" alt="Lắp đặt" width={22} height={22} className="w-[22px] h-[22px] object-contain" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal text-center sm:text-left">
            <strong className="text-slate-900 font-bold">Chương trình khuyến mãi:</strong> Khách hàng đăng ký gói cước mới được trang bị miễn phí Modem Wi-Fi 6 thế hệ mới, <strong className="text-fpt-orange font-bold">tặng kèm Camera FPT AI an ninh thông minh miễn phí</strong> và hỗ trợ khảo sát lắp đặt tận nhà trong 24 giờ.
          </p>
        </div>
      </div>
    </section>
  );
}
