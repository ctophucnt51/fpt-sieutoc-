import Link from "next/link";
import { ChevronRight } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import Wifi6Explainer from "@/components/home/Wifi6Explainer";
import SportsEplSection from "@/components/home/SportsEplSection";
import ProcessSection from "@/components/home/ProcessSection";
import FaqSection from "@/components/home/FaqSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";

interface ProvinceLandingViewProps {
  provinceName: string;
  shortName: string;
  campaignContext: string;
  districts: string[];
}

export default function ProvinceLandingView({
  provinceName,
  shortName,
  campaignContext,
  districts,
}: ProvinceLandingViewProps) {
  return (
    <>
      {/* Subtle Breadcrumb for SEO & clean return-to-home navigation */}
      <nav
        aria-label="Breadcrumb"
        className="bg-[#F8FAFC] border-b border-slate-200/70 py-2"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 text-[11.5px] text-slate-500">
          <Link href="/" className="hover:text-[#F37021] font-medium transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-semibold">FPT {shortName}</span>
        </div>
      </nav>

      <HeroSection
        badge={`FPT ${shortName} • Hỗ Trợ Khảo Sát & Lắp Đặt 24h`}
        headline={
          <>
            Lắp Mạng <span className="text-[#F37021]">FPT {shortName}</span>{" "}
            <br className="hidden sm:inline" />
            Wi-Fi 6 Siêu Tốc &amp; Combo Ngoại Hạng Anh
          </>
        }
        subheadline={`Tổng đài tiếp nhận đăng ký lắp mạng Internet FPT tại ${provinceName}: tốc độ đến 1 Gbps, trang bị Modem Wi-Fi 6 chuẩn mới, cước từ 180.000đ/tháng (đã gồm VAT), ưu đãi tặng Camera AI khi đăng ký gói Combo phù hợp.`}
        showPriorityCards={true}
        defaultPackage="Combo GIGA"
        formHeadline={`ĐĂNG KÝ FPT ${shortName.toUpperCase()}`}
        campaignContext={campaignContext}
      />

      <section className="py-5 bg-white border-b border-[#E4E8ED]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-slate-900 shrink-0">
              Khu vực hạ tầng FPT {shortName} hỗ trợ lắp đặt nhanh:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {districts.map((area) => (
                <span
                  key={area}
                  className="px-2.5 py-1 rounded-full bg-[#F4F6FB] border border-slate-200 text-[11px] font-semibold text-slate-700"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PricingSection
        initialTab="all"
        title={`Bảng Giá Lắp Mạng FPT ${shortName} & Combo Phổ Biến`}
        subtitle={`Giá cước tham khảo áp dụng tại ${provinceName} (đã gồm 10% VAT) • Khảo sát lắp đặt trong 24h`}
      />

      <Wifi6Explainer />

      <SportsEplSection />

      <ProcessSection />

      <FaqSection />

      <BottomCtaSection
        defaultPackage="Combo GIGA"
        title={`Đăng Ký Lắp Mạng FPT ${shortName} Nhanh Trong 24h`}
        description={`Để lại số điện thoại để nhân viên FPT ${shortName} kiểm tra hạ tầng tận nơi và tư vấn gói cước phù hợp nhất.`}
      />
    </>
  );
}
