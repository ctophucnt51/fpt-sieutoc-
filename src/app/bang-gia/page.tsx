import type { Metadata } from "next";
import Link from "next/link";
import PricingSection from "@/components/home/PricingSection";
import PricingComparisonMatrix from "@/components/pricing/PricingComparisonMatrix";
import Wifi6Explainer from "@/components/home/Wifi6Explainer";
import BottomCtaSection from "@/components/home/BottomCtaSection";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Bảng Giá Cước Internet Wi-Fi 6 & Combo Truyền Hình FPT Mới Nhất",
  description:
    "Tổng hợp bảng giá cước lắp mạng FPT Telecom cập nhật mới nhất: Gói Giga 300Mbps, Sky 1Gbps, Meta đối xứng, Combo Ngoại Hạng Anh 220K/tháng. Đã bao gồm VAT.",
  alternates: {
    canonical: "/bang-gia",
  },
};

export default function BangGiaPage() {
  return (
    <>
      {/* Compact Pricing Page Header (Không lặp lại Hero trang chủ) */}
      <section className="bg-gradient-to-br from-[#F8FAFC] via-white to-[#FFF7F2] py-7 sm:py-10 border-b border-[#E4E8ED]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
            <Link href="/" className="hover:text-[#F37021] transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#0F172A] font-bold">Bảng giá cước FPT</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
                Bảng Giá Cước <span className="text-[#F37021]">Internet Wi-Fi 6 &amp; Combo FPT</span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#475569] leading-relaxed">
                Tổng hợp đầy đủ các gói cước cá nhân, gia đình, game thủ và Combo Ngoại Hạng Anh. Giá niêm yết đã bao gồm 10% VAT, khảo sát hạ tầng tận nơi miễn phí.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href="#bang-gia"
                className="px-3.5 py-2 rounded-full bg-white border border-[#E4E8ED] hover:border-[#F37021] text-xs font-bold text-[#0F172A] shadow-2xs transition-colors whitespace-nowrap"
              >
                Thẻ gói cước
              </a>
              <a
                href="#so-sanh-nhanh"
                className="px-3.5 py-2 rounded-full bg-white border border-[#E4E8ED] hover:border-[#F37021] text-xs font-bold text-[#0F172A] shadow-2xs transition-colors whitespace-nowrap"
              >
                Bảng so sánh
              </a>
              <a
                href="#chinh-sach-uu-dai"
                className="px-3.5 py-2 rounded-full bg-white border border-[#E4E8ED] hover:border-[#F37021] text-xs font-bold text-[#0F172A] shadow-2xs transition-colors whitespace-nowrap"
              >
                Ưu đãi trả trước
              </a>
            </div>
          </div>
        </div>
      </section>

      <PricingSection
        initialTab="all"
        title="Chọn Gói Cước Phù Hợp Nhu Cầu Của Bạn"
        subtitle="Bấm lọc theo danh mục bên dưới để xem chi tiết tốc độ và thiết bị trang bị"
      />

      <PricingComparisonMatrix />

      <Wifi6Explainer />

      <BottomCtaSection
        defaultPackage="SKY"
        title="Chưa Biết Chọn Gói Cước Nào Phù Hợp?"
        description="Để lại thông tin hoặc gọi Hotline để chuyên viên FPT tư vấn gói cước tối ưu chi phí theo số lượng thiết bị và diện tích nhà bạn."
      />
    </>
  );
}
