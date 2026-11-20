"use client";

import { useSiteConfig } from "@/context/ConfigContext";
import { useLeadModal } from "@/context/LeadModalContext";
import { fbTracker } from "@/components/tracking/MetaPixel";
import LeadForm from "@/components/forms/LeadForm";
import { Zap, Tv, Camera, Clock, Star, Phone, Gift, ArrowRight, ShieldCheck, Sparkles, Check, Wifi, Trophy } from "lucide-react";

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
  badge = "Ưu Đãi Độc Quyền • Trang Bị Modem Wi-Fi 6 & Camera Miễn Phí • Lắp Đặt 24H",
  headline = (
    <>
      Lắp Mạng FPT <span className="text-fpt-orange">Wi-Fi 6 Siêu Tốc</span>
    </>
  ),
  subheadline,
  defaultPackage = "SKY",
  formHeadline = "Đăng Ký Tư Vấn & Nhận Camera 0đ",
  campaignContext,
  showPriorityCards = false,
}: HeroSectionProps) {
  const siteConfig = useSiteConfig();
  const { openLeadModal } = useLeadModal();

  return (
    <section className="relative bg-gradient-to-b from-orange-50/30 via-white to-slate-50/40 pt-4 pb-6 sm:pt-7 sm:pb-10 lg:pt-8 lg:pb-12 border-b border-slate-200/60 overflow-hidden max-w-full">
      {/* Subtle Ambient Decorative Light Blurs for White Glassmorphism Depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 xl:gap-10 items-center">
          
          {/* Left Column: Value Proposition & Trust */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4.5 text-center lg:text-left">
            {/* Main Headline */}
            <h1 className="text-[23px] sm:text-3xl md:text-4xl lg:text-4xl xl:text-[44px] font-black text-slate-900 tracking-tight leading-snug sm:leading-tight break-words">
              {headline}
            </h1>

            {/* Sub-headline / Visual Value Proposition */}
            {showPriorityCards ? (
              <div className="space-y-2.5 sm:space-y-3 pt-0.5 text-left max-w-2xl mx-auto lg:max-w-none">
                {/* 1. Thiết Bị Tặng Kèm - Trực Quan & Tinh Tế (Đồng bộ động từ Cài đặt hệ thống) */}
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-emerald-200/90 text-slate-800 shadow-2xs">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 p-0.5 shadow-2xs">
                    <img
                      src="/images/icons/liquid-glass/qua-tang.webp"
                      alt="Quà tặng"
                      width={22}
                      height={22}
                      className="w-[22px] h-[22px] object-contain"
                    />
                  </div>
                  <div className="leading-snug text-[11px] sm:text-xs">
                    {siteConfig.promo?.heroGiftText ? (
                      <span className="font-bold text-slate-800">{siteConfig.promo.heroGiftText}</span>
                    ) : (
                      <>
                        <span className="font-bold text-emerald-900">Trang bị Modem Wi-Fi 6 thế hệ mới</span> &amp;{" "}
                        <span className="font-bold text-fpt-orange">Tặng kèm Camera FPT AI</span> an ninh thông minh miễn phí
                      </>
                    )}
                  </div>
                </div>

                {/* 2. Hai Gói Cước Ưu Tiên - Viettel Vx Wave Header Card Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Thẻ 1: Combo Net + Ngoại Hạng Anh 220K */}
                  <div
                    onClick={() => openLeadModal("Combo GIGA")}
                    className="rounded-3xl bg-white shadow-[0_6px_25px_rgba(243,112,33,0.14)] hover:shadow-[0_12px_35px_rgba(243,112,33,0.22)] border border-orange-200/80 transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
                  >
                    {/* Viettel Vx Wave Header in FPT Orange */}
                    <div className="relative bg-gradient-to-r from-orange-500 via-fpt-orange to-[#d4560b] text-white p-4 pb-6 overflow-hidden">
                      <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/95 uppercase tracking-wider">
                            <img
                              src="/images/icons/liquid-glass/ngoai-hang-anh.webp"
                              alt="EPL"
                              width={13}
                              height={13}
                              className="w-3.5 h-3.5 object-contain brightness-0 invert"
                            />
                            <span>Combo Thể Thao</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-white text-red-600 font-black text-[9px] tracking-tight uppercase shadow-xs">
                            380 Trận EPL
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                          Combo Internet + Ngoại Hạng Anh
                        </h3>
                      </div>
                      <div className="absolute -bottom-1 inset-x-0 w-full overflow-hidden leading-none pointer-events-none">
                        <svg className="relative block w-full h-3.5 text-white" viewBox="0 0 360 20" fill="currentColor" preserveAspectRatio="none">
                          <path d="M0,0 C120,20 240,0 360,16 L360,20 L0,20 Z" />
                        </svg>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline gap-1 my-1">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                            220.000đ
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">/tháng</span>
                        </div>

                        <ul className="space-y-1.5 my-2.5 text-[11px] sm:text-xs text-slate-700">
                          <li className="flex items-start gap-1.5 font-medium leading-tight">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Xem 380 trận EPL trên Smart TV (FPT Play)</span>
                          </li>
                          <li className="flex items-start gap-1.5 font-medium leading-tight">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Internet cáp quang 300 Mbps mượt mà</span>
                          </li>
                          <li className="flex items-start gap-1.5 font-medium leading-tight">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Trang bị Modem Wi-Fi 6 + Tặng Camera AI 0đ</span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">Lắp đặt trong 24h</span>
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-fpt-orange group-hover:from-orange-600 group-hover:to-fpt-orange text-white text-xs font-bold shadow-xs group-hover:shadow-md transition-all">
                          <span>Đăng ký</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thẻ 2: Gói chỉ Internet Wi-Fi 6 195K */}
                  <div
                    onClick={() => openLeadModal("SKY")}
                    className="rounded-3xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_35px_rgba(243,112,33,0.18)] border border-slate-200/90 hover:border-orange-300 transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
                  >
                    {/* Viettel Vx Wave Header in FPT Navy / Slate with Orange Accent */}
                    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 pb-6 overflow-hidden">
                      <div className="absolute -top-8 -right-8 w-24 h-24 bg-orange-500/10 rounded-full blur-lg pointer-events-none" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/95 uppercase tracking-wider">
                            <img
                              src="/images/icons/liquid-glass/wifi-6.webp"
                              alt="Wi-Fi 6"
                              width={13}
                              height={13}
                              className="w-3.5 h-3.5 object-contain brightness-0 invert"
                            />
                            <span>Internet Cáp Quang</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-fpt-orange text-white font-black text-[9px] tracking-tight uppercase shadow-xs">
                            1 Gbps (Sky)
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                          Chỉ Internet Wi-Fi 6 Siêu Tốc
                        </h3>
                      </div>
                      <div className="absolute -bottom-1 inset-x-0 w-full overflow-hidden leading-none pointer-events-none">
                        <svg className="relative block w-full h-3.5 text-white" viewBox="0 0 360 20" fill="currentColor" preserveAspectRatio="none">
                          <path d="M0,0 C120,20 240,0 360,16 L360,20 L0,20 Z" />
                        </svg>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline gap-1 my-1">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                            195.000đ
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">/tháng</span>
                        </div>

                        <ul className="space-y-1.5 my-2.5 text-[11px] sm:text-xs text-slate-700">
                          <li className="flex items-start gap-1.5 font-medium leading-tight">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Tốc độ Download cực khủng lên đến 1 Gbps</span>
                          </li>
                          <li className="flex items-start gap-1.5 font-medium leading-tight">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Trang bị Modem Wi-Fi 6 hai băng tần mới nhất</span>
                          </li>
                          <li className="flex items-start gap-1.5 font-medium leading-tight">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Kết nối cùng lúc 30+ thiết bị mượt mà</span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">Khảo sát 0đ</span>
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 group-hover:bg-fpt-orange text-white text-xs font-bold shadow-xs group-hover:shadow-md transition-all">
                          <span>Đăng ký</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Cam Kết & Đánh Giá - Chống xuống hàng, canh giữa cân đối tránh khoảng trắng lớn */}
                <div className="flex flex-nowrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5 pt-1 text-[10px] sm:text-[11px] text-slate-700 font-semibold whitespace-nowrap overflow-x-auto no-scrollbar">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs shrink-0">
                    <img
                      src="/images/icons/liquid-glass/lap-dat.webp"
                      alt="Lắp đặt 24h"
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5 object-contain shrink-0"
                    />
                    <span>Lắp đặt 24H</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs shrink-0">
                    <img
                      src="/images/icons/liquid-glass/khao-sat.webp"
                      alt="Khảo sát 0đ"
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5 object-contain shrink-0"
                    />
                    <span>Khảo sát 0đ</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs shrink-0">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-current shrink-0" />
                    <span className="sm:hidden">4.9/5 (100k+ KH)</span>
                    <span className="hidden sm:inline">4.9/5 (100.000+ Khách hàng)</span>
                  </span>
                </div>
              </div>
            ) : (
              <>
                {typeof subheadline === "string" ? (
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:max-w-none">
                    {subheadline}
                  </p>
                ) : (
                  subheadline
                )}

                {/* Bullet Proof Benefits Grid - White Glass Cards */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-0.5 text-left max-w-xl mx-auto lg:max-w-none">
                  {/* Card 1: Gói chỉ Internet Wi-Fi 6 195K */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/85 backdrop-blur-xl hover:bg-white border border-slate-200/80 shadow-2xs transition-all">
                    <div className="w-7 h-7 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 p-0.5">
                      <img
                        src="/images/icons/liquid-glass/wifi-6.webp"
                        alt="Wi-Fi 6"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] object-contain shrink-0"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">Internet Wi-Fi 6</h4>
                      <p className="text-[10px] text-fpt-dark font-semibold truncate">195K/th &bull; 1 Gbps</p>
                    </div>
                  </div>

                  {/* Card 2: Combo Internet + Ngoại Hạng Anh 220K */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/85 backdrop-blur-xl hover:bg-white border border-slate-200/80 shadow-2xs transition-all">
                    <div className="w-7 h-7 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 p-0.5">
                      <img
                        src="/images/icons/liquid-glass/ngoai-hang-anh.webp"
                        alt="EPL"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] object-contain shrink-0"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">Combo Net + EPL</h4>
                      <p className="text-[10px] text-red-600 font-semibold truncate">220K/th &bull; 380 trận</p>
                    </div>
                  </div>

                  {/* Card 3: Free AI Camera */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/85 backdrop-blur-xl hover:bg-white border border-slate-200/80 shadow-2xs transition-all">
                    <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 p-0.5">
                      <img
                        src="/images/icons/liquid-glass/camera-ai.webp"
                        alt="Camera AI"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] object-contain shrink-0"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">Tặng Camera AI</h4>
                      <p className="text-[10px] text-slate-500 font-normal truncate">An ninh 0đ</p>
                    </div>
                  </div>

                  {/* Card 4: 24h Fast Installation */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/85 backdrop-blur-xl hover:bg-white border border-slate-200/80 shadow-2xs transition-all">
                    <div className="w-7 h-7 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 p-0.5">
                      <img
                        src="/images/icons/liquid-glass/lap-dat.webp"
                        alt="Lắp đặt 24h"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] object-contain shrink-0"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">Lắp Đặt 24H</h4>
                      <p className="text-[10px] text-slate-500 font-normal truncate">Khảo sát 0đ</p>
                    </div>
                  </div>
                </div>

                <div className="pt-0.5 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-medium text-slate-600 text-[11px]">
                    4.9/5 điểm hài lòng từ hơn 100.000+ khách hàng
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Right Column: Lead Form in White Glassmorphism Container */}
          <div className="lg:col-span-5 w-full mt-1 lg:mt-0">
            <LeadForm
              defaultPackage={defaultPackage}
              headline={formHeadline}
              subheadline="Kiểm tra cổng cáp quang &amp; kích hoạt quà tặng Camera trong 15 phút"
              formLocation="hero-mobile-form"
            />
          </div>
        </div>

        {/* Viettel Vx Style Quick Actions Bar (5 Thẻ Tiện Ích Bo Góc Mềm) */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-slate-200/70">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {/* Action 1 */}
            <div
              onClick={() => openLeadModal("SKY")}
              className="p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-orange-50/50 border border-slate-200/90 hover:border-orange-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(243,112,33,0.12)] transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-orange-50 group-hover:bg-fpt-orange p-1.5 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                <img
                  src="/images/icons/liquid-glass/wifi-6.webp"
                  alt="Internet"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-fpt-orange transition-colors truncate">
                  Internet Wi-Fi 6
                </h4>
                <p className="text-[11px] text-slate-500 truncate">1 Gbps từ 195K/th</p>
              </div>
            </div>

            {/* Action 2 */}
            <div
              onClick={() => openLeadModal("Combo GIGA")}
              className="p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-red-50/50 border border-slate-200/90 hover:border-red-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(220,38,38,0.12)] transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-50 group-hover:bg-red-600 p-1.5 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                <img
                  src="/images/icons/liquid-glass/ngoai-hang-anh.webp"
                  alt="EPL"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors truncate">
                  Combo Thể Thao
                </h4>
                <p className="text-[11px] text-slate-500 truncate">380 trận EPL 220K</p>
              </div>
            </div>

            {/* Action 3 */}
            <div
              onClick={() => openLeadModal("Combo GIGA")}
              className="p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200/90 hover:border-emerald-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.12)] transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 p-1.5 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                <img
                  src="/images/icons/liquid-glass/camera-ai.webp"
                  alt="Camera AI"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                  Camera FPT AI 0đ
                </h4>
                <p className="text-[11px] text-slate-500 truncate">An ninh đám mây</p>
              </div>
            </div>

            {/* Action 4 */}
            <div
              onClick={() => openLeadModal("SKY")}
              className="p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200/90 hover:border-blue-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(2,132,199,0.12)] transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-50 group-hover:bg-blue-600 p-1.5 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                <img
                  src="/images/icons/liquid-glass/lap-dat.webp"
                  alt="Lắp đặt 24h"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  Lắp Đặt 24H
                </h4>
                <p className="text-[11px] text-slate-500 truncate">Khảo sát tận nơi 0đ</p>
              </div>
            </div>

            {/* Action 5 */}
            <a
              href={siteConfig.contact.hotlineTel}
              className="col-span-2 sm:col-span-1 p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-orange-50/50 border border-slate-200/90 hover:border-orange-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(243,112,33,0.12)] transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-orange-50 group-hover:bg-fpt-orange p-1.5 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                <img
                  src="/images/icons/liquid-glass/hotline.webp"
                  alt="Hotline"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-fpt-orange transition-colors truncate">
                  Hotline 24/7
                </h4>
                <p className="text-[11px] text-fpt-orange font-bold truncate">{siteConfig.contact.hotlineDisplay}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
