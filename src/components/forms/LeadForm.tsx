"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSiteConfig } from "@/context/ConfigContext";
import { captureAttribution } from "@/lib/trackingUtils";
import { fbTracker } from "@/components/tracking/MetaPixel";
import { googleTracker } from "@/components/tracking/GoogleAds";

interface LeadFormProps {
  defaultPackage?: string;
  headline?: string;
  subheadline?: string;
  badgeText?: string;
  className?: string;
  formTitle?: string;
  formSubtitle?: string;
  formLocation?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const DUPLICATE_STORAGE_KEY = "fpt_recent_submissions";

type ServiceType = "Internet" | "Combo Ngoại Hạng Anh" | "Combo Tặng Camera";

export default function LeadForm({
  defaultPackage = "Combo Ngoại Hạng Anh",
  headline,
  subheadline,
  className = "",
  formLocation = "hero-form",
  onSuccess,
  onClose,
}: LeadFormProps) {
  const siteConfig = useSiteConfig();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Trạng thái các trường nhập liệu
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 2. Trạng thái dịch vụ chọn (Internet | Combo Ngoại Hạng Anh | Combo Tặng Camera)
  const [selectedService, setSelectedService] = useState<ServiceType>(() => {
    if (defaultPackage?.includes("Camera")) {
      return "Combo Tặng Camera";
    }
    if (defaultPackage?.includes("Ngoại Hạng Anh") || defaultPackage?.includes("Combo") || defaultPackage?.includes("Play")) {
      return "Combo Ngoại Hạng Anh";
    }
    if (defaultPackage?.includes("Chỉ") || defaultPackage?.includes("Internet") || defaultPackage?.includes("SKY") || defaultPackage?.includes("GIGA")) {
      return "Internet";
    }
    return "Combo Ngoại Hạng Anh";
  });

  // Anti-spam & Phản hồi
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Đồng bộ khi prop defaultPackage thay đổi
  useEffect(() => {
    if (defaultPackage) {
      if (defaultPackage.includes("Camera")) {
        setSelectedService("Combo Tặng Camera");
      } else if (defaultPackage.includes("Chỉ") || defaultPackage.includes("SKY") || defaultPackage.includes("GIGA")) {
        setSelectedService("Internet");
      } else if (defaultPackage.includes("Ngoại Hạng Anh") || defaultPackage.includes("Play") || defaultPackage.includes("Combo")) {
        setSelectedService("Combo Ngoại Hạng Anh");
      }
    }
  }, [defaultPackage]);

  // Validate số điện thoại Việt Nam 10 chữ số
  const validatePhone = (val: string) => {
    const cleaned = val.replace(/\s+/g, "").replace(/[-.]/g, "");
    const vnPhoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    if (!cleaned) {
      setPhoneError("Vui lòng nhập số điện thoại.");
      return false;
    }
    if (!vnPhoneRegex.test(cleaned)) {
      setPhoneError("Số điện thoại không hợp lệ (10 chữ số).");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
    if (val.length >= 10) {
      validatePhone(val);
    } else {
      setPhoneError(null);
    }
  };

  const isDuplicatePhone = (cleaned: string): boolean => {
    try {
      const raw = sessionStorage.getItem(DUPLICATE_STORAGE_KEY);
      if (!raw) return false;
      const list: { phone: string; time: number }[] = JSON.parse(raw);
      const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
      return list.some((item) => item.phone === cleaned && item.time > thirtyMinutesAgo);
    } catch {
      return false;
    }
  };

  const markPhoneSubmitted = (cleaned: string) => {
    try {
      const raw = sessionStorage.getItem(DUPLICATE_STORAGE_KEY);
      const list: { phone: string; time: number }[] = raw ? JSON.parse(raw) : [];
      list.push({ phone: cleaned, time: Date.now() });
      sessionStorage.setItem(DUPLICATE_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (honeypot) {
      router.push("/cam-on");
      return;
    }

    const cleanedPhone = phone.replace(/\s+/g, "").replace(/[-.]/g, "");
    if (!validatePhone(cleanedPhone)) {
      return;
    }

    if (!address.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ lắp đặt.");
      return;
    }

    if (isDuplicatePhone(cleanedPhone)) {
      setErrorMessage(
        "Số điện thoại này vừa gửi đăng ký. Chuyên viên FPT sẽ liên hệ lại bạn ngay!"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const attribution = captureAttribution();
      const eventId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // 1. Gửi vào máy chủ API nội bộ /api/leads để lưu trữ & bắn Telegram qua Cloudflare Worker
      let leadId = `FPT-${Date.now().toString(36).toUpperCase()}`;
      let internalSuccess = false;

      try {
        const internalRes = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: fullName.trim(),
            phone: cleanedPhone,
            address: address.trim(),
            area: "Cần Thơ",
            packageInterested: selectedService,
            note: "",
            agreeConsent: true,
            landingPage: pathname || "/",
            leadLocation: formLocation,
            eventId: eventId,
            website: honeypot,
            ...attribution,
          }),
        });

        if (internalRes.ok) {
          internalSuccess = true;
          const internalData = await internalRes.json();
          if (internalData.leadId) {
            leadId = internalData.leadId;
          }
        } else if (internalRes.status === 403) {
          const blockedData = await internalRes.json().catch(() => ({}));
          if (blockedData?.blocked) {
            setErrorMessage(
              blockedData.message ||
                "Yêu cầu tạm thời không thể gửi trực tuyến. Quý khách vui lòng gọi trực tiếp hotline 0878 800 400."
            );
            setIsSubmitting(false);
            return;
          }
        }
      } catch (internalErr) {
        console.warn("Internal leads API error:", internalErr);
      }

      // Dự phòng duy nhất: Nếu máy chủ API /api/leads gặp sự cố không phản hồi, gửi trực tiếp tới Cloudflare Worker để đảm bảo không thất thoát khách
      if (!internalSuccess) {
        try {
          await fetch("https://form-fpt.cto-phucnt51.workers.dev/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: fullName.trim(),
              phone: cleanedPhone,
              address: address.trim(),
              province: "can-tho",
              area: "Cần Thơ",
              package: selectedService,
              package_interest: selectedService,
              plan: selectedService,
              service: selectedService,
              packageInterested: selectedService,
              form_location: formLocation,
              formLocation: formLocation,
              note: "",
              source: attribution.utm_source || "direct",
              campaign: attribution.utm_campaign || undefined,
              medium: attribution.utm_medium || undefined,
              term: attribution.utm_term || undefined,
              content: attribution.utm_content || undefined,
              fbclid: attribution.fbclid || undefined,
              gclid: attribution.gclid || undefined,
              utm_source: attribution.utm_source || "",
              utm_medium: attribution.utm_medium || "",
              utm_campaign: attribution.utm_campaign || "",
              utm_content: attribution.utm_content || "",
              utm_term: attribution.utm_term || "",
              page_url: typeof window !== "undefined" ? window.location.href : "https://gofpt.vn",
              page_path: pathname || "/",
              referrer: typeof document !== "undefined" ? document.referrer : "",
              submitted_at: new Date().toISOString(),
              user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
            }),
          });
        } catch (cfErr: unknown) {
          console.warn("Fallback Cloudflare Worker dispatch warning:", cfErr);
        }
      }

