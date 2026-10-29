"use client";

import LeadForm from "@/components/forms/LeadForm";
import { useSiteConfig } from "@/context/ConfigContext";
import { PhoneCall, ShieldCheck, Wifi, Camera, Clock, CheckCircle2 } from "lucide-react";

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
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-slate-50/70 via-orange-50/20 to-slate-50/50 border-b border-slate-200/60 relative overflow-hidden max-w-full">
      {/* Decorative ambient glass blur */}
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-orange-400/8 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 xl:gap-12 items-center">
          
          {/* Header & Value Highlights */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-5 text-center lg:text-left">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-fpt-orange border border-orange-200/80 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-2 shadow-2xs backdrop-blur-md">
                Đăng Ký Siêu Tốc &bull; Khảo Sát 0đ
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                {title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-normal">
                {description}
              </p>
            </div>

            {/* Value checklist for Desktop & Tablet - White Glass Cards */}
            <div className="hidden sm:grid grid-cols-2 gap-2.5 sm:gap-3 text-left">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-2xs">
                <Wifi className="w-4 h-4 text-fpt-orange shrink-0" />
                <span className="text-xs text-slate-800 font-semibold">Trang bị Modem Wi-Fi 6 0đ</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-2xs">
                <Camera className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs text-slate-800 font-semibold">Tặng kèm Camera AI an ninh</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-2xs">
                <Clock className="w-4 h-4 text-fpt-orange shrink-0" />
                <span className="text-xs text-slate-800 font-semibold">Khảo sát &amp; Lắp đặt trong 24h</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs text-slate-800 font-semibold">Bảo trì kỹ thuật trọn đời</span>
              </div>
            </div>

            {/* Direct Hotline Box (Desktop & Tablet) - White Glass Card */}
            <div className="hidden sm:flex p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-orange-200/80 shadow-2xs items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-fpt-orange flex items-center justify-center shrink-0 shadow-2xs">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Tổng đài tư vấn 24/7:</span>
                  <span className="text-base sm:text-lg font-black text-slate-900">{siteConfig.contact.hotlineDisplay}</span>
                </div>
              </div>
              <a
                href={siteConfig.contact.hotlineTel}
                className="px-4 py-2 rounded-xl bg-fpt-orange hover:bg-fpt-hover text-white text-xs font-bold shadow-[0_2px_10px_rgba(243,112,33,0.3)] transition-all shrink-0 cursor-pointer active:scale-95"
              >
                Gọi ngay
              </a>
            </div>

            <div className="hidden sm:flex items-center justify-center lg:justify-start gap-1.5 text-xs text-slate-500 font-medium">
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
