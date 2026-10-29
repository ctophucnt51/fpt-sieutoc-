import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import SportsEplSection from "@/components/home/SportsEplSection";
import PricingSection from "@/components/home/PricingSection";
import ProcessSection from "@/components/home/ProcessSection";
import FaqSection from "@/components/home/FaqSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";

export const metadata: Metadata = {
  title: "Combo Internet FPT + Xem Bản Quyền Trọn Vẹn Ngoại Hạng Anh Bản Quyền",
  description:
    "Đăng ký Combo Internet Wi-Fi 6 và Truyền hình FPT Play gói V.VIP thể thao. Xem trực tiếp 380 trận Ngoại Hạng Anh, Cúp Châu Âu mượt mà trên Smart TV không cần Box.",
};

export default function ComboNgoaiHangAnhPage() {
  return (
    <>
      <HeroSection
        badge="Gói Ưu Tiên • Combo Giga Chỉ 220K/Tháng"
        headline={
          <>
            Combo Giga Wi-Fi 6 + <br />
            <span className="text-red-600">
              Xem Trọn Vẹn Ngoại Hạng Anh Chỉ 220K/Tháng
            </span>
          </>
        }
        subheadline="Thưởng thức Bản quyền trọn vẹn các trận cầu rực lửa Ngoại Hạng Anh chuẩn Full HD mượt mà trên Smart TV và thiết bị di động (Không cần đầu thu Box). Ưu đãi sốc Combo Giga chỉ 220.000đ/tháng, đặc biệt tặng kèm Camera FPT AI an ninh thông minh miễn phí."
        defaultPackage="Combo GIGA"
        formHeadline="Đăng Ký Combo Thể Thao Ngoại Hạng Anh"
        campaignContext="combo-ngoai-hang-anh"
      />

      <SportsEplSection />

      <PricingSection
        initialTab="combo"
        title="Bảng Giá Các Gói Combo Ngoại Hạng Anh & FPT Play"
        subtitle="Vừa có Internet Wi-Fi 6 siêu tốc, vừa thỏa sức đam mê bóng đá và giải trí gia đình"
      />

      <ProcessSection />

      <FaqSection />

      <BottomCtaSection
        defaultPackage="Combo GIGA"
        title="Sẵn Sàng Thưởng Thức Ngoại Hạng Anh Cuối Tuần Này"
        description="Đăng ký ngay để kỹ thuật viên triển khai hoàn tất thiết bị và kích hoạt tài khoản xem bóng đá trong 24 giờ."
      />
    </>
  );
}
