import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import Wifi6Explainer from "@/components/home/Wifi6Explainer";
import SportsEplSection from "@/components/home/SportsEplSection";
import ProcessSection from "@/components/home/ProcessSection";
import FaqSection from "@/components/home/FaqSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";
import RevealSection from "@/components/ui/RevealSection";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section: Khớp 100% nhóm từ khóa Lắp Mạng FPT, Wi-Fi 6, Combo & 3 tỉnh Cần Thơ - Sóc Trăng - Hậu Giang */}
      <HeroSection
        badge="Đại lý tiếp nhận đăng ký Lắp Mạng FPT"
        headline={
          <>
            Lắp Mạng FPT Wi-Fi 6 &amp;{" "}
            <br className="hidden sm:inline" />
            <span className="text-[#F37021]">Combo Internet Ngoại Hạng Anh</span>
          </>
        }
        showPriorityCards={true}
        defaultPackage="Combo GIGA"
        formHeadline="NHẬN TƯ VẤN MIỄN PHÍ"
      />

      {/* 2. Bảng Giá & So Sánh Gói Cước (Đưa lên ngay sau Hero để giữ chân người xem tìm gói cước) */}
      <RevealSection>
        <PricingSection
          initialTab="all"
          title="Bảng Giá Gói Cước Lắp Mạng FPT & Combo Phổ Biến"
          subtitle="Giá cước tham khảo đã gồm 10% VAT • Trang bị Modem Wi-Fi 6 theo gói • Khảo sát lắp đặt 24h"
        />
      </RevealSection>

      {/* 3. Wi-Fi 6 Advantage Explainer */}
      <RevealSection>
        <Wifi6Explainer />
      </RevealSection>

      {/* 4. Chi Tiết Trực Tiếp 380 Trận Ngoại Hạng Anh & FPT Play Trên Smart TV */}
      <RevealSection>
        <SportsEplSection />
      </RevealSection>

      {/* 5. Standard 4-Step Installation Process */}
      <RevealSection>
        <ProcessSection />
      </RevealSection>

      {/* 6. Objections & FAQ Accordion */}
      <RevealSection>
        <FaqSection />
      </RevealSection>

      {/* 7. Bottom Lead Form CTA */}
      <RevealSection>
        <BottomCtaSection
          defaultPackage="Combo GIGA"
          title="Đăng Ký Combo Ngoại Hạng Anh • Nhận Modem Wi-Fi 6 & Camera 0đ"
          description="Điền thông tin bên dưới hoặc gọi hotline để chuyên viên FPT kiểm tra hạ tầng và kích hoạt ưu đãi trong 15 phút."
        />
      </RevealSection>
    </>
  );
}
