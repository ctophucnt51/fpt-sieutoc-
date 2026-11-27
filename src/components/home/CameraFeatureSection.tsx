"use client";

import { ShieldCheck, Eye, Cloud, BellRing, ArrowRight } from "lucide-react";
import { useLeadModal } from "@/context/LeadModalContext";

export default function CameraFeatureSection() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-[#F4F6FB] border-b border-[#E4E8ED]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#C44D06] border border-orange-200/80 font-bold text-xs uppercase tracking-wider mb-2 shadow-[0_0_8px_-2px_rgba(243,112,33,0.08)]">
            <img
              src="/images/icons/svg/camera-ai.svg"
              alt="Camera AI"
              width={16}
              height={16}
              loading="lazy"
              decoding="async"
              className="w-4 h-4 object-contain shrink-0"
            />
            <span>Giải Pháp An Ninh AI</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            FPT Camera AI Thông Minh &bull; Lưu Trữ Đám Mây An Toàn
          </h2>
          <p className="mt-2 text-xs sm:text-sm lg:text-base text-slate-600 font-normal">
            Giải pháp giám sát an ninh toàn diện cho gia đình, cửa hàng và xưởng sản xuất. Máy chủ Cloud đặt 100% tại Việt Nam, không lo lộ lọt video.
          </p>
        </div>

        {/* 4 Feature Cards - White Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <div className="p-5 rounded-2xl bg-white border border-[#E4E8ED] hover:border-orange-200 hover:shadow-[0_4px_16px_rgba(243,112,33,0.12)] transition-all shadow-[0_0_8px_-2px_rgba(243,112,33,0.06)]">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#F37021] flex items-center justify-center mb-3">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1.5">Lưu Trữ Cloud FPT</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Dữ liệu video được lưu trữ tại trung tâm dữ liệu chuẩn Tier III của FPT Telecom tại VN, bảo mật cao theo tiêu chuẩn an ninh dữ liệu.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4E8ED] hover:border-orange-200 hover:shadow-[0_4px_16px_rgba(243,112,33,0.12)] transition-all shadow-[0_0_8px_-2px_rgba(243,112,33,0.06)]">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1.5">Phát Hiện Người Bằng AI</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Trí tuệ nhân tạo phân biệt chính xác chuyển động của con người với lá cây, chó mèo, tránh cảnh báo rác gây phiền toái.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4E8ED] hover:border-orange-200 hover:shadow-[0_4px_16px_rgba(243,112,33,0.12)] transition-all shadow-[0_0_8px_-2px_rgba(243,112,33,0.06)]">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <BellRing className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1.5">Cảnh Báo Tức Thì</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Gửi thông báo có hình ảnh đến điện thoại ngay khi phát hiện xâm nhập vùng an ninh ảo, hỗ trợ đàm thoại 2 chiều to rõ.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4E8ED] hover:border-orange-200 hover:shadow-[0_4px_16px_rgba(243,112,33,0.12)] transition-all shadow-[0_0_8px_-2px_rgba(243,112,33,0.06)]">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 p-1 flex items-center justify-center mb-3">
              <img
                src="/images/icons/svg/bao-hanh.svg"
                alt="Bảo Hành"
                width={28}
                height={28}
                loading="lazy"
                decoding="async"
                className="w-7 h-7 object-contain"
              />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1.5">Bảo Hành Chính Hãng</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Bảo hành 24 tháng chính hãng FPT, hỗ trợ kỹ thuật và bảo trì tận nơi 24/7 trên toàn quốc trong suốt thời gian sử dụng dịch vụ.
            </p>
          </div>
        </div>

        {/* 2 Camera Models Card Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Camera Play 4 */}
          <div className="rounded-2xl border border-[#E4E8ED] p-6 sm:p-7 bg-white flex flex-col justify-between shadow-[0_0_8px_-2px_rgba(243,112,33,0.06)] hover:shadow-[0_4px_16px_rgba(243,112,33,0.12)] transition-all">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-fpt-dark text-xs font-bold uppercase">
                  Trong Nhà &bull; Xoay 315° &bull; 3MP
                </span>
              </div>
              <div className="my-3 flex justify-center">
                <img
                  src="/images/camera-ai/camera-play-4.jpg"
                  alt="FPT Camera AI Play 4 Chính Hãng"
                  width={280}
                  height={175}
                  loading="lazy"
                  decoding="async"
                  className="w-full max-w-[280px] h-44 object-cover bg-slate-50 rounded-2xl border border-slate-100 shadow-2xs hover:scale-[1.02] transition-transform"
                />
              </div>
              <h3 className="text-xl font-black text-slate-900">FPT Camera Play 4</h3>
              <p className="text-xs text-slate-500 mt-1">Camera AI trong nhà xoay toàn cảnh phòng khách, cửa hàng, phòng bé</p>
              <div className="my-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-fpt-orange text-xs font-extrabold border border-orange-200/80">
                Ưu đãi: Tặng 1 Camera khi lắp Internet FPT (Miễn phí lưu trữ)
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li>&bull; Độ phân giải 3MP sắc nét, ống kính 4.0mm</li>
                <li>&bull; Xoay ngang 315°, dọc 75°, hồng ngoại ban đêm 10m</li>
                <li>&bull; Đàm thoại chủ động 2 chiều + nút gọi đa năng</li>
                <li>&bull; Kết nối Wi-Fi, cài đặt nhanh Bluetooth, AI phát hiện người</li>
              </ul>
            </div>
            <button
              onClick={() => openLeadModal("FPT Camera Play 4")}
              className="mt-6 w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Đăng Ký Tư Vấn Camera Play 4</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Camera IQ4S */}
          <div className="rounded-2xl border-2 border-[#F37021] p-6 sm:p-7 bg-white flex flex-col justify-between shadow-[0_4px_16px_rgba(243,112,33,0.15)] ring-4 ring-orange-500/10">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <span className="inline-block px-3 py-1 rounded-full bg-fpt-orange text-white text-xs font-bold uppercase shadow-2xs">
                  Ngoài Trời &bull; Chuẩn IP67 &bull; 3MP
                </span>
              </div>
              <div className="my-3 flex justify-center">
                <img
                  src="/images/camera-ai/camera-iq-4s.jpg"
                  alt="FPT Camera AI IQ 4S Chính Hãng"
                  width={280}
                  height={175}
                  loading="lazy"
                  decoding="async"
                  className="w-full max-w-[280px] h-44 object-cover bg-slate-50 rounded-2xl border border-orange-100 shadow-2xs hover:scale-[1.02] transition-transform"
                />
              </div>
              <h3 className="text-xl font-black text-slate-900">FPT Camera IQ 4S</h3>
              <p className="text-xs text-slate-500 mt-1">Chịu mưa nắng bền bỉ trước cổng nhà, sân vườn, kho bãi</p>
              <div className="my-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-fpt-orange text-xs font-extrabold border border-orange-200/80">
                Ưu đãi: Tặng 1 Camera khi lắp Internet FPT (Miễn phí lưu trữ)
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li>&bull; Chuẩn kháng nước, chống bụi IP67, hồng ngoại 30m</li>
                <li>&bull; Đàm thoại 2 chiều + báo động đèn rọi &amp; còi hú</li>
                <li>&bull; AI phát hiện người, phân biệt chuyển động người &amp; vật</li>
                <li>&bull; Lưu trữ Cloud Video Full 24/7 tại Data Center Việt Nam</li>
              </ul>
            </div>
            <button
              onClick={() => openLeadModal("FPT Camera IQ 4S")}
              className="mt-6 w-full py-3.5 rounded-xl bg-fpt-orange hover:bg-fpt-hover text-white font-bold text-xs uppercase shadow-[0_4px_16px_rgba(243,112,33,0.3)] hover:shadow-[0_6px_20px_rgba(243,112,33,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Đăng Ký Tư Vấn Camera IQ 4S</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
