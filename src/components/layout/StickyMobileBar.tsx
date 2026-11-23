"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLeadModal } from "@/context/LeadModalContext";
import { useSiteConfig } from "@/context/ConfigContext";
import { fbTracker } from "@/components/tracking/MetaPixel";

export default function StickyMobileBar() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();
  const { openLeadModal } = useLeadModal();

  // Không hiển thị thanh menu mobile trên trang quản trị
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHomeActive = pathname === "/";
  const isInternetActive = pathname === "/lap-mang-fpt" || pathname === "/wifi-6";
  const isEplActive = pathname === "/combo-ngoai-hang-anh" || pathname === "/truyen-hinh-fpt";

  const handleOpenRegister = () => {
    fbTracker.contact("form", "Floating Mobile Nav - Dang Ky");
    openLeadModal("Combo GIGA");
  };

  const handleContactClick = () => {
    fbTracker.contact("hotline", "Floating Mobile Nav - Lien He");
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-50 md:hidden pb-safe-nav pointer-events-auto"
    >
      <div
        className="bg-white/95 backdrop-blur-md border border-[#E4E8ED] shadow-[0_8px_30px_rgba(243,112,33,0.15)] rounded-full px-1.5 py-1 flex items-center justify-around h-[62px] transition-all"
      >
        {/* 1. Trang chủ */}
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center h-full rounded-full transition-colors duration-200 select-none ${
            isHomeActive
              ? "text-[#F37021] bg-[#FFF4ED] font-bold"
              : "text-[#657384] hover:text-[#20283D] font-medium"
          }`}
        >
          <img
            src="/images/icons/liquid-glass/trang-chu.webp"
            alt="Trang chủ"
            width={22}
            height={22}
            loading="eager"
            decoding="async"
            className="w-[22px] h-[22px] object-contain shrink-0"
          />
          <span className="text-[10.5px] leading-tight mt-0.5 truncate">Trang chủ</span>
        </Link>

        {/* 2. Internet */}
        <Link
          href="/lap-mang-fpt"
          className={`flex-1 flex flex-col items-center justify-center h-full rounded-full transition-colors duration-200 select-none ${
            isInternetActive
              ? "text-[#F37021] bg-[#FFF4ED] font-bold"
              : "text-[#657384] hover:text-[#20283D] font-medium"
          }`}
        >
          <img
            src="/images/icons/liquid-glass/wifi-6.webp"
            alt="Internet"
            width={22}
            height={22}
            loading="eager"
            decoding="async"
            className="w-[22px] h-[22px] object-contain shrink-0"
          />
          <span className="text-[10.5px] leading-tight mt-0.5 truncate">Internet</span>
        </Link>

        {/* 3. Đăng ký - Nút Nổi Bật Chính Giữa Phong Cách FPT Orange */}
        <button
          type="button"
          onClick={handleOpenRegister}
          className="flex-1 flex flex-col items-center justify-center -mt-3.5 transition-transform active:scale-95 cursor-pointer select-none"
        >
          <div className="w-12 h-12 rounded-full bg-[#F37021] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(243,112,33,0.45)] border-2 border-white">
            <img
              src="/images/icons/liquid-glass/gui-dang-ky.webp"
              alt="Đăng ký"
              width={24}
              height={24}
              loading="eager"
              decoding="async"
              className="w-6 h-6 object-contain brightness-0 invert"
            />
          </div>
          <span className="text-[10px] font-bold text-[#F37021] leading-tight mt-0.5 truncate">Đăng ký 0đ</span>
        </button>

        {/* 4. Ngoại hạng Anh */}
        <Link
          href="/combo-ngoai-hang-anh"
          className={`flex-1 flex flex-col items-center justify-center h-full rounded-full transition-colors duration-200 select-none ${
            isEplActive
              ? "text-[#F37021] bg-[#FFF4ED] font-bold"
              : "text-[#657384] hover:text-[#20283D] font-medium"
          }`}
        >
          <img
            src="/images/icons/liquid-glass/ngoai-hang-anh.webp"
            alt="Ngoại hạng Anh"
            width={22}
            height={22}
            loading="eager"
            decoding="async"
            className="w-[22px] h-[22px] object-contain shrink-0"
          />
          <span className="text-[10.5px] leading-tight mt-0.5 truncate">Ngoại Hạng</span>
        </Link>

        {/* 5. Liên hệ */}
        <a
          href={siteConfig.contact.hotlineTel}
          onClick={handleContactClick}
          className="flex-1 flex flex-col items-center justify-center h-full rounded-full transition-colors duration-200 cursor-pointer select-none text-[#657384] hover:text-[#F37021] active:text-[#F37021] font-medium"
        >
          <img
            src="/images/icons/liquid-glass/hotline.webp"
            alt="Hotline"
            width={22}
            height={22}
            loading="eager"
            decoding="async"
            className="w-[22px] h-[22px] object-contain shrink-0"
          />
          <span className="text-[10.5px] leading-tight mt-0.5 truncate">Liên hệ</span>
        </a>
      </div>
    </nav>
  );
}
