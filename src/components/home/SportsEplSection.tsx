"use client";

import { Tv, Trophy, Smartphone, CheckCircle, ArrowRight } from "lucide-react";
import { useLeadModal } from "@/context/LeadModalContext";

export default function SportsEplSection() {
  const { openLeadModal } = useLeadModal();

  const handleRegisterEpl = () => {
    openLeadModal("Combo GIGA");
  };

  return (
    <section id="ngoai-hang-anh" className="py-8 sm:py-12 bg-white relative overflow-hidden max-w-full border-b border-[#E4E8ED] scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl sm:rounded-4xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-[0_12px_45px_rgba(15,23,42,0.12)] relative overflow-hidden">
          {/* Subtle warm ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center relative z-10">
            {/* Left Text */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 font-bold text-xs uppercase tracking-wider shadow-xs">
                <img
                  src="/images/icons/liquid-glass/ngoai-hang-anh.webp"
                  alt="EPL"
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain shrink-0"
                />
                <span>Bản Quyền Trực Tiếp Ngoại Hạng Anh (EPL)</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-snug sm:leading-tight">
                Combo Internet Wi-Fi 6 +{" "}
                <span className="text-red-500">
                  Xem Bản Quyền Trọn Vẹn Ngoại Hạng Anh
                </span>
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-slate-400 leading-relaxed max-w-2xl font-normal mx-auto lg:mx-0">
                Không bỏ lỡ bất kỳ trận cầu nảy lửa nào của Manchester United, Arsenal, Liverpool, Manchester City hay Chelsea. Hình ảnh chuẩn Full HD sắc nét, không lo giật lag hay chèn quảng cáo phiền toái.
              </p>

              {/* Feature Bullets - Clean Minimalist Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-0.5 text-left">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 p-1">
                    <img
                      src="/images/icons/liquid-glass/ngoai-hang-anh.webp"
                      alt="EPL"
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Bản Quyền Trọn Vẹn EPL</h4>
                    <p className="text-[11px] sm:text-xs text-slate-400">Bình luận tiếng Việt sôi động, trực tiếp các vòng đấu</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 p-1">
                    <img
                      src="/images/icons/liquid-glass/smart-tv.webp"
                      alt="Smart TV"
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Xem Trực Tiếp Trên Smart TV</h4>
                    <p className="text-[11px] sm:text-xs text-slate-400">Cài app FPT Play trên TV Samsung, Sony, LG không cần Box</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 p-1">
                    <img
                      src="/images/icons/liquid-glass/kenh-truyen-hinh.webp"
                      alt="Kênh Truyền Hình"
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Gần 170 Kênh Truyền Hình</h4>
                    <p className="text-[11px] sm:text-xs text-slate-400">Kho phim điện ảnh, HBO, Warner TV, kênh thiếu nhi</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 p-1">
                    <img
                      src="/images/icons/liquid-glass/da-thiet-bi.webp"
                      alt="Đa Thiết Bị"
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Xem Trên Nhiều Thiết Bị</h4>
                    <p className="text-[11px] sm:text-xs text-slate-400">Đăng nhập đồng thời trên Smart TV, điện thoại, máy tính</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRegisterEpl}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-[0_6px_20px_rgba(220,38,38,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span className="sm:hidden">ĐĂNG KÝ COMBO EPL 220K/THÁNG</span>
                  <span className="hidden sm:inline">ĐĂNG KÝ GÓI COMBO GIGA EPL 220K/THÁNG</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>

            {/* Right Highlight Box - Viettel Vx Bento Style */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 lg:p-6 shadow-sm space-y-3.5 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Combo GIGA (Ngoại Hạng Anh)</h3>
                  </div>
                  <div className="flex items-baseline gap-1 sm:text-right">
                    <span className="text-[11px] text-slate-400">Chỉ</span>
                    <span className="text-xl sm:text-2xl font-black text-fpt-orange">220.000đ</span>
                    <span className="text-[11px] text-slate-400">/tháng</span>
                  </div>
                </div>

                {/* Official EPL Banner */}
                <div className="overflow-hidden rounded-2xl border border-slate-800 shadow-xs">
                  <img
                    src="/images/banners/combo-epl-official.jpg"
                    alt="Combo Giga Ngoại Hạng Anh FPT"
                    className="w-full h-36 sm:h-40 object-cover"
                  />
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Internet Wi-Fi 6 tốc độ 300 Mbps cực nhanh</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Bản quyền trực tiếp 380 trận Ngoại Hạng Anh Full HD</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Xem trực tiếp App FPT Play trên Smart TV (Không cần Box)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Gần 170 kênh truyền hình FPT Play giải trí cho cả nhà</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Tặng kèm 01 Camera FPT AI an ninh thông minh miễn phí</span>
                  </li>
                </ul>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] sm:text-xs text-slate-400">
                  <strong className="text-slate-200">Đăng ký hôm nay:</strong> Kỹ thuật viên hỗ trợ lắp đặt hoàn thiện và hướng dẫn sử dụng tận nhà trong 24 giờ.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
