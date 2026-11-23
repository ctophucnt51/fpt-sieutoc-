"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSiteConfig } from "@/context/ConfigContext";
import { useLeadModal } from "@/context/LeadModalContext";
import { fbTracker } from "@/components/tracking/MetaPixel";
import { Menu, X, Phone, ChevronRight, ArrowRight, ShieldCheck, Zap } from "lucide-react";

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

  // Do not render website header inside admin dashboard
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleHotlineClick = (source: string) => {
    fbTracker.contact("hotline", `Header Call - ${source}`);
  };

  const handleOpenPromoModal = () => {
    fbTracker.contact("form", "Top Promo Bar - Click");
    openLeadModal("Combo GIGA");
  };

  const navLinks = [
    {
      href: "/combo-ngoai-hang-anh",
      label: "Combo Ngoại Hạng Anh",
      badge: "220K",
      badgeColor: "bg-red-600 text-white",
    },
    {
      href: "/lap-mang-fpt",
      label: "Internet Wi-Fi 6",
      badge: null,
      badgeColor: "",
    },
    {
      href: "/truyen-hinh-fpt",
      label: "Truyền Hình FPT",
      badge: null,
      badgeColor: "",
    },
    {
      href: "/#bang-gia",
      label: "Bảng Giá Cước",
      badge: null,
      badgeColor: "",
    },
    {
      href: "/tin-tuc",
      label: "Tin Tức & Khuyến Mãi",
      badge: null,
      badgeColor: "",
    },
  ];

  return (
    <header className="sticky-header sticky top-0 z-50 w-full transition-all">
      {/* TẦNG 1: TOP PROMO BAR (Phong cách Long Châu: Tải app / Tư vấn ngay) */}
      <div className="bg-[#FFF4ED] border-b border-orange-200/60 text-slate-800 text-[11px] sm:text-xs py-1 px-3 sm:px-6">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-2 min-h-[26px]">
          {/* Desktop Left: Announcement */}
          <div className="hidden md:flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F37021] text-white text-[9px] font-extrabold tracking-wide uppercase shrink-0">
              <img
                src="/images/icons/liquid-glass/qua-tang.webp"
                alt="Ưu Đãi"
                width={12}
                height={12}
                className="w-3 h-3 object-contain shrink-0"
              />
              {siteConfig.promo?.topBarBadge || "Ưu Đãi"}
            </span>
            <p className="text-[11.5px] text-[#2F364A] truncate font-medium">
              <strong className="text-[#20283D] font-bold">
                {siteConfig.promo?.topBarAnnouncement || "Miễn phí Modem Wi-Fi 6 & Camera FPT khi đăng ký online tại đây"}
              </strong>
            </p>
          </div>

          {/* Mobile Announcement */}
          <div
            onClick={handleOpenPromoModal}
            className="md:hidden flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden cursor-pointer"
          >
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#F37021] text-white text-[8.5px] font-extrabold uppercase shrink-0">
              <img
                src="/images/icons/liquid-glass/qua-tang.webp"
                alt="Ưu Đãi"
                width={11}
                height={11}
                loading="eager"
                decoding="async"
                className="w-2.5 h-2.5 object-contain shrink-0"
              />
              {siteConfig.promo?.topBarBadge || "Ưu Đãi"}
            </span>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <span className="text-[11px] font-bold text-[#20283D] tracking-tight truncate block">
                {siteConfig.promo?.topBarAnnouncement || "Miễn phí Modem Wi-Fi 6 & Camera FPT khi đăng ký online"}
              </span>
            </div>
          </div>

          {/* Right: Quick Action Link & Hotline */}
          <div className="flex items-center gap-2.5 shrink-0 text-[11px]">
            <button
              onClick={handleOpenPromoModal}
              className="hidden sm:inline-flex items-center gap-1 text-[#F37021] hover:text-[#E05D10] font-bold hover:underline cursor-pointer"
            >
              <span>Nhận ưu đãi ngay</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <a
              href={siteConfig.contact.hotlineTel}
              onClick={() => handleHotlineClick("Top Bar Hotline")}
              className="font-bold text-[#20283D] hover:text-[#F37021] transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#F37021] fill-current" />
              <span>Tư vấn ngay: {siteConfig.contact.hotlineDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* TẦNG 2: MAIN NAVBAR (Phong cách Long Châu: Nền trắng, Logo FPT, Hotline & Nút CTA Bo Tròn) */}
      <div className="bg-white border-b border-[#E4E8ED] shadow-[0px_2px_8px_-2px_rgba(243,112,33,0.06)]">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-[70px] flex items-center justify-between gap-3">
          
          {/* Left: Logo FPT & Slogan Thành viên FPT */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <img
              src="/images/logo-ftel.svg"
              alt="FPT Telecom"
              width={109}
              height={36}
              loading="eager"
              decoding="async"
              className="h-6 sm:h-8 w-auto object-contain transition-transform group-hover:scale-102"
            />
            <div className="h-5 w-px bg-[#E4E8ED] hidden sm:block mx-0.5" />
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-[14px] sm:text-base text-[#20283D] tracking-tight whitespace-nowrap group-hover:text-[#F37021] transition-colors leading-tight">
                Lắp Mạng FPT
              </span>
              <span className="text-[10px] text-[#657384] font-medium leading-none">
                Chính Hãng Toàn Quốc
              </span>
            </div>
          </Link>

          {/* Center (Desktop): Quick Trust Badges (Phong cách Dược phẩm/Công nghệ của Long Châu) */}
          <div className="hidden xl:flex items-center gap-4 text-xs text-[#2F364A] font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F6FB] border border-[#E4E8ED]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Khảo sát tận nơi 0đ</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F6FB] border border-[#E4E8ED]">
              <Zap className="w-4 h-4 text-[#F37021] shrink-0" />
              <span>Lắp đặt trong 24 giờ</span>
            </div>
          </div>

          {/* Right: Hotline Pill & CTA Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Hotline Pill */}
            <a
              href={siteConfig.contact.hotlineTel}
              onClick={() => handleHotlineClick("Header Hotline Pill")}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F6FB] hover:bg-[#FFF4ED] border border-[#E4E8ED] hover:border-orange-300 text-[#20283D] transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-xs">
                <Phone className="w-3.5 h-3.5 text-[#F37021] fill-current" />
              </div>
              <div className="text-left">
                <span className="block text-[9.5px] text-[#657384] font-medium leading-none">Tổng đài 24/7</span>
                <span className="text-xs font-black text-[#F37021] leading-tight">{siteConfig.contact.hotlineDisplay}</span>
              </div>
            </a>

            {/* CTA Button: Long Châu Pill Style with FPT Orange */}
            <button
              type="button"
              onClick={() => {
                handleHotlineClick("Header CTA Button");
                openLeadModal("Combo GIGA");
              }}
              className="hidden sm:inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#F37021] hover:bg-[#E05D10] text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_rgba(243,112,33,0.35)] hover:shadow-[0_6px_20px_rgba(243,112,33,0.45)] active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Đăng Ký Tư Vấn</span>
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMobileMenuOpen((prev) => !prev);
              }}
              className={`lg:hidden w-10 h-10 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer relative z-[10000] touch-manipulation ${
                mobileMenuOpen
                  ? "bg-[#FFF4ED] border-orange-300 text-[#F37021]"
                  : "bg-white border-[#E4E8ED] text-[#20283D]"
              }`}
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu điều hướng"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#F37021]" />
              ) : (
                <Menu className="w-5 h-5 text-[#20283D]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* TẦNG 3: CATEGORY NAVIGATION BAR (Desktop Only - Phong cách Long Châu Menu Ngang) */}
      <div className="hidden lg:block bg-white border-b border-[#E4E8ED]">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 h-11">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" &&
                  link.href !== "/#bang-gia" &&
                  pathname?.startsWith(link.href.split("#")[0]));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13.5px] font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "text-[#F37021] bg-[#FFF4ED]"
                      : "text-[#2F364A] hover:text-[#F37021] hover:bg-[#F4F6FB]"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-red-600 text-white tracking-tight shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN (Phong cách Long Châu: Nền trắng sạch, viền xám mềm) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9990] pointer-events-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Floating Dropdown Card */}
          <div className="fixed top-[74px] sm:top-[80px] right-3 w-[280px] z-[9995] pointer-events-auto">
            <div className="bg-white rounded-2xl border border-[#E4E8ED] shadow-[0_16px_40px_rgba(243,112,33,0.14)] p-3 transition-all duration-200">
              <nav className="divide-y divide-[#F4F6FB]">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#FFF4ED] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13.5px] font-bold text-[#20283D] group-hover:text-[#F37021] transition-colors">
                        {link.label}
                      </span>
                      {link.badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-red-600 text-white">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C1C8D1] group-hover:text-[#F37021] transition-colors" />
                  </Link>
                ))}
              </nav>

              <div className="mt-3 pt-3 border-t border-[#F4F6FB] space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLeadModal("Combo GIGA");
                  }}
                  className="w-full py-2.5 rounded-full bg-[#F37021] hover:bg-[#E05D10] text-white font-extrabold text-xs shadow-[0_4px_12px_rgba(243,112,33,0.3)] transition-all cursor-pointer"
                >
                  Đăng Ký Tư Vấn Miễn Phí
                </button>
                <a
                  href={siteConfig.contact.hotlineTel}
                  onClick={() => handleHotlineClick("Mobile Menu Hotline")}
                  className="flex items-center justify-center gap-2 py-2 rounded-full border border-[#E4E8ED] text-[#20283D] font-bold text-xs hover:border-orange-300 hover:text-[#F37021] transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F37021] fill-current" />
                  <span>Hotline: {siteConfig.contact.hotlineDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
