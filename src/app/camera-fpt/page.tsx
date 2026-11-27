import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import CameraCatalogSection from "@/components/camera/CameraCatalogSection";
import CameraFeatureSection from "@/components/home/CameraFeatureSection";
import ProcessSection from "@/components/home/ProcessSection";
import FaqSection from "@/components/home/FaqSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";

export const metadata: Metadata = {
  title: "FPT Camera AI Thông Minh - Lưu Trữ Cloud Việt Nam & Báo Giá Lắp Đặt",
  description:
    "Giải pháp FPT Camera AI an ninh chính hãng: Bullet 5, Dome 5i, Play 4, Bullet 5i, Dome IQ 4W, SE 3S. Cảnh báo người bằng AI, kháng nước IP67, lưu trữ Cloud đặt tại Việt Nam từ 22.000đ/tháng.",
  alternates: {
    canonical: "/camera-fpt",
  },
};

export default function CameraFptPage() {
  return (
    <>
      <HeroSection
        badge="FPT Camera AI Chính Hãng • Lưu Trữ Cloud Việt Nam"
        headline={
          <>
            Lắp Đặt <span className="text-fpt-orange">FPT Camera AI</span> <br />
            Giám Sát An Ninh Thông Minh 24/7
          </>
        }
        subheadline="Đầy đủ các dòng Camera AI trong nhà và ngoài trời (Bullet 5, Dome 5i, Play 4, SE 3S) chuẩn kháng nước IP67, phát hiện người chính xác bằng AI và lưu trữ đám mây an toàn tại Data Center Việt Nam."
        defaultPackage="Camera FPT AI"
        formHeadline="NHẬN BÁO GIÁ CAMERA FPT"
        campaignContext="camera-fpt"
      />

      <CameraCatalogSection />

      <CameraFeatureSection />

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
