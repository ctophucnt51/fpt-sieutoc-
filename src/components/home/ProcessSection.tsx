export default function ProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Gửi Yêu Cầu Tư Vấn",
      desc: "Chỉ mất 30 giây điền số điện thoại và địa chỉ hoặc bấm gọi Hotline 0878 800 400.",
      iconImg: "/images/icons/liquid-glass/hotline.webp",
      highlight: "Nhanh chóng",
    },
    {
      step: "02",
      title: "Khảo Sát Hạ Tầng & Báo Giá",
      desc: "Chuyên viên liên hệ lại sau 5 - 15 phút, kiểm tra cổng quang tại địa chỉ nhà bạn và báo giá chuẩn xác.",
      iconImg: "/images/icons/liquid-glass/khao-sat.webp",
      highlight: "15 phút",
    },
    {
      step: "03",
      title: "Ký Hợp Đồng Điện Tử",
      desc: "Ký hợp đồng online bảo mật qua tin nhắn OTP hoặc nhân viên hỗ trợ tận nhà theo yêu cầu.",
      iconImg: "/images/icons/liquid-glass/hop-dong.webp",
      highlight: "Bảo mật",
    },
    {
      step: "04",
      title: "Lắp Đặt & Bàn Giao Trong 24H",
      desc: "Kỹ thuật viên kéo cáp quang, trang bị modem Wi-Fi 6, đo kiểm tốc độ và bàn giao nghiệm thu.",
      iconImg: "/images/icons/liquid-glass/lap-dat.webp",
      highlight: "Siêu tốc",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-fpt-orange border border-orange-200/80 font-bold text-xs uppercase tracking-wider mb-2 shadow-2xs backdrop-blur-md">
            <img
              src="/images/icons/liquid-glass/lap-dat.webp"
              alt="Quy trình"
              width={16}
              height={16}
              className="w-4 h-4 object-contain shrink-0"
            />
            <span>Quy Trình Chuẩn Hóa</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight break-words">
            4 Bước Đăng Ký &amp; Lắp Đặt Siêu Tốc Trong 24 Giờ
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-normal">
            Thủ tục đơn giản nhất thị trường, không cần đặt cọc trước, khảo sát tận nơi hoàn toàn miễn phí.
          </p>
        </div>

        {/* 4 Steps Grid - Viettel Vx Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(243,112,33,0.12)] hover:border-orange-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black text-white bg-gradient-to-r from-orange-500 to-fpt-orange px-3 py-1 rounded-full shadow-xs uppercase tracking-tight">
                    BƯỚC {item.step}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/80">
                    {item.highlight}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-orange-50/80 border border-orange-200/60 p-1 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-all shadow-2xs">
                  <img
                    src={item.iconImg}
                    alt={item.title}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain shrink-0"
                  />
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1.5 group-hover:text-fpt-orange transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
