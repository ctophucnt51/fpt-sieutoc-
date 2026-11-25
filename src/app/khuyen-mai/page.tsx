import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import SportsEplSection from "@/components/home/SportsEplSection";
import CameraFeatureSection from "@/components/home/CameraFeatureSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";

export const metadata: Metadata = {
  title: "Khuyến Mãi Lắp Mạng FPT • Tặng Modem Wi-Fi 6 & Camera AI 0đ",
  description:
    "Chương trình ưu đãi lắp mạng FPT mới nhất: Trang bị miễn phí Modem Wi-Fi 6, tặng Camera FPT AI an ninh, ưu đãi trả trước tặng tháng cước, xem Ngoại Hạng Anh 220K.",
};

export default function KhuyenMaiPage() {
  return (
    <>
      <HeroSection
        badge="Ưu Đãi Độc Quyền Tháng Này • Tặng Thiết Bị 0đ"
        headline={
          <>
            Ưu Đãi Lắp Mạng FPT:{" "}
            <span className="text-[#F37021]">Tặng Wi-Fi 6 &amp; Camera AI 0đ</span>
          </>
        }
        subheadline="Đăng ký online hôm nay để nhận trọn bộ quà tặng thiết bị chính hãng, miễn phí khảo sát hạ tầng tận nơi và ưu đãi tặng thêm tháng cước khi trả trước."
        defaultPackage="Combo GIGA"
        formHeadline="GIỮ SUẤT ƯU ĐÃI TẶNG THIẾT BỊ 0Đ"
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
        title="Đăng Ký Ngay Để Không Bỏ Lỡ Ưu Đãi Tháng Này"
        description="Số lượng thiết bị tặng kèm có hạn theo từng khu vực. Chuyên viên FPT sẽ liên hệ xác nhận suất ưu đãi cho địa chỉ của bạn trong 15 phút."
      />
    </>
  );
}
