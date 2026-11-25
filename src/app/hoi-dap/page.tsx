import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FaqSection from "@/components/home/FaqSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";

export const metadata: Metadata = {
  title: "Câu Hỏi Thường Gặp & Hỗ Trợ Lắp Mạng FPT Telecom",
  description:
    "Giải đáp toàn bộ thắc mắc về lắp đặt mạng FPT: Thủ tục nhà thuê, thời gian triển khai, chính sách bảo hành Modem Wi-Fi 6, xem Ngoại Hạng Anh trên Smart TV.",
};

export default function HoiDapPage() {
  return (
    <>
      <HeroSection
        badge="Trung Tâm Hỗ Trợ • Giải Đáp Nhanh 24/7"
        headline={
          <>
            Câu Hỏi Thường Gặp <span className="text-[#F37021]">Dịch Vụ FPT</span>
          </>
        }
        subheadline="Tổng hợp chi tiết các câu hỏi về thủ tục đăng ký, gói cước, thiết bị Wi-Fi 6, Camera AI và chính sách bảo trì kỹ thuật."
        defaultPackage="SKY"
        formHeadline="GỬI CÂU HỎI CHO CHUYÊN VIÊN FPT"
      />

      <FaqSection />

      <BottomCtaSection
        defaultPackage="SKY"
        title="Bạn Cần Tư Vấn Riêng Cho Trường Hợp Của Mình?"
        description="Gọi trực tiếp Hotline hoặc để lại số điện thoại để được chuyên viên hỗ trợ giải đáp ngay lập tức."
      />
    </>
  );
}
