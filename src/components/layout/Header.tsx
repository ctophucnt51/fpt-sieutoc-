"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSiteConfig } from "@/context/ConfigContext";
import { useLeadModal } from "@/context/LeadModalContext";
import { fbTracker } from "@/components/tracking/MetaPixel";
import {
  Menu,
  X,
  Phone,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Search,
  Headset,
  MessageCircle,
  Flame,
  Wifi,
  Tv,
  Camera,
  FileText,
  Tag,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();
  const { openLeadModal } = useLeadModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("internet");

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

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

  const handleOpenPromoModal = (pkgName = "Combo GIGA") => {
    fbTracker.contact("form", "Header Promo - Click");
    openLeadModal(pkgName);
  };

  const toggleSection = (id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
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
      {/* TẦNG 1: TOP PROMO BAR (Chỉ hiển thị trên Desktop, Ẩn hoàn toàn trên Mobile theo yêu cầu) */}
      <div className="hidden lg:block bg-[#FFF4ED] border-b border-orange-200/60 text-slate-800 text-[11px] sm:text-xs py-1 px-3 sm:px-6">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-2 min-h-[26px]">
          {/* Desktop Left: Announcement */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F37021] text-white text-[9px] font-extrabold tracking-wide uppercase shrink-0">
              <Flame className="w-3 h-3 shrink-0" />
              {siteConfig.promo?.topBarBadge || "Ưu Đãi"}
            </span>
            <p className="text-[11.5px] text-[#2F364A] truncate font-medium">
              <strong className="text-[#20283D] font-bold">
                {siteConfig.promo?.topBarAnnouncement ||
                  "Miễn phí Modem Wi-Fi 6 & Camera FPT khi đăng ký online tại đây"}
              </strong>
            </p>
          </div>

          {/* Right: Quick Action Link & Hotline */}
          <div className="flex items-center gap-2.5 shrink-0 text-[11px]">
            <button
              onClick={() => handleOpenPromoModal("Top Bar Nhận Ưu Đãi")}
              className="inline-flex items-center gap-1 text-[#C44D06] hover:text-[#A03D05] font-bold hover:underline cursor-pointer"
            >
              <span>Nhận ưu đãi ngay</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-400 inline">|</span>
            <a
              href={siteConfig.contact.hotlineTel}
              onClick={() => handleHotlineClick("Top Bar Hotline")}
              className="font-bold text-[#20283D] hover:text-[#C44D06] transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#C44D06] fill-current" />
              <span>Tư vấn ngay: {siteConfig.contact.hotlineDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* TẦNG 2A: MOBILE MAIN HEADER (Phong cách Long Châu: Nền màu thương hiệu FPT Cam, Logo Trắng + Text 'Lắp mạng FPT siêu tốc') */}
      <div className="lg:hidden bg-gradient-to-r from-[#F37021] to-[#FF7A00] text-white shadow-md">
        {/* Hàng 1: Menu Hamburger | Logo + 'Lắp mạng FPT siêu tốc' | Nút Yêu Cầu Tư Vấn */}
        <div className="px-3 pt-2.5 pb-2 flex items-center justify-between gap-2">
          {/* Nút Hamburger 3 gạch trắng */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label="Mở menu điều hướng"
          >
            <Menu className="w-6 h-6 stroke-[2.2]" />
          </button>

          {/* Logo FPT Telecom + Text "Lắp mạng FPT siêu tốc" to rõ chuẩn phong cách Long Châu */}
          <Link href="/" className="flex items-center gap-2 min-w-0 group shrink-0">
            <img
              src="/images/logo-ftel.svg"
              alt="FPT Telecom"
              width={85}
              height={28}
              loading="eager"
              decoding="async"
              className="h-7 sm:h-8 w-auto object-contain brightness-0 invert drop-shadow-xs shrink-0"
            />
            <div className="flex flex-col leading-[1.12] shrink-0 text-left">
              <span className="font-black text-[13px] sm:text-[14px] tracking-tight text-white drop-shadow-xs whitespace-nowrap">
                Lắp mạng
              </span>
              <span className="font-black text-[13px] sm:text-[14px] tracking-tight text-amber-200 drop-shadow-xs whitespace-nowrap">
                FPT siêu tốc
              </span>
            </div>
          </Link>

          {/* Nút Yêu Cầu Tư Vấn chuẩn phong cách Long Châu */}
          <button
            type="button"
            onClick={() => handleOpenPromoModal("Mobile Header Yêu Cầu Tư Vấn")}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FFCC00] hover:bg-[#FFD633] active:scale-95 text-[#C84600] font-black text-[11px] sm:text-xs shadow-md transition-all flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap"
          >
            <Headset className="w-3.5 h-3.5 shrink-0" />
            <span>Yêu cầu tư vấn</span>
          </button>
        </div>

        {/* Hàng 2: Thanh Tìm Kiếm / Hỏi Đáp Dịch Vụ Bo Tròn (Như thanh "Bạn cần bác sĩ tư vấn?" của Long Châu) */}
        <div className="px-3 pb-2.5">
          <div
            onClick={() => handleOpenPromoModal("Mobile Search Bar")}
            className="w-full bg-white rounded-full py-1.5 px-3.5 flex items-center justify-between text-xs text-slate-500 shadow-sm cursor-pointer border border-white/40 active:bg-slate-50 transition-colors"
          >
            <span className="text-slate-600 font-medium truncate">
              Bạn cần tư vấn lắp mạng, truyền hình, camera?
            </span>
            <div className="w-6 h-6 rounded-full bg-[#FFF4ED] flex items-center justify-center shrink-0 ml-1">
              <Search className="w-3.5 h-3.5 text-[#F37021]" />
            </div>
          </div>
        </div>
      </div>

      {/* TẦNG 2B: DESKTOP MAIN NAVBAR (Phong cách Long Châu: Nền trắng, Logo FPT, Hotline & Nút CTA Bo Tròn) */}
      <div className="hidden lg:block bg-white border-b border-[#E4E8ED] shadow-[0px_2px_8px_-2px_rgba(243,112,33,0.06)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 h-16 lg:h-[70px] flex items-center justify-between gap-3">
          {/* Left: Logo FPT & Slogan Thành viên FPT */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <img
              src="/images/logo-ftel.svg"
              alt="FPT Telecom"
              width={120}
              height={40}
              loading="eager"
              decoding="async"
              className="h-9 lg:h-10 w-auto object-contain transition-transform group-hover:scale-102"
            />
            <div className="h-6 w-px bg-[#E4E8ED] mx-0.5" />
            <div className="flex flex-col">
              <span className="font-black text-lg lg:text-[19px] text-[#20283D] tracking-tight whitespace-nowrap group-hover:text-[#F37021] transition-colors leading-tight">
                Lắp Mạng FPT Siêu Tốc
              </span>
              <span className="text-[11px] text-[#C44D06] font-bold leading-none mt-0.5">
                Đại Lý Tiếp Nhận Dịch Vụ
              </span>
            </div>
          </Link>

          {/* Center (Desktop): Quick Trust Badges */}
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
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop Hotline Pill */}
            <a
              href={siteConfig.contact.hotlineTel}
              onClick={() => handleHotlineClick("Header Hotline Pill")}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F6FB] hover:bg-[#FFF4ED] border border-[#E4E8ED] hover:border-orange-300 text-[#20283D] transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-xs">
                <Phone className="w-3.5 h-3.5 text-[#F37021] fill-current" />
              </div>
              <div className="text-left">
                <span className="block text-[9.5px] text-[#657384] font-medium leading-none">
                  Tổng đài 24/7
                </span>
                <span className="text-xs font-black text-[#C44D06] leading-tight">
                  {siteConfig.contact.hotlineDisplay}
                </span>
              </div>
            </a>

            {/* CTA Button: Long Châu Pill Style with FPT Orange */}
            <button
              type="button"
              onClick={() => {
                handleHotlineClick("Header CTA Button");
                handleOpenPromoModal("Desktop Header CTA");
              }}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#F37021] hover:bg-[#E05D10] text-white font-extrabold text-sm shadow-[0_4px_16px_rgba(243,112,33,0.35)] hover:shadow-[0_6px_20px_rgba(243,112,33,0.45)] active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Đăng Ký Tư Vấn</span>
            </button>
          </div>
        </div>
      </div>

      {/* TẦNG 3: CATEGORY NAVIGATION BAR (Desktop Only - Menu Ngang Chuẩn) */}
      <div className="hidden lg:block bg-white border-b border-[#E4E8ED]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
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

      {/* ========================================================= */}
      {/* KHUNG MỞ MENU MOBILE (DRAWER CHUẨN LONG CHÂU) */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9990] flex">
          {/* Lớp nền mờ (Backdrop) */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Ngăn kéo Menu (Drawer) trượt từ bên trái sang */}
          <div className="relative w-[85%] max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-[9999] overflow-hidden animate-in slide-in-from-left duration-300">
            {/* 1. Header ngăn kéo: Nền cam FPT, Logo và text "Lắp mạng FPT siêu tốc" */}
            <div className="bg-[#F37021] px-4 py-3.5 flex items-center justify-between text-white shadow-sm shrink-0">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <img
                  src="/images/logo-ftel.svg"
                  alt="FPT Telecom"
                  width={85}
                  height={28}
                  className="h-7 sm:h-8 w-auto object-contain brightness-0 invert shrink-0"
                />
                <div className="flex flex-col leading-[1.12] text-left">
                  <span className="font-black text-[13px] sm:text-sm tracking-tight text-white">
                    Lắp mạng
                  </span>
                  <span className="font-black text-[13px] sm:text-sm tracking-tight text-amber-200">
                    FPT siêu tốc
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-colors cursor-pointer"
                aria-label="Đóng menu"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* 2. Thẻ Ưu Đãi / Tư Vấn Đặc Quyền (Tựa như card Đăng nhập của Long Châu) */}
            <div className="p-3.5 bg-gradient-to-br from-[#FFF4ED] via-orange-50 to-[#FFE8D6] border-b border-orange-200/80 shrink-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#F37021] text-white flex items-center justify-center text-[10px] font-black">
                  ★
                </span>
                <span className="text-xs font-black text-[#20283D] uppercase tracking-tight">
                  Đặc quyền lắp đặt FPT hôm nay
                </span>
              </div>
              <p className="text-[11.5px] text-[#556070] leading-snug">
                Đăng ký online để nhận miễn phí Modem Wi-Fi 6, Camera AI an ninh & tặng đến 2 tháng cước.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenPromoModal("Drawer Promo Card");
                }}
                className="mt-2.5 w-full py-2 px-4 rounded-full bg-[#F37021] hover:bg-[#E05D10] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Nhận ưu đãi tư vấn ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Danh sách Danh mục Menu (Phong cách Accordion & List chuẩn Long Châu) */}
            <div className="flex-1 overflow-y-auto py-2 divide-y divide-slate-100">
              {/* Mục 1: Lắp Mạng FPT Wi-Fi 6 (Có Accordion) */}
              <div className="px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => toggleSection("internet")}
                  className="w-full flex items-center justify-between py-2 text-left font-bold text-[13.5px] text-[#20283D] hover:text-[#F37021] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#FFF4ED] flex items-center justify-center text-[#F37021]">
                      <Wifi className="w-3.5 h-3.5" />
                    </div>
                    <span>Internet Wi-Fi 6</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      expandedSection === "internet" ? "rotate-180 text-[#F37021]" : ""
                    }`}
                  />
                </button>

                {expandedSection === "internet" && (
                  <div className="bg-[#FFF8F2] border border-orange-100/80 rounded-xl p-3 my-1.5 space-y-2 text-xs text-slate-700">
                    <Link
                      href="/lap-mang-fpt"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-[#F37021] font-medium transition-colors"
                    >
                      • Gói GIGA (300 Mbps) - Siêu tiết kiệm
                    </Link>
                    <Link
                      href="/lap-mang-fpt"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-[#F37021] font-medium transition-colors"
                    >
                      • Gói SKY (1000 Mbps) - Băng thông cực đại
                    </Link>
                    <Link
                      href="/lap-mang-fpt"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-[#F37021] font-medium transition-colors"
                    >
                      • Gói META (1000 Mbps Đối Xứng) - Đỉnh cao gaming
                    </Link>
                    <Link
                      href="/lap-mang-fpt"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block pt-1 text-[#F37021] font-bold border-t border-orange-200/50"
                    >
                      → Xem tất cả gói Internet Wi-Fi 6
                    </Link>
                  </div>
                )}
              </div>

              {/* Mục 2: Combo Ngoại Hạng Anh (Có Accordion) */}
              <div className="px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => toggleSection("combo")}
                  className="w-full flex items-center justify-between py-2 text-left font-bold text-[13.5px] text-[#20283D] hover:text-[#F37021] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                    <span>Combo Ngoại Hạng Anh</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-red-600 text-white">
                      HOT
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      expandedSection === "combo" ? "rotate-180 text-[#F37021]" : ""
                    }`}
                  />
                </button>

                {expandedSection === "combo" && (
                  <div className="bg-[#FFF8F2] border border-orange-100/80 rounded-xl p-3 my-1.5 space-y-2 text-xs text-slate-700">
                    <Link
                      href="/combo-ngoai-hang-anh"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-[#F37021] font-medium transition-colors"
                    >
                      • Combo GIGA + FPT Play (220.000đ/tháng)
                    </Link>
                    <Link
                      href="/combo-ngoai-hang-anh"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-[#F37021] font-medium transition-colors"
                    >
                      • Combo SKY + Ngoại Hạng Anh trọn vẹn
                    </Link>
                    <Link
                      href="/combo-ngoai-hang-anh"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block pt-1 text-[#F37021] font-bold border-t border-orange-200/50"
                    >
                      → Xem toàn bộ lịch & gói cước thể thao
                    </Link>
                  </div>
                )}
              </div>

              {/* Mục 3: Truyền Hình FPT Play */}
              <div className="px-3 py-1.5">
                <Link
                  href="/truyen-hinh-fpt"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-left font-bold text-[13.5px] text-[#20283D] hover:text-[#F37021] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#FFF4ED] flex items-center justify-center text-[#F37021]">
                      <Tv className="w-3.5 h-3.5" />
                    </div>
                    <span>Truyền Hình FPT Play</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Mục 4: Camera An Ninh FPT AI */}
              <div className="px-3 py-1.5">
                <Link
                  href="/#bang-gia"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-left font-bold text-[13.5px] text-[#20283D] hover:text-[#F37021] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#FFF4ED] flex items-center justify-center text-[#F37021]">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <span>Camera Thông Minh AI</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Mục 5: Bảng Giá Cước 2026 */}
              <div className="px-3 py-1.5">
                <Link
                  href="/#bang-gia"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-left font-bold text-[13.5px] text-[#20283D] hover:text-[#F37021] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                    <span>Bảng Giá Cước Mới Nhất</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Mục 6: Tin Tức & Khuyến Mãi */}
              <div className="px-3 py-1.5">
                <Link
                  href="/tin-tuc"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-left font-bold text-[13.5px] text-[#20283D] hover:text-[#F37021] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#FFF4ED] flex items-center justify-center text-[#F37021]">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span>Tin Tức & Khuyến Mãi</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* 4. Chân ngăn kéo: Nút Gọi Hotline Nổi Bật (Chuẩn Pill của Long Châu) & Chat Zalo */}
            <div className="p-3 bg-white border-t border-slate-100 space-y-2 shrink-0">
              {/* Nút Gọi Hotline màu nhạt với viền cam bo tròn */}
              <a
                href={siteConfig.contact.hotlineTel}
                onClick={() => handleHotlineClick("Mobile Drawer Hotline")}
                className="w-full py-2.5 px-4 rounded-full bg-[#FFF4ED] hover:bg-orange-100 border border-orange-200 text-[#C44D06] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4 fill-current text-[#F37021]" />
                <span>Gọi Hotline: {siteConfig.contact.hotlineDisplay}</span>
              </a>

              {/* Nút Chat Zalo */}
              <a
                href={siteConfig.contact.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 rounded-full bg-[#0068FF] hover:bg-[#0057D9] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat Zalo tư vấn 24/7</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
