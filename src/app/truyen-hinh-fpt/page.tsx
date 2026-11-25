import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import ProcessSection from "@/components/home/ProcessSection";
import FaqSection from "@/components/home/FaqSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";
import { Tv, Sparkles, Film } from "lucide-react";

export const metadata: Metadata = {
  title: "Combo Internet + Truyền Hình FPT Play - Gần 200 Kênh & Phim 4K",
  description:
    "Đăng ký Combo Internet Cáp quang và Truyền hình FPT Play. Xem trực tiếp gần 200 kênh truyền hình trong nước & quốc tế, kho phim 4K và Ngoại Hạng Anh trên Smart TV không cần Box.",
  alternates: {
    canonical: "/truyen-hinh-fpt",
  },
};

export default function TruyenHinhFptPage() {
  return (
    <>
      <HeroSection
        badge="Gói Ưu Tiên • Combo Giga Chỉ 220K/Tháng"
        headline={
          <>
            Combo Giga Wi-Fi 6 + <br />
            <span className="text-fpt-orange">
              Truyền Hình FPT Play &amp; Ngoại Hạng Anh
            </span>
          </>
        }
        subheadline="Cài đặt xem trực tiếp qua ứng dụng FPT Play trên Smart TV, Smartphone, Tablet mượt mà không cần đầu thu Box. Xem Bản Quyền Trọn Vẹn Ngoại Hạng Anh & gần 170 kênh truyền hình chỉ 220.000đ/tháng, đặc biệt tặng kèm Camera FPT AI an ninh thông minh miễn phí."
        defaultPackage="Combo GIGA"
        formHeadline="NHẬN TƯ VẤN MIỄN PHÍ"
        campaignContext="truyen-hinh-fpt"
      />

      {/* Feature Highlight Cards - Phong cách Long Châu */}
      <section className="py-8 sm:py-12 bg-[#F4F6FB] border-b border-[#E4E8ED]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E4E8ED] shadow-xs hover:border-orange-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4 p-1">
                <img
                  src="/images/icons/svg/kenh-truyen-hinh.svg"
                  alt="Kênh truyền hình"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <h3 className="font-extrabold text-base text-[#20283D] mb-1">Gần 200 Kênh Truyền Hình</h3>
              <p className="text-xs text-[#657384] leading-relaxed font-normal">Đầy đủ kênh truyền hình quốc gia VTV, HTV, VTC và các kênh quốc tế HBO, Cinemax, Cartoon Network.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E4E8ED] shadow-xs hover:border-orange-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 p-1">
                <img
                  src="/images/icons/svg/smart-tv.svg"
                  alt="Smart TV"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <h3 className="font-extrabold text-base text-[#20283D] mb-1">Xem Trực Tiếp Không Cần Box</h3>
              <p className="text-xs text-[#657384] leading-relaxed font-normal">Cài đặt dễ dàng ứng dụng FPT Play trên Smart TV (Samsung, LG, Sony, Android TV) không cần thêm đầu Box rườm rà.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E4E8ED] shadow-xs hover:border-orange-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-[#20283D] mb-1">Kho Phim 4K Đồ Sộ</h3>
              <p className="text-xs text-[#657384] leading-relaxed font-normal">Hàng ngàn giờ phim bom tấn chiếu rạp, phim bộ Hàn Quốc, Trung Quốc, Âu Mỹ độc quyền cập nhật mỗi ngày.</p>
            </div>
          </div>
        </div>
      </section>

      <PricingSection
        initialTab="combo"
        title="Các Gói Cước Combo Internet + Truyền Hình FPT Play"
        subtitle="Tiết kiệm lên đến 35% chi phí so với việc đăng ký riêng lẻ từng dịch vụ"
      />

      <ProcessSection />

      <FaqSection />

      <BottomCtaSection
        defaultPackage="Combo GIGA"
        title="Nâng Tầm Không Gian Giải Trí Gia Đình Ngay Hôm Nay"
        description="Điền thông tin để được tư vấn gói combo tiết kiệm và hỗ trợ lắp đặt trọn gói trong 24 giờ."
      />
    </>
  );
}
