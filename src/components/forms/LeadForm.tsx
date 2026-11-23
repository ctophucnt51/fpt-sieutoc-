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

const CITIES = [
  "TP. Cần Thơ",
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Hải Phòng",
  "Tỉnh / thành phố khác",
];

const WARDS_CAN_THO = [
  "Phường Ninh Kiều",
  "Phường Cái Răng",
  "Phường Bình Thủy",
  "Phường Ô Môn",
  "Phường Thốt Nốt",
  "Huyện Phong Điền",
  "Huyện Cờ Đỏ",
  "Huyện Thới Lai",
  "Huyện Vĩnh Thạnh",
  "Khu vực khác",
];

export default function LeadForm({
  defaultPackage = "Combo GIGA",
  className = "",
  formLocation = "hero-form",
  onSuccess,
  onClose,
}: LeadFormProps) {
  const siteConfig = useSiteConfig();
  const router = useRouter();
  const pathname = usePathname();
  const formId = (formLocation || "lead").replace(/[^a-zA-Z0-9_-]/g, "_");

  // Form states matching mockup
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("TP. Cần Thơ");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const [packageInterested, setPackageInterested] = useState(() => {
    if (defaultPackage === "Combo GIGA" || defaultPackage.includes("220")) {
      return "Combo Internet + Ngoại Hạng Anh (220.000đ/tháng)";
    }
    if (defaultPackage === "SKY" || defaultPackage.includes("195")) {
      return "Chỉ Internet Wi-Fi 6 (195.000đ/tháng)";
    }
    return defaultPackage;
  });
  const [honeypot, setHoneypot] = useState("");

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Sync defaultPackage
  useEffect(() => {
    if (defaultPackage) {
      if (defaultPackage === "SKY" || defaultPackage.includes("195")) {
        setPackageInterested("Chỉ Internet Wi-Fi 6 (195.000đ/tháng)");
      } else if (defaultPackage === "Combo GIGA" || defaultPackage.includes("220")) {
        setPackageInterested("Combo Internet + Ngoại Hạng Anh (220.000đ/tháng)");
      } else {
        setPackageInterested(defaultPackage);
      }
    }
  }, [defaultPackage]);

  // Phone validation
  const validatePhone = (val: string) => {
    const cleaned = val.replace(/\s+/g, "").replace(/[-.]/g, "");
    const vnPhoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    if (!cleaned) {
      setPhoneError("Vui lòng nhập số điện thoại.");
      return false;
    }
    if (!vnPhoneRegex.test(cleaned)) {
      setPhoneError("Số điện thoại không hợp lệ (cần 10 chữ số).");
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

    if (isDuplicatePhone(cleanedPhone)) {
      setErrorMessage(
        "Số điện thoại này vừa gửi đăng ký. Chuyên viên FPT sẽ liên hệ lại ngay!"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const attribution = captureAttribution();
      const eventId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const selectedArea = ward ? `${city} - ${ward}` : city;
      const detailedAddress = address.trim()
        ? `${address.trim()}, ${selectedArea}`
        : selectedArea;

      const workerPayload = {
        fullName: fullName.trim(),
        phone: cleanedPhone,
        address: detailedAddress,
        area: selectedArea,
        packageInterested: packageInterested || "Chưa chọn gói (Cần tư vấn)",
        note: "",
        agreeConsent: true,
        landingPage: pathname || "/",
        leadLocation: formLocation,
        eventId: eventId,
        ...attribution,
      };

      let cfSuccess = false;
      let cfErr: Error | null = null;
      try {
        const workerRes = await fetch(
          "https://fpt-lead-receiver.phucnt51.workers.dev/api/leads",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(workerPayload),
          }
        );

        if (workerRes.ok) {
          cfSuccess = true;
        } else {
          cfErr = new Error(`Lưu trữ tạm gián đoạn (Mã ${workerRes.status})`);
        }
      } catch (err: unknown) {
        cfErr = err instanceof Error ? err : new Error("Lỗi mạng khi kết nối máy chủ");
      }

      if (!cfSuccess && cfErr) {
        setErrorMessage(cfErr.message || "Lỗi kết nối. Vui lòng gọi trực tiếp Hotline!");
        setIsSubmitting(false);
        return;
      }

      markPhoneSubmitted(cleanedPhone);

      let leadId = `FPT-${Date.now().toString(36).toUpperCase()}`;
      try {
        const internalRes = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: fullName.trim(),
            phone: cleanedPhone,
            address: detailedAddress,
            area: selectedArea,
            packageInterested: packageInterested || "Chưa chọn gói (Cần tư vấn)",
            note: undefined,
            agreeConsent: true,
            landingPage: pathname || "/",
            website: honeypot,
            eventId,
            ...attribution,
          }),
        });

        if (internalRes.ok) {
          const internalData = await internalRes.json();
          if (internalData.leadId) {
            leadId = internalData.leadId;
          }
        }
      } catch {
        // Non-fatal
      }

      fbTracker.lead(eventId, packageInterested || "Chưa chọn gói");
      googleTracker.formConversion(packageInterested || "Chưa chọn gói", leadId);

      try {
        sessionStorage.setItem(
          "fpt_lead_confirmation",
          JSON.stringify({
            leadId,
            fullName: fullName.trim(),
            phone: cleanedPhone.slice(-4),
            packageInterested: packageInterested || "Chưa chọn gói",
            area: selectedArea,
            timestamp: new Date().toLocaleTimeString("vi-VN"),
          })
        );
      } catch {
        // Ignore
      }

      if (onSuccess) {
        onSuccess();
      }

      router.push(`/cam-on?code=${leadId}`);
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra. Quý khách vui lòng gọi Hotline trực tiếp.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="lead-form"
      className={`bg-[#FFFAF4] rounded-2xl sm:rounded-3xl border border-[#FCE7D8] shadow-sm p-5 sm:p-6 lg:p-7 ${className}`}
    >
      {/* Header matching Mockup: GOFPT Logo | Đăng ký lắp mạng FPT + WiFi icon + Close */}
      <div className="flex items-center justify-between pb-4 mb-4 sm:mb-5 border-b border-[#F7DFCE]">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <img
            src="/images/logo-gofpt.svg"
            alt="GOFPT"
            width={110}
            height={32}
            className="h-6 sm:h-7 w-auto object-contain shrink-0"
          />
          <span className="text-[#9CA3AF] font-light text-lg sm:text-xl leading-none">|</span>
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#1E293B] tracking-tight truncate">
            Đăng ký lắp mạng FPT
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {/* Wi-Fi Wave Icon in Orange */}
          <svg
            width="22"
            height="18"
            viewBox="0 0 24 20"
            fill="none"
            stroke="#C84600"
            strokeWidth="2.4"
            strokeLinecap="round"
            className="shrink-0"
            aria-hidden="true"
          >
            <path d="M3 5C7.8 1 16.2 1 21 5" />
            <path d="M6.5 9.5C9.8 6.5 14.2 6.5 17.5 9.5" />
            <path d="M10 14C11.2 12.8 12.8 12.8 14 14" />
          </svg>

          {/* Close Icon (Active if inside modal) */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-[#64748B] hover:text-[#0F172A] p-0.5 text-xl font-normal leading-none cursor-pointer transition-colors"
              aria-label="Đóng cửa sổ"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-snug">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Honeypot field */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Row 1: Họ và tên & Số điện thoại (Desktop 2 cols, Mobile 1 col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor={`${formId}-fullName`} className="block text-xs sm:text-sm font-semibold text-[#1E293B] mb-1.5">
              Họ và tên
            </label>
            <input
              id={`${formId}-fullName`}
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#C84600] focus:ring-1 focus:ring-[#C84600]/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-phone`} className="block text-xs sm:text-sm font-semibold text-[#1E293B] mb-1.5">
              Số điện thoại
            </label>
            <input
              id={`${formId}-phone`}
              type="tel"
              required
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Nhập số điện thoại"
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all ${
                phoneError ? "border-red-400 focus:ring-1 focus:ring-red-400" : "border-[#E2E8F0] focus:border-[#C84600] focus:ring-1 focus:ring-[#C84600]/20"
              }`}
            />
            {phoneError && (
              <p className="text-red-600 text-xs mt-1">{phoneError}</p>
            )}
          </div>
        </div>

        {/* Row 2: Tỉnh / thành phố & Phường / xã (Desktop 2 cols, Mobile 1 col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor={`${formId}-city`} className="block text-xs sm:text-sm font-semibold text-[#1E293B] mb-1.5">
              Tỉnh / thành phố
            </label>
            <select
              id={`${formId}-city`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] outline-none focus:border-[#C84600] focus:ring-1 focus:ring-[#C84600]/20 transition-all cursor-pointer appearance-none bg-no-repeat bg-[right_14px_center] pr-9"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              }}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${formId}-ward`} className="block text-xs sm:text-sm font-semibold text-[#1E293B] mb-1.5">
              Phường / xã
            </label>
            <select
              id={`${formId}-ward`}
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] outline-none focus:border-[#C84600] focus:ring-1 focus:ring-[#C84600]/20 transition-all cursor-pointer appearance-none bg-no-repeat bg-[right_14px_center] pr-9"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              }}
            >
              <option value="">Chọn phường / xã</option>
              {WARDS_CAN_THO.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Địa chỉ lắp đặt */}
        <div>
          <label htmlFor={`${formId}-address`} className="block text-xs sm:text-sm font-semibold text-[#1E293B] mb-1.5">
            Địa chỉ lắp đặt
          </label>
          <input
            id={`${formId}-address`}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, tên đường hoặc ấp"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#C84600] focus:ring-1 focus:ring-[#C84600]/20 transition-all"
          />
        </div>

        {/* Row 4: Gói quan tâm */}
        <div>
          <label htmlFor={`${formId}-packageInterested`} className="block text-xs sm:text-sm font-semibold text-[#1E293B] mb-1.5">
            Gói quan tâm
          </label>
          <select
            id={`${formId}-packageInterested`}
            name="packageInterested"
            value={packageInterested}
            onChange={(e) => setPackageInterested(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] outline-none focus:border-[#C84600] focus:ring-1 focus:ring-[#C84600]/20 transition-all cursor-pointer appearance-none bg-no-repeat bg-[right_14px_center] pr-9"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            }}
          >
            <option value="">Chưa chọn gói</option>
            <option value="Combo Internet + Ngoại Hạng Anh (220.000đ/tháng)">
              Combo Internet + Ngoại Hạng Anh (220.000đ/tháng)
            </option>
            <option value="Chỉ Internet Wi-Fi 6 (195.000đ/tháng)">
              Chỉ Internet Wi-Fi 6 (195.000đ/tháng)
            </option>
            <option value="F-GAME (235.000đ/tháng)">
              Gói Game F-GAME (235.000đ/tháng)
            </option>
            <option value="META 1 Gbps (300.000đ/tháng)">
              Gói META 1 Gbps (300.000đ/tháng)
            </option>
            <option value="Tư vấn gói cước phù hợp">
              Tư vấn gói cước phù hợp
            </option>
          </select>
        </div>

        {/* Row 5: Nút Gửi đăng ký (FPT Burnt Orange matching mockup) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-[#C84600] hover:bg-[#B33E06] active:bg-[#9E3605] text-white font-bold text-base tracking-wide transition-all cursor-pointer disabled:opacity-60 shadow-xs mt-1"
        >
          {isSubmitting ? "Đang gửi đăng ký..." : "Gửi đăng ký"}
        </button>

        {/* Row 6: Dòng xác nhận bên dưới nút */}
        <p className="text-center text-xs sm:text-sm text-[#475569] font-medium pt-1">
          GOFPT sẽ gọi lại để xác nhận.
        </p>
      </form>
    </div>
  );
}
