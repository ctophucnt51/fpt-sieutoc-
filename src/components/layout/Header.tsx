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
      label: "Ngoại Hạng Anh",
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
      href: "/camera-fpt",
      label: "Camera AI",
      badge: null,
      badgeColor: "",
    },
    {
      href: "/bang-gia",
      label: "Bảng Giá",
      badge: null,
      badgeColor: "",
    },
    {
      href: "/khuyen-mai",
      label: "Ưu Đãi",
      badge: "HOT",
      badgeColor: "bg-[#F37021] text-white",
    },
    {
      href: "/tin-tuc",
      label: "Tin Tức",
      badge: null,
      badgeColor: "",
    },
  ];

  return (
    <>
    <header className="sticky-header sticky top-0 z-40 w-full transition-all bg-white">
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
              className="inline-flex items-center gap-1 text-[#9A3412] hover:text-[#A03D05] font-bold hover:underline cursor-pointer"
            >
              <span>Nhận ưu đãi ngay</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-400 inline">|</span>
            <a
              href={siteConfig.contact.hotlineTel}
              onClick={() => handleHotlineClick("Top Bar Hotline")}
              className="font-bold text-[#20283D] hover:text-[#9A3412] transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#9A3412] fill-current" />
              <span>Tư vấn ngay: {siteConfig.contact.hotlineDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* TẦNG 2A: MOBILE MAIN HEADER (Phong cách App Native tối ưu render GPU 60fps) */}
      <div className="lg:hidden bg-white border-b border-slate-200 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
        <div className="px-3.5 h-14 flex items-center justify-between gap-2">
          {/* Left: Menu + Logo FPT gọn gàng */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="Mở menu điều hướng"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>

            <Link href="/" className="flex items-center gap-2 min-w-0 shrink-0">
              <img
                src="/images/logo-ftel.svg"
                alt="FPT Telecom"
                width={80}
                height={26}
                loading="eager"
                decoding="async"
                className="h-6.5 w-auto object-contain shrink-0"
              />
              <div className="h-4 w-px bg-slate-200 shrink-0" />
              <span className="font-black text-[13.5px] tracking-tight text-[#0F172A] whitespace-nowrap leading-none translate-y-[1px]">
                FPT <span className="animate-shimmer-orange">Siêu Tốc</span>
              </span>
            </Link>
          </div>

          {/* Right: 3 cấp độ hiển thị theo độ rộng màn hình: >=405px (Đầy đủ) | 310px-404px (Chỉ icon điện thoại) | <310px (Ẩn luôn) */}
          <div className="flex items-center shrink-0">
            <a
              href={siteConfig.contact.hotlineTel}
              onClick={() => handleHotlineClick("Mobile Header Phone Icon")}
              className="hidden min-[310px]:flex min-[405px]:hidden w-9 h-9 rounded-2xl bg-gradient-to-r from-[#F37021] to-[#FF7A00] active:scale-95 text-white shadow-[0_3px_10px_rgba(243,112,33,0.3)] items-center justify-center transition-all shrink-0"
              aria-label="Gọi tư vấn ngay"
            >
              <Phone className="w-4 h-4 fill-current" />
            </a>

            <button
              type="button"
              onClick={() => handleOpenPromoModal("Mobile Header Yêu Cầu Tư Vấn")}
              className="hidden min-[405px]:flex px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#F37021] to-[#FF7A00] hover:from-[#E05D10] hover:to-[#F37021] active:scale-95 text-white font-extrabold text-[11px] shadow-[0_3px_10px_rgba(243,112,33,0.3)] transition-all items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
            >
              <Headset className="w-3.5 h-3.5 shrink-0" />
              <span>Tư vấn ngay</span>
            </button>
          </div>
        </div>
      </div>

      {/* TẦNG 2B: DESKTOP MAIN NAVBAR (Tích hợp Menu Ngang Trực Quan, Gọn Đẹp Chuẩn SaaS) */}
      <div className="hidden lg:block bg-white border-b border-[#E4E8ED] shadow-[0px_2px_12px_-4px_rgba(15,23,42,0.06)]">
        <div className="max-w-[1280px] mx-auto px-5 xl:px-8 h-16 lg:h-[68px] flex items-center justify-between gap-4">
          {/* Left: Logo FPT & Tên Kênh */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/images/logo-ftel.svg"
              alt="FPT Telecom"
              width={110}
              height={36}
              loading="eager"
              decoding="async"
              className="h-8 xl:h-9 w-auto object-contain transition-transform group-hover:scale-102"
            />
            <div className="h-6 w-px bg-[#E4E8ED]" />
            <div className="flex flex-col justify-center translate-y-[1px]">
              <span className="font-black text-base xl:text-[17px] text-[#20283D] tracking-tight whitespace-nowrap leading-none">
                FPT <span className="animate-shimmer-orange">Siêu Tốc</span>
              </span>
              <span className="text-[10px] xl:text-[10.5px] text-[#9A3412] font-bold leading-none mt-1 whitespace-nowrap">
                Tiếp nhận đăng ký 24/7
              </span>
            </div>
          </Link>

          {/* Center: Clean Horizontal Navigation Links */}
          <nav className="flex items-center gap-0.5 xl:gap-1">
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
                  className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl text-[12.5px] xl:text-[13px] font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "text-[#F37021] bg-[#FFF4ED]"
                      : "text-[#2F364A] hover:text-[#F37021] hover:bg-[#F4F6FB]"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full tracking-tight shadow-2xs ${link.badgeColor || "bg-red-600 text-white"}`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Hotline Pill & CTA Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={siteConfig.contact.hotlineTel}
              onClick={() => handleHotlineClick("Header Hotline Pill")}
              className="hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4F6FB] hover:bg-[#FFF4ED] border border-[#E4E8ED] hover:border-orange-300 text-[#20283D] transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-2xs">
                <Phone className="w-3.5 h-3.5 text-[#F37021] fill-current" />
              </div>
              <div className="text-left">
                <span className="block text-[9px] text-[#475569] font-medium leading-none">
                  Hotline 24/7
                </span>
                <span className="text-xs font-black text-[#9A3412] leading-tight">
                  {siteConfig.contact.hotlineDisplay}
                </span>
              </div>
            </a>

            <button
              type="button"
              onClick={() => {
                handleHotlineClick("Header CTA Button");
                handleOpenPromoModal("Desktop Header CTA");
              }}
              className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-gradient-to-r from-[#F37021] to-[#FF7A00] hover:from-[#E05D10] hover:to-[#F37021] text-white font-extrabold text-xs xl:text-sm shadow-[0_4px_14px_rgba(243,112,33,0.3)] active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Đăng Ký Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* ========================================================= */}
      {/* KHUNG MỞ MENU MOBILE (NẰM NGOÀI HEADER ĐỂ LUÔN ĐÈ TRÊN THANH CHÂN TRANG) */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9990] flex">
          {/* Lớp nền mờ (Backdrop) */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Ngăn kéo Menu (Drawer) trượt từ bên trái sang - Cùng phong cách Mobile Header & Sticky Bottom Bar */}
          <div className="relative w-[86%] max-w-[340px] bg-white h-full shadow-[4px_0_24px_rgba(15,23,42,0.15)] flex flex-col z-[9999] overflow-hidden border-r border-slate-200 animate-in slide-in-from-left duration-250">
            {/* 1. Header ngăn kéo: Nền trắng, logo FPT tự nhiên, đồng bộ chuẩn Mobile Header */}
            <div className="bg-white border-b border-slate-200 px-3.5 h-14 flex items-center justify-between shrink-0 shadow-2xs">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 min-w-0"
              >
                <img
                  src="/images/logo-ftel.svg"
                  alt="FPT Telecom"
                  width={80}
                  height={26}
                  loading="eager"
                  decoding="async"
                  className="h-6.5 w-auto object-contain shrink-0"
                />
                <div className="h-4 w-px bg-slate-200 shrink-0" />
                <span className="font-black text-[13.5px] tracking-tight text-[#0F172A] whitespace-nowrap leading-none translate-y-[1px]">
                  FPT <span className="animate-shimmer-orange">Siêu Tốc</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all cursor-pointer"
                aria-label="Đóng menu"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* 2. Thẻ Ưu Đãi / Tư Vấn Đặc Quyền (Phong cách thẻ Native Card hiện đại, sạch sẽ) */}
            <div className="mx-3.5 mt-3 mb-1 p-3 rounded-2xl bg-gradient-to-br from-[#FFF9F5] via-white to-[#FFF4ED] border border-orange-200/70 shadow-2xs shrink-0">
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-100/80 text-[#C2410C] text-[10px] font-black uppercase tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F37021] animate-pulse" />
                  Ưu Đãi Hôm Nay
                </div>
                <span className="text-[10px] text-slate-600 font-semibold">Tặng tới 2T cước</span>
              </div>
              <p className="text-[11.5px] text-slate-600 leading-snug">
                Trang bị miễn phí <strong className="text-slate-900 font-bold">Modem Wi-Fi 6</strong> &amp; Camera AI khi đăng ký hôm nay.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenPromoModal("Drawer Promo Card");
                }}
                className="mt-2.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#F37021] to-[#FF7A00] hover:from-[#E05D10] text-white font-extrabold text-xs shadow-[0_3px_10px_rgba(243,112,33,0.25)] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Nhận ưu đãi tư vấn ngay</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* 3. Danh sách Danh mục Menu (Phong cách Clean Modern List đồng bộ hệ thống) */}
            <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1">
              {/* Mục 1: Lắp Mạng FPT Wi-Fi 6 (Accordion) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection("internet")}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                    expandedSection === "internet" ? "bg-orange-50/70 text-[#F37021]" : "text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF4ED] flex items-center justify-center text-[#F37021] shrink-0">
                      <Wifi className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="font-bold text-[13px] group-hover:text-[#F37021] transition-colors">
                      Internet Wi-Fi 6
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      expandedSection === "internet" ? "rotate-180 text-[#F37021]" : ""
                    }`}
                  />
                </button>

                {expandedSection === "internet" && (
                  <div className="bg-slate-50/90 border border-slate-100 rounded-xl p-2.5 my-1 ml-8 space-y-1 text-xs text-slate-600">
                    <Link
                      href="/lap-mang-fpt"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 px-2 rounded-lg hover:bg-white hover:text-[#F37021] font-medium transition-colors"
                    >
                      • Gói GIGA (300 Mbps) - Siêu tiết kiệm
                    </Link>
                    <Link
                      href="/lap-mang-fpt"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 px-2 rounded-lg hover:bg-white hover:text-[#F37021] font-medium transition-colors"
                    >
                      • Gói SKY (1000 Mbps) - Băng thông cực đại
                    </Link>
                    <Link
                      href="/lap-mang-fpt"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 px-2 rounded-lg hover:bg-white hover:text-[#F37021] font-medium transition-colors"
                    >
                      • Gói META (1000 Mbps Đối Xứng) - Gaming
                    </Link>
                    <Link
                      href="/lap-mang-fpt"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block pt-1.5 px-2 text-[#F37021] font-bold border-t border-slate-200/60"
                    >
                      → Xem tất cả gói Internet Wi-Fi 6
                    </Link>
                  </div>
                )}
              </div>

              {/* Mục 2: Combo Ngoại Hạng Anh (Accordion) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection("combo")}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer group ${
                    expandedSection === "combo" ? "bg-orange-50/70 text-[#F37021]" : "text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                      <Flame className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="font-bold text-[13px] group-hover:text-[#F37021] transition-colors">
                      Combo Ngoại Hạng Anh
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-600 text-white shadow-2xs">
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
                  <div className="bg-slate-50/90 border border-slate-100 rounded-xl p-2.5 my-1 ml-8 space-y-1 text-xs text-slate-600">
                    <Link
                      href="/combo-ngoai-hang-anh"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 px-2 rounded-lg hover:bg-white hover:text-[#F37021] font-medium transition-colors"
                    >
                      • Combo GIGA + FPT Play (220.000đ/tháng)
                    </Link>
                    <Link
                      href="/combo-ngoai-hang-anh"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 px-2 rounded-lg hover:bg-white hover:text-[#F37021] font-medium transition-colors"
                    >
                      • Combo SKY + Ngoại Hạng Anh trọn vẹn
                    </Link>
                    <Link
                      href="/combo-ngoai-hang-anh"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block pt-1.5 px-2 text-[#F37021] font-bold border-t border-slate-200/60"
                    >
                      → Xem lịch &amp; gói cước thể thao
                    </Link>
                  </div>
                )}
              </div>

              {/* Mục 3: Truyền Hình FPT Play */}
              <div>
                <Link
                  href="/truyen-hinh-fpt"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left text-slate-800 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                      <Tv className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="font-bold text-[13px] group-hover:text-[#F37021] transition-colors">
                      Truyền Hình FPT Play
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Mục 4: Camera An Ninh FPT AI */}
              <div>
                <Link
                  href="/camera-fpt"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left text-slate-800 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                      <Camera className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="font-bold text-[13px] group-hover:text-[#F37021] transition-colors">
                      Camera Thông Minh AI
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Mục 5: Bảng Giá Cước */}
              <div>
                <Link
                  href="/bang-gia"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left text-slate-800 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <Tag className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="font-bold text-[13px] group-hover:text-[#F37021] transition-colors">
                      Bảng Giá Cước Mới Nhất
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Mục 6: Ưu Đãi & Khuyến Mãi */}
              <div>
                <Link
                  href="/khuyen-mai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left text-slate-800 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-[#F37021] shrink-0">
                      <Flame className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="font-bold text-[13px] group-hover:text-[#F37021] transition-colors">
                      Khuyến Mãi &amp; Quà Tặng
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Mục 7: Quy Trình Lắp Đặt */}
              <div>
                <Link
                  href="/quy-trinh-lap-dat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left text-slate-800 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Zap className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="font-bold text-[13px] group-hover:text-[#F37021] transition-colors">
                      Quy Trình Lắp Đặt 24H
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Mục 8: Hỏi Đáp */}
              <div>
                <Link
                  href="/hoi-dap"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left text-slate-800 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="font-bold text-[13px] group-hover:text-[#F37021] transition-colors">
                      Câu Hỏi Thường Gặp
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Mục 9: Tin Tức */}
              <div>
                <Link
                  href="/tin-tuc"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left text-slate-800 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      <FileText className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="font-bold text-[13px] group-hover:text-[#F37021] transition-colors">
                      Tin Tức Viễn Thông
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 4. Chân ngăn kéo: Nút Gọi Hotline Nổi Bật & Chat Zalo (Đồng bộ chuẩn Sticky Bottom Bar) */}
            <div className="p-3 bg-white border-t border-slate-200 space-y-2 shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-2px_12px_rgba(15,23,42,0.04)]">
              {/* Nút Gọi Hotline FPT Brand Orange */}
              <a
                href={siteConfig.contact.hotlineTel}
                onClick={() => handleHotlineClick("Mobile Drawer Hotline")}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#F37021] to-[#FF7A00] hover:from-[#E05D10] text-white font-extrabold text-xs shadow-[0_3px_10px_rgba(243,112,33,0.25)] active:scale-98 transition-all flex items-center justify-center gap-2 select-none"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Hotline 24/7: {siteConfig.contact.hotlineDisplay}</span>
              </a>

              {/* Nút Chat Zalo */}
              <a
                href={siteConfig.contact.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 rounded-2xl bg-white hover:bg-blue-50/60 border border-[#0068FF]/30 text-[#0068FF] font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all select-none shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat Zalo tư vấn 24/7</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
