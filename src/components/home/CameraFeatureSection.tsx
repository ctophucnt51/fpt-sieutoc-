"use client";

import { ShieldCheck, Eye, Cloud, BellRing, ArrowRight } from "lucide-react";
import { useLeadModal } from "@/context/LeadModalContext";

export default function CameraFeatureSection() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 font-bold text-xs uppercase tracking-wider mb-2 shadow-2xs backdrop-blur-md">
            Giải Pháp An Ninh AI
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
          <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 hover:border-orange-200 hover:shadow-md transition-all shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-fpt-orange flex items-center justify-center mb-3 shadow-2xs">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1.5">Lưu Trữ Cloud FPT</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Dữ liệu video được lưu trữ tại trung tâm dữ liệu chuẩn Tier III của FPT Telecom tại VN, an toàn tuyệt đối ngay cả khi camera bị mất cắp.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 hover:border-orange-200 hover:shadow-md transition-all shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 shadow-2xs">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1.5">Phát Hiện Người Bằng AI</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Trí tuệ nhân tạo phân biệt chính xác chuyển động của con người với lá cây, chó mèo, tránh cảnh báo rác gây phiền toái.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 hover:border-orange-200 hover:shadow-md transition-all shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-2xs">
              <BellRing className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1.5">Cảnh Báo Tức Thì</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Gửi thông báo có hình ảnh đến điện thoại ngay khi phát hiện xâm nhập vùng an ninh ảo, hỗ trợ đàm thoại 2 chiều to rõ.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 hover:border-orange-200 hover:shadow-md transition-all shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1.5">Bảo Hành Chính Hãng</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Bảo hành 24 tháng chính hãng FPT, hỗ trợ kỹ thuật và bảo trì trọn đời tận nơi 24/7 trên toàn quốc.
            </p>
          </div>
        </div>

        {/* 2 Camera Models Card Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Camera Play */}
          <div className="rounded-3xl border border-slate-200/80 p-6 sm:p-7 bg-white/85 backdrop-blur-xl flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-fpt-dark text-xs font-bold uppercase">
                  Trong Nhà &bull; Xoay 355°
                </span>
              </div>
              <div className="my-3 flex justify-center">
                <img
                  src="/images/products/camera-play-official.jpg"
                  alt="FPT Camera Play Chính Hãng"
                  className="w-40 h-40 object-contain bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-2xs hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-xl font-black text-slate-900">FPT Camera Play</h3>
              <p className="text-xs text-slate-500 mt-1">Quan sát bao quát góc rộng toàn cảnh phòng khách, phòng bé</p>
              <div className="my-3 text-2xl font-black text-fpt-orange">
                Từ 550.000đ <span className="text-xs text-slate-500 font-normal">/thiết bị</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li>&bull; Hình ảnh sắc nét Full HD 1080p</li>
                <li>&bull; Xoay ngang 355°, xoay dọc 100°</li>
                <li>&bull; Đàm thoại 2 chiều to rõ thời gian thực</li>
                <li>&bull; Kết nối Wi-Fi băng tần kép tiện lợi</li>
              </ul>
            </div>
            <button
              onClick={() => openLeadModal("FPT Camera Play")}
              className="mt-6 w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Đăng Ký Tư Vấn Camera Play</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Camera IQ3 */}
          <div className="rounded-3xl border-2 border-fpt-orange p-6 sm:p-7 bg-white/95 backdrop-blur-2xl flex flex-col justify-between shadow-[0_12px_40px_rgba(243,112,33,0.15)] ring-4 ring-orange-500/10">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <span className="inline-block px-3 py-1 rounded-full bg-fpt-orange text-white text-xs font-bold uppercase shadow-2xs">
                  Ngoài Trời &bull; Chuẩn IP66
                </span>
              </div>
              <div className="my-3 flex justify-center">
                <img
                  src="/images/products/camera-iq3-official.jpg"
                  alt="FPT Camera IQ3 Chính Hãng"
                  className="w-40 h-40 object-contain bg-slate-50 p-2 rounded-2xl border border-orange-100 shadow-2xs hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-xl font-black text-slate-900">FPT Camera IQ3</h3>
              <p className="text-xs text-slate-500 mt-1">Chịu mưa nắng bền bỉ trước cổng nhà, sân vườn, bãi giữ xe</p>
              <div className="my-3 text-2xl font-black text-fpt-orange">
                Từ 750.000đ <span className="text-xs text-slate-500 font-normal">/thiết bị</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li>&bull; Chuẩn chống nước, chống bụi chuẩn IP66</li>
                <li>&bull; Ban đêm quan sát có màu rõ nét</li>
                <li>&bull; Khoanh vùng phát hiện người và phát cảnh báo còi</li>
                <li>&bull; Hỗ trợ cổng LAN hoặc kết nối Wi-Fi</li>
              </ul>
            </div>
            <button
              onClick={() => openLeadModal("FPT Camera IQ3")}
              className="mt-6 w-full py-3.5 rounded-xl bg-fpt-orange hover:bg-fpt-hover text-white font-bold text-xs uppercase shadow-[0_4px_16px_rgba(243,112,33,0.3)] hover:shadow-[0_6px_20px_rgba(243,112,33,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Đăng Ký Tư Vấn Camera IQ3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
