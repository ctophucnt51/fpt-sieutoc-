import type { Metadata } from "next";
import ProvinceLandingView from "@/components/landing/ProvinceLandingView";

export const metadata: Metadata = {
  title: "FPT Hậu Giang - Lắp Mạng Wi-Fi 6, Combo Ngoại Hạng Anh & Camera AI",
  description:
    "Đăng ký lắp mạng FPT Hậu Giang tốc độ đến 1 Gbps, trang bị Modem Wi-Fi 6. Hỗ trợ khảo sát & lắp đặt nhanh trong 24h tại Vị Thanh, Ngã Bảy, Long Mỹ, Châu Thành, Châu Thành A, Phụng Hiệp.",
  alternates: {
    canonical: "/fpt-hau-giang",
  },
};

export default function FptHauGiangPage() {
  return (
    <ProvinceLandingView
      provinceName="Tỉnh Hậu Giang"
      shortName="Hậu Giang"
      campaignContext="fpt-hau-giang"
      districts={[
        "TP. Vị Thanh",
        "TP. Ngã Bảy",
        "TX. Long Mỹ",
        "Huyện Châu Thành",
        "Huyện Châu Thành A",
        "Huyện Phụng Hiệp",
        "Huyện Vị Thủy",
        "Huyện Long Mỹ",
      ]}
    />
  );
}
