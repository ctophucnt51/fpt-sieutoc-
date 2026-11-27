import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import CameraCatalogSection from "@/components/camera/CameraCatalogSection";
import CameraFeatureSection from "@/components/home/CameraFeatureSection";
import ProcessSection from "@/components/home/ProcessSection";
import FaqSection from "@/components/home/FaqSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";

export const metadata: Metadata = {
  title: "FPT Camera AI Thông Minh - IQ4S, Play 4 & Cloud Lưu Trữ 35K/Tháng",
  description:
    "Giải pháp FPT Camera AI chính hãng: IQ 4S, Play 4, Bullet 5, Dome 5i, Bullet 5i, Dome IQ 4W. Gói lưu trữ Cloud 7 ngày chỉ từ 35K/tháng (1 thiết bị) và 50K/tháng (từ 2 thiết bị). Ưu đãi tặng 1 Camera miễn phí lưu trữ khi lắp Internet FPT.",
  alternates: {
    canonical: "/camera-fpt",
  },
};

export default function CameraFptPage() {
  return (
    <>
      <HeroSection
        badge="FPT Camera AI • Tặng 1 Camera Khi Lắp Internet FPT"
        headline={
          <>
            Lắp Đặt <span className="text-fpt-orange">FPT Camera AI</span> <br />
            Giám Sát An Ninh Thông Minh 24/7
          </>
        }
        subheadline="Nổi bật với bộ đôi Camera IQ 4S ngoài trời & Play 4 trong nhà. Gói lưu trữ Cloud 7 ngày chỉ 35.000đ/tháng (1 thiết bị) hoặc 50.000đ/tháng (từ 2 thiết bị). Đặc biệt ưu đãi tặng 1 Camera (miễn phí lưu trữ) khi đăng ký lắp Internet FPT."
        defaultPackage="Camera FPT AI"
        formHeadline="NHẬN BÁO GIÁ CAMERA FPT"
        campaignContext="camera-fpt"
      />

      <CameraFeatureSection />

      <CameraCatalogSection />

      <ProcessSection />

      <FaqSection />

      <BottomCtaSection
        defaultPackage="Camera FPT AI"
        title="Tư Vấn Giải Pháp FPT Camera AI Phù Hợp Cho Gia Đình & Cửa Hàng"
        description="Để lại số điện thoại để kỹ thuật viên FPT khảo sát góc lắp đặt, tư vấn số lượng mắt camera và gói lưu trữ Cloud tiết kiệm nhất."
      />
    </>
  );
}
