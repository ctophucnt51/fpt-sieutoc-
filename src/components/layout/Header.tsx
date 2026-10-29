"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSiteConfig } from "@/context/ConfigContext";
import { useLeadModal } from "@/context/LeadModalContext";
import { fbTracker } from "@/components/tracking/MetaPixel";
import {
  Wifi6Vector,
  FptPlayTvVector,
  PricingChartVector,
  NewsArticleVector,
} from "@/components/vectors/CustomVectors";
import { Menu, X, Phone, Gift, Trophy, MessageSquare, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();
  const { openLeadModal } = useLeadModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Do not lock body overflow so mobile position does not jump or reset on scroll

  // Do not render website header inside admin dashboard
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleHotlineClick = (source: string) => {
    fbTracker.contact("hotline", `Header Call - ${source}`);
  };

  const handleZaloClick = (source: string) => {
    fbTracker.contact("zalo", `Header Zalo - ${source}`);
  };

  const handleOpenPromoModal = () => {
    fbTracker.contact("form", "Top Promo Bar - Click");
    openLeadModal("Combo GIGA");
  };

  return (
    <header className="sticky-header sticky top-0 z-50 w-full bg-white/95 backdrop-blur-2xl backdrop-saturate-150 border-b border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-all">
      {/* 1. TOP PROMOTION / ANNOUNCEMENT BAR - Thu nhỏ lại xíu trên giao diện web */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50/70 to-orange-50 border-b border-orange-200/70 text-slate-800 text-xs py-1 sm:py-1 px-3 sm:px-6 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-h-[26px]">
          {/* Desktop Announcement - Đồng bộ động từ Cài đặt hệ thống */}
          <div className="hidden md:flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-fpt-orange text-white text-[9px] font-extrabold tracking-wide uppercase shadow-2xs shrink-0">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              {siteConfig.promo?.topBarBadge || "Ưu Đãi"}
            </span>
            <p className="text-[11px] lg:text-[11.5px] text-slate-800 truncate font-medium">
              <strong className="text-slate-900 font-bold">
                {siteConfig.promo?.topBarAnnouncement || "Miễn phí Modem Wi-Fi 6 & Camera FPT khi đăng ký online tại đây"}
              </strong>
            </p>
          </div>

          {/* Mobile Announcement - Đồng bộ động từ Cài đặt hệ thống (bao gồm cả Badge) */}
          <div
            onClick={handleOpenPromoModal}
            className="md:hidden flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden cursor-pointer"
          >
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-fpt-orange text-white text-[8.5px] font-extrabold uppercase shrink-0">
              <Sparkles className="w-2 h-2 fill-current" />
              {siteConfig.promo?.topBarBadge || "Ưu Đãi"}
            </span>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <span className="text-[11px] font-bold text-slate-900 tracking-tight">
                {siteConfig.promo?.topBarAnnouncement || "Miễn phí Modem Wi-Fi 6 & Camera FPT khi đăng ký online tại đây"}
              </span>
            </div>
          </div>

          {/* Quick Action Link / Button */}
          <div className="flex items-center gap-2 shrink-0 text-[10.5px] sm:text-[11px]">
            <button
              onClick={handleOpenPromoModal}
              className="hidden sm:inline-flex items-center gap-1 text-fpt-orange hover:text-fpt-hover font-bold hover:underline cursor-pointer"
            >
              <span>Nhận ưu đãi ngay</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <a
              href={siteConfig.contact.hotlineTel}
              onClick={() => handleHotlineClick("Top Bar Hotline")}
              className="font-bold text-slate-900 hover:text-fpt-orange transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-fpt-orange fill-current" />
              <span>{siteConfig.contact.hotlineDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR - Chiều cao chuẩn cân đối, Logo to rõ ràng trên cả Mobile & PC */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-[66px] flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Logo FPT to rõ, sắc nét và cân đối trên cả 2 giao diện */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <img
            src="/images/logo-ftel.svg"
            alt="FPT Telecom"
            width={109}
            height={36}
            className="h-6 sm:h-7.5 lg:h-8.5 w-auto object-contain transition-transform group-hover:scale-102"
          />
          <div className="h-4.5 w-px bg-slate-300 hidden sm:block mx-1" />
          <span className="font-extrabold text-[13px] sm:text-base text-slate-900 tracking-tight whitespace-nowrap group-hover:text-fpt-orange transition-colors">
            Lắp Mạng FPT
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-fpt-orange border border-orange-200/80 hidden xl:inline-block">
            Chính Hãng
          </span>
        </Link>

        {/* Center: Desktop Navigation Links (Gọn gàng, tinh tế) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 font-medium text-xs xl:text-[13px] text-slate-700 shrink-0">
          {/* 1. Combo Ngoại Hạng Anh */}
          <Link
            href="/combo-ngoai-hang-anh"
            className={`transition-all whitespace-nowrap py-1.5 px-2.5 xl:px-3 rounded-xl flex items-center gap-1.5 ${
              pathname === "/combo-ngoai-hang-anh"
                ? "bg-red-50 text-red-600 font-bold border border-red-200 shadow-2xs"
                : "bg-red-50/60 text-red-600 hover:bg-red-50 border border-red-200/60 font-semibold"
            }`}
          >
            <span>Combo Ngoại Hạng Anh</span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-red-600 text-white shrink-0 tracking-tight shadow-2xs">
              220K
            </span>
          </Link>

          {/* 2. Internet Wi-Fi 6 */}
          <Link
            href="/lap-mang-fpt"
            className={`transition-all whitespace-nowrap py-1.5 px-2.5 xl:px-3 rounded-xl hover:bg-orange-50 hover:text-fpt-orange ${
              pathname === "/lap-mang-fpt"
                ? "bg-orange-50 text-fpt-orange font-bold border border-orange-200/80"
                : "text-slate-700"
            }`}
          >
            Internet Wi-Fi 6
          </Link>

          {/* 3. Truyền Hình */}
          <Link
            href="/truyen-hinh-fpt"
            className={`transition-all whitespace-nowrap py-1.5 px-2.5 xl:px-3 rounded-xl hover:bg-orange-50 hover:text-fpt-orange ${
              pathname === "/truyen-hinh-fpt"
                ? "bg-orange-50 text-fpt-orange font-bold border border-orange-200/80"
                : "text-slate-700"
            }`}
          >
            Truyền Hình FPT
          </Link>

          {/* 4. Bảng Giá */}
          <Link
            href="/#bang-gia"
            className="text-slate-700 hover:text-fpt-orange hover:bg-orange-50 transition-colors whitespace-nowrap py-1.5 px-2.5 xl:px-3 rounded-xl"
          >
            Bảng Giá
          </Link>

          {/* 5. Tin Tức */}
          <Link
            href="/tin-tuc"
            className={`transition-all whitespace-nowrap py-1.5 px-2.5 xl:px-3 rounded-xl hover:bg-orange-50 hover:text-fpt-orange ${
              pathname?.startsWith("/tin-tuc")
                ? "bg-orange-50 text-fpt-orange font-bold border border-orange-200/80"
                : "text-slate-700"
            }`}
          >
            Tin Tức
          </Link>
        </nav>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Desktop Hotline Pill */}
          <a
            href={siteConfig.contact.hotlineTel}
            onClick={() => handleHotlineClick("Header Hotline Pill")}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200/80 text-slate-800 text-xs font-semibold shadow-2xs transition-all whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-fpt-orange fill-current" />
            <span className="text-slate-500 font-normal">Hotline:</span>
            <span className="font-bold text-fpt-orange">{siteConfig.contact.hotlineDisplay}</span>
          </a>

          {/* Desktop CTA Button: Chuẩn padding, không bao giờ tràn chữ ra khỏi nút */}
          <button
            type="button"
            onClick={() => {
              handleHotlineClick("Header CTA Button");
              openLeadModal("Combo GIGA");
            }}
            className="hidden sm:inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-fpt-orange hover:bg-fpt-hover text-white font-bold text-xs shadow-[0_4px_16px_rgba(243,112,33,0.3)] hover:shadow-[0_6px_20px_rgba(243,112,33,0.4)] active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer min-w-max"
          >
            <span>Đăng Ký Tư Vấn</span>
          </button>

          {/* Mobile Hamburger Menu Toggle Button - Nổi trên overlay, bấm mở/đóng trực tiếp */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMobileMenuOpen((prev) => !prev);
            }}
            className={`lg:hidden w-10 h-10 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-sm relative z-[10000] touch-manipulation ${
              mobileMenuOpen
                ? "bg-orange-50 border-orange-300 text-fpt-orange ring-2 ring-orange-500/20"
                : "bg-white/95 active:bg-orange-50 border-slate-200 text-slate-800"
            }`}
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu điều hướng"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-fpt-orange" />
            ) : (
              <Menu className="w-5 h-5 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* 3. MOBILE MENU XỔ RA NGAY DƯỚI NÚT - KHÔNG CHE NÚT (WHITE GLASSMORPHISM) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9990] pointer-events-auto">
          {/* Backdrop Overlay mờ nhẹ, click vào đóng menu */}
          <div
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Floating Glass Container - Nằm cố định ngay dưới thanh Header, canh phải theo nút Menu */}
          <div className="fixed top-[88px] sm:top-[96px] right-3 left-3 sm:left-auto sm:w-[380px] z-[9995] pointer-events-auto">
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
              className="border border-white/95 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.18),0_4px_16px_rgba(0,0,0,0.06)] p-3.5 sm:p-4 max-h-[calc(100vh-160px)] overflow-y-auto space-y-3 origin-top-right transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-top-2"
            >
              {/* Tiêu đề menu kính tinh gọn */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100/90">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                  Danh Mục Dịch Vụ
                </span>
              </div>

              {/* 2 Nút liên hệ nhanh - Thiết kế kính tối giản */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={siteConfig.contact.hotlineTel}
                  onClick={() => {
                    handleHotlineClick("Mobile Drawer Call");
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/80 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600 fill-current shrink-0" />
                  <div className="leading-tight text-left">
                    <span className="block text-[9px] text-emerald-600 font-semibold uppercase">Hotline 24/7</span>
                    <span className="text-xs font-black">{siteConfig.contact.hotlineDisplay}</span>
                  </div>
                </a>

                <a
                  href={siteConfig.contact.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    handleZaloClick("Mobile Drawer Zalo");
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200/80 hover:bg-blue-100/80 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600 fill-current shrink-0" />
                  <div className="leading-tight text-left">
                    <span className="block text-[9px] text-blue-600 font-semibold uppercase">Chat Zalo</span>
                    <span className="text-xs font-black">Hỗ trợ 24/7</span>
                  </div>
                </a>
              </div>

              {/* Danh sách điều hướng - Card kính trắng bo tròn */}
              <div className="space-y-1.5 pt-1">
                {/* 1. Combo Ngoại Hạng Anh */}
                <Link
                  href="/combo-ngoai-hang-anh"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-white/70 hover:bg-orange-50/70 border border-slate-200/80 transition-all flex items-center justify-between min-h-[46px] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 border border-red-200/60 flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block group-hover:text-fpt-orange transition-colors truncate">
                        Combo Ngoại Hạng Anh
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">Bản quyền trọn vẹn Full HD</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      220K/th
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-fpt-orange transition-colors" />
                  </div>
                </Link>

                {/* 2. Lắp Mạng Internet Wi-Fi 6 */}
                <Link
                  href="/lap-mang-fpt"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-white/70 hover:bg-orange-50/70 border border-slate-200/80 transition-all flex items-center justify-between min-h-[46px] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-fpt-orange border border-orange-200/60 flex items-center justify-center shrink-0">
                      <Wifi6Vector size={16} className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block group-hover:text-fpt-orange transition-colors truncate">
                        Internet Cáp Quang Wi-Fi 6
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">Tốc độ cao đến 1 Gbps</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-fpt-orange">
                      195K/th
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-fpt-orange transition-colors" />
                  </div>
                </Link>

                {/* 3. Truyền Hình FPT Play */}
                <Link
                  href="/truyen-hinh-fpt"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-white/70 hover:bg-blue-50/70 border border-slate-200/80 transition-all flex items-center justify-between min-h-[46px] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center shrink-0">
                      <FptPlayTvVector size={16} className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block group-hover:text-blue-600 transition-colors truncate">
                        Truyền Hình FPT Play
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">Gần 170 kênh giải trí</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Smart TV
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>

                {/* 4. Bảng Giá Chi Tiết */}
                <Link
                  href="/#bang-gia"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-white/70 hover:bg-slate-50 border border-slate-200/80 transition-all flex items-center justify-between min-h-[46px] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 flex items-center justify-center shrink-0">
                      <PricingChartVector size={16} className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block group-hover:text-fpt-orange transition-colors truncate">
                        Bảng Giá Tất Cả Gói Cước
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">Minh bạch, ưu đãi mới nhất</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-fpt-orange transition-colors shrink-0" />
                </Link>

                {/* 5. Tin Tức & Khuyến Mãi */}
                <Link
                  href="/tin-tuc"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-white/70 hover:bg-slate-50 border border-slate-200/80 transition-all flex items-center justify-between min-h-[46px] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 flex items-center justify-center shrink-0">
                      <NewsArticleVector size={16} className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block group-hover:text-fpt-orange transition-colors truncate">
                        Tin Tức & Khuyến Mãi Mới
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">Cập nhật chính sách FPT</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-fpt-orange transition-colors shrink-0" />
                </Link>
              </div>

              {/* Nút Đăng ký tư vấn nhận Camera 0đ */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLeadModal("Combo GIGA");
                  }}
                  className="w-full py-3 px-4 rounded-full bg-fpt-orange hover:bg-fpt-hover text-white font-bold text-xs shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-white shrink-0" />
                  <span>Đăng Ký Tư Vấn & Nhận Camera 0đ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}