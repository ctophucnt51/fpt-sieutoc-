import type { Metadata } from "next";
import ProvinceLandingView from "@/components/landing/ProvinceLandingView";

export const metadata: Metadata = {
  title: "FPT Hậu Giang - Lắp Mạng Wi-Fi 6, Combo Ngoại Hạng Anh & Camera AI",
  description:
    "Đăng ký lắp mạng FPT khu vực Hậu Giang (TP. Cần Thơ) tốc độ đến 1 Gbps, trang bị Modem Wi-Fi 6. Hỗ trợ khảo sát & lắp đặt nhanh trong 24h tại Phường Vị Thanh, Vị Tân, Ngã Bảy, Long Mỹ và các xã lân cận.",
  alternates: {
    canonical: "/fpt-hau-giang",
  },
};

export default function FptHauGiangPage() {
  return (
    <ProvinceLandingView
      provinceName="khu vực Hậu Giang (TP. Cần Thơ)"
      shortName="Hậu Giang"
      campaignContext="fpt-hau-giang"
      districts={[
        "Phường Vị Thanh",
        "Phường Vị Tân",
        "Phường Ngã Bảy",
        "Phường Đại Thành",
        "Phường Long Mỹ",
        "Xã Châu Thành",
        "Xã Châu Thành A",
        "Xã Phụng Hiệp",
        "Xã Vị Thủy",
      ]}
    />
  );
}
