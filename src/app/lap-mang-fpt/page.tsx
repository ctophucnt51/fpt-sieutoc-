import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import Wifi6Explainer from "@/components/home/Wifi6Explainer";
import ProcessSection from "@/components/home/ProcessSection";
import FaqSection from "@/components/home/FaqSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";

export const metadata: Metadata = {
  title: "Lắp Mạng Internet FPT Cáp Quang Wi-Fi 6 - Miễn Phí Lắp Đặt 24H",
  description:
    "Đăng ký Internet cáp quang FPT Wi-Fi 6 tốc độ từ 300 Mbps đến 1 Gbps. Trang bị modem Wi-Fi 6 hai băng tần miễn phí. Khảo sát và ký hợp đồng tận nhà trong 24 giờ.",
};

export default function LapMangFptPage() {
  return (
    <>
      <HeroSection
        badge="Gói Bán Chạy Nhất • Gói Sky 1 Gbps Chỉ 195K/Tháng"
        headline={
          <>
            Lắp Mạng FPT Wi-Fi 6 <br />
            <span className="text-fpt-orange">Gói Sky 1 Gbps</span>{" "}
            <span>Siêu Tốc Chỉ 195K/Tháng</span>
          </>
        }
        subheadline="Hạ tầng 100% cáp quang GPON siêu ổn định. Trang bị Modem Wi-Fi 6 băng tần kép AX3000 miễn phí. Ưu đãi sốc gói Sky 1 Gbps chỉ 195.000đ/tháng, đặc biệt tặng kèm Camera FPT AI an ninh thông minh miễn phí."
        defaultPackage="SKY"
        formHeadline="Đăng Ký Khảo Sát Internet Gói Sky 195K"
        campaignContext="lap-mang-fpt"
      />

      <PricingSection
        initialTab="internet"
        title="Bảng Giá Các Gói Cước Internet Cáp Quang FPT"
        subtitle="Phù hợp cho cá nhân, hộ gia đình, kinh doanh online và sinh viên"
      />

      <Wifi6Explainer />

      <ProcessSection />

      <FaqSection />

      <BottomCtaSection
        defaultPackage="SKY"
        title="Nhận Báo Giá Gói Cước Internet Cáp Quang Ưu Đãi"
        description="Đăng ký ngay hôm nay để nhận trọn bộ ưu đãi modem Wi-Fi 6 và Camera FPT AI an ninh tặng kèm miễn phí."
      />
    </>
  );
}
