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
}

const DUPLICATE_STORAGE_KEY = "fpt_recent_submissions";

export default function LeadForm({
  defaultPackage = "SKY",
  headline = "Đăng Ký Tư Vấn",
  subheadline = "Liên hệ lại sau 5 - 15 phút",
  className = "",
  formTitle,
  formSubtitle,
  formLocation = "hero-form",
  onSuccess,
}: LeadFormProps) {
  const siteConfig = useSiteConfig();
  const router = useRouter();
  const pathname = usePathname();
  const formId = (formLocation || "lead").replace(/[^a-zA-Z0-9_-]/g, "_");

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
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

      const workerPayload = {
        fullName: fullName.trim(),
        phone: cleanedPhone,
        address: address.trim() || "Chưa cung cấp",
        area: address.trim() || "Cần Thơ",
        packageInterested: packageInterested,
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
            address: address.trim() || undefined,
            area: address.trim() || "Cần Thơ",
            packageInterested,
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

      fbTracker.lead(eventId, packageInterested);
      googleTracker.formConversion(packageInterested, leadId);

      try {
        sessionStorage.setItem(
          "fpt_lead_confirmation",
          JSON.stringify({
            leadId,
            fullName: fullName.trim(),
            phone: cleanedPhone.slice(-4),
            packageInterested,
            area: address.trim() || "Cần Thơ",
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
      className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 ${className}`}
    >
      {/* Header */}
      {(formTitle !== "" && headline !== "") && (
        <div className="mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            {formTitle || headline}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {formSubtitle || subheadline}
          </p>
        </div>
      )}

      {/* Error Alert - Plain text, No icon */}
      {errorMessage && (
        <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs leading-snug">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
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

        {/* Họ và tên */}
        <div>
          <label htmlFor={`${formId}-fullName`} className="block text-xs font-semibold text-slate-700 mb-1">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            id={`${formId}-fullName`}
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#F37021] text-sm text-slate-900 outline-none transition-colors"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label htmlFor={`${formId}-phone`} className="block text-xs font-semibold text-slate-700 mb-1">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id={`${formId}-phone`}
            type="tel"
            required
            value={phone}
            onChange={handlePhoneChange}
            placeholder="0912 345 678"
            className={`w-full px-3 py-2 rounded-lg border bg-slate-50 hover:bg-white focus:bg-white text-sm text-slate-900 outline-none transition-colors ${
              phoneError ? "border-red-400" : "border-slate-200 focus:border-[#F37021]"
            }`}
          />
          {phoneError && (
            <p className="text-red-600 text-xs mt-1">{phoneError}</p>
          )}
        </div>

        {/* Địa chỉ lắp đặt */}
        <div>
          <label htmlFor={`${formId}-address`} className="block text-xs font-semibold text-slate-700 mb-1">
            Địa chỉ lắp đặt <span className="text-red-500">*</span>
          </label>
          <input
            id={`${formId}-address`}
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, tên đường, phường/xã"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#F37021] text-sm text-slate-900 outline-none transition-colors"
          />
        </div>

        {/* Gói cước quan tâm */}
        <div>
          <label htmlFor={`${formId}-packageInterested`} className="block text-xs font-semibold text-slate-700 mb-1">
            Gói cước quan tâm <span className="text-red-500">*</span>
          </label>
          <select
            id={`${formId}-packageInterested`}
            name="packageInterested"
            value={packageInterested}
            onChange={(e) => setPackageInterested(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#F37021] text-sm text-slate-900 outline-none transition-colors cursor-pointer"
          >
            <option value="Combo Internet + Ngoại Hạng Anh (220.000đ/tháng)">
              Combo Internet + Ngoại Hạng Anh (220.000đ/tháng)
            </option>
            <option value="Chỉ Internet Wi-Fi 6 (195.000đ/tháng)">
              Chỉ Internet Wi-Fi 6 (195.000đ/tháng)
            </option>
            <option value="F-GAME (235.000đ/tháng)">
              Gói Game F-GAME (235.000đ/tháng)
            </option>
            <option value="Tư vấn gói cước phù hợp">
              Cần tư vấn thêm gói cước khác
            </option>
          </select>
        </div>

        {/* Submit Button - Plain & Bold, No Icon */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-lg bg-[#F37021] hover:bg-[#E05D10] text-white font-bold text-sm tracking-wide transition-colors cursor-pointer disabled:opacity-60 mt-1"
        >
          {isSubmitting ? "Đang gửi thông tin..." : "GỬI ĐĂNG KÝ"}
        </button>

        {/* Hotline Support */}
        <p className="text-center text-xs text-slate-500 pt-1">
          Hotline tiếp nhận:{" "}
          <a
            href={siteConfig.contact.hotlineTel}
            onClick={() => fbTracker.contact("hotline", "Form Direct Hotline Click")}
            className="font-bold text-[#F37021] hover:underline"
          >
            {siteConfig.contact.hotlineDisplay}
          </a>
        </p>
      </form>
    </div>
  );
}
