import { PhoneCall, MapPin, FileCheck2, Wrench, ShieldCheck } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Gửi Yêu Cầu Tư Vấn",
      desc: "Chỉ mất 30 giây điền số điện thoại và địa chỉ hoặc bấm gọi Hotline 0878 800 400.",
      icon: PhoneCall,
      highlight: "Nhanh chóng",
    },
    {
      step: "02",
      title: "Khảo Sát Hạ Tầng & Báo Giá",
      desc: "Chuyên viên liên hệ lại sau 5 - 15 phút, kiểm tra cổng quang tại địa chỉ nhà bạn và báo giá chuẩn xác.",
      icon: MapPin,
      highlight: "15 phút",
    },
    {
      step: "03",
      title: "Ký Hợp Đồng Điện Tử",
      desc: "Ký hợp đồng online bảo mật qua tin nhắn OTP hoặc nhân viên hỗ trợ tận nhà theo yêu cầu.",
      icon: FileCheck2,
      highlight: "Bảo mật",
    },
    {
      step: "04",
      title: "Lắp Đặt & Bàn Giao Trong 24H",
      desc: "Kỹ thuật viên kéo cáp quang, trang bị modem Wi-Fi 6, đo kiểm tốc độ và bàn giao nghiệm thu.",
      icon: Wrench,
      highlight: "Siêu tốc",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-fpt-orange border border-orange-200/80 font-bold text-xs uppercase tracking-wider mb-2 shadow-2xs backdrop-blur-md">
            Quy Trình Chuẩn Hóa
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight break-words">
            4 Bước Đăng Ký &amp; Lắp Đặt Siêu Tốc Trong 24 Giờ
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-normal">
            Thủ tục đơn giản nhất thị trường, không cần đặt cọc trước, khảo sát tận nơi hoàn toàn miễn phí.
          </p>
        </div>

        {/* 4 Steps Grid - White Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/85 backdrop-blur-xl rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-black text-fpt-orange bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-200/60 shadow-2xs">
                      BƯỚC {item.step}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/80">
                      {item.highlight}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/60 text-fpt-orange group-hover:bg-fpt-orange group-hover:text-white flex items-center justify-center mb-3 transition-all shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
