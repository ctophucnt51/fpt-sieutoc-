"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSiteConfig } from "@/context/ConfigContext";
import { captureAttribution } from "@/lib/trackingUtils";
import { fbTracker } from "@/components/tracking/MetaPixel";
import { googleTracker } from "@/components/tracking/GoogleAds";
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2, AlertCircle, PhoneCall, Sparkles, Clock, Zap } from "lucide-react";
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
  headline = "Đăng Ký Tư Vấn & Khảo Sát Miễn Phí",
  subheadline = "Chuyên viên FPT liên hệ lại sau 5 - 15 phút để kiểm tra hạ tầng và báo giá ưu đãi nhất",
  badgeText = "Ưu Đãi Áp Dụng Hôm Nay",
  className = "",
  formTitle,
  formSubtitle,
  formLocation = "hero-mobile-form",
  onSuccess,
}: LeadFormProps) {
  const siteConfig = useSiteConfig();
  const router = useRouter();
  const pathname = usePathname();

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
  const [agreeConsent, setAgreeConsent] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // hidden field

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Sync defaultPackage if changed via prop or external click
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

  // Phone validation helper (Không dùng chữ Ví dụ)
  const validatePhone = (val: string) => {
    const cleaned = val.replace(/\s+/g, "").replace(/[-.]/g, "");
    const vnPhoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    if (!cleaned) {
      setPhoneError("Vui lòng nhập số điện thoại.");
      return false;
    }
    if (!vnPhoneRegex.test(cleaned)) {
      setPhoneError("Số điện thoại không đúng định dạng di động Việt Nam (gồm 10 chữ số).");
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

    // 1. Honeypot check
    if (honeypot) {
      console.warn("Bot detected via honeypot.");
      router.push("/cam-on");
      return;
    }

    // 2. Phone validation
    const cleanedPhone = phone.replace(/\s+/g, "").replace(/[-.]/g, "");
    if (!validatePhone(cleanedPhone)) {
      return;
    }

    // 3. Duplicate check within 30 minutes
    if (isDuplicatePhone(cleanedPhone)) {
      setErrorMessage(
        "Số điện thoại này vừa gửi thông tin đăng ký trong vòng 30 phút qua. Chuyên viên FPT đang tiếp nhận và liên hệ lại ngay. Quý khách vui lòng không gửi lại liên tục!"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const attribution = captureAttribution();
      const eventId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // 4. Chuẩn bị payload gửi về Worker
      const workerPayload = {
        name: fullName.trim(),
        phone: cleanedPhone,
        address: address.trim() || undefined,
        area: area || siteConfig.popularAreas[0]?.name,
        service: packageInterested,
        note: note.trim() || undefined,
        formLocation: formLocation,
        source: attribution.utm_source || "direct",
        campaign: attribution.utm_campaign || undefined,
        medium: attribution.utm_medium || undefined,
        term: attribution.utm_term || undefined,
        content: attribution.utm_content || undefined,
        fbclid: attribution.fbclid || undefined,
        gclid: attribution.gclid || undefined,
      };

      // 5. Gửi trực tiếp tới Cloudflare Worker để bắn thông báo về Telegram
      const WORKER_ENDPOINT = "https://form-fpt.cto-phucnt51.workers.dev/";

      let cfSuccess = false;
      try {
        const cfResponse = await fetch(WORKER_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workerPayload),
        });

        if (!cfResponse.ok) {
          throw new Error(`Máy chủ tiếp nhận phản hồi mã lỗi HTTP ${cfResponse.status}.`);
        }

        const cfData = await cfResponse.json();

        if (cfData?.ok !== true) {
          throw new Error(cfData?.message || "Hệ thống tiếp nhận phản hồi không thành công. Vui lòng thử lại!");
        }

        cfSuccess = true;
      } catch (cfErr: unknown) {
        console.error("Cloudflare Worker / CORS Error:", cfErr);
        const errMsg =
          cfErr instanceof Error && (cfErr.name === "TypeError" || cfErr.message.includes("fetch"))
            ? "Lỗi kết nối tới hệ thống tiếp nhận. Vui lòng thử lại hoặc gọi Hotline!"
            : cfErr instanceof Error
            ? cfErr.message
            : "Lỗi kết nối tới hệ thống tiếp nhận Telegram.";
        setErrorMessage(errMsg);
        setIsSubmitting(false);
        return;
      }

      if (!cfSuccess) return;

      markPhoneSubmitted(cleanedPhone);

      // 6. Đồng bộ Lead vào hệ thống nội bộ
      let leadId = `FPT-${Date.now().toString(36).toUpperCase()}`;
      try {
        const internalRes = await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

      // 7. Kích hoạt Pixel & Google Ads Conversion Event
      fbTracker.lead(eventId, packageInterested);
      googleTracker.formConversion(packageInterested, leadId);

      // 8. Lưu thông tin tạm để hiển thị trên trang Cảm Ơn
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
        // Ignore session storage error
      }

      // 9. Gọi callback thành công nếu có
      if (onSuccess) {
        onSuccess();
      }

      // 10. Chuyển hướng sang trang Cảm Ơn
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
      className={`bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_16px_50px_rgba(15,23,42,0.08)] p-4 sm:p-5 lg:p-6.5 relative overflow-hidden transition-all ${className}`}
    >
      {/* Decorative Ambient Glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-br from-orange-400/15 via-amber-300/10 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Header Section */}
      {(formTitle !== "" && headline !== "") && (
        <div className="mb-3.5 pb-3 border-b border-slate-100">
          {badgeText && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-fpt-orange border border-orange-200/80 font-bold text-[10px] sm:text-[11px] tracking-wide uppercase mb-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>{badgeText}</span>
            </span>
          )}
          <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 tracking-tight leading-snug">
            {formTitle || headline}
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-relaxed">
            {formSubtitle || subheadline}
          </p>
        </div>
      )}

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <div className="leading-snug">
            <span className="font-semibold block">Không thể gửi thông tin:</span>
            <span>{errorMessage}</span>
          </div>
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
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Họ và Tên <span className="text-fpt-orange">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên của bạn"
            className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white hover:border-slate-300 focus:border-fpt-orange focus:ring-4 focus:ring-orange-500/10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 font-normal"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Số Điện Thoại Nhận Ưu Đãi <span className="text-fpt-orange">*</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Nhập số điện thoại liên hệ"
            className={`w-full px-3.5 py-2.5 sm:py-3 rounded-xl border bg-slate-50/70 hover:bg-white focus:bg-white text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 font-normal ${
              phoneError
                ? "border-red-400 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 hover:border-slate-300 focus:border-fpt-orange focus:ring-4 focus:ring-orange-500/10"
            }`}
          />
          {phoneError && (
            <p className="text-red-600 text-[11px] font-medium mt-1">{phoneError}</p>
          )}
        </div>

        {/* Khu vực lắp đặt (Searchable dropdown) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Khu Vực / Xã Phường Lắp Đặt <span className="text-fpt-orange">*</span>
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
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Địa Chỉ Khảo Sát Tận Nơi <span className="text-slate-400 font-normal lowercase">(số nhà, tên đường, thôn / ấp)</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, tên đường hoặc thôn / ấp"
            className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white hover:border-slate-300 focus:border-fpt-orange focus:ring-4 focus:ring-orange-500/10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 font-normal"
          />
        </div>

        {/* Gói cước đăng ký */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-800">
              Gói Cước Đăng Ký <span className="text-fpt-orange">*</span>
            </label>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>Tặng Camera AI 0đ</span>
            </span>
          </div>

          <div className="relative">
            <select
              name="packageInterested"
              value={packageInterested}
              onChange={(e) => setPackageInterested(e.target.value)}
              className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white hover:border-slate-300 focus:border-fpt-orange focus:ring-4 focus:ring-orange-500/10 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition-all cursor-pointer appearance-none pr-9"
            >
              <optgroup label="GÓI CƯỚC KHUYÊN DÙNG HÔM NAY">
                <option value="Combo Internet + Ngoại Hạng Anh (220.000đ/tháng)">
                  Combo Internet + Ngoại Hạng Anh - 220.000đ/tháng (380 trận EPL • Khuyên dùng)
                </option>
                <option value="Chỉ Internet Wi-Fi 6 (195.000đ/tháng)">
                  Gói chỉ Internet Wi-Fi 6 - 195.000đ/tháng (Sky 1 Gbps • Phổ biến)
                </option>
              </optgroup>
              <optgroup label="GÓI INTERNET CÁP QUANG TỐC ĐỘ CAO">
                <option value="F-GAME (235.000đ/tháng)">
                  F-GAME: Giảm ping chuyên nghiệp, tích hợp Ultra Fast (235.000đ/tháng)
                </option>
                <option value="META (300.000đ/tháng)">
                  META: 1 Gbps đối xứng Upload/Download (300.000đ/tháng)
                </option>
              </optgroup>
              <optgroup label="GÓI COMBO INTERNET + FPT PLAY">
                <option value="Combo SKY (239.000đ/tháng)">
                  Combo SKY: Internet 1 Gbps + FPT Play Ngoại Hạng Anh (239.000đ/tháng)
                </option>
                <option value="Combo META (340.000đ/tháng)">
                  Combo META: Internet 1 Gbps đối xứng + FPT Play VIP (340.000đ/tháng)
                </option>
              </optgroup>
              <optgroup label="TƯ VẤN TRỰC TIẾP">
                <option value="Tư vấn gói cước phù hợp">
                  Chưa chọn được - Cần chuyên viên FPT khảo sát &amp; tư vấn theo nhu cầu thực tế
                </option>
              </optgroup>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ghi chú tùy chọn */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Ghi Chú Yêu Cầu <span className="text-slate-400 font-normal lowercase">(thời gian tiện nghe máy hoặc yêu cầu thêm)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thời gian tiện nghe máy hoặc yêu cầu thêm"
            className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white hover:border-slate-300 focus:border-fpt-orange focus:ring-4 focus:ring-orange-500/10 text-xs sm:text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 font-normal"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="pt-0.5">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-snug">
            <input
              type="checkbox"
              required
              checked={agreeConsent}
              onChange={(e) => setAgreeConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-fpt-orange focus:ring-fpt-orange shrink-0 cursor-pointer accent-orange-500"
            />
            <span>
              Tôi đồng ý nhận tư vấn khảo sát và đồng ý với{" "}
              <Link
                href="/chinh-sach-bao-mat"
                target="_blank"
                className="text-slate-900 underline hover:text-fpt-orange font-semibold"
              >
                Chính sách bảo mật
              </Link>
              .
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-fpt-orange to-[#d4560b] hover:from-orange-600 hover:to-fpt-orange text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_8px_25px_rgba(243,112,33,0.35)] hover:shadow-[0_12px_32px_rgba(243,112,33,0.45)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span className="leading-tight">Đang gửi đăng ký...</span>
            </>
          ) : (
            <>
              <span className="leading-tight">GỬI ĐĂNG KÝ KHẢO SÁT 0 ĐỒNG</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </>
          )}
        </button>

        {/* Trust Badges Bar */}
        <div className="pt-1.5 grid grid-cols-3 gap-1.5 text-[10px] sm:text-[11px] text-slate-500 font-medium text-center border-t border-slate-100">
          <div className="flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Khảo sát 0đ</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-fpt-orange shrink-0" />
            <span className="truncate">Lắp đặt 24h</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">Bảo mật 100%</span>
          </div>
        </div>

        {/* Urgent Callout */}
        <div className="pt-1 text-center">
          <p className="text-[11px] sm:text-xs text-slate-500">
            {siteConfig.promo?.leadFormUrgentNote || "Cần lắp đặt gấp trong 2 - 4 giờ?"}{" "}
            Gọi ngay:{" "}
            <a
              href={siteConfig.contact.hotlineTel}
              onClick={() => fbTracker.contact("hotline", "Form Urgent Link")}
              className="font-bold text-fpt-orange hover:underline inline-flex items-center gap-1 ml-0.5"
            >
              <PhoneCall className="w-3 h-3 inline" />
              <span>{siteConfig.contact.hotlineDisplay}</span>
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
