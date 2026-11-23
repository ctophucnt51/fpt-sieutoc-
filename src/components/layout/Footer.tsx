"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteConfig } from "@/context/ConfigContext";
import { Clock, MapPin, ChevronRight, Phone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();

  // Do not render website footer inside admin dashboard
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative z-20 w-full bg-white text-[#2F364A] pt-10 sm:pt-14 pb-28 md:pb-12 border-t border-[#E4E8ED] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 mb-8 sm:mb-10">
          
          {/* Col 1: Về Chúng Tôi & Cam Kết */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#F4F6FB] p-2 rounded-2xl border border-[#E4E8ED] shrink-0">
                <img
                  src="/images/logo-ftel.svg"
                  alt="FPT Telecom"
                  width={109}
                  height={36}
                  className="h-7 w-auto max-w-[110px] object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg text-[#20283D] tracking-tight block">
                  Lắp Mạng <span className="text-[#F37021]">FPT Siêu Tốc</span>
                </span>
                <span className="text-[11px] text-[#657384] font-medium">Hệ Thống Đăng Ký Trực Tuyến</span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-[#657384] leading-relaxed font-normal">
              Kênh tư vấn &amp; hỗ trợ tiếp nhận đăng ký trực tuyến các dịch vụ Internet cáp quang Wi-Fi 6, Truyền hình FPT Play, Thể thao Ngoại Hạng Anh và FPT Camera an ninh thông minh trên toàn quốc.
            </p>

            {/* Live Status Beacon (Long Châu style) */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Hỗ trợ tiếp nhận thông tin 24/7</span>
            </div>

            <div className="pt-1 flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <img
                src="/images/icons/liquid-glass/hop-dong.webp"
                alt="HĐ điện tử"
                width={16}
                height={16}
                className="w-4 h-4 object-contain shrink-0"
              />
              <span>Khảo sát 0đ • Ký HĐ điện tử • Lắp đặt trong 24h</span>
            </div>
          </div>

          {/* Col 2: Dịch Vụ Tư Vấn */}
          <div>
            <h3 className="text-[#20283D] font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#F37021] rounded-full"></span>
              Dịch Vụ Tư Vấn
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              <li>
                <Link
                  href="/lap-mang-fpt"
                  className="group flex items-center gap-1.5 text-[#657384] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#C1C8D1] group-hover:text-[#F37021] transition-colors" />
                  <span>Lắp Internet Cáp Quang Wi-Fi 6</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/wifi-6"
                  className="group flex items-center gap-1.5 text-[#657384] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#C1C8D1] group-hover:text-[#F37021] transition-colors" />
                  <span>Modem Wi-Fi 6 Băng Tần Kép</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/combo-ngoai-hang-anh"
                  className="group flex items-center gap-1.5 text-[#657384] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#C1C8D1] group-hover:text-[#F37021] transition-colors" />
                  <span>Combo Internet + Ngoại Hạng Anh (EPL)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/truyen-hinh-fpt"
                  className="group flex items-center gap-1.5 text-[#657384] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#C1C8D1] group-hover:text-[#F37021] transition-colors" />
                  <span>Combo Truyền Hình FPT Play</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="group flex items-center gap-1.5 text-[#657384] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#C1C8D1] group-hover:text-[#F37021] transition-colors" />
                  <span>Tin Tức &amp; Khuyến Mãi Mới Nhất</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Kênh Tư Vấn 24/7 (Long Châu Style Hotline Cards) */}
          <div>
            <h3 className="text-[#20283D] font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#F37021] rounded-full"></span>
              Kênh Tư Vấn 24/7
            </h3>
            <ul className="space-y-3 text-xs sm:text-[13px]">
              {/* Phone Card */}
              <li>
                <div className="p-3 rounded-2xl bg-[#F4F6FB] border border-[#E4E8ED] hover:border-orange-300 transition-all">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF4ED] border border-orange-200/70 p-1 flex items-center justify-center shrink-0">
                      <img
                        src="/images/icons/liquid-glass/hotline.webp"
                        alt="Hotline"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] object-contain"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#657384] font-medium">Hotline Bán Hàng &amp; Tư Vấn:</span>
                      <a
                        href={siteConfig.contact.hotlineTel}
                        className="text-[#20283D] font-bold hover:text-[#F37021] text-sm sm:text-base tracking-tight transition-colors inline-block"
                      >
                        {siteConfig.contact.hotlineDisplay}
                      </a>
                    </div>
                  </div>
                </div>
              </li>

              {/* Zalo Card */}
              <li>
                <div className="p-3 rounded-2xl bg-[#F4F6FB] border border-[#E4E8ED] hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/70 p-1 flex items-center justify-center shrink-0">
                      <img
                        src="/images/icons/liquid-glass/chat-zalo.webp"
                        alt="Zalo"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] object-contain"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#657384] font-medium">Tư Vấn Zalo Nhanh:</span>
                      <a
                        href={siteConfig.contact.zaloUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-bold transition-colors inline-block text-xs sm:text-sm"
                      >
                        Chat Zalo {siteConfig.contact.hotlineDisplay}
                      </a>
                    </div>
                  </div>
                </div>
              </li>

              {/* Working Hours */}
              <li className="flex items-start gap-2 text-[#657384] text-xs px-1">
                <Clock className="w-4 h-4 text-[#C1C8D1] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[#657384] font-medium">Giờ phục vụ: </span>
                  <span className="text-[#20283D] font-semibold">{siteConfig.contact.workingHours}</span>
                </div>
              </li>

              {/* Coverage */}
              <li className="flex items-start gap-2 text-[#657384] text-xs px-1">
                <MapPin className="w-4 h-4 text-[#C1C8D1] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[#657384] font-medium">Khu vực: </span>
                  <span className="text-[#20283D] font-semibold">Toàn quốc &amp; 63 tỉnh thành</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Pháp Lý & Chứng Nhận */}
          <div className="space-y-3.5">
            <h3 className="text-[#20283D] font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#F37021] rounded-full"></span>
              Chính Sách &amp; Pháp Lý
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              <li>
                <Link
                  href="/chinh-sach-bao-mat"
                  className="group flex items-center gap-1.5 text-[#657384] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#C1C8D1] group-hover:text-[#F37021] transition-colors" />
                  <span>Chính Sách Bảo Mật Dữ Liệu Cá Nhân</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dieu-khoan"
                  className="group flex items-center gap-1.5 text-[#657384] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#C1C8D1] group-hover:text-[#F37021] transition-colors" />
                  <span>Điều Khoản Sử Dụng Dịch Vụ</span>
                </Link>
              </li>
            </ul>

            {/* Decree 13 Card */}
            <div className="p-3 rounded-2xl bg-[#F4F6FB] border border-[#E4E8ED] text-[11px] sm:text-xs text-[#657384] leading-relaxed font-normal">
              Tuân thủ Nghị định 13/2023/NĐ-CP: Mọi thông tin khách hàng chỉ phục vụ liên hệ xác nhận nhu cầu lắp đặt và được bảo mật tuyệt đối.
            </div>

            {/* BCT Badge */}
            <div className="pt-1">
              <img
                src="/images/badges/bct-certificate.png"
                alt="Đã thông báo Bộ Công Thương"
                className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-300 opacity-90 hover:opacity-100 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-[#E4E8ED] text-xs text-[#657384] space-y-3">
          <p className="leading-relaxed bg-[#F4F6FB] p-3.5 rounded-2xl border border-[#E4E8ED] text-[#657384]">
            <strong className="text-[#20283D] font-semibold">Tuyên bố miễn trừ trách nhiệm: </strong>
            {siteConfig.disclaimer.officialDisclaimer} Bảng giá, chương trình khuyến mãi thực tế có thể thay đổi tùy theo khu vực địa lý cụ thể và chính sách kinh doanh từng thời điểm của FPT Telecom. Quý khách vui lòng liên hệ trực tiếp hotline để được báo giá chính xác nhất tại địa chỉ lắp đặt.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 text-[#657384] text-[11px]">
            <p suppressHydrationWarning>© {new Date().getFullYear()} {siteConfig.brand.name}. Mọi quyền được bảo lưu.</p>
            <p>Hệ thống tối ưu tiếp nhận thông tin khách hàng dịch vụ FPT Telecom.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
