import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ProcessSection from "@/components/home/ProcessSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";
import { CheckCircle2, FileCheck2, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Quy Trình & Thủ Tục Lắp Đặt Mạng FPT Siêu Tốc Trong 24H",
  description:
    "Hướng dẫn quy trình 4 bước đăng ký lắp đặt Internet FPT đơn giản: Chỉ cần CCCD, ký hợp đồng điện tử bảo mật, kỹ thuật viên kéo cáp bàn giao trong 24 giờ.",
  alternates: {
    canonical: "/quy-trinh-lap-dat",
  },
};

export default function QuyTrinhLapDatPage() {
  return (
    <>
      <HeroSection
        badge="Thủ Tục Đơn Giản • Chỉ Cần CCCD • Lắp Đặt Trong 24H"
        headline={
          <>
            Quy Trình Lắp Đặt <span className="text-[#F37021]">FPT Siêu Tốc 24H</span>
          </>
        }
        subheadline="Không cần hộ khẩu, không đặt cọc phức tạp. Đăng ký online chỉ trong 30 giây, kỹ thuật viên có mặt khảo sát và thi công ngay trong ngày."
        defaultPackage="SKY"
        formHeadline="ĐẶT LỊCH KHẢO SÁT MIỄN PHÍ"
      />

      <ProcessSection />

      {/* Hạ tầng phủ sóng & Thủ tục cần chuẩn bị */}
      <section className="py-10 sm:py-14 bg-[#F4F6FB] border-b border-[#E4E8ED]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4E8ED] text-[#C44D06] text-xs font-bold uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>Hạ Tầng Phủ Sóng Toàn Quốc</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] leading-tight">
                Thủ Tục Đăng Ký Nhanh Gọn Trên Toàn Quốc
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Hệ thống cáp quang FTTH của FPT Telecom đã phủ sóng rộng khắp 34 tỉnh, thành phố trên cả nước, từ khu vực nội thành, chung cư đến các phường, xã và khu nhà trọ.
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-4 rounded-2xl bg-white border border-[#E4E8ED] flex items-start gap-3">
                  <FileCheck2 className="w-5 h-5 text-[#F37021] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Đối với Cá nhân &amp; Hộ gia đình</h3>
                    <p className="text-xs text-[#475569] mt-0.5">
                      Chỉ cần ảnh chụp Căn cước công dân (CCCD) 2 mặt. Khách hàng ở trọ/thuê nhà vẫn lắp đặt bình thường.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E4E8ED] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Đối với Doanh nghiệp &amp; Quán Game</h3>
                    <p className="text-xs text-[#475569] mt-0.5">
                      Chuẩn bị Giấy phép kinh doanh (GPKD) và CCCD người đại diện để xuất hóa đơn VAT đầy đủ.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E4E8ED] flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Thời gian triển khai cam kết</h3>
                    <p className="text-xs text-[#475569] mt-0.5">
                      Lắp đặt hoàn thiện trong vòng 12 – 24 giờ kể từ lúc hoàn tất hợp đồng điện tử. Hỗ trợ cả Thứ 7 &amp; Chủ Nhật.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4E8ED] shadow-sm w-full max-w-md text-center">
                <img
                  src="/images/banners/vietnam-network-map.png"
                  alt="Bản đồ phủ sóng hạ tầng cáp quang FPT Telecom toàn quốc"
                  width={420}
                  height={420}
                  className="w-full h-auto max-h-[340px] object-contain mx-auto"
                />
                <p className="text-xs font-bold text-[#0F172A] mt-4">
                  Mạng lưới hạ tầng cáp quang FTTH phủ sóng 34 tỉnh, thành phố
                </p>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Đội ngũ kỹ thuật trực chiến tại từng phường, xã, hỗ trợ bảo trì tận nơi 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BottomCtaSection
        defaultPackage="SKY"
        title="Kiểm Tra Hạ Tầng Tại Địa Chỉ Của Bạn"
        description="Nhập địa chỉ lắp đặt để kỹ thuật viên kiểm tra cổng quang gần nhất và báo lịch thi công trong 15 phút."
      />
    </>
  );
}
