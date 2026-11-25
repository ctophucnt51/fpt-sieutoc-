import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import SportsEplSection from "@/components/home/SportsEplSection";
import CameraFeatureSection from "@/components/home/CameraFeatureSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";

export const metadata: Metadata = {
  title: "Khuyến Mãi Lắp Mạng FPT • Tặng Modem Wi-Fi 6 & Camera AI 0đ",
  description:
    "Chương trình ưu đãi lắp mạng FPT mới nhất: Trang bị miễn phí Modem Wi-Fi 6, tặng Camera FPT AI an ninh, ưu đãi trả trước tặng tháng cước, xem Ngoại Hạng Anh 220K.",
  alternates: {
    canonical: "/khuyen-mai",
  },
};

export default function KhuyenMaiPage() {
  return (
    <>
      <HeroSection
        badge="Chương Trình Ưu Đãi Hiện Hành • Hỗ Trợ Thiết Bị 0đ"
        headline={
          <>
            Ưu Đãi Lắp Mạng FPT:{" "}
            <span className="text-[#F37021]">Tặng Wi-Fi 6 &amp; Camera AI 0đ</span>
          </>
        }
        subheadline="Đăng ký online để nhận tư vấn gói cước phù hợp, hỗ trợ khảo sát hạ tầng tận nơi và áp dụng ưu đãi tặng thêm tháng cước khi trả trước theo quy định."
        defaultPackage="Combo GIGA"
        formHeadline="ĐĂNG KÝ TƯ VẤN GÓI CƯỚC & THIẾT BỊ"
      />

      {/* Official FPT Telecom Award Banner from FPT.VN */}
      <section className="py-6 sm:py-8 bg-white border-b border-[#E4E8ED]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden border border-[#E4E8ED] shadow-sm">
            <img
              src="/images/banners/fpt-award-banner.jpg"
              alt="FPT Telecom - Thương hiệu được yêu thích nhất"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      <SportsEplSection />

      <CameraFeatureSection />

      <BottomCtaSection
        defaultPackage="Combo GIGA"
        title="Đăng Ký Tư Vấn Gói Cước & Thiết Bị Phù Hợp"
        description="Chính sách trang bị thiết bị và ưu đãi áp dụng theo điều kiện từng gói cước và khu vực. Chuyên viên FPT sẽ liên hệ kiểm tra hạ tầng cho địa chỉ của bạn trong 15 phút."
      />
    </>
  );
}
