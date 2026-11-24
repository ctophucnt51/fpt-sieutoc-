"use client";

import { useState } from "react";
import { useSiteConfig } from "@/context/ConfigContext";
import { useLeadModal } from "@/context/LeadModalContext";
import { PackageItem } from "@/config/siteConfig";
import { Check, ArrowRight, ShieldCheck, ChevronRight, Sparkles } from "lucide-react";

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
    <section id="bang-gia" className="py-8 sm:py-12 lg:py-16 bg-[#F4F6FB] relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Phong cách Long Châu: Tiêu đề rõ ràng, Tabs chuyển danh mục bo tròn) */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#C44D06] border border-[#E4E8ED] font-bold text-xs uppercase tracking-wider mb-2.5 shadow-xs">
            <img
              src="/images/icons/svg/bang-gia.svg"
              alt="Bảng Giá"
              width={16}
              height={16}
              loading="lazy"
              decoding="async"
              className="w-4 h-4 object-contain shrink-0"
            />
            <span>Bảng Giá Minh Bạch &bull; Chính Hãng FPT</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
            {title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#334155] font-medium">
            {subtitle} &bull; <span className="text-emerald-700 font-bold whitespace-nowrap">Đã bao gồm 10% VAT</span>
          </p>

          {/* Category Tabs - Phong cách Long Châu Segment Tabs */}
          <div className="mt-5 sm:mt-7 inline-flex p-1.5 rounded-full bg-white border border-[#E4E8ED] shadow-xs max-w-sm sm:max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-2 px-4 sm:px-6 rounded-full text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#F37021] text-white shadow-[0_2px_10px_rgba(243,112,33,0.35)]"
                  : "text-[#657384] hover:text-[#20283D] hover:bg-[#F4F6FB]"
              }`}
            >
              <img
                src="/images/icons/svg/bang-gia.svg"
                alt="Tất cả"
                width={15}
                height={15}
                loading="lazy"
                decoding="async"
                className="w-3.5 h-3.5 object-contain shrink-0 hidden sm:inline-block"
              />
              <span>Tất Cả</span>
            </button>
            <button
              onClick={() => setActiveTab("internet")}
              className={`py-2 px-4 sm:px-6 rounded-full text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "internet"
                  ? "bg-[#F37021] text-white shadow-[0_2px_10px_rgba(243,112,33,0.35)]"
                  : "text-[#657384] hover:text-[#20283D] hover:bg-[#F4F6FB]"
              }`}
            >
              <img
                src="/images/icons/svg/wifi-6.svg"
                alt="Internet"
                width={15}
                height={15}
                loading="lazy"
                decoding="async"
                className="w-3.5 h-3.5 object-contain shrink-0 hidden sm:inline-block"
              />
              <span>Chỉ Internet</span>
            </button>
            <button
              onClick={() => setActiveTab("combo")}
              className={`py-2 px-4 sm:px-6 rounded-full text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "combo"
                  ? "bg-[#F37021] text-white shadow-[0_2px_10px_rgba(243,112,33,0.35)]"
                  : "text-[#657384] hover:text-[#20283D] hover:bg-[#F4F6FB]"
              }`}
            >
              <img
                src="/images/icons/svg/fpt-play.svg"
                alt="Combo TV"
                width={15}
                height={15}
                loading="lazy"
                decoding="async"
                className="w-3.5 h-3.5 object-contain shrink-0 hidden sm:inline-block"
              />
              <span>Combo TV &amp; Net</span>
            </button>
          </div>
        </div>

        {/* Packages Grid - Phong cách Product Cards của Long Châu (Trắng Tinh, Bo 16px, Viền Mảnh #E4E8ED, Hover Đổ Bóng Cam) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {filteredPackages.map((pkg) => {
            const isCombo = pkg.category === "combo";
            const startingPrice = getStartingPrice(pkg.priceDisplay);
            const hasRange = pkg.priceDisplay.includes(" - ");
            const pkgIcon = pkg.id === "f-game" || pkg.name.toLowerCase().includes("game")
              ? "/images/icons/svg/gaming.svg"
              : pkg.name.toLowerCase().includes("mesh")
              ? "/images/icons/svg/wifi-mesh.svg"
              : isCombo
              ? "/images/icons/svg/fpt-play.svg"
              : "/images/icons/svg/wifi-6.svg";

            return (
              <div
                key={pkg.id}
                className={`rounded-2xl transition-all duration-300 flex flex-col justify-between relative bg-white border ${
                  pkg.highlight
                    ? "border-[#F37021] shadow-[0_8px_30px_rgba(243,112,33,0.16)] ring-1 ring-[#F37021]"
                    : "border-[#E4E8ED] shadow-xs hover:border-[#F37021] hover:shadow-[0_8px_25px_rgba(243,112,33,0.12)]"
                }`}
              >
                {/* Long Châu Style Card Top Tags */}
                <div className="p-5 sm:p-6 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4F6FB] text-[#2F364A] border border-[#E4E8ED]">
                      <img
                        src={pkgIcon}
                        alt="Icon"
                        width={14}
                        height={14}
                        loading="lazy"
                        decoding="async"
                        className="w-3.5 h-3.5 object-contain"
                      />
                      <span>{isCombo ? "Combo Internet + TV" : "Internet Wi-Fi 6"}</span>
                    </span>
                    {pkg.badge && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFF4ED] text-[#C44D06] border border-orange-200">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xl font-black text-[#20283D] uppercase tracking-tight">
                    {pkg.name}
                  </h3>
                  
                  {/* Speed Chip (Long Châu Unit Switcher Style) */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FFF4ED] text-[#C44D06] text-xs font-bold">
                      <Sparkles className="w-3 h-3 text-[#C44D06]" />
                      <span>Tốc độ: {pkg.speed}</span>
                    </span>
                    {pkg.name.toLowerCase().includes("meta") && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                        Đối xứng 1:1
                      </span>
                    )}
                    {(pkg.id === "net-fgame" || pkg.name.toLowerCase().includes("game")) && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold">
                        Ultra Fast Giảm Ping
                      </span>
                    )}
                  </div>

                  {/* Price Block (Long Châu Style: Giá to màu cam nổi bật + đơn vị / tháng) */}
                  <div className="mt-3.5 pt-3.5 border-t border-[#F4F6FB]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-[#C44D06] tracking-tight leading-none">
                        {startingPrice}
                      </span>
                      <span className="text-xs text-[#657384] font-semibold">{pkg.billingCycle}</span>
                    </div>

                    {hasRange && (
                      <p className="text-[11px] text-[#94A3B8] mt-1">
                        (Giá dao động {pkg.priceDisplay} theo khu vực)
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Body & Features */}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Ideal For Box */}
                    <div className="mb-3.5 text-xs text-[#2F364A] bg-[#F4F6FB] p-3 rounded-xl border border-[#E4E8ED] leading-relaxed">
                      <strong className="text-[#20283D] block mb-0.5 font-bold">Phù hợp nhu cầu:</strong>
                      {pkg.idealFor}
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 mb-4 text-xs sm:text-[13px] text-[#2F364A]">
                      {pkg.features.map((feat, idx) => {
                        const lower = feat.toLowerCase();
                        let featIcon = null;
                        if (lower.includes("đối xứng")) {
                          featIcon = "/images/icons/svg/bang-thong-doi-xung.svg";
                        } else if (lower.includes("ultra fast") || lower.includes("giảm ping")) {
                          featIcon = "/images/icons/svg/ultra-fast.svg";
                        } else if (lower.includes("download") || lower.includes("tải về") || lower.includes("tải xuống")) {
                          featIcon = "/images/icons/svg/tai-xuong.svg";
                        } else if (lower.includes("upload") || lower.includes("tải lên")) {
                          featIcon = "/images/icons/svg/tai-len.svg";
                        } else if (lower.includes("smart tv") || lower.includes("không cần box")) {
                          featIcon = "/images/icons/svg/smart-tv.svg";
                        } else if (lower.includes("kênh truyền hình")) {
                          featIcon = "/images/icons/svg/kenh-truyen-hinh.svg";
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
                                  loading="lazy"
                                  decoding="async"
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

                    {/* Equipment Included */}
                    <div className="mb-4 pt-3 border-t border-[#F4F6FB] text-xs text-[#657384]">
                      <span className="font-bold text-[#20283D] block mb-1.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#F37021] shrink-0" />
                        Thiết bị kèm theo:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[#2F364A]">
                        {pkg.equipment.map((eq, i) => (
                          <li key={i}>{eq}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Long Châu Style Full-Width Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleSelectPackage(pkg.name)}
                      className="w-full py-3 px-6 rounded-full font-extrabold text-xs sm:text-sm tracking-wide bg-[#F37021] hover:bg-[#E05D10] text-white shadow-[0_4px_16px_rgba(243,112,33,0.3)] hover:shadow-[0_6px_20px_rgba(243,112,33,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>ĐĂNG KÝ GÓI NÀY</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPackage(pkg.name)}
                      className="text-xs font-bold text-[#F37021] hover:text-[#E05D10] flex items-center justify-center gap-1 mx-auto mt-2.5 cursor-pointer group"
                    >
                      <span>Xem chi tiết ưu đãi</span>
                      <span className="text-[#F37021] group-hover:translate-x-0.5 transition-transform">&gt;</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Transparency Note (Long Châu Style White Card) */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E8ED] shadow-xs text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <img src="/images/icons/svg/modem.svg" alt="Modem" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] object-contain" />
            <img src="/images/icons/svg/camera-ai.svg" alt="Camera" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] object-contain" />
            <img src="/images/icons/svg/lap-dat.svg" alt="Lắp đặt" width={22} height={22} loading="lazy" decoding="async" className="w-[22px] h-[22px] object-contain" />
          </div>
          <p className="text-xs sm:text-sm text-[#657384] leading-relaxed font-normal text-center sm:text-left">
            <strong className="text-[#20283D] font-bold">Chính sách minh bạch &amp; ưu đãi:</strong> Bảng giá đã bao gồm 10% VAT. Khách hàng đăng ký gói cước mới được trang bị Modem Wi-Fi 6 thế hệ mới 0đ trong suốt thời gian hòa mạng. <strong className="text-[#C44D06] font-bold">Ưu đãi tặng Camera FPT AI</strong> áp dụng có điều kiện theo chính sách hòa mạng trả trước hiện hành của FPT Telecom. Hỗ trợ khảo sát hạ tầng tận nơi 0đ trong 24 giờ.
          </p>
        </div>
      </div>
    </section>
  );
}
