"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLeadModal } from "@/context/LeadModalContext";
import { useSiteConfig } from "@/context/ConfigContext";
import { fbTracker } from "@/components/tracking/MetaPixel";
import { Home, Wifi, FileText, Trophy, Phone } from "lucide-react";

export default function StickyMobileBar() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();
  const { openLeadModal } = useLeadModal();

  // Không hiển thị thanh menu mobile trên trang quản trị
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Danh mục menu đồng đều theo Floating Glass Navigation:
  // 1. Trang chủ (/)
  // 2. Internet (/lap-mang-fpt)
  // 3. Đăng ký (mở modal đăng ký)
  // 4. Ngoại hạng Anh (/combo-ngoai-hang-anh)
  // 5. Liên hệ (hotline/zalo)
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
      className="fixed bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 max-w-lg mx-auto z-50 md:hidden pb-safe-nav pointer-events-auto"
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.82)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
        className="border border-white/90 shadow-[0_8px_32px_rgba(15,23,42,0.12),0_2px_8px_rgba(0,0,0,0.04)] rounded-full px-1.5 py-1 flex items-center justify-around h-[64px] transition-all"
      >
        {/* 1. Trang chủ */}
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center h-full rounded-full transition-colors duration-200 select-none ${
            isHomeActive
              ? "text-fpt-orange bg-orange-50/60 font-bold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Home className="w-5 h-5 shrink-0 transition-colors" strokeWidth={isHomeActive ? 2.4 : 1.9} />
          <span className="text-[11px] leading-tight mt-1 truncate">Trang chủ</span>
        </Link>

        {/* 2. Internet */}
        <Link
          href="/lap-mang-fpt"
          className={`flex-1 flex flex-col items-center justify-center h-full rounded-full transition-colors duration-200 select-none ${
            isInternetActive
              ? "text-fpt-orange bg-orange-50/60 font-bold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Wifi className="w-5 h-5 shrink-0 transition-colors" strokeWidth={isInternetActive ? 2.4 : 1.9} />
          <span className="text-[11px] leading-tight mt-1 truncate">Internet</span>
        </Link>

        {/* 3. Đăng ký */}
        <button
          type="button"
          onClick={handleOpenRegister}
          className="flex-1 flex flex-col items-center justify-center h-full rounded-full transition-colors duration-200 cursor-pointer select-none text-slate-500 hover:text-fpt-orange active:text-fpt-orange font-medium"
        >
          <FileText className="w-5 h-5 shrink-0 transition-colors" strokeWidth={1.9} />
          <span className="text-[11px] leading-tight mt-1 truncate">Đăng ký</span>
        </button>

        {/* 4. Ngoại hạng Anh */}
        <Link
          href="/combo-ngoai-hang-anh"
          className={`flex-1 flex flex-col items-center justify-center h-full rounded-full transition-colors duration-200 select-none ${
            isEplActive
              ? "text-fpt-orange bg-orange-50/60 font-bold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Trophy className="w-5 h-5 shrink-0 transition-colors" strokeWidth={isEplActive ? 2.4 : 1.9} />
          <span className="text-[11px] leading-tight mt-1 truncate">Ngoại hạng Anh</span>
        </Link>

        {/* 5. Liên hệ */}
        <a
          href={siteConfig.contact.hotlineTel}
          onClick={handleContactClick}
          className="flex-1 flex flex-col items-center justify-center h-full rounded-full transition-colors duration-200 cursor-pointer select-none text-slate-500 hover:text-fpt-orange active:text-fpt-orange font-medium"
        >
          <Phone className="w-5 h-5 shrink-0 transition-colors" strokeWidth={1.9} />
          <span className="text-[11px] leading-tight mt-1 truncate">Liên hệ</span>
        </a>
      </div>
    </nav>
  );
}
