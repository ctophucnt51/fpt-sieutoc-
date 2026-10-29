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
        formHeadline="Đăng Ký Combo Giga 220K/Tháng"
        campaignContext="truyen-hinh-fpt"
      />

      {/* Feature Highlight Cards - White Glassmorphism */}
      <section className="py-8 sm:py-12 bg-white/70 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-2xs hover:border-orange-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-fpt-orange flex items-center justify-center mb-4 shadow-2xs">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Gần 200 Kênh Truyền Hình</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">Đầy đủ kênh truyền hình quốc gia VTV, HTV, VTC và các kênh quốc tế HBO, Cinemax, Cartoon Network.</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-2xs hover:border-orange-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Xem Trực Tiếp Không Cần Box</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">Cài đặt dễ dàng ứng dụng FPT Play trên Smart TV (Samsung, LG, Sony, Android TV) không cần thêm đầu Box rườm rà.</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-2xs hover:border-orange-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-2xs">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Kho Phim 4K Đồ Sộ</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">Hàng ngàn giờ phim bom tấn chiếu rạp, phim bộ Hàn Quốc, Trung Quốc, Âu Mỹ độc quyền cập nhật mỗi ngày.</p>
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
