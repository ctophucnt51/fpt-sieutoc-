"use client";

import LeadForm from "@/components/forms/LeadForm";
import { useSiteConfig } from "@/context/ConfigContext";
import { Phone, ShieldCheck, ArrowRight } from "lucide-react";

interface BottomCtaSectionProps {
  defaultPackage?: string;
  title?: string;
  description?: string;
}

export default function BottomCtaSection({
  defaultPackage = "SKY",
  title = "Đăng Ký Lắp Mạng FPT Để Nhận Tư Vấn Gói Cước Phù Hợp",
  description = "Chuyên viên kỹ thuật FPT sẽ liên hệ tư vấn vị trí lắp đặt, đo kiểm sóng Wi-Fi và tiến hành khảo sát hạ tầng miễn phí theo khu vực.",
}: BottomCtaSectionProps) {
  const siteConfig = useSiteConfig();
  return (
    <section className="py-8 sm:py-12 lg:py-14 bg-white border-b border-[#E4E8ED] relative overflow-hidden max-w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Headline + Form (Tinh gọn, loại bỏ các khối USP & Banner lặp lại) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Header & Value Highlights */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-4 text-center lg:text-left">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#FFF4ED] text-[#9A3412] border border-orange-200/80 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-2.5 shadow-xs">
                Đăng Ký Siêu Tốc &bull; Khảo Sát 0đ
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight leading-snug">
                {title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#334155] leading-relaxed font-medium">
                {description}
              </p>
            </div>

            {/* Direct Hotline Box (Phong cách Long Châu) */}
            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-[#E4E8ED] flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] border border-orange-100 p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/images/icons/svg/hotline.svg"
                    alt="Hotline"
                    width={24}
                    height={24}
                    loading="lazy"
                    decoding="async"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-[#475569] font-medium">Tổng đài tiếp nhận 24/7:</span>
                  <span className="text-base sm:text-lg font-black text-[#0F172A]">{siteConfig.contact.hotlineDisplay}</span>
                </div>
              </div>
              <a
                href={siteConfig.contact.hotlineTel}
                className="px-4 py-2 rounded-full bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
              >
                Gọi ngay
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs text-[#475569] font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Cam kết bảo mật 100% &amp; không làm phiền nếu chưa có nhu cầu</span>
            </div>
          </div>

          {/* Right Lead Form */}
          <div className="lg:col-span-6 w-full">
            <LeadForm
              defaultPackage={defaultPackage}
              headline="NHẬN TƯ VẤN MIỄN PHÍ"
              subheadline="Kiểm tra hạ tầng & tư vấn gói cước miễn phí"
              formLocation="bottom-cta-form"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
