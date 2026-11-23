"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSiteConfig } from "@/context/ConfigContext";
import { captureAttribution } from "@/lib/trackingUtils";
import { fbTracker } from "@/components/tracking/MetaPixel";
import { googleTracker } from "@/components/tracking/GoogleAds";
import { Loader2, AlertCircle } from "lucide-react";
import SearchableAreaSelect from "./SearchableAreaSelect";

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

export default function LeadForm({
  defaultPackage = "SKY",
  headline = "Đăng Ký Tư Vấn & Khảo Sát",
  subheadline = "Chuyên viên FPT sẽ liên hệ lại trong 5 – 15 phút",
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
  const [area, setArea] = useState(
    siteConfig.popularAreas[0]?.name || "Cần Thơ - Phường Ninh Kiều"
  );
  const [packageInterested, setPackageInterested] = useState(() => {
    if (defaultPackage === "Combo GIGA" || defaultPackage.includes("220")) {
      return "Combo Internet + Ngoại Hạng Anh (220.000đ/tháng)";
    }
    if (defaultPackage === "SKY" || defaultPackage.includes("195")) {
      return "Chỉ Internet Wi-Fi 6 (195.000đ/tháng)";
    }
    return defaultPackage;
  });
  const [note, setNote] = useState("");
  const [agreeConsent, setAgreeConsent] = useState(true);
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

  const DUPLICATE_STORAGE_KEY = "fpt_recent_submissions";

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
        "Số điện thoại này vừa gửi đăng ký. Chuyên viên FPT đang tiếp nhận và liên hệ lại ngay!"
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
        area: area,
        packageInterested: packageInterested,
        note: note.trim() || undefined,
        formLocation: formLocation,
        landingPage: pathname || "/",
        source: attribution.utm_source || "direct",
        campaign: attribution.utm_campaign || undefined,
        medium: attribution.utm_medium || undefined,
        term: attribution.utm_term || undefined,
        content: attribution.utm_content || undefined,
        fbclid: attribution.fbclid || undefined,
        gclid: attribution.gclid || undefined,
      };

      const WORKER_ENDPOINT = "https://form-fpt.cto-phucnt51.workers.dev/";

      let cfSuccess = false;
      try {
        const cfResponse = await fetch(WORKER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workerPayload),
        });

        if (!cfResponse.ok) {
          throw new Error(`Máy chủ tiếp nhận phản hồi HTTP ${cfResponse.status}.`);
        }

        const cfData = await cfResponse.json();
        if (cfData?.ok !== true) {
          throw new Error(cfData?.message || "Hệ thống tiếp nhận phản hồi không thành công.");
        }

        cfSuccess = true;
      } catch (cfErr: unknown) {
        console.error("Cloudflare Worker Error:", cfErr);
        const errMsg =
          cfErr instanceof Error && (cfErr.name === "TypeError" || cfErr.message.includes("fetch"))
            ? "Lỗi kết nối tới hệ thống tiếp nhận. Vui lòng thử lại hoặc gọi Hotline!"
            : cfErr instanceof Error
            ? cfErr.message
            : "Lỗi kết nối. Vui lòng liên hệ Hotline!";
        setErrorMessage(errMsg);
        setIsSubmitting(false);
        return;
      }

      if (!cfSuccess) return;

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
            area,
            packageInterested,
            note: note.trim() || undefined,
            agreeConsent,
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
            area,
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
      className={`bg-white rounded-2xl border border-[#E2E8F0] shadow-md p-5 sm:p-6 transition-all ${className}`}
    >
      {/* Header */}
      {(formTitle !== "" && headline !== "") && (
        <div className="mb-4 pb-3 border-b border-[#F1F5F9]">
          <h3 className="text-lg sm:text-xl font-bold text-[#1E293B] tracking-tight leading-snug">
            {formTitle || headline}
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            {formSubtitle || subheadline}
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <div className="leading-snug">{errorMessage}</div>
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

        {/* Họ và tên */}
        <div>
          <label htmlFor={`${formId}-fullName`} className="block text-xs font-semibold text-[#334155] mb-1">
            Họ và tên <span className="text-[#E11D48]">*</span>
          </label>
          <input
            id={`${formId}-fullName`}
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ví dụ: Nguyễn Văn A"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white focus:bg-white focus:border-[#F37021] focus:ring-2 focus:ring-orange-500/15 text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8]"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label htmlFor={`${formId}-phone`} className="block text-xs font-semibold text-[#334155] mb-1">
            Số điện thoại <span className="text-[#E11D48]">*</span>
          </label>
          <input
            id={`${formId}-phone`}
            type="tel"
            required
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Ví dụ: 0912 345 678"
            className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#F8FAFC] hover:bg-white focus:bg-white text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8] ${
              phoneError
                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-[#E2E8F0] focus:border-[#F37021] focus:ring-2 focus:ring-orange-500/15"
            }`}
          />
          {phoneError && (
            <p className="text-red-600 text-xs mt-1">{phoneError}</p>
          )}
        </div>

        {/* Khu vực lắp đặt */}
        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1">
            Khu vực lắp đặt <span className="text-[#E11D48]">*</span>
          </label>
          <SearchableAreaSelect
            areas={siteConfig.popularAreas}
            value={area}
            onChange={setArea}
            required
          />
        </div>

        {/* Địa chỉ chi tiết */}
        <div>
          <label htmlFor={`${formId}-address`} className="block text-xs font-semibold text-[#334155] mb-1">
            Địa chỉ chi tiết <span className="text-[#94A3B8] font-normal">(Số nhà, tên đường...)</span>
          </label>
          <input
            id={`${formId}-address`}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, tên đường hoặc thôn / ấp"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white focus:bg-white focus:border-[#F37021] focus:ring-2 focus:ring-orange-500/15 text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8]"
          />
        </div>

        {/* Gói cước quan tâm */}
        <div>
          <label htmlFor={`${formId}-packageInterested`} className="block text-xs font-semibold text-[#334155] mb-1">
            Gói cước quan tâm <span className="text-[#E11D48]">*</span>
          </label>
          <div className="relative">
            <select
              id={`${formId}-packageInterested`}
              name="packageInterested"
              aria-label="Chọn gói cước đăng ký"
              value={packageInterested}
              onChange={(e) => setPackageInterested(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white focus:bg-white focus:border-[#F37021] focus:ring-2 focus:ring-orange-500/15 text-sm font-medium text-[#0F172A] outline-none transition-all cursor-pointer appearance-none pr-9"
            >
              <option value="Combo Internet + Ngoại Hạng Anh (220.000đ/tháng)">
                Combo Internet + Ngoại Hạng Anh — 220.000đ/tháng
              </option>
              <option value="Chỉ Internet Wi-Fi 6 (195.000đ/tháng)">
                Chỉ Internet Wi-Fi 6 (1 Gbps) — 195.000đ/tháng
              </option>
              <option value="F-GAME (235.000đ/tháng)">
                Gói F-GAME (Giảm Ping) — 235.000đ/tháng
              </option>
              <option value="META (300.000đ/tháng)">
                Gói META (1 Gbps đối xứng) — 300.000đ/tháng
              </option>
              <option value="Combo SKY (239.000đ/tháng)">
                Combo SKY + FPT Play — 239.000đ/tháng
              </option>
              <option value="Tư vấn gói cước phù hợp">
                Cần tư vấn gói cước phù hợp
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94A3B8]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ghi chú */}
        <div>
          <label htmlFor={`${formId}-note`} className="block text-xs font-semibold text-[#334155] mb-1">
            Ghi chú <span className="text-[#94A3B8] font-normal">(Tùy chọn)</span>
          </label>
          <input
            id={`${formId}-note`}
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thời gian tiện nghe máy hoặc yêu cầu thêm..."
            className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white focus:bg-white focus:border-[#F37021] focus:ring-2 focus:ring-orange-500/15 text-sm text-[#0F172A] outline-none transition-all placeholder:text-[#94A3B8]"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="pt-0.5">
          <label htmlFor={`${formId}-consent`} className="flex items-center gap-2 cursor-pointer text-xs text-[#64748B]">
            <input
              id={`${formId}-consent`}
              type="checkbox"
              required
              checked={agreeConsent}
              onChange={(e) => setAgreeConsent(e.target.checked)}
              className="w-4 h-4 rounded border-[#CBD5E1] text-[#F37021] focus:ring-[#F37021] shrink-0 cursor-pointer accent-[#F37021]"
            />
            <span>
              Tôi đồng ý với{" "}
              <Link
                href="/chinh-sach-bao-mat"
                target="_blank"
                className="text-[#334155] underline hover:text-[#F37021] font-medium"
              >
                chính sách bảo mật
              </Link>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl bg-[#F37021] hover:bg-[#E05D10] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>Đang gửi thông tin...</span>
            </>
          ) : (
            <span>GỬI ĐĂNG KÝ TƯ VẤN</span>
          )}
        </button>

        {/* Hotline Support */}
        <p className="text-center text-xs text-[#64748B] pt-1">
          Hoặc gọi trực tiếp:{" "}
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
