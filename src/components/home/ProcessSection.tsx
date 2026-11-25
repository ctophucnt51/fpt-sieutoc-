import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Gửi Yêu Cầu Tư Vấn",
      desc: "Chỉ mất 30 giây điền số điện thoại và địa chỉ hoặc bấm gọi Hotline 0878 800 400.",
      iconImg: "/images/icons/svg/hotline.svg",
      highlight: "Nhanh chóng",
    },
    {
      step: "02",
      title: "Khảo Sát Hạ Tầng & Báo Giá",
      desc: "Chuyên viên liên hệ lại sau 5 - 15 phút, kiểm tra cổng quang tại địa chỉ nhà bạn và báo giá chuẩn xác.",
      iconImg: "/images/icons/svg/khao-sat.svg",
      highlight: "15 phút",
    },
    {
      step: "03",
      title: "Ký Hợp Đồng Điện Tử",
      desc: "Ký hợp đồng online bảo mật qua tin nhắn OTP hoặc nhân viên hỗ trợ tận nhà theo yêu cầu.",
      iconImg: "/images/icons/svg/hop-dong.svg",
      highlight: "Bảo mật",
    },
    {
      step: "04",
      title: "Lắp Đặt & Bàn Giao Trong 24H",
      desc: "Kỹ thuật viên kéo cáp quang, trang bị modem Wi-Fi 6, đo kiểm tốc độ và bàn giao nghiệm thu.",
      iconImg: "/images/icons/svg/lap-dat.svg",
      highlight: "Siêu tốc",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-[#E4E8ED]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4ED] text-[#9A3412] border border-orange-200/80 font-bold text-xs uppercase tracking-wider mb-2.5 shadow-xs">
            <img
              src="/images/icons/svg/lap-dat.svg"
              alt="Quy trình"
              width={16}
              height={16}
              loading="lazy"
              decoding="async"
              className="w-4 h-4 object-contain shrink-0"
            />
            <span>Quy Trình Chuẩn Hóa</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight break-words">
            4 Bước Đăng Ký &amp; Lắp Đặt Siêu Tốc Trong 24 Giờ
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#334155] font-medium">
            Thủ tục đăng ký đơn giản, hỗ trợ khảo sát hạ tầng tận nơi miễn phí theo chính sách khu vực.
          </p>
        </div>

        {/* 4 Steps Grid - Phong cách Long Châu White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F4F6FB] hover:bg-white rounded-2xl p-5 sm:p-6 border border-[#E4E8ED] hover:border-[#F37021] shadow-xs hover:shadow-[0_8px_24px_rgba(243,112,33,0.12)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black text-white bg-[#F37021] px-3 py-0.5 rounded-full shadow-xs uppercase tracking-tight">
                    BƯỚC {item.step}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white text-[#475569] border border-[#E4E8ED]">
                    {item.highlight}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-xl bg-white border border-[#E4E8ED] p-1 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-all shadow-xs">
                  <img
                    src={item.iconImg}
                    alt={item.title}
                    width={32}
                    height={32}
                    loading="lazy"
                    decoding="async"
                    className="w-8 h-8 object-contain shrink-0"
                  />
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A] mb-1.5 group-hover:text-[#F37021] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#334155] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/quy-trinh-lap-dat"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#F4F6FB] hover:bg-[#FFF4ED] border border-[#E4E8ED] hover:border-orange-300 text-xs sm:text-sm font-bold text-[#0F172A] hover:text-[#9A3412] transition-all whitespace-nowrap"
          >
            <span>Xem chi tiết thủ tục &amp; vùng phủ sóng</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
