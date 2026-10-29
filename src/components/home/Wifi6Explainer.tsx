"use client";

import { Wifi, Cpu, Layers, Zap, CheckCircle2, ShieldCheck } from "lucide-react";

export default function Wifi6Explainer() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white/60 backdrop-blur-md border-b border-slate-200/60 overflow-hidden max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Title & Comparison Table */}
          <div className="lg:col-span-6 space-y-4 min-w-0 max-w-full text-center lg:text-left">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-fpt-orange border border-orange-200/80 font-bold text-xs uppercase tracking-wider mb-2.5 shadow-2xs backdrop-blur-md">
                Chuẩn Wi-Fi 6 (802.11ax) Thế Hệ Mới
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                Tại Sao Nên Chọn <span className="text-fpt-orange">Wi-Fi 6 Của FPT</span> Thay Vì Wi-Fi Cũ?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Tất cả gói cước Internet FPT hiện nay đều được trang bị modem Wi-Fi 6 băng tần kép hiện đại. Giải quyết triệt để tình trạng nghẽn mạng, giật lag khi cả gia đình cùng giải trí 4K hoặc làm việc online.
              </p>
            </div>

            {/* Comparison Table with White Glassmorphism - Zero Horizontal Scroll */}
            <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-2xs overflow-hidden">
              {/* Mobile Card Grid (No horizontal scroll, 100% responsive) */}
              <div className="sm:hidden divide-y divide-slate-100 text-xs">
                <div className="p-3 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Tốc độ tối đa</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-100">
                      <span className="block text-[10px] text-slate-400">Wi-Fi 5 Cũ</span>
                      Đến 867 Mbps
                    </div>
                    <div className="p-2 rounded-xl bg-orange-50/80 text-fpt-dark font-bold border border-orange-200/70">
                      <span className="block text-[10px] text-fpt-orange">FPT Wi-Fi 6 Mới</span>
                      Lên đến 1 Gbps
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Độ trễ (Ping)</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-100">
                      <span className="block text-[10px] text-slate-400">Wi-Fi 5 Cũ</span>
                      20ms – 50ms
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50/80 text-emerald-800 font-bold border border-emerald-200/70">
                      <span className="block text-[10px] text-emerald-600">FPT Wi-Fi 6 Mới</span>
                      &lt; 10ms (giảm 75%)
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Thiết bị đồng thời</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-100">
                      <span className="block text-[10px] text-slate-400">Wi-Fi 5 Cũ</span>
                      Chỉ 8 – 12 máy
                    </div>
                    <div className="p-2 rounded-xl bg-orange-50/80 text-fpt-dark font-bold border border-orange-200/70">
                      <span className="block text-[10px] text-fpt-orange">FPT Wi-Fi 6 Mới</span>
                      30+ thiết bị mượt mà
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Độ phủ sóng</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-100">
                      <span className="block text-[10px] text-slate-400">Wi-Fi 5 Cũ</span>
                      Trung bình
                    </div>
                    <div className="p-2 rounded-xl bg-orange-50/80 text-fpt-dark font-bold border border-orange-200/70">
                      <span className="block text-[10px] text-fpt-orange">FPT Wi-Fi 6 Mới</span>
                      Xuyên tường, Mesh
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop / Tablet Table View (Hidden on mobile) */}
              <div className="hidden sm:block text-xs sm:text-sm">
                {/* Table Header */}
                <div className="grid grid-cols-3 bg-slate-100/70 p-3.5 font-bold text-slate-800 border-b border-slate-200/80">
                  <div>Tiêu chí</div>
                  <div className="text-slate-500">Wi-Fi 5 Cũ</div>
                  <div className="text-fpt-orange font-extrabold">FPT Wi-Fi 6 Mới</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-slate-100 text-slate-700">
                  <div className="grid grid-cols-3 p-3.5 items-center hover:bg-orange-50/20 transition-colors">
                    <span className="font-semibold text-slate-900">Tốc độ tối đa</span>
                    <span className="text-slate-400">Đến 867 Mbps</span>
                    <span className="font-bold text-slate-900">Lên đến 1 Gbps</span>
                  </div>
                  <div className="grid grid-cols-3 p-3.5 items-center hover:bg-orange-50/20 transition-colors">
                    <span className="font-semibold text-slate-900">Độ trễ (Ping)</span>
                    <span className="text-slate-400">20ms - 50ms</span>
                    <span className="font-bold text-emerald-600">Giảm đến 75% (&lt; 10ms)</span>
                  </div>
                  <div className="grid grid-cols-3 p-3.5 items-center hover:bg-orange-50/20 transition-colors">
                    <span className="font-semibold text-slate-900">Thiết bị đồng thời</span>
                    <span className="text-slate-400">Chỉ 8 - 12 máy</span>
                    <span className="font-bold text-fpt-orange">30+ thiết bị mượt mà</span>
                  </div>
                  <div className="grid grid-cols-3 p-3.5 items-center hover:bg-orange-50/20 transition-colors">
                    <span className="font-semibold text-slate-900">Độ phủ sóng</span>
                    <span className="text-slate-400">Trung bình</span>
                    <span className="font-bold text-slate-900">Xuyên tường, hỗ trợ Mesh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Key Pillars + Product Showcase */}
          <div className="lg:col-span-6 space-y-3.5 min-w-0 max-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-fpt-orange flex items-center justify-center mb-2.5 shadow-2xs">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">Tốc Độ Siêu Tốc 1 Gbps</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Tải phim 4K trong vài giây, xem livestream sắc nét, không còn xoay tròn chờ đợi.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2.5 shadow-2xs">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">Độ Trễ Thấp (Low Ping)</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Công nghệ OFDMA &amp; MU-MIMO truyền dữ liệu đa luồng, chơi game online cực êm.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2.5 shadow-2xs">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">Công Nghệ Mesh Mở Rộng</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Phủ sóng toàn bộ nhà nhiều tầng, chung cư lớn chỉ với 1 tên Wi-Fi duy nhất.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2.5 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">Bảo Hành Thiết Bị Trọn Đời</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Trang bị miễn phí modem Wi-Fi 6 và đổi mới ngay khi phát sinh lỗi kỹ thuật.
                </p>
              </div>
            </div>

            {/* Official Modem Showcase Strip - White Glassmorphism Card */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-orange-200/80 shadow-2xs flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                <img
                  src="/images/products/modem-wifi6-official.png"
                  alt="Modem Wi-Fi 6 FPT Chính Hãng"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-50 text-fpt-orange border border-orange-200/70 text-[10px] font-bold uppercase whitespace-nowrap mb-1">
                  Thiết Bị Tiêu Chuẩn FPT
                </span>
                <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug break-normal hyphens-none">
                  Modem Wi-Fi 6 Băng Tần Kép AX3000
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5 break-normal font-normal">
                  Được trang bị hoàn toàn 0 đồng khi đăng ký gói Internet Cáp Quang hôm nay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
