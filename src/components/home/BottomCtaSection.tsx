"use client";

import LeadForm from "@/components/forms/LeadForm";
import { useSiteConfig } from "@/context/ConfigContext";
import { Phone, ShieldCheck, MapPin, ArrowRight } from "lucide-react";

interface BottomCtaSectionProps {
  defaultPackage?: string;
  title?: string;
  description?: string;
}

export default function BottomCtaSection({
  defaultPackage = "SKY",
  title = "Đăng Ký Lắp Mạng FPT Ngay Hôm Nay Để Nhận Ưu Đãi Tốt Nhất",
  description = "Chuyên viên kỹ thuật FPT sẽ liên hệ tư vấn vị trí lắp đặt, đo kiểm sóng Wi-Fi và tiến hành khảo sát hạ tầng hoàn toàn miễn phí.",
}: BottomCtaSectionProps) {
  const siteConfig = useSiteConfig();
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-[#E4E8ED] relative overflow-hidden max-w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Cột USP Phong cách Long Châu (Thuốc chính hãng / Đổi trả / Chất lượng / Dược sĩ) */}
        <div className="mb-10 sm:mb-12 p-6 rounded-2xl bg-[#F4F6FB] border border-[#E4E8ED]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E4E8ED] p-1 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/images/icons/liquid-glass/modem.webp"
                  alt="Modem Wi-Fi 6"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#20283D]">Modem Wi-Fi 6 0đ</h4>
                <p className="text-xs text-[#657384]">Trang bị chuẩn AX3000</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E4E8ED] p-1 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/images/icons/liquid-glass/camera-ai.webp"
                  alt="Camera AI"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#20283D]">Tặng Camera AI</h4>
                <p className="text-xs text-[#657384]">An ninh thông minh 0đ</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E4E8ED] p-1 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/images/icons/liquid-glass/lap-dat.webp"
                  alt="Lắp đặt 24h"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#20283D]">Lắp Đặt Trong 24H</h4>
                <p className="text-xs text-[#657384]">Khảo sát tận nơi 0đ</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E4E8ED] p-1 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/images/icons/liquid-glass/bao-tri.webp"
                  alt="Bảo trì"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#20283D]">Bảo Trì Trọn Đời</h4>
                <p className="text-xs text-[#657384]">Hỗ trợ kỹ thuật 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thanh Băng Ngang Store Locator Banner (Phong cách Long Châu: Hệ thống 2775 nhà thuốc) */}
        <div className="mb-10 sm:mb-12 p-4 sm:p-5 rounded-2xl bg-[#F37021] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_20px_rgba(243,112,33,0.25)]">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Hệ Thống Hạ Tầng FPT Telecom Phủ Khắp 63 Tỉnh Thành
              </h3>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                Sẵn sàng khảo sát &amp; kéo cáp quang siêu tốc đến từng thôn, xóm, phường, xã trên toàn quốc.
              </p>
            </div>
          </div>

          <a
            href={siteConfig.contact.hotlineTel}
            className="px-5 py-2.5 rounded-full bg-white text-[#F37021] font-extrabold text-xs sm:text-sm hover:bg-orange-50 transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Phone className="w-4 h-4 text-[#F37021] fill-current" />
            <span>Gọi {siteConfig.contact.hotlineDisplay}</span>
          </a>
        </div>

        {/* Main Grid: Headline + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 xl:gap-12 items-center">
          
          {/* Header & Value Highlights */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-4 text-center lg:text-left">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#FFF4ED] text-[#F37021] border border-orange-200/80 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-2.5 shadow-xs">
                Đăng Ký Siêu Tốc &bull; Khảo Sát 0đ
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#20283D] tracking-tight leading-snug">
                {title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#657384] leading-relaxed font-normal">
                {description}
              </p>
            </div>

            {/* Direct Hotline Box (Phong cách Long Châu) */}
            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-[#E4E8ED] flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] border border-orange-100 p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/images/icons/liquid-glass/hotline.webp"
                    alt="Hotline"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-[#657384] font-medium">Tổng đài tiếp nhận 24/7:</span>
                  <span className="text-base sm:text-lg font-black text-[#20283D]">{siteConfig.contact.hotlineDisplay}</span>
                </div>
              </div>
              <a
                href={siteConfig.contact.hotlineTel}
                className="px-4 py-2 rounded-full bg-[#F37021] hover:bg-[#E05D10] text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
              >
                Gọi ngay
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs text-[#657384] font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cam kết bảo mật 100% &amp; không làm phiền nếu chưa có nhu cầu</span>
            </div>
          </div>

          {/* Right Lead Form */}
          <div className="lg:col-span-6 w-full">
            <LeadForm
              defaultPackage={defaultPackage}
              headline="Đăng Ký Khảo Sát &amp; Nhận Báo Giá Miễn Phí"
              subheadline="Chuyên viên kỹ thuật sẽ kiểm tra hạ tầng và liên hệ lại sau 5 - 15 phút"
              formLocation="bottom-cta-form"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
