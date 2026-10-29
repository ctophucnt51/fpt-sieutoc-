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
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <Gift className="w-4 h-4" />
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

                {/* 2. Hai Gói Cước Ưu Tiên - Nâng cấp cao cấp, sang trọng, chuyên nghiệp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Thẻ 1: Combo Net + Ngoại Hạng Anh 220K (Flagship Glass Card) */}
                  <div
                    onClick={() => openLeadModal("Combo GIGA")}
                    className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-orange-50/30 to-white backdrop-blur-2xl border-2 border-fpt-orange shadow-[0_10px_35px_rgba(243,112,33,0.15)] hover:shadow-[0_16px_45px_rgba(243,112,33,0.24)] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Subtle warm ambient glow inside card */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div>
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100/90 text-fpt-orange font-extrabold text-[10px] tracking-wide uppercase shadow-2xs">
                          <Trophy className="w-3 h-3 text-red-600" />
                          <span>Combo Thể Thao</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-[10px] tracking-tight shadow-2xs">
                          380 Trận EPL
                        </span>
                      </div>

                      {/* Package Title */}
                      <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-fpt-orange transition-colors tracking-tight leading-snug">
                        Combo Internet + Ngoại Hạng Anh
                      </h3>

                      {/* Price Display */}
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl sm:text-3xl font-black text-fpt-orange tracking-tight leading-none">
                          220.000đ
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">/tháng</span>
                        <span className="text-[10px] text-slate-400 font-medium ml-0.5">(Đã gồm VAT)</span>
                      </div>

                      {/* Feature Checklist Bullets */}
                      <ul className="space-y-1.5 my-3 text-[11px] sm:text-xs text-slate-700">
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Xem 380 trận EPL trên Smart TV (App FPT Play)</span>
                        </li>
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Internet cáp quang 150 Mbps mượt mà, ổn định</span>
                        </li>
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Trang bị Modem Wi-Fi 6 + Tặng Camera AI 0đ</span>
                        </li>
                      </ul>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-2 pt-2.5 border-t border-orange-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">Lắp đặt trong 24h</span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fpt-orange group-hover:bg-fpt-hover text-white text-xs font-bold shadow-xs group-hover:shadow-md transition-all">
                        <span>Đăng ký ngay</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Thẻ 2: Gói chỉ Internet Wi-Fi 6 195K (Sleek High-End Card) */}
                  <div
                    onClick={() => openLeadModal("SKY")}
                    className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-slate-50/40 to-white backdrop-blur-2xl border border-slate-200/90 hover:border-orange-400 shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_45px_rgba(15,23,42,0.12)] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Subtle cool ambient glow inside card */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

                    <div>
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[10px] tracking-wide uppercase shadow-2xs">
                          <Wifi className="w-3 h-3 text-fpt-orange" />
                          <span>Internet Cáp Quang</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-orange-100 text-fpt-dark font-black text-[10px] tracking-tight">
                          1 Gbps (Sky)
                        </span>
                      </div>

                      {/* Package Title */}
                      <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-fpt-orange transition-colors tracking-tight leading-snug">
                        Chỉ Internet Wi-Fi 6 Siêu Tốc
                      </h3>

                      {/* Price Display */}
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                          195.000đ
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">/tháng</span>
                        <span className="text-[10px] text-slate-400 font-medium ml-0.5">(Đã gồm VAT)</span>
                      </div>

                      {/* Feature Checklist Bullets */}
                      <ul className="space-y-1.5 my-3 text-[11px] sm:text-xs text-slate-700">
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Mở băng thông không giới hạn tới 1 Gbps</span>
                        </li>
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Trang bị Modem Wi-Fi 6 băng tần kép mới nhất</span>
                        </li>
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Kết nối cùng lúc 30+ thiết bị mượt mà, không lag</span>
                        </li>
                      </ul>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">Khảo sát 0đ</span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 group-hover:bg-fpt-orange text-white text-xs font-bold shadow-xs group-hover:shadow-md transition-all">
                        <span>Đăng ký ngay</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Cam Kết & Đánh Giá - Chống xuống hàng, canh giữa cân đối tránh khoảng trắng lớn */}
                <div className="flex flex-nowrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5 pt-1 text-[10px] sm:text-[11px] text-slate-700 font-semibold whitespace-nowrap overflow-x-auto no-scrollbar">
                  <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs shrink-0">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-fpt-orange shrink-0" />
                    <span>Lắp đặt 24H</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs shrink-0">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                    <span>Khảo sát 0đ</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs shrink-0">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-current shrink-0" />
                    <span className="sm:hidden">4.9★ (100k+ KH)</span>
                    <span className="hidden sm:inline">4.9/5★ (100.000+ Khách hàng)</span>
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
                    <div className="w-7 h-7 rounded-xl bg-orange-100 text-fpt-orange flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">Internet Wi-Fi 6</h4>
                      <p className="text-[10px] text-fpt-dark font-semibold truncate">195K/th &bull; 1 Gbps</p>
                    </div>
                  </div>

                  {/* Card 2: Combo Internet + Ngoại Hạng Anh 220K */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/85 backdrop-blur-xl hover:bg-white border border-slate-200/80 shadow-2xs transition-all">
                    <div className="w-7 h-7 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <Tv className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">Combo Net + EPL</h4>
                      <p className="text-[10px] text-red-600 font-semibold truncate">220K/th &bull; 380 trận</p>
                    </div>
                  </div>

                  {/* Card 3: Free AI Camera */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/85 backdrop-blur-xl hover:bg-white border border-slate-200/80 shadow-2xs transition-all">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">Tặng Camera AI</h4>
                      <p className="text-[10px] text-slate-500 font-normal truncate">An ninh 0đ</p>
                    </div>
                  </div>

                  {/* Card 4: 24h Fast Installation */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/85 backdrop-blur-xl hover:bg-white border border-slate-200/80 shadow-2xs transition-all">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
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
      </div>
    </section>
  );
}
