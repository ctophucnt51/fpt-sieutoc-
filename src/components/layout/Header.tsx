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
                  "Trang bị Modem Wi-Fi 6 • Ưu đãi tặng 1 Camera AI (Miễn phí lưu trữ) khi lắp Internet FPT"}
              </strong>
            </p>
          </div>

          {/* Right: Support Hours & Infrastructure Check (No duplicate Hotline/CTA with navbar below) */}
          <div className="flex items-center gap-2.5 shrink-0 text-[11px]">
            <span className="text-[#475569] font-medium">
              Lắp nhanh 24h &bull; Hỗ trợ 07:30 – 22:00 (T2 – CN)
            </span>
            <span className="text-slate-300 inline">|</span>
            <button
              onClick={() => handleOpenPromoModal("Top Bar Kiểm Tra Hạ Tầng")}
              className="inline-flex items-center gap-1 text-[#9A3412] hover:text-[#F37021] font-bold hover:underline cursor-pointer"
            >
              <span>Kiểm tra hạ tầng</span>
              <ArrowRight className="w-3 h-3" />
            </button>
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

            {/* 2. Danh sách Menu Tinh Gọn (Gọn gàng, 1 chạm, vừa màn hình mobile) */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              {[
                {
                  href: "/lap-mang-fpt",
                  label: "Internet Wi-Fi 6",
                  icon: Wifi,
                  iconClass: "bg-[#FFF4ED] text-[#F37021]",
                },
                {
                  href: "/combo-ngoai-hang-anh",
                  label: "Combo Ngoại Hạng Anh",
                  badge: "HOT",
                  icon: Flame,
                  iconClass: "bg-red-50 text-red-600",
                },
                {
                  href: "/camera-fpt",
                  label: "Camera Thông Minh AI",
                  icon: Camera,
                  iconClass: "bg-purple-50 text-purple-600",
                },
                {
                  href: "/bang-gia",
                  label: "Bảng Giá Cước",
                  icon: Tag,
                  iconClass: "bg-emerald-50 text-emerald-600",
                },
                {
                  href: "/truyen-hinh-fpt",
                  label: "Truyền Hình FPT Play",
                  icon: Tv,
                  iconClass: "bg-amber-50 text-amber-600",
                },
                {
                  href: "/tin-tuc",
                  label: "Tin Tức Viễn Thông",
                  icon: FileText,
                  iconClass: "bg-indigo-50 text-indigo-600",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-slate-800 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconClass}`}>
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="font-bold text-[13.5px] group-hover:text-[#F37021] transition-colors">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-600 text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                );
              })}

              {/* Liên kết phụ gọn trong 1 hàng */}
              <div className="pt-3 mt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-center">
                <Link
                  href="/khuyen-mai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-1 rounded-xl bg-slate-50 hover:bg-orange-50 text-[11px] font-bold text-slate-700 hover:text-[#F37021] transition-colors"
                >
                  Khuyến Mãi
                </Link>
                <Link
                  href="/quy-trinh-lap-dat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-1 rounded-xl bg-slate-50 hover:bg-orange-50 text-[11px] font-bold text-slate-700 hover:text-[#F37021] transition-colors"
                >
                  Lắp Đặt 24H
                </Link>
                <Link
                  href="/hoi-dap"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-1 rounded-xl bg-slate-50 hover:bg-orange-50 text-[11px] font-bold text-slate-700 hover:text-[#F37021] transition-colors"
                >
                  Hỏi Đáp
                </Link>
              </div>
            </div>

            {/* 3. Chân ngăn kéo: 2 nút Hotline & Zalo nằm ngang gọn gàng */}
            <div className="p-3 bg-white border-t border-slate-200 grid grid-cols-2 gap-2 shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <a
                href={siteConfig.contact.hotlineTel}
                onClick={() => handleHotlineClick("Mobile Drawer Hotline")}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#F37021] to-[#FF7A00] text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5 select-none"
              >
                <Phone className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>Gọi Hotline</span>
              </a>

              <a
                href={siteConfig.contact.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-blue-50 border border-[#0068FF]/30 text-[#0068FF] font-bold text-xs flex items-center justify-center gap-1.5 select-none"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>Chat Zalo</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
