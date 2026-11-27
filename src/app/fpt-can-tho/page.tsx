import type { Metadata } from "next";
import ProvinceLandingView from "@/components/landing/ProvinceLandingView";

export const metadata: Metadata = {
  title: "FPT Cần Thơ - Lắp Mạng Wi-Fi 6, Combo Ngoại Hạng Anh & Camera AI",
  description:
    "Đăng ký lắp mạng FPT Cần Thơ tốc độ đến 1 Gbps, trang bị Modem Wi-Fi 6. Hỗ trợ khảo sát & lắp đặt nhanh trong 24h tại 103 phường, xã thuộc TP. Cần Thơ mới (Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn, Thốt Nốt, Vị Thanh, Sóc Trăng...).",
  alternates: {
    canonical: "/fpt-can-tho",
  },
};

export default function FptCanThoPage() {
  return (
    <ProvinceLandingView
      provinceName="TP. Cần Thơ (103 phường, xã sau sáp nhập)"
      shortName="Cần Thơ"
      campaignContext="fpt-can-tho"
      districts={[
        "Phường Ninh Kiều",
        "Phường Cái Khế",
        "Phường Tân An",
        "Phường An Bình",
        "Phường Bình Thủy",
        "Phường Cái Răng",
        "Phường Hưng Phú",
        "Phường Ô Môn",
        "Phường Thốt Nốt",
        "Phường Vị Thanh",
        "Phường Ngã Bảy",
        "Phường Sóc Trăng",
        "Phường Vĩnh Châu",
        "Xã Phong Điền",
        "Xã Cờ Đỏ",
        "Xã Thới Lai",
        "Xã Vĩnh Thạnh",
      ]}
    />
  );
}
