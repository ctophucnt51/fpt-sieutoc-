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
      Lắp Mạng FPT <span className="text-[#F37021]">Wi-Fi 6 Siêu Tốc</span>
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
    <section className="relative bg-[#F4F6FB] pt-4 pb-8 sm:pt-6 sm:pb-12 border-b border-[#E4E8ED] overflow-hidden max-w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 xl:gap-10 items-center">
          
          {/* Left Column: Value Proposition & Trust (Phong cách Long Châu: Card Trắng Sạch, Bo 16px, Badge Uy Tín) */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4E8ED] text-xs font-semibold text-[#20283D] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span>Chính sách FPT Telecom 2026</span>
              <span className="text-[#C1C8D1]">|</span>
              <span className="text-[#F37021] font-bold">Khảo sát 0đ</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-[#20283D] tracking-tight leading-snug sm:leading-tight break-words">
              {headline}
            </h1>

            {/* Sub-headline / Visual Value Proposition */}
            {showPriorityCards ? (
              <div className="space-y-3 pt-0.5 text-left max-w-2xl mx-auto lg:max-w-none">
                {/* 1. Thiết Bị Tặng Kèm - Phong cách Long Châu Trust Card */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#E4E8ED] text-[#2F364A] shadow-xs hover:border-emerald-300 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 p-0.5">
                    <img
                      src="/images/icons/liquid-glass/qua-tang.webp"
                      alt="Quà tặng"
                      width={22}
                      height={22}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="w-[22px] h-[22px] object-contain"
                    />
                  </div>
                  <div className="leading-snug text-xs sm:text-[13px]">
                    {siteConfig.promo?.heroGiftText ? (
                      <span className="font-bold text-[#20283D]">{siteConfig.promo.heroGiftText}</span>
                    ) : (
                      <>
                        <span className="font-bold text-emerald-900">Trang bị Modem Wi-Fi 6 thế hệ mới</span> &amp;{" "}
                        <span className="font-bold text-[#F37021]">Tặng kèm Camera FPT AI</span> an ninh thông minh miễn phí
                      </>
                    )}
                  </div>
                </div>

                {/* 2. Hai Gói Cước Ưu Tiên - Phong cách Long Châu Product Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Card 1: Combo Net + Ngoại Hạng Anh 220K */}
                  <div
                    onClick={() => openLeadModal("Combo GIGA")}
                    className="rounded-2xl bg-white p-4 border border-[#E4E8ED] hover:border-[#F37021] shadow-xs hover:shadow-[0_8px_24px_rgba(243,112,33,0.14)] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1.5 mb-2.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                          <img
                            src="/images/icons/liquid-glass/ngoai-hang-anh.webp"
                            alt="EPL"
                            width={12}
                            height={12}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className="w-3 h-3 object-contain shrink-0"
                          />
                          <span>380 Trận EPL</span>
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FFF4ED] text-[#F37021]">
                          HOT NHẤT
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-black text-[#20283D] group-hover:text-[#F37021] transition-colors leading-snug">
                        Combo Internet + Ngoại Hạng Anh
                      </h3>

                      {/* Price (Long Châu style) */}
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl font-black text-[#F37021] tracking-tight leading-none">
                          220.000đ
                        </span>
                        <span className="text-xs text-[#657384] font-semibold">/ tháng</span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-1.5 my-2.5 text-xs text-[#2F364A]">
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Xem trọn vẹn 380 trận EPL trên Smart TV</span>
                        </li>
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Internet cáp quang 300 Mbps mượt mà</span>
                        </li>
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Modem Wi-Fi 6 + Tặng Camera AI 0đ</span>
                        </li>
                      </ul>
                    </div>

                    {/* Bottom Action Button (Long Châu full pill) */}
                    <div className="mt-3 pt-2.5 border-t border-[#F4F6FB] flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#657384]">Lắp đặt trong 24h</span>
                      <div className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#F37021] group-hover:bg-[#E05D10] text-white text-xs font-bold shadow-xs transition-all">
                        <span>Đăng ký</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Gói chỉ Internet Wi-Fi 6 195K */}
                  <div
                    onClick={() => openLeadModal("SKY")}
                    className="rounded-2xl bg-white p-4 border border-[#E4E8ED] hover:border-[#F37021] shadow-xs hover:shadow-[0_8px_24px_rgba(243,112,33,0.14)] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1.5 mb-2.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <img
                            src="/images/icons/liquid-glass/wifi-6.webp"
                            alt="Wi-Fi 6"
                            width={12}
                            height={12}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className="w-3 h-3 object-contain shrink-0"
                          />
                          <span>1 Gbps (Gói Sky)</span>
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          TIẾT KIỆM
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-black text-[#20283D] group-hover:text-[#F37021] transition-colors leading-snug">
                        Chỉ Internet Wi-Fi 6 Siêu Tốc
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl font-black text-[#F37021] tracking-tight leading-none">
                          195.000đ
                        </span>
                        <span className="text-xs text-[#657384] font-semibold">/ tháng</span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-1.5 my-2.5 text-xs text-[#2F364A]">
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Tốc độ Download cực khủng lên đến 1 Gbps</span>
                        </li>
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Trang bị Modem Wi-Fi 6 hai băng tần</span>
                        </li>
                        <li className="flex items-start gap-1.5 font-medium leading-tight">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Kết nối cùng lúc 30+ thiết bị mượt mà</span>
                        </li>
                      </ul>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="mt-3 pt-2.5 border-t border-[#F4F6FB] flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#657384]">Khảo sát 0đ</span>
                      <div className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#20283D] group-hover:bg-[#F37021] text-white text-xs font-bold shadow-xs transition-all">
                        <span>Đăng ký</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Cam Kết & Đánh Giá */}
                <div className="flex flex-nowrap items-center justify-center lg:justify-start gap-2 pt-1 text-[11px] text-[#2F364A] font-semibold whitespace-nowrap overflow-x-auto no-scrollbar">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#E4E8ED] shadow-xs shrink-0">
                    <img
                      src="/images/icons/liquid-glass/lap-dat.webp"
                      alt="Lắp đặt 24h"
                      width={14}
                      height={14}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="w-3.5 h-3.5 object-contain shrink-0"
                    />
                    <span>Lắp đặt 24H</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#E4E8ED] shadow-xs shrink-0">
                    <img
                      src="/images/icons/liquid-glass/khao-sat.webp"
                      alt="Khảo sát 0đ"
                      width={14}
                      height={14}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="w-3.5 h-3.5 object-contain shrink-0"
                    />
                    <span>Khảo sát 0đ</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-[#E4E8ED] shadow-xs shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" />
                    <span>4.9/5 (100.000+ Khách hàng)</span>
                  </span>
                </div>
              </div>
            ) : (
              <>
                {typeof subheadline === "string" ? (
                  <p className="text-xs sm:text-sm text-[#657384] font-normal leading-relaxed max-w-2xl mx-auto lg:max-w-none">
                    {subheadline}
                  </p>
                ) : (
                  subheadline
                )}

                {/* Bullet Proof Benefits Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-0.5 text-left max-w-xl mx-auto lg:max-w-none">
                  {/* Card 1: Gói chỉ Internet Wi-Fi 6 195K */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white border border-[#E4E8ED] shadow-xs hover:border-orange-300 transition-all">
                    <div className="w-7 h-7 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 p-0.5">
                      <img
                        src="/images/icons/liquid-glass/wifi-6.webp"
                        alt="Wi-Fi 6"
                        width={22}
                        height={22}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="w-[22px] h-[22px] object-contain shrink-0"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#20283D] truncate">Internet Wi-Fi 6</h4>
                      <p className="text-[10px] text-[#F37021] font-semibold truncate">195K/th &bull; 1 Gbps</p>
                    </div>
                  </div>

                  {/* Card 2: Combo Internet + Ngoại Hạng Anh 220K */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white border border-[#E4E8ED] shadow-xs hover:border-red-300 transition-all">
                    <div className="w-7 h-7 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 p-0.5">
                      <img
                        src="/images/icons/liquid-glass/ngoai-hang-anh.webp"
                        alt="EPL"
                        width={22}
                        height={22}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="w-[22px] h-[22px] object-contain shrink-0"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#20283D] truncate">Combo Net + EPL</h4>
                      <p className="text-[10px] text-red-600 font-semibold truncate">220K/th &bull; 380 trận</p>
                    </div>
                  </div>

                  {/* Card 3: Free AI Camera */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white border border-[#E4E8ED] shadow-xs hover:border-emerald-300 transition-all">
                    <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 p-0.5">
                      <img
                        src="/images/icons/liquid-glass/camera-ai.webp"
                        alt="Camera AI"
                        width={22}
                        height={22}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="w-[22px] h-[22px] object-contain shrink-0"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#20283D] truncate">Tặng Camera AI</h4>
                      <p className="text-[10px] text-[#657384] font-normal truncate">An ninh 0đ</p>
                    </div>
                  </div>

                  {/* Card 4: 24h Fast Installation */}
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white border border-[#E4E8ED] shadow-xs hover:border-orange-300 transition-all">
                    <div className="w-7 h-7 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 p-0.5">
                      <img
                        src="/images/icons/liquid-glass/lap-dat.webp"
                        alt="Lắp đặt 24h"
                        width={22}
                        height={22}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="w-[22px] h-[22px] object-contain shrink-0"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#20283D] truncate">Lắp Đặt 24H</h4>
                      <p className="text-[10px] text-[#657384] font-normal truncate">Khảo sát 0đ</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: Lead Form Container (Phong cách Long Châu: Nền Trắng Tinh, Viền Mảnh #E4E8ED) */}
          <div className="lg:col-span-5 w-full mt-2 lg:mt-0">
            <LeadForm
              defaultPackage={defaultPackage}
              headline={formHeadline}
              subheadline="Kiểm tra cổng cáp quang &amp; kích hoạt quà tặng Camera trong 15 phút"
              formLocation="hero-mobile-form"
            />
          </div>
        </div>

        {/* Quick Utility Cards Bar (Phong cách 6 tiện ích của Long Châu: Cần mua thuốc, Tư vấn Dược sĩ, v.v.) */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-[#E4E8ED]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Utility 1 */}
            <div
              onClick={() => openLeadModal("SKY")}
              className="p-3.5 rounded-2xl bg-white hover:bg-[#FFF4ED] border border-[#E4E8ED] hover:border-orange-300 shadow-xs hover:shadow-[0_4px_16px_rgba(243,112,33,0.12)] transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-[#F37021] p-1.5 flex items-center justify-center shrink-0 transition-colors">
                <img
                  src="/images/icons/liquid-glass/wifi-6.webp"
                  alt="Internet"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#20283D] group-hover:text-[#F37021] transition-colors truncate">
                  Internet Wi-Fi 6
                </h4>
                <p className="text-[11px] text-[#657384] truncate">1 Gbps từ 195K/th</p>
              </div>
            </div>

            {/* Utility 2 */}
            <div
              onClick={() => openLeadModal("Combo GIGA")}
              className="p-3.5 rounded-2xl bg-white hover:bg-red-50/50 border border-[#E4E8ED] hover:border-red-300 shadow-xs hover:shadow-[0_4px_16px_rgba(220,38,38,0.12)] transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 group-hover:bg-red-600 p-1.5 flex items-center justify-center shrink-0 transition-colors">
                <img
                  src="/images/icons/liquid-glass/ngoai-hang-anh.webp"
                  alt="EPL"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#20283D] group-hover:text-red-600 transition-colors truncate">
                  Combo Thể Thao
                </h4>
                <p className="text-[11px] text-[#657384] truncate">380 trận EPL 220K</p>
              </div>
            </div>

            {/* Utility 3 */}
            <div
              onClick={() => openLeadModal("Combo GIGA")}
              className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-[#E4E8ED] hover:border-emerald-300 shadow-xs hover:shadow-[0_4px_16px_rgba(16,185,129,0.12)] transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 p-1.5 flex items-center justify-center shrink-0 transition-colors">
                <img
                  src="/images/icons/liquid-glass/camera-ai.webp"
                  alt="Camera AI"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#20283D] group-hover:text-emerald-700 transition-colors truncate">
                  Camera FPT AI 0đ
                </h4>
                <p className="text-[11px] text-[#657384] truncate">An ninh đám mây</p>
              </div>
            </div>

            {/* Utility 4 */}
            <div
              onClick={() => openLeadModal("SKY")}
              className="p-3.5 rounded-2xl bg-white hover:bg-blue-50/50 border border-[#E4E8ED] hover:border-blue-300 shadow-xs hover:shadow-[0_4px_16px_rgba(2,132,199,0.12)] transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 p-1.5 flex items-center justify-center shrink-0 transition-colors">
                <img
                  src="/images/icons/liquid-glass/lap-dat.webp"
                  alt="Lắp đặt 24h"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#20283D] group-hover:text-blue-600 transition-colors truncate">
                  Lắp Đặt 24H
                </h4>
                <p className="text-[11px] text-[#657384] truncate">Khảo sát tận nơi 0đ</p>
              </div>
            </div>

            {/* Utility 5 */}
            <a
              href={siteConfig.contact.hotlineTel}
              className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white hover:bg-[#FFF4ED] border border-[#E4E8ED] hover:border-orange-300 shadow-xs hover:shadow-[0_4px_16px_rgba(243,112,33,0.12)] transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-[#F37021] p-1.5 flex items-center justify-center shrink-0 transition-colors">
                <img
                  src="/images/icons/liquid-glass/hotline.webp"
                  alt="Hotline"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#20283D] group-hover:text-[#F37021] transition-colors truncate">
                  Hotline 24/7
                </h4>
                <p className="text-[11px] text-[#F37021] font-bold truncate">{siteConfig.contact.hotlineDisplay}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
