"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteConfig } from "@/context/ConfigContext";
import { Clock, MapPin, ChevronRight, Phone, Mail, ShieldCheck } from "lucide-react";

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
                  loading="lazy"
                  decoding="async"
                  className="h-7 w-auto max-w-[110px] object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg text-[#0F172A] tracking-tight block">
                  Lắp Mạng <span className="text-[#C44D06]">FPT Siêu Tốc</span>
                </span>
                <span className="text-[11px] text-[#C44D06] font-bold block mt-0.5">
                  {siteConfig.contact.partnerRole || "Kênh Đại Lý Tiếp Nhận Dịch Vụ FPT Telecom"}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed font-normal">
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
                src="/images/icons/svg/hop-dong.svg"
                alt="HĐ điện tử"
                width={16}
                height={16}
                loading="lazy"
                decoding="async"
                className="w-4 h-4 object-contain shrink-0"
              />
              <span>Khảo sát 0đ • Ký HĐ điện tử • Lắp đặt trong 24h</span>
            </div>
          </div>

          {/* Col 2: Dịch Vụ Tư Vấn */}
          <div>
            <h3 className="text-[#0F172A] font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#F37021] rounded-full"></span>
              Dịch Vụ Tư Vấn
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              <li>
                <Link
                  href="/lap-mang-fpt"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Lắp Internet Cáp Quang Wi-Fi 6</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/wifi-6"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Modem Wi-Fi 6 Băng Tần Kép</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/combo-ngoai-hang-anh"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Combo Internet + Ngoại Hạng Anh (EPL)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/truyen-hinh-fpt"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Combo Truyền Hình FPT Play</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/camera-fpt"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Camera FPT AI An Ninh</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/bang-gia"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Bảng Giá Cước Mới Nhất</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/khuyen-mai"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Ưu Đãi &amp; Khuyến Mãi</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/quy-trinh-lap-dat"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Quy Trình Lắp Đặt 24H</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/hoi-dap"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Câu Hỏi Thường Gặp</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Tin Tức &amp; Khuyến Mãi Mới Nhất</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Kênh Tư Vấn 24/7 (Long Châu Style Hotline Cards) */}
          <div>
            <h3 className="text-[#0F172A] font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
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
                        src="/images/icons/svg/hotline.svg"
                        alt="Hotline"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] object-contain"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#475569] font-medium">Hotline Bán Hàng &amp; Tư Vấn:</span>
                      <a
                        href={siteConfig.contact.hotlineTel}
                        className="text-[#0F172A] font-bold hover:text-[#F37021] text-sm sm:text-base tracking-tight transition-colors inline-block"
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
                        src="/images/icons/svg/chat-zalo.svg"
                        alt="Zalo"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] object-contain"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#475569] font-medium">Tư Vấn Zalo Nhanh:</span>
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

              {/* Physical Address */}
              <li className="flex items-start gap-2 text-[#475569] text-xs px-1">
                <MapPin className="w-4 h-4 text-[#94A3B8] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[#475569] font-medium">Điểm tiếp nhận: </span>
                  <span className="text-[#0F172A] font-semibold">{siteConfig.contact.address || "Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ"}</span>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-2 text-[#475569] text-xs px-1">
                <Mail className="w-4 h-4 text-[#94A3B8] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[#475569] font-medium">Email hỗ trợ: </span>
                  <a
                    href="mailto:PhucNT51@fpt.com"
                    className="text-[#0F172A] hover:text-[#C44D06] font-semibold transition-colors"
                  >
                    PhucNT51@fpt.com
                  </a>
                </div>
              </li>

              {/* Working Hours */}
              <li className="flex items-start gap-2 text-[#475569] text-xs px-1">
                <Clock className="w-4 h-4 text-[#94A3B8] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[#475569] font-medium">Giờ phục vụ: </span>
                  <span className="text-[#0F172A] font-semibold">{siteConfig.contact.workingHours}</span>
                </div>
              </li>

              {/* Coverage */}
              <li className="flex items-start gap-2 text-[#475569] text-xs px-1">
                <ShieldCheck className="w-4 h-4 text-[#94A3B8] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[#475569] font-medium">Phạm vi hỗ trợ: </span>
                  <span className="text-[#0F172A] font-semibold">Cần Thơ, Miền Tây &amp; Toàn quốc</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Pháp Lý & Chứng Nhận */}
          <div className="space-y-3.5">
            <h3 className="text-[#0F172A] font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#F37021] rounded-full"></span>
              Chính Sách &amp; Pháp Lý
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              <li>
                <Link
                  href="/chinh-sach-bao-mat"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Chính Sách Bảo Mật Dữ Liệu Cá Nhân</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dieu-khoan"
                  className="group flex items-center gap-1.5 text-[#475569] hover:text-[#F37021] transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F37021] transition-colors" />
                  <span>Điều Khoản Sử Dụng Dịch Vụ</span>
                </Link>
              </li>
            </ul>

            {/* Decree 13 Card */}
            <div className="p-3 rounded-2xl bg-[#F4F6FB] border border-[#E4E8ED] text-[11px] sm:text-xs text-[#475569] leading-relaxed font-medium">
              Tuân thủ Nghị định 13/2023/NĐ-CP: Mọi thông tin khách hàng chỉ phục vụ liên hệ xác nhận nhu cầu lắp đặt và được bảo mật nghiêm ngặt.
            </div>

            {/* Verified Partner Badge (Tuân thủ chuẩn Google Ads, không giả mạo chứng nhận chính phủ) */}
            <div className="pt-1">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FFF4ED] border border-orange-200/80 text-[#C44D06]">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#C44D06]" />
                <div className="text-[11px] leading-tight text-[#0F172A]">
                  <span className="font-bold block">Kênh Đại Lý FPT Telecom</span>
                  <span className="text-[10px] text-[#475569] font-normal">Tư vấn chính sách khuyến mãi chính hãng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-[#E4E8ED] text-xs text-[#475569] space-y-3">
          <p className="leading-relaxed bg-[#F4F6FB] p-3.5 rounded-2xl border border-[#E4E8ED] text-[#475569]">
            <strong className="text-[#0F172A] font-semibold">Tuyên bố miễn trừ trách nhiệm: </strong>
            {siteConfig.disclaimer.officialDisclaimer} Bảng giá, chương trình khuyến mãi thực tế có thể thay đổi tùy theo khu vực địa lý cụ thể và chính sách kinh doanh từng thời điểm của FPT Telecom. Quý khách vui lòng liên hệ trực tiếp hotline để được báo giá chính xác nhất tại địa chỉ lắp đặt.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 pb-16 md:pb-0 text-[#475569] text-[11px]">
            <p suppressHydrationWarning>© {new Date().getFullYear()} {siteConfig.brand.name}. Mọi quyền được bảo lưu.</p>
            <p>Hệ thống tối ưu tiếp nhận thông tin khách hàng dịch vụ FPT Telecom.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
