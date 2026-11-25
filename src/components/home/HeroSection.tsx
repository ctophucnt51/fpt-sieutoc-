"use client";

import { useSiteConfig } from "@/context/ConfigContext";
import { useLeadModal } from "@/context/LeadModalContext";
import LeadForm from "@/components/forms/LeadForm";
import { Star, ArrowRight, Check } from "lucide-react";

interface HeroSectionProps {
  badge?: string;
  headline?: React.ReactNode;
  subheadline?: React.ReactNode;
  defaultPackage?: string;
  formHeadline?: string;
  campaignContext?: string;
  showPriorityCards?: boolean;
}

export default function HeroSection({
  badge = "Đại Lý Tiếp Nhận FPT Telecom • Phủ Sóng Toàn Quốc • Khảo Sát 0đ",
  headline = (
    <>
      Lắp Mạng FPT <span className="text-[#F37021]">Wi-Fi 6 Siêu Tốc</span>
    </>
  ),
  subheadline,
  defaultPackage = "SKY",
  formHeadline = "NHẬN TƯ VẤN MIỄN PHÍ",
  showPriorityCards = false,
}: HeroSectionProps) {
  const siteConfig = useSiteConfig();
  const { openLeadModal } = useLeadModal();

  return (
    <section className="relative bg-gradient-to-br from-[#F8FAFC] via-white to-[#FFF7F2] pt-5 pb-8 sm:pt-8 sm:pb-12 border-b border-[#E4E8ED] overflow-hidden max-w-full">
      {/* Subtle Nationwide Fiber Optic Infrastructure Map Backdrop (Desktop) */}
      <div className="hidden lg:block absolute right-[38%] top-1/2 -translate-y-1/2 w-[540px] h-[540px] pointer-events-none select-none opacity-[0.12]">
        <img
          src="/images/banners/vietnam-network-map.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
          {/* Left Column: Clear Value Proposition, Hardware Showcase & Priority Packages */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4E8ED] text-[11px] sm:text-xs font-semibold text-[#0F172A] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
              <span>{badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-black text-[#0F172A] tracking-tight leading-snug sm:leading-[1.18] break-words">
              {headline}
            </h1>

            {showPriorityCards ? (
              <div className="space-y-4 text-left max-w-2xl mx-auto lg:max-w-none">
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-center lg:text-left font-medium">
                  Đường truyền cáp quang tốc độ lên đến <strong className="text-[#0F172A]">1 Gbps</strong>, lắp đặt thần tốc trong 24h. Trang bị trọn bộ thiết bị chính hãng:
                </p>

                {/* 1. Showcase 3 Real Hardware & Infrastructure Visuals */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                  {/* Hardware 1: Modem Wi-Fi 6 */}
                  <div className="rounded-2xl bg-white border border-[#E4E8ED] p-2 sm:p-3 text-center shadow-2xs hover:border-orange-300 transition-all flex flex-col items-center">
                    <div className="w-full h-14 sm:h-20 flex items-center justify-center mb-1.5 bg-[#F8FAFC] rounded-xl p-1">
                      <img
                        src="/images/products/modem-wifi-6.jpg"
                        alt="Modem Wi-Fi 6 FPT"
                        width={90}
                        height={90}
                        loading="eager"
                        decoding="async"
                        className="max-h-full w-auto object-contain mix-blend-multiply"
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs font-extrabold text-[#0F172A] leading-tight whitespace-nowrap">
                      Modem Wi-Fi 6
                    </span>
                    <span className="mt-1 text-[9.5px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Trang bị 0đ
                    </span>
                  </div>

                  {/* Hardware 2: Camera FPT AI */}
                  <div className="rounded-2xl bg-white border border-[#E4E8ED] p-2 sm:p-3 text-center shadow-2xs hover:border-orange-300 transition-all flex flex-col items-center">
                    <div className="w-full h-14 sm:h-20 flex items-center justify-center mb-1.5 bg-[#F8FAFC] rounded-xl p-1">
                      <img
                        src="/images/products/camera-fpt-ai.png"
                        alt="Camera FPT AI"
                        width={90}
                        height={90}
                        loading="eager"
                        decoding="async"
                        className="max-h-full w-auto object-contain"
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs font-extrabold text-[#0F172A] leading-tight whitespace-nowrap">
                      Camera FPT AI
                    </span>
                    <span className="mt-1 text-[9.5px] sm:text-[10px] font-bold text-[#C44D06] bg-[#FFF4ED] px-2 py-0.5 rounded-full whitespace-nowrap">
                      Tặng kèm 0đ
                    </span>
                  </div>

                  {/* Infrastructure 3: Vietnam Fiber Coverage */}
                  <div className="rounded-2xl bg-white border border-[#E4E8ED] p-2 sm:p-3 text-center shadow-2xs hover:border-blue-300 transition-all flex flex-col items-center">
                    <div className="w-full h-14 sm:h-20 flex items-center justify-center mb-1.5 bg-[#F8FAFC] rounded-xl p-1">
                      <img
                        src="/images/banners/vietnam-network-map.png"
                        alt="Hạ tầng FPT Phủ Sóng Toàn Quốc"
                        width={90}
                        height={90}
                        loading="eager"
                        decoding="async"
                        className="max-h-full w-auto object-contain"
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs font-extrabold text-[#0F172A] leading-tight whitespace-nowrap">
                      Hạ Tầng 63 Tỉnh
                    </span>
                    <span className="mt-1 text-[9.5px] sm:text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Lắp đặt 24h
                    </span>
                  </div>
                </div>

                {/* 2. Two Highlighted Package Cards (Tối ưu hiển thị giá, tốc độ & CTA không xuống dòng) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Card 1: Combo Net + Ngoại Hạng Anh 220K */}
                  <div
                    onClick={() => openLeadModal("Combo GIGA")}
                    className="rounded-2xl bg-white p-4 border border-[#E4E8ED] border-t-[3px] border-t-[#F37021] hover:border-[#F37021] shadow-[0_4px_16px_rgba(243,112,33,0.08)] hover:shadow-[0_8px_24px_rgba(243,112,33,0.16)] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 whitespace-nowrap">
                          <img
                            src="/images/icons/svg/ngoai-hang-anh.svg"
                            alt="EPL"
                            width={12}
                            height={12}
                            className="w-3 h-3 object-contain shrink-0"
                          />
                          <span>380 Trận EPL</span>
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F37021] text-white whitespace-nowrap">
                          HOT NHẤT
                        </span>
                      </div>

                      <h2 className="text-[15px] font-black text-[#0F172A] group-hover:text-[#F37021] transition-colors leading-snug">
                        Combo Internet + Ngoại Hạng Anh
                      </h2>

                      <div className="flex items-baseline justify-between gap-2 my-2">
                        <div className="flex items-baseline gap-1 whitespace-nowrap">
                          <span className="text-2xl font-black text-[#C44D06] tracking-tight leading-none">
                            220.000đ
                          </span>
                          <span className="text-xs text-[#64748B] font-semibold">/tháng</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#0F172A] bg-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                          300 Mbps
                        </span>
                      </div>

                      <ul className="space-y-1 mt-2 text-xs text-[#334155]">
                        <li className="flex items-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Xem trọn vẹn 380 trận Ngoại Hạng Anh</span>
                        </li>
                        <li className="flex items-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Tặng Modem Wi-Fi 6 &amp; Camera AI 0đ</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-[#64748B] whitespace-nowrap">Lắp đặt 24h</span>
                      <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F37021] to-[#FF7A00] text-white text-xs font-bold shadow-2xs transition-all whitespace-nowrap shrink-0">
                        <span>Đăng ký</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Gói chỉ Internet Wi-Fi 6 195K */}
                  <div
                    onClick={() => openLeadModal("SKY")}
                    className="rounded-2xl bg-white p-4 border border-[#E4E8ED] border-t-[3px] border-t-[#0F172A] hover:border-[#F37021] shadow-2xs hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                          <img
                            src="/images/icons/svg/wifi-6.svg"
                            alt="Wi-Fi 6"
                            width={12}
                            height={12}
                            className="w-3 h-3 object-contain shrink-0"
                          />
                          <span>Gói Sky Wi-Fi 6</span>
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 whitespace-nowrap">
                          TIẾT KIỆM
                        </span>
                      </div>

                      <h2 className="text-[15px] font-black text-[#0F172A] group-hover:text-[#F37021] transition-colors leading-snug">
                        Chỉ Internet Wi-Fi 6 Siêu Tốc
                      </h2>

                      <div className="flex items-baseline justify-between gap-2 my-2">
                        <div className="flex items-baseline gap-1 whitespace-nowrap">
                          <span className="text-2xl font-black text-[#0F172A] tracking-tight leading-none">
                            195.000đ
                          </span>
                          <span className="text-xs text-[#64748B] font-semibold">/tháng</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                          Đến 1 Gbps
                        </span>
                      </div>

                      <ul className="space-y-1 mt-2 text-xs text-[#334155]">
                        <li className="flex items-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Băng thông cực đại, chịu tải 30+ thiết bị</span>
                        </li>
                        <li className="flex items-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Trang bị Modem Wi-Fi 6 hai băng tần</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-[#64748B] whitespace-nowrap">Khảo sát 0đ</span>
                      <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#0F172A] group-hover:bg-[#F37021] text-white text-xs font-bold shadow-2xs transition-all whitespace-nowrap shrink-0">
                        <span>Đăng ký</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Trust Strip */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-0.5 text-[11px] text-[#334155] font-semibold">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4E8ED] shadow-2xs whitespace-nowrap">
                    <img src="/images/icons/svg/lap-dat.svg" alt="Lắp đặt" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0" />
                    <span>Lắp đặt 24H</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4E8ED] shadow-2xs whitespace-nowrap">
                    <img src="/images/icons/svg/khao-sat.svg" alt="Khảo sát" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0" />
                    <span>Khảo sát 0đ</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#E4E8ED] shadow-2xs whitespace-nowrap">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" />
                    <span>4.9/5 (100K+ KH)</span>
                  </span>
                </div>
              </div>
            ) : (
              <>
                {typeof subheadline === "string" ? (
                  <p className="text-xs sm:text-sm text-[#475569] font-normal leading-relaxed max-w-2xl mx-auto lg:max-w-none">
                    {subheadline}
                  </p>
                ) : (
                  subheadline
                )}

                {/* Subpage Hardware + Benefits Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-0.5 text-left max-w-xl mx-auto lg:max-w-none">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-[#E4E8ED] shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center shrink-0 p-1">
                      <img
                        src="/images/products/modem-wifi-6.jpg"
                        alt="Wi-Fi 6"
                        width={36}
                        height={36}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] truncate">Modem Wi-Fi 6</p>
                      <p className="text-[10px] text-[#C44D06] font-semibold truncate">195K/th &bull; 1 Gbps</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-[#E4E8ED] shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center shrink-0 p-1">
                      <img
                        src="/images/products/camera-fpt-ai.png"
                        alt="Camera AI"
                        width={36}
                        height={36}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] truncate">Tặng Camera AI</p>
                      <p className="text-[10px] text-emerald-700 font-semibold truncate">An ninh Cloud 0đ</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-[#E4E8ED] shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 p-1.5">
                      <img
                        src="/images/icons/svg/ngoai-hang-anh.svg"
                        alt="EPL"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] truncate">Combo Net + EPL</p>
                      <p className="text-[10px] text-red-600 font-semibold truncate">220K/th &bull; 380 trận</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-[#E4E8ED] shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center shrink-0 p-1">
                      <img
                        src="/images/banners/vietnam-network-map.png"
                        alt="Toàn quốc"
                        width={36}
                        height={36}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] truncate">Phủ sóng toàn quốc</p>
                      <p className="text-[10px] text-blue-700 font-semibold truncate">Lắp đặt nhanh 24h</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: Clean White Lead Form Container */}
          <div className="lg:col-span-5 w-full mt-2 lg:mt-0">
            <LeadForm
              defaultPackage={defaultPackage}
              headline={formHeadline}
              subheadline={siteConfig.promo?.heroGiftText || "Tặng thiết bị WiFi 6 cho 300 KH đầu tiên"}
              formLocation="hero-mobile-form"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
