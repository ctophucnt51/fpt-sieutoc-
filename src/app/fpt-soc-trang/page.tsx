import type { Metadata } from "next";
import ProvinceLandingView from "@/components/landing/ProvinceLandingView";

export const metadata: Metadata = {
  title: "FPT Sóc Trăng - Lắp Mạng Wi-Fi 6, Combo Ngoại Hạng Anh & Camera AI",
  description:
    "Đăng ký lắp mạng FPT khu vực Sóc Trăng (TP. Cần Thơ) tốc độ đến 1 Gbps, trang bị Modem Wi-Fi 6. Hỗ trợ khảo sát & lắp đặt nhanh trong 24h tại Phường Sóc Trăng, Phú Lợi, Mỹ Xuyên, Vĩnh Châu, Ngã Năm và các xã lân cận.",
  alternates: {
    canonical: "/fpt-soc-trang",
  },
};

export default function FptSocTrangPage() {
  return (
    <ProvinceLandingView
      provinceName="khu vực Sóc Trăng (TP. Cần Thơ)"
      shortName="Sóc Trăng"
      campaignContext="fpt-soc-trang"
      districts={[
        "Phường Sóc Trăng",
        "Phường Phú Lợi",
        "Phường Mỹ Xuyên",
        "Phường Vĩnh Châu",
        "Phường Khánh Hòa",
        "Phường Ngã Năm",
        "Xã Kế Sách",
        "Xã Châu Thành",
        "Xã Long Phú",
        "Xã Trần Đề",
        "Xã Thạnh Trị",
      ]}
    />
  );
}