      markPhoneSubmitted(cleanedPhone);

      // 3. Kích hoạt Tracking Pixel & Google Ads
      fbTracker.lead(eventId, selectedService);
      googleTracker.formConversion(selectedService, leadId);

      // 4. Lưu thông tin trang Cảm Ơn
      try {
        sessionStorage.setItem(
          "fpt_lead_confirmation",
          JSON.stringify({
            leadId,
            fullName: fullName.trim(),
            phone: cleanedPhone.slice(-4),
            packageInterested: selectedService,
            area: address.trim(),
            timestamp: new Date().toLocaleTimeString("vi-VN"),
          })
        );
      } catch {
        // Ignore
      }

      if (onSuccess) {
        onSuccess();
      }

      // 5. Chuyển hướng tới trang Cảm Ơn
      router.push(`/cam-on?code=${leadId}`);
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra. Quý khách vui lòng gọi Hotline trực tiếp.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="lead-form"
      className={`bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] shadow-[0_12px_40px_rgba(15,23,42,0.08)] p-5 sm:p-7 lg:p-8 relative ${className}`}
    >
      {/* Nút đóng (khi mở dạng Popup Modal) */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-lg leading-none transition-colors cursor-pointer z-10"
          aria-label="Đóng cửa sổ"
        >
          ✕
        </button>
      )}

      {/* 1. Tiêu đề chính & Tiêu đề phụ */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4ED] text-[#9A3412] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-[#C2410C] animate-pulse" />
          <span>Tiếp Nhận Đăng Ký Siêu Tốc</span>
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-[26px] font-black text-[#0F172A] uppercase tracking-tight leading-tight">
          {headline || "NHẬN TƯ VẤN MIỄN PHÍ"}
        </h3>
        <p className="text-[#475569] text-xs sm:text-sm font-medium mt-1 leading-snug">
          {subheadline || "Kiểm tra hạ tầng & tư vấn gói cước miễn phí"}
        </p>
      </div>

      {/* Thông báo lỗi nếu có */}
      {errorMessage && (
        <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-xs leading-snug shadow-2xs">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 sm:mt-5">
        {/* Trường chống spam honeypot */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* CÁC TRƯỜNG THÔNG TIN: MỖI DÒNG 1 THÔNG TIN (Họ tên, Số điện thoại, Địa chỉ) */}
        <div className="space-y-2.5 sm:space-y-3">
          {/* DÒNG 1: Họ và tên * */}
          <div>
            <label htmlFor="lead-fullname" className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
              Họ và tên <span className="text-red-600">*</span>
            </label>
            <input
              id="lead-fullname"
              type="text"
              aria-label="Họ và tên"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#F8FAFC] focus:bg-white text-slate-900 text-base sm:text-sm font-medium outline-none border border-[#E2E8F0] focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/20 transition-all"
            />
          </div>

          {/* DÒNG 2: Số điện thoại * */}
          <div>
            <label htmlFor="lead-phone" className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
              Số điện thoại <span className="text-red-600">*</span>
            </label>
            <input
              id="lead-phone"
              type="tel"
              aria-label="Số điện thoại"
              required
              value={phone}
              onChange={handlePhoneChange}
              className={`w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#F8FAFC] focus:bg-white text-slate-900 text-base sm:text-sm font-medium outline-none border transition-all ${
                phoneError
                  ? "border-red-500 ring-2 ring-red-500/20"
                  : "border-[#E2E8F0] focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/20"
              }`}
            />
            {phoneError && (
              <p className="text-red-700 text-[11px] font-semibold mt-1 px-1">
                {phoneError}
              </p>
            )}
          </div>

          {/* DÒNG 3: Địa chỉ lắp đặt * */}
          <div>
            <label htmlFor="lead-address" className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
              Địa chỉ lắp đặt <span className="text-red-600">*</span>
            </label>
            <input
              id="lead-address"
              type="text"
              aria-label="Địa chỉ lắp đặt"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#F8FAFC] focus:bg-white text-slate-900 text-base sm:text-sm font-medium outline-none border border-[#E2E8F0] focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/20 transition-all"
            />
          </div>
        </div>

        {/* HÀNG 3: DỊCH VỤ CẦN TƯ VẤN (3 TÙY CHỌN: Internet, Combo Ngoại Hạng Anh, Combo Tặng Camera) */}
        <div className="mt-4 sm:mt-5">
          <span className="block text-[#0F172A] font-bold text-xs sm:text-sm mb-2 sm:mb-2.5">
            Dịch vụ cần tư vấn
          </span>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Tùy chọn 1: Internet */}
            <div
              onClick={() => setSelectedService("Internet")}
              className={`rounded-2xl p-2.5 sm:p-3 text-center cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center min-h-[105px] sm:min-h-[120px] border-2 ${
                selectedService === "Internet"
                  ? "border-[#F37021] bg-[#FFF5EE] ring-2 ring-[#F37021]/20 shadow-xs scale-[1.02]"
                  : "border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              {/* Nút tròn radio ở góc trên bên phải */}
              <div
                className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedService === "Internet"
                    ? "border-[#F37021] bg-[#F37021]"
                    : "border-slate-300 bg-white"
                }`}
              >
                {selectedService === "Internet" && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </div>

              {/* Icon Modem / Wi-Fi 6 */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center mb-1">
                <img
                  src="/images/icons/liquid-glass/wifi-6.webp"
                  alt="Internet"
                  width={44}
                  height={44}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <span className="text-slate-800 font-bold text-xs sm:text-sm tracking-tight leading-tight">
                Internet
              </span>
            </div>

            {/* Tùy chọn 2: Combo Ngoại Hạng Anh */}
            <div
              onClick={() => setSelectedService("Combo Ngoại Hạng Anh")}
              className={`rounded-2xl p-2.5 sm:p-3 text-center cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center min-h-[105px] sm:min-h-[120px] border-2 ${
                selectedService === "Combo Ngoại Hạng Anh"
                  ? "border-[#F37021] bg-[#FFF5EE] ring-2 ring-[#F37021]/20 shadow-xs scale-[1.02]"
                  : "border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <div
                className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedService === "Combo Ngoại Hạng Anh"
                    ? "border-[#F37021] bg-[#F37021]"
                    : "border-slate-300 bg-white"
                }`}
              >
                {selectedService === "Combo Ngoại Hạng Anh" && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </div>

              {/* Icon Ngoại Hạng Anh */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center mb-1">
                <img
                  src="/images/icons/liquid-glass/ngoai-hang-anh.webp"
                  alt="Combo Ngoại Hạng Anh"
                  width={44}
                  height={44}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <span className="text-slate-800 font-bold text-xs sm:text-sm tracking-tight leading-tight">
                Combo
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#C84600] mt-0.5">
                Ngoại Hạng Anh
              </span>
            </div>

            {/* Tùy chọn 3: Combo Tặng Camera */}
            <div
              onClick={() => setSelectedService("Combo Tặng Camera")}
              className={`rounded-2xl p-2.5 sm:p-3 text-center cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center min-h-[105px] sm:min-h-[120px] border-2 ${
                selectedService === "Combo Tặng Camera"
                  ? "border-[#F37021] bg-[#FFF5EE] ring-2 ring-[#F37021]/20 shadow-xs scale-[1.02]"
                  : "border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <div
                className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedService === "Combo Tặng Camera"
                    ? "border-[#F37021] bg-[#F37021]"
                    : "border-slate-300 bg-white"
                }`}
              >
                {selectedService === "Combo Tặng Camera" && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </div>

              {/* Icon Camera AI */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center mb-1">
                <img
                  src="/images/icons/liquid-glass/camera-ai.webp"
                  alt="Combo Tặng Camera"
                  width={44}
                  height={44}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <span className="text-slate-800 font-bold text-xs sm:text-sm tracking-tight leading-tight">
                Combo
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 mt-0.5">
                Tặng Camera
              </span>
            </div>
          </div>
        </div>

        {/* HÀNG 4: NÚT BẤM CTA CAM NỔI BẬT HÌNH VIÊN THUỐC */}
        <div className="mt-5 sm:mt-6 flex flex-col items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#F37021] to-[#FF7A00] hover:from-[#E05D10] hover:to-[#F37021] active:scale-98 text-white font-black text-sm sm:text-base shadow-[0_8px_20px_rgba(184,67,0,0.3)] hover:shadow-[0_10px_25px_rgba(184,67,0,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isSubmitting ? (
              "Đang gửi thông tin..."
            ) : (
              <>
                <span>Gửi Yêu Cầu Tư Vấn</span>
                <span className="text-base sm:text-lg font-bold leading-none">→</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-[#64748B] font-medium mt-3 text-center leading-relaxed">
            Bằng việc gửi thông tin, bạn đồng ý với{" "}
            <Link href="/chinh-sach-bao-mat" className="text-[#0F172A] underline hover:text-[#F37021]">
              Chính sách bảo mật
            </Link>{" "}
            và{" "}
            <Link href="/dieu-khoan" className="text-[#0F172A] underline hover:text-[#F37021]">
              Điều khoản dịch vụ
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
