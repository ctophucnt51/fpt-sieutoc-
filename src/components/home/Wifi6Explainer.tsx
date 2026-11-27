"use client";

import { Wifi, Cpu, Layers, Zap, CheckCircle2, ShieldCheck } from "lucide-react";

export default function Wifi6Explainer() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-[#E4E8ED] overflow-hidden max-w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Title & Comparison Table */}
          <div className="lg:col-span-6 space-y-4 min-w-0 max-w-full text-center lg:text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#9A3412] border border-orange-200/80 font-bold text-xs uppercase tracking-wider mb-2.5 shadow-2xs backdrop-blur-md">
                <img
                  src="/images/icons/svg/wifi-6.svg"
                  alt="Wi-Fi 6"
                  width={16}
                  height={16}
                  loading="lazy"
                  decoding="async"
                  className="w-4 h-4 object-contain shrink-0"
                />
                <span>Chuẩn Wi-Fi 6 (802.11ax) Thế Hệ Mới</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                Tại Sao Nên Chọn <span className="text-[#9A3412]">Wi-Fi 6 Của FPT</span> Thay Vì Wi-Fi Cũ?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Tất cả gói cước Internet FPT hiện nay đều được trang bị modem Wi-Fi 6 băng tần kép hiện đại. Giải quyết triệt để tình trạng nghẽn mạng, giật lag khi cả gia đình cùng giải trí 4K hoặc làm việc online.
              </p>
            </div>

            {/* Comparison Table with White Glassmorphism - Zero Horizontal Scroll */}
            <div className="rounded-2xl bg-white border border-[#E4E8ED] shadow-[0_0_8px_-2px_rgba(243,112,33,0.08)] overflow-hidden">
              {/* Mobile Card Grid (No horizontal scroll, 100% responsive) */}
              <div className="sm:hidden divide-y divide-slate-100 text-xs">
                <div className="p-3 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Tốc độ tối đa</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                      <span className="block text-[10px] text-slate-600 font-semibold">Wi-Fi 5 Cũ</span>
                      Đến 867 Mbps
                    </div>
                    <div className="p-2 rounded-xl bg-orange-50/80 text-slate-900 font-bold border border-orange-200/70">
                      <span className="block text-[10px] text-[#9A3412] font-bold">FPT Wi-Fi 6 Mới</span>
                      Lên đến 1 Gbps
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Độ trễ (Ping)</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                      <span className="block text-[10px] text-slate-600 font-semibold">Wi-Fi 5 Cũ</span>
                      20ms – 50ms
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50/80 text-emerald-900 font-bold border border-emerald-200/70">
                      <span className="block text-[10px] text-emerald-800 font-bold">FPT Wi-Fi 6 Mới</span>
                      &lt; 10ms (giảm 75%)
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Thiết bị đồng thời</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                      <span className="block text-[10px] text-slate-600 font-semibold">Wi-Fi 5 Cũ</span>
                      Chỉ 8 – 12 máy
                    </div>
                    <div className="p-2 rounded-xl bg-orange-50/80 text-slate-900 font-bold border border-orange-200/70">
                      <span className="block text-[10px] text-[#9A3412] font-bold">FPT Wi-Fi 6 Mới</span>
                      30+ thiết bị mượt mà
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Độ phủ sóng</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                      <span className="block text-[10px] text-slate-600 font-semibold">Wi-Fi 5 Cũ</span>
                      Trung bình
                    </div>
                    <div className="p-2 rounded-xl bg-orange-50/80 text-slate-900 font-bold border border-orange-200/70">
                      <span className="block text-[10px] text-[#9A3412] font-bold">FPT Wi-Fi 6 Mới</span>
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
                  <div className="text-slate-700 font-bold">Wi-Fi 5 Cũ</div>
                  <div className="text-[#9A3412] font-black">FPT Wi-Fi 6 Mới</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-slate-100 text-slate-700">
                  <div className="grid grid-cols-3 p-3.5 items-center hover:bg-orange-50/20 transition-colors">
                    <span className="font-semibold text-slate-900">Tốc độ tối đa</span>
                    <span className="text-slate-600">Đến 867 Mbps</span>
                    <span className="font-bold text-slate-900">Lên đến 1 Gbps</span>
                  </div>
                  <div className="grid grid-cols-3 p-3.5 items-center hover:bg-orange-50/20 transition-colors">
                    <span className="font-semibold text-slate-900">Độ trễ (Ping)</span>
                    <span className="text-slate-600">20ms - 50ms</span>
                    <span className="font-bold text-emerald-700">Giảm đến 75% (&lt; 10ms)</span>
                  </div>
                  <div className="grid grid-cols-3 p-3.5 items-center hover:bg-orange-50/20 transition-colors">
                    <span className="font-semibold text-slate-900">Thiết bị đồng thời</span>
                    <span className="text-slate-600">Chỉ 8 - 12 máy</span>
                    <span className="font-bold text-[#9A3412]">30+ thiết bị mượt mà</span>
                  </div>
                  <div className="grid grid-cols-3 p-3.5 items-center hover:bg-orange-50/20 transition-colors">
                    <span className="font-semibold text-slate-900">Độ phủ sóng</span>
                    <span className="text-slate-600">Trung bình</span>
                    <span className="font-bold text-slate-900">Xuyên tường, hỗ trợ Mesh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Key Pillars + Product Showcase */}
          <div className="lg:col-span-6 space-y-3.5 min-w-0 max-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 hover:border-orange-200 hover:shadow-[0_12px_32px_rgba(243,112,33,0.12)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100/80 p-1 flex items-center justify-center mb-3 shadow-2xs">
                  <img
                    src="/images/icons/svg/toc-do.svg"
                    alt="Tốc độ 1 Gbps"
                    width={26}
                    height={26}
                    loading="lazy"
                    decoding="async"
                    className="w-[26px] h-[26px] object-contain shrink-0"
                  />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">Tốc Độ Siêu Tốc 1 Gbps</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Tải phim 4K trong vài giây, xem livestream sắc nét, không còn xoay tròn chờ đợi.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-[0_12px_32px_rgba(16,185,129,0.12)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100/80 p-1 flex items-center justify-center mb-3 shadow-2xs">
                  <img
                    src="/images/icons/svg/gaming.svg"
                    alt="Low Ping Gaming"
                    width={26}
                    height={26}
                    loading="lazy"
                    decoding="async"
                    className="w-[26px] h-[26px] object-contain shrink-0"
                  />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">Độ Trễ Thấp (Low Ping)</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Công nghệ OFDMA &amp; MU-MIMO truyền dữ liệu đa luồng, chơi game online cực êm.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-[0_12px_32px_rgba(2,132,199,0.12)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100/80 p-1 flex items-center justify-center mb-3 shadow-2xs">
                  <img
                    src="/images/icons/svg/wifi-mesh.svg"
                    alt="Wi-Fi Mesh"
                    width={26}
                    height={26}
                    loading="lazy"
                    decoding="async"
                    className="w-[26px] h-[26px] object-contain shrink-0"
                  />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">Công Nghệ Mesh Mở Rộng</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Phủ sóng toàn bộ nhà nhiều tầng, chung cư lớn chỉ với 1 tên Wi-Fi duy nhất.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 hover:border-purple-200 hover:shadow-[0_12px_32px_rgba(168,85,247,0.12)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100/80 p-0.5 flex items-center justify-center mb-2.5 shadow-2xs">
                  <img
                    src="/images/icons/svg/bao-hanh.svg"
                    alt="Bảo Hành"
                    width={26}
                    height={26}
                    loading="lazy"
                    decoding="async"
                    className="w-[26px] h-[26px] object-contain shrink-0"
                  />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">Bảo Hành Thiết Bị Trọn Đời</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Trang bị miễn phí modem Wi-Fi 6 và đổi mới ngay khi phát sinh lỗi kỹ thuật.
                </p>
              </div>
            </div>

            {/* Official Modem Showcase Strip - Clean Transparent PNG Showcase */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-orange-200/80 shadow-[0_0_8px_-2px_rgba(243,112,33,0.08)] flex items-center gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-50/90 via-white to-slate-50 border border-orange-100 p-2 flex items-center justify-center shrink-0">
                <img
                  src="/images/products/modem-wifi6-transparent.png"
                  alt="Modem Wi-Fi 6 FPT Chính Hãng"
                  width={74}
                  height={151}
                  className="h-full w-auto max-w-full object-contain drop-shadow-xs"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-50 text-[#9A3412] border border-orange-200/70 text-[10px] font-bold uppercase whitespace-nowrap mb-1">
                  <img
                    src="/images/icons/svg/modem.svg"
                    alt="Modem"
                    width={13}
                    height={13}
                    loading="lazy"
                    decoding="async"
                    className="w-3.5 h-3.5 object-contain shrink-0"
                  />
                  <span>Thiết Bị Tiêu Chuẩn FPT</span>
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
