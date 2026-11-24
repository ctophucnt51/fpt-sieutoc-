"use client";

import { useState, useEffect } from "react";
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

type ServiceType =
  | "Internet"
  | "Truyền hình"
  | "Camera"
  | "Combo Internet - FPT Play"
  | "Combo Internet - Camera";

export default function LeadForm({
  defaultPackage = "Internet",
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

  // 2. Trạng thái dịch vụ chọn (Internet | Truyền hình | Camera | Combo Internet - FPT Play | Combo Internet - Camera)
  const [selectedService, setSelectedService] = useState<ServiceType>(() => {
    if (defaultPackage?.includes("Camera") && !defaultPackage?.includes("Combo") && !defaultPackage?.includes("combo")) {
      return "Camera";
    }
    if (defaultPackage?.includes("Camera") || defaultPackage?.includes("combo-camera")) {
      return "Combo Internet - Camera";
    }
    if (defaultPackage?.includes("Truyền hình") || defaultPackage?.includes("TV") || defaultPackage?.includes("truyen-hinh")) {
      return "Truyền hình";
    }
    if (defaultPackage?.includes("Play") || defaultPackage?.includes("Combo") || defaultPackage?.includes("Ngoại Hạng Anh")) {
      return "Combo Internet - FPT Play";
    }
    return "Internet";
  });

  // Anti-spam & Phản hồi
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Đồng bộ khi prop defaultPackage thay đổi
  useEffect(() => {
    if (defaultPackage) {
      if (defaultPackage.includes("Camera") && !defaultPackage.includes("Combo") && !defaultPackage.includes("combo")) {
        setSelectedService("Camera");
      } else if (defaultPackage.includes("Camera") || defaultPackage.includes("combo-camera")) {
        setSelectedService("Combo Internet - Camera");
      } else if (defaultPackage.includes("Truyền hình") || defaultPackage.includes("TV") || defaultPackage.includes("truyen-hinh")) {
        setSelectedService("Truyền hình");
      } else if (defaultPackage.includes("Play") || defaultPackage.includes("Combo") || defaultPackage.includes("Ngoại Hạng Anh")) {
        setSelectedService("Combo Internet - FPT Play");
      } else {
        setSelectedService("Internet");
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

      // 1. Gửi trực tiếp tới Cloudflare Worker để bắn thông báo về Telegram tức thì (Chuẩn 100% schema worker)
      const workerPayload = {
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
      };

      const WORKER_ENDPOINT = "https://form-fpt.cto-phucnt51.workers.dev/";

      try {
        await fetch(WORKER_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workerPayload),
        });
      } catch (cfErr: unknown) {
        console.warn("Cloudflare Worker dispatch warning:", cfErr);
      }

      // 2. Gửi vào máy chủ API nội bộ /api/leads để lưu trữ & trigger tracking
      let leadId = `FPT-${Date.now().toString(36).toUpperCase()}`;
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
          const internalData = await internalRes.json();
          if (internalData.leadId) {
            leadId = internalData.leadId;
          }
        }
      } catch (internalErr) {
        console.warn("Internal leads API error:", internalErr);
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
      className={`bg-gradient-to-b from-[#FF7A00] to-[#FF6200] rounded-[28px] sm:rounded-[34px] p-2.5 sm:p-3 shadow-2xl relative ${className}`}
    >
      {/* Khung viền mỏng bo tròn bên trong chuẩn theo bản thiết kế */}
      <div className="border border-white/40 rounded-[22px] sm:rounded-[28px] p-4 sm:p-6 lg:p-7 relative">
        {/* Nút đóng (khi mở dạng Popup Modal) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg leading-none transition-colors cursor-pointer z-10"
            aria-label="Đóng cửa sổ"
          >
            ✕
          </button>
        )}

        {/* 1. Tiêu đề chính & Tiêu đề phụ */}
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl lg:text-[28px] font-black text-white uppercase tracking-tight leading-tight">
            {headline || "NHẬN TƯ VẤN MIỄN PHÍ"}
          </h3>
          <p className="text-white/95 text-xs sm:text-sm font-medium mt-1 sm:mt-1.5 leading-snug">
            {subheadline || "Tặng thiết bị WiFi 6 cho 300 KH đầu tiên"}
          </p>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-white text-red-600 font-semibold text-xs leading-snug shadow-sm">
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

          {/* HÀNG 1: Họ tên * | Số điện thoại * (2 Cột hình viên thuốc) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên *"
                className="w-full px-4 py-2.5 sm:py-3 rounded-full bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none shadow-xs focus:ring-2 focus:ring-[#FFCC00] transition-all"
              />
            </div>

            <div>
              <input
                type="tel"
                required
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Nhập số điện thoại *"
                className={`w-full px-4 py-2.5 sm:py-3 rounded-full bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none shadow-xs transition-all ${
                  phoneError ? "ring-2 ring-red-400" : "focus:ring-2 focus:ring-[#FFCC00]"
                }`}
              />
              {phoneError && (
                <p className="text-white bg-red-600/90 px-3 py-0.5 rounded-full text-[11px] font-semibold mt-1">
                  {phoneError}
                </p>
              )}
            </div>
          </div>

          {/* HÀNG 2: Địa chỉ lắp đặt * (Full width hình viên thuốc) */}
          <div className="mt-2.5 sm:mt-3">
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ lắp đặt *"
              className="w-full px-4 py-2.5 sm:py-3 rounded-full bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-medium outline-none shadow-xs focus:ring-2 focus:ring-[#FFCC00] transition-all"
            />
          </div>

          {/* HÀNG 3: DỊCH VỤ CẦN TƯ VẤN (5 TÙY CHỌN CHUẨN: 3 CỘT HÀNG TRÊN, 2 CỘT HÀNG DƯỚI) */}
          <div className="mt-4 sm:mt-5">
            <span className="block text-white font-bold text-xs sm:text-sm mb-2 sm:mb-2.5">
              Dịch vụ cần tư vấn
            </span>

            {/* Hàng trên: 3 dịch vụ đơn lẻ (Internet | Truyền hình | Camera) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Tùy chọn 1: Internet */}
              <div
                onClick={() => setSelectedService("Internet")}
                className={`bg-white rounded-2xl p-2.5 sm:p-3 text-center cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center min-h-[105px] sm:min-h-[120px] border-2 ${
                  selectedService === "Internet"
                    ? "border-[#FFCC00] ring-2 ring-[#FFCC00]/50 shadow-md scale-[1.02]"
                    : "border-transparent hover:border-white/50 hover:shadow-xs"
                }`}
              >
                {/* Nút tròn radio ở góc trên bên phải */}
                <div
                  className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedService === "Internet"
                      ? "border-[#FF7A00] bg-[#FF7A00]"
                      : "border-[#FFA64D] bg-transparent"
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

              {/* Tùy chọn 2: Truyền hình */}
              <div
                onClick={() => setSelectedService("Truyền hình")}
                className={`bg-white rounded-2xl p-2.5 sm:p-3 text-center cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center min-h-[105px] sm:min-h-[120px] border-2 ${
                  selectedService === "Truyền hình"
                    ? "border-[#FFCC00] ring-2 ring-[#FFCC00]/50 shadow-md scale-[1.02]"
                    : "border-transparent hover:border-white/50 hover:shadow-xs"
                }`}
              >
                <div
                  className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedService === "Truyền hình"
                      ? "border-[#FF7A00] bg-[#FF7A00]"
                      : "border-[#FFA64D] bg-transparent"
                  }`}
                >
                  {selectedService === "Truyền hình" && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>

                {/* Icon Truyền hình / FPT Play */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center mb-1">
                  <img
                    src="/images/icons/liquid-glass/fpt-play.webp"
                    alt="Truyền hình"
                    width={44}
                    height={44}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                </div>
                <span className="text-slate-800 font-bold text-xs sm:text-sm tracking-tight leading-tight">
                  Truyền hình
                </span>
              </div>

              {/* Tùy chọn 3: Camera */}
              <div
                onClick={() => setSelectedService("Camera")}
                className={`bg-white rounded-2xl p-2.5 sm:p-3 text-center cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center min-h-[105px] sm:min-h-[120px] border-2 ${
                  selectedService === "Camera"
                    ? "border-[#FFCC00] ring-2 ring-[#FFCC00]/50 shadow-md scale-[1.02]"
                    : "border-transparent hover:border-white/50 hover:shadow-xs"
                }`}
              >
                <div
                  className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedService === "Camera"
                      ? "border-[#FF7A00] bg-[#FF7A00]"
                      : "border-[#FFA64D] bg-transparent"
                  }`}
                >
                  {selectedService === "Camera" && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>

                {/* Icon Camera AI */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center mb-1">
                  <img
                    src="/images/icons/liquid-glass/camera-ai.webp"
                    alt="Camera"
                    width={44}
                    height={44}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                </div>
                <span className="text-slate-800 font-bold text-xs sm:text-sm tracking-tight leading-tight">
                  Camera
                </span>
              </div>
            </div>

            {/* Hàng dưới: 2 gói Combo (Combo Internet - FPT Play | Combo Internet - Camera) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-3">
              {/* Tùy chọn 4: Combo Internet - FPT Play */}
              <div
                onClick={() => setSelectedService("Combo Internet - FPT Play")}
                className={`bg-white rounded-2xl p-2.5 sm:p-3 text-center cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center min-h-[105px] sm:min-h-[120px] border-2 ${
                  selectedService === "Combo Internet - FPT Play"
                    ? "border-[#FFCC00] ring-2 ring-[#FFCC00]/50 shadow-md scale-[1.02]"
                    : "border-transparent hover:border-white/50 hover:shadow-xs"
                }`}
              >
                <div
                  className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedService === "Combo Internet - FPT Play"
                      ? "border-[#FF7A00] bg-[#FF7A00]"
                      : "border-[#FFA64D] bg-transparent"
                  }`}
                >
                  {selectedService === "Combo Internet - FPT Play" && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>

                {/* Icon Combo FPT Play */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center mb-1">
                  <img
                    src="/images/icons/liquid-glass/fpt-play.webp"
                    alt="Combo Internet - FPT Play"
                    width={44}
                    height={44}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                </div>
                <span className="text-slate-800 font-bold text-xs sm:text-sm tracking-tight leading-tight">
                  Combo
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#C84600] mt-0.5 leading-tight">
                  Internet - FPT Play
                </span>
              </div>

              {/* Tùy chọn 5: Combo Internet - Camera */}
              <div
                onClick={() => setSelectedService("Combo Internet - Camera")}
                className={`bg-white rounded-2xl p-2.5 sm:p-3 text-center cursor-pointer transition-all duration-200 relative flex flex-col items-center justify-center min-h-[105px] sm:min-h-[120px] border-2 ${
                  selectedService === "Combo Internet - Camera"
                    ? "border-[#FFCC00] ring-2 ring-[#FFCC00]/50 shadow-md scale-[1.02]"
                    : "border-transparent hover:border-white/50 hover:shadow-xs"
                }`}
              >
                <div
                  className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedService === "Combo Internet - Camera"
                      ? "border-[#FF7A00] bg-[#FF7A00]"
                      : "border-[#FFA64D] bg-transparent"
                  }`}
                >
                  {selectedService === "Combo Internet - Camera" && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>

                {/* Icon Combo Camera */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center mb-1">
                  <img
                    src="/images/icons/liquid-glass/camera-ai.webp"
                    alt="Combo Internet - Camera"
                    width={44}
                    height={44}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                </div>
                <span className="text-slate-800 font-bold text-xs sm:text-sm tracking-tight leading-tight">
                  Combo
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#C84600] mt-0.5 leading-tight">
                  Internet - Camera
                </span>
              </div>
            </div>
          </div>

          {/* HÀNG 4: NÚT BẤM CTA VÀNG NỔI BẬT HÌNH VIÊN THUỐC */}
          <div className="mt-5 sm:mt-6 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 sm:px-10 py-2.5 sm:py-3 rounded-full bg-[#FFCC00] hover:bg-[#FFD633] active:scale-95 text-[#D95300] font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75"
            >
              {isSubmitting ? (
                "Đang gửi đăng ký..."
              ) : (
                <>
                  <span>Tư vấn ngay</span>
                  <span className="text-base sm:text-lg font-bold leading-none">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
