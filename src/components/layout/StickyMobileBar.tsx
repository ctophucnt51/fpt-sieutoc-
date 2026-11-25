"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLeadModal } from "@/context/LeadModalContext";
import { useSiteConfig } from "@/context/ConfigContext";
import { fbTracker } from "@/components/tracking/MetaPixel";
import { googleTracker } from "@/components/tracking/GoogleAds";
import { Home, Tag, Send, MessageCircle, PhoneCall } from "lucide-react";

export default function StickyMobileBar() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();
  const { openLeadModal } = useLeadModal();

  // Không hiển thị thanh menu mobile trên trang quản trị
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHomeActive = pathname === "/";
  const isPricingActive =
    pathname === "/bang-gia" ||
    pathname === "/lap-mang-fpt" ||
    pathname === "/wifi-6" ||
    pathname === "/combo-ngoai-hang-anh" ||
    pathname === "/truyen-hinh-fpt" ||
    pathname === "/camera-fpt";

  const handleOpenRegister = () => {
    fbTracker.contact("form", "Mobile Bottom Bar - Dang Ky");
    openLeadModal("Combo GIGA");
  };

  const handleContactClick = () => {
    fbTracker.contact("hotline", "Mobile Bottom Bar - Hotline");
    googleTracker.callConversion("hotline", "Mobile Bottom Bar - Hotline");
  };

  const handleZaloClick = () => {
    fbTracker.contact("zalo", "Mobile Bottom Bar - Zalo");
    googleTracker.callConversion("zalo", "Mobile Bottom Bar - Zalo");
  };

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-lg mx-auto px-2 h-[64px] grid grid-cols-5 items-center gap-1">
        {/* 1. Trang chủ */}
        <Link
          href="/"
          className={`relative flex flex-col items-center justify-center h-full rounded-xl transition-colors select-none ${
            isHomeActive
              ? "text-[#B84300] font-extrabold"
              : "text-slate-600 hover:text-slate-900 font-semibold"
          }`}
        >
          {isHomeActive && (
            <span className="absolute top-0 w-6 h-0.5 rounded-full bg-[#B84300]" />
          )}
          <Home className={`w-5 h-5 ${isHomeActive ? "stroke-[2.4]" : "stroke-[1.9]"}`} />
          <span className="text-[10px] leading-tight mt-1 whitespace-nowrap">Trang chủ</span>
        </Link>

        {/* 2. Bảng giá */}
        <Link
          href="/bang-gia"
          className={`relative flex flex-col items-center justify-center h-full rounded-xl transition-colors select-none ${
            isPricingActive
              ? "text-[#B84300] font-extrabold"
              : "text-slate-600 hover:text-slate-900 font-semibold"
          }`}
        >
          {isPricingActive && (
            <span className="absolute top-0 w-6 h-0.5 rounded-full bg-[#B84300]" />
          )}
          <Tag className={`w-5 h-5 ${isPricingActive ? "stroke-[2.4]" : "stroke-[1.9]"}`} />
          <span className="text-[10px] leading-tight mt-1 whitespace-nowrap">Bảng giá</span>
        </Link>

        {/* 3. Đăng ký (Nút CTA nổi bật ở trung tâm) */}
        <div className="flex items-center justify-center px-0.5">
          <button
            type="button"
            onClick={handleOpenRegister}
            className="w-full py-2 px-2 rounded-2xl bg-gradient-to-r from-[#C84A00] to-[#B84300] hover:from-[#B43E00] hover:to-[#9A3412] text-white shadow-[0_4px_14px_rgba(184,67,0,0.3)] active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer select-none"
          >
            <Send className="w-4 h-4 stroke-[2.3]" />
            <span className="text-[10px] font-black leading-tight mt-0.5 whitespace-nowrap">
              Đăng ký
            </span>
          </button>
        </div>

        {/* 4. Chat Zalo */}
        <a
          href={siteConfig.contact.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleZaloClick}
          className="flex flex-col items-center justify-center h-full rounded-xl text-[#0068FF] hover:bg-blue-50/70 active:scale-95 transition-all select-none font-bold"
        >
          <MessageCircle className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] leading-tight mt-1 whitespace-nowrap">Chat Zalo</span>
        </a>

        {/* 5. Gọi Hotline */}
        <a
          href={siteConfig.contact.hotlineTel}
          onClick={handleContactClick}
          className="flex flex-col items-center justify-center h-full rounded-xl text-emerald-700 hover:bg-emerald-50/70 active:scale-95 transition-all select-none font-bold"
        >
          <PhoneCall className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] leading-tight mt-1 whitespace-nowrap">Gọi ngay</span>
        </a>
      </div>
    </nav>
  );
}
