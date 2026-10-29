import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import Wifi6Explainer from "@/components/home/Wifi6Explainer";
import PricingSection from "@/components/home/PricingSection";
import ProcessSection from "@/components/home/ProcessSection";
import FaqSection from "@/components/home/FaqSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";

export const metadata: Metadata = {
  title: "Internet FPT Wi-Fi 6 Chuẩn Mới 802.11ax - Siêu Tốc & Độ Trễ Thấp",
  description:
    "Trải nghiệm công nghệ Internet Wi-Fi 6 đột phá từ FPT. Tốc độ gấp 3 lần, giảm 75% độ trễ, kết nối 30+ thiết bị mượt mà cùng lúc. Trang bị miễn phí modem chuẩn Wi-Fi 6.",
};

export default function Wifi6Page() {
  return (
    <>
      <HeroSection
        badge="Wi-Fi 6 Đột Phá • Gói Sky 1 Gbps Chỉ 195K/Tháng"
        headline={
          <>
            Nâng Cấp Ngay Lên <br />
            <span className="text-fpt-orange">Internet FPT Wi-Fi 6</span>{" "}
            <span className="text-fpt-orange">Gói Sky 195K</span>
          </>
        }
        subheadline="Độ trễ siêu thấp dưới 10ms, tốc độ 1 Gbps cực khủng, phủ sóng xuyên tường cực mạnh cho nhà nhiều tầng. Gói Sky 1 Gbps giá ưu đãi chỉ 195.000đ/tháng, đặc biệt tặng kèm Camera FPT AI an ninh thông minh miễn phí."
        defaultPackage="SKY"
        formHeadline="Đăng Ký Wi-Fi 6 Gói Sky 195K"
        campaignContext="wifi-6"
      />

      <Wifi6Explainer />

      <PricingSection
        initialTab="internet"
        title="Các Gói Cước Trang Bị Modem Wi-Fi 6 Tiêu Chuẩn"
        subtitle="Modem AX1800/AX3000 hỗ trợ công nghệ Mesh phủ sóng toàn bộ ngôi nhà"
      />

      <ProcessSection />

      <FaqSection />

      <BottomCtaSection
        defaultPackage="SKY"
        title="Trải Nghiệm Đỉnh Cao Tốc Độ Với Wi-Fi 6 Gói Sky 195K"
        description="Điền thông tin nhận ngay tư vấn chuyên sâu về vùng phủ sóng và giải pháp Mesh Wi-Fi tối ưu."
      />
    </>
  );
}
