import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import Wifi6Explainer from "@/components/home/Wifi6Explainer";
import SportsEplSection from "@/components/home/SportsEplSection";
import ProcessSection from "@/components/home/ProcessSection";
import FaqSection from "@/components/home/FaqSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section: Combo Internet Wi-Fi 6 + Ngoại Hạng Anh 220K là gói cước ưu đãi chính */}
      <HeroSection
        badge="Gói Ưu Đãi Số 1 • Combo Wi-Fi 6 + Bản Quyền Trọn Vẹn Ngoại Hạng Anh 220K/Tháng"
        headline={
          <>
            Combo Internet Wi-Fi 6 +{" "}
            <br className="hidden sm:inline" />
            <span className="text-red-600">Bản Quyền Trọn Vẹn Ngoại Hạng Anh</span>
          </>
        }
        showPriorityCards={true}
        defaultPackage="Combo GIGA"
        formHeadline="Đăng Ký Combo Ngoại Hạng Anh 220K & Nhận Camera 0đ"
      />

      {/* 2. Chi Tiết Trực Tiếp 380 Trận Ngoại Hạng Anh & FPT Play Trên Smart TV */}
      <SportsEplSection />

      {/* 3. Wi-Fi 6 Advantage Explainer */}
      <Wifi6Explainer />

      {/* 4. Package Comparison & Pricing */}
      <PricingSection
        initialTab="all"
        title="Bảng Giá Các Gói Cước Internet & Combo Bán Chạy Nhất"
        subtitle="Giá cước tham khảo minh bạch • Trang bị Modem Wi-Fi 6 miễn phí • Hỗ trợ bảo trì trọn đời"
      />

      {/* 5. Standard 4-Step Installation Process */}
      <ProcessSection />

      {/* 6. Objections & FAQ Accordion */}
      <FaqSection />

      {/* 7. Bottom Lead Form CTA */}
      <BottomCtaSection
        defaultPackage="Combo GIGA"
        title="Đăng Ký Combo Ngoại Hạng Anh • Nhận Modem Wi-Fi 6 & Camera 0đ"
        description="Điền thông tin bên dưới hoặc gọi hotline để chuyên viên FPT kiểm tra hạ tầng và kích hoạt ưu đãi trong 15 phút."
      />
    </>
  );
}
