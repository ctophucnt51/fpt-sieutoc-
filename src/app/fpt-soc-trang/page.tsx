import type { Metadata } from "next";
import ProvinceLandingView from "@/components/landing/ProvinceLandingView";

export const metadata: Metadata = {
  title: "FPT Sóc Trăng - Lắp Mạng Wi-Fi 6, Combo Ngoại Hạng Anh & Camera AI",
  description:
    "Đăng ký lắp mạng FPT Sóc Trăng tốc độ đến 1 Gbps, trang bị Modem Wi-Fi 6. Hỗ trợ khảo sát & lắp đặt nhanh trong 24h tại TP. Sóc Trăng, Vĩnh Châu, Ngã Năm, Mỹ Xuyên, Kế Sách, Châu Thành.",
  alternates: {
    canonical: "/fpt-soc-trang",
  },
};

export default function FptSocTrangPage() {
  return (
    <ProvinceLandingView
      provinceName="Tỉnh Sóc Trăng"
      shortName="Sóc Trăng"
      campaignContext="fpt-soc-trang"
      districts={[
        "TP. Sóc Trăng",
        "TX. Vĩnh Châu",
        "TX. Ngã Năm",
        "Huyện Mỹ Xuyên",
        "Huyện Kế Sách",
        "Huyện Châu Thành",
        "Huyện Long Phú",
        "Huyện Trần Đề",
        "Huyện Thạnh Trị",
      ]}
    />
  );
}
