import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import Wifi6Explainer from "@/components/home/Wifi6Explainer";
import BottomCtaSection from "@/components/home/BottomCtaSection";

export const metadata: Metadata = {
  title: "Bảng Giá Cước Internet Wi-Fi 6 & Combo Truyền Hình FPT Mới Nhất",
  description:
    "Tổng hợp bảng giá cước lắp mạng FPT Telecom cập nhật mới nhất: Gói Giga 300Mbps, Sky 1Gbps, Meta đối xứng, Combo Ngoại Hạng Anh 220K/tháng. Đã bao gồm VAT.",
};

export default function BangGiaPage() {
  return (
    <>
      <HeroSection
        badge="Bảng Giá Niêm Yết • Đã Bao Gồm 10% VAT • Khảo Sát 0đ"
        headline={
          <>
            Bảng Giá Cước <span className="text-[#F37021]">Internet &amp; Combo FPT</span> Mới Nhất
          </>
        }
        subheadline="So sánh đầy đủ các gói cước Internet cáp quang Wi-Fi 6 và Combo truyền hình Ngoại Hạng Anh. Trang bị Modem Wi-Fi 6 miễn phí, hỗ trợ kỹ thuật 24/7."
        defaultPackage="SKY"
        formHeadline="NHẬN BÁO GIÁ CHI TIẾT THEO KHU VỰC"
      />

      <PricingSection
        initialTab="all"
        title="So Sánh Chi Tiết Tất Cả Gói Cước FPT Telecom"
        subtitle="Lựa chọn gói cước phù hợp nhất cho nhu cầu gia đình, game thủ và cửa hàng kinh doanh"
      />

      <Wifi6Explainer />

      <BottomCtaSection
        defaultPackage="SKY"
        title="Chưa Biết Chọn Gói Cước Nào Phù Hợp?"
        description="Để lại thông tin hoặc gọi Hotline để chuyên viên FPT tư vấn gói cước tối ưu chi phí theo số lượng thiết bị và diện tích nhà bạn."
      />
    </>
  );
}
