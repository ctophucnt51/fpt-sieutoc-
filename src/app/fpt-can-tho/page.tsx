import type { Metadata } from "next";
import ProvinceLandingView from "@/components/landing/ProvinceLandingView";

export const metadata: Metadata = {
  title: "FPT Cần Thơ - Lắp Mạng Wi-Fi 6, Combo Ngoại Hạng Anh & Camera AI",
  description:
    "Đăng ký lắp mạng FPT Cần Thơ tốc độ đến 1 Gbps, trang bị Modem Wi-Fi 6. Hỗ trợ khảo sát & lắp đặt nhanh trong 24h tại Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn, Thốt Nốt, Phong Điền, Cờ Đỏ, Thới Lai, Vĩnh Thạnh.",
  alternates: {
    canonical: "/fpt-can-tho",
  },
};

export default function FptCanThoPage() {
  return (
    <ProvinceLandingView
      provinceName="TP. Cần Thơ"
      shortName="Cần Thơ"
      campaignContext="fpt-can-tho"
      districts={[
        "Quận Ninh Kiều",
        "Quận Cái Răng",
        "Quận Bình Thủy",
        "Quận Ô Môn",
        "Quận Thốt Nốt",
        "Huyện Phong Điền",
        "Huyện Cờ Đỏ",
        "Huyện Thới Lai",
        "Huyện Vĩnh Thạnh",
      ]}
    />
  );
}
