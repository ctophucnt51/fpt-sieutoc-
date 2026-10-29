"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteConfig } from "@/context/ConfigContext";
import { Phone, MessageSquare, Clock, ShieldCheck, MapPin, ChevronRight } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();

  // Do not render website footer inside admin dashboard
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative z-20 w-full bg-slate-950 text-slate-400 pt-10 sm:pt-14 pb-32 sm:pb-28 md:pb-12 border-t border-slate-900 overflow-hidden">
      {/* Subtle Floating Ambient Glow in Dark Background */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-36 bg-gradient-to-r from-orange-500/10 via-amber-400/5 to-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 mb-8 sm:mb-10">
          
          {/* Col 1: Brand & Commitment */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/5 p-2 rounded-2xl border border-white/10 shrink-0 hover:bg-white/10 transition-colors">
                <img
                  src="/images/logo-ftel.svg"
                  alt="FPT Telecom"
                  width={109}
                  height={36}
                  className="h-7 w-auto max-w-[110px] object-contain brightness-0 invert"
                />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight block">
                  Lắp Mạng <span className="text-fpt-orange">FPT Siêu Tốc</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Hệ Thống Đăng Ký Trực Tuyến</span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
              Kênh tư vấn &amp; hỗ trợ tiếp nhận đăng ký trực tuyến các dịch vụ Internet cáp quang Wi-Fi 6, Truyền hình FPT Play, Thể thao Ngoại Hạng Anh và FPT Camera an ninh thông minh trên toàn quốc.
            </p>

            {/* Live Status Beacon */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Hỗ trợ tiếp nhận thông tin 24/7</span>
            </div>

            <div className="pt-1 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Khảo sát 0đ • Ký HĐ điện tử • Lắp đặt trong 24h</span>
            </div>
          </div>

          {/* Col 2: Dịch Vụ Cung Cấp */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-fpt-orange rounded-full"></span>
              Dịch Vụ Tư Vấn
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              <li>
                <Link
                  href="/lap-mang-fpt"
                  className="group flex items-center gap-1.5 text-slate-400 hover:text-white transition-all duration-200 hover:translate-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-fpt-orange transition-colors" />
                  <span>Lắp Internet Cáp Quang Wi-Fi 6</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/wifi-6"
                  className="group flex items-center gap-1.5 text-slate-400 hover:text-white transition-all duration-200 hover:translate-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-fpt-orange transition-colors" />
                  <span>Modem Wi-Fi 6 Băng Tần Kép</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/combo-ngoai-hang-anh"
                  className="group flex items-center gap-1.5 text-slate-400 hover:text-white transition-all duration-200 hover:translate-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-fpt-orange transition-colors" />
                  <span>Combo Internet + Ngoại Hạng Anh (EPL)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/truyen-hinh-fpt"
                  className="group flex items-center gap-1.5 text-slate-400 hover:text-white transition-all duration-200 hover:translate-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-fpt-orange transition-colors" />
                  <span>Combo Truyền Hình FPT Play</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="group flex items-center gap-1.5 text-slate-400 hover:text-white transition-all duration-200 hover:translate-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-fpt-orange transition-colors" />
                  <span>Tin Tức &amp; Khuyến Mãi Mới Nhất</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Thông Tin Liên Hệ Trực Tiếp */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-fpt-orange rounded-full"></span>
              Kênh Tư Vấn 24/7
            </h3>
            <ul className="space-y-3 text-xs sm:text-[13px]">
              {/* Phone Card */}
              <li>
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-fpt-orange flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-medium">Hotline Bán Hàng &amp; Tư Vấn:</span>
                      <a
                        href={siteConfig.contact.hotlineTel}
                        className="text-white font-bold hover:text-fpt-orange text-sm sm:text-base tracking-tight transition-colors inline-block"
                      >
                        {siteConfig.contact.hotlineDisplay}
                      </a>
                    </div>
                  </div>
                </div>
              </li>

              {/* Zalo Card */}
              <li>
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-medium">Tư Vấn Zalo Nhanh:</span>
                      <a
                        href={siteConfig.contact.zaloUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-white font-bold transition-colors inline-block text-xs sm:text-sm"
                      >
                        Chat Zalo {siteConfig.contact.hotlineDisplay}
                      </a>
                    </div>
                  </div>
                </div>
              </li>

              {/* Working Hours */}
              <li className="flex items-start gap-2 text-slate-400 text-xs px-1">
                <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 font-medium">Giờ phục vụ: </span>
                  <span className="text-slate-200 font-semibold">{siteConfig.contact.workingHours}</span>
                </div>
              </li>

              {/* Coverage */}
              <li className="flex items-start gap-2 text-slate-400 text-xs px-1">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 font-medium">Khu vực: </span>
                  <span className="text-slate-200 font-semibold">Toàn quốc &amp; 63 tỉnh thành</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Pháp Lý & Cam Kết */}
          <div className="space-y-3.5">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-fpt-orange rounded-full"></span>
              Chính Sách &amp; Pháp Lý
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              <li>
                <Link
                  href="/chinh-sach-bao-mat"
                  className="group flex items-center gap-1.5 text-slate-400 hover:text-white transition-all duration-200 hover:translate-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-fpt-orange transition-colors" />
                  <span>Chính Sách Bảo Mật Dữ Liệu Cá Nhân</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dieu-khoan"
                  className="group flex items-center gap-1.5 text-slate-400 hover:text-white transition-all duration-200 hover:translate-x-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-fpt-orange transition-colors" />
                  <span>Điều Khoản Sử Dụng Dịch Vụ</span>
                </Link>
              </li>
            </ul>

            {/* Decree 13 Dark Card */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] sm:text-xs text-slate-400 leading-relaxed font-normal shadow-2xs">
              Tuân thủ Nghị định 13/2023/NĐ-CP: Mọi thông tin khách hàng chỉ phục vụ liên hệ xác nhận nhu cầu lắp đặt và được bảo mật tuyệt đối.
            </div>

            {/* BCT Badge with Hover Scale Animation */}
            <div className="pt-1">
              <img
                src="/images/badges/bct-certificate.png"
                alt="Đã thông báo Bộ Công Thương"
                className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-300 opacity-85 hover:opacity-100 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-slate-900 text-xs text-slate-500 space-y-3">
          <p className="leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
            <strong className="text-slate-300 font-semibold">Tuyên bố miễn trừ trách nhiệm: </strong>
            {siteConfig.disclaimer.officialDisclaimer} Bảng giá, chương trình khuyến mãi thực tế có thể thay đổi tùy theo khu vực địa lý cụ thể và chính sách kinh doanh từng thời điểm của FPT Telecom. Quý khách vui lòng liên hệ trực tiếp hotline để được báo giá chính xác nhất tại địa chỉ lắp đặt.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 text-slate-500 text-[11px]">
            <p suppressHydrationWarning>© {new Date().getFullYear()} {siteConfig.brand.name}. Mọi quyền được bảo lưu.</p>
            <p className="text-slate-500">Hệ thống tối ưu tiếp nhận thông tin khách hàng dịch vụ FPT Telecom.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
