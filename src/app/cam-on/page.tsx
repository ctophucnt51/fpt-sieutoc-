"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";
import { fbTracker } from "@/components/tracking/MetaPixel";
import { googleTracker } from "@/components/tracking/GoogleAds";
import { CheckCircle2, Phone, ArrowLeft, Clock, ShieldCheck, Loader2 } from "lucide-react";

interface LeadConfirmation {
  leadId: string;
  fullName: string;
  phone: string;
  packageInterested: string;
  area: string;
  timestamp: string;
}

function CamOnContent() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code") || "FPT-SUCCESS";
  const [confirmation, setConfirmation] = useState<LeadConfirmation | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("fpt_lead_confirmation");
      if (saved) {
        setConfirmation(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleHotlineCall = () => {
    fbTracker.contact("hotline", "Thank You Page Hotline Call");
  };

  return (
    <div className="max-w-xl w-full bg-white/92 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_20px_50px_rgba(15,23,42,0.06)] p-6 sm:p-8 text-center relative">
      {/* Success Icon */}
      <div className="w-16 h-16 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Đăng Ký Tư Vấn Thành Công!
      </h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
        Cảm ơn bạn đã tin tưởng FPT Telecom. Yêu cầu của bạn đã được chuyển đến chuyên viên phụ trách khu vực.
      </p>

      {/* Lead Details Card */}
      <div className="my-6 p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-left text-xs sm:text-sm space-y-2.5 shadow-2xs">
        <div className="flex justify-between items-center border-b border-slate-200/80 pb-2.5">
          <span className="text-slate-500 font-medium">Mã tiếp nhận hồ sơ:</span>
          <span className="font-mono font-bold text-fpt-orange bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200/80 text-xs sm:text-sm shadow-2xs">
            {confirmation?.leadId || codeParam}
          </span>
        </div>
        {confirmation && (
          <>
            <div className="flex justify-between items-center pt-0.5">
              <span className="text-slate-500 font-medium">Người đăng ký:</span>
              <span className="font-bold text-slate-900">{confirmation.fullName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Gói quan tâm:</span>
              <span className="font-bold text-fpt-orange">{confirmation.packageInterested}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Khu vực:</span>
              <span className="font-semibold text-slate-900">{confirmation.area}</span>
            </div>
          </>
        )}
      </div>

      {/* Next Steps Guide */}
      <div className="text-left bg-white/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-6 space-y-3 shadow-2xs">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-fpt-orange" />
          Các bước tiếp theo:
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-100 text-fpt-orange text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <span>
              Chuyên viên FPT gọi xác nhận thông tin và kiểm tra cổng quang trong vòng <strong>5 – 15 phút</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-100 text-fpt-orange text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <span>
              Kỹ thuật viên liên hệ hẹn giờ thuận tiện nhất để triển khai kéo cáp và lắp đặt thiết bị.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-orange-100 text-fpt-orange text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <span>
              Quý khách chỉ cần chuẩn bị ảnh <strong>Căn cước công dân (CCCD)</strong> để ký hợp đồng điện tử.
            </span>
          </li>
        </ul>
      </div>

      {/* Urgent Call Hotline */}
      <div className="space-y-3">
        <p className="text-xs text-slate-500 font-medium">Cần hỗ trợ khảo sát gấp hoặc kết nối ngay?</p>
        <a
          href={siteConfig.contact.hotlineTel}
          onClick={handleHotlineCall}
          className="w-full py-3.5 px-6 rounded-full bg-fpt-orange hover:bg-fpt-hover text-white font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(243,112,33,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Phone className="w-4 h-4" />
          <span>GỌI HOTLINE: {siteConfig.contact.hotlineDisplay}</span>
        </a>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-fpt-orange transition-colors font-medium mt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay về trang chủ</span>
          </Link>
        </div>
      </div>

      {/* Security badge */}
      <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Thông tin của bạn được cam kết bảo mật 100% theo quy định pháp luật.</span>
      </div>
    </div>
  );
}

export default function CamOnPage() {
  return (
    <div className="min-h-[80vh] bg-slate-50/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="max-w-xl w-full bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-fpt-orange" />
            <p className="mt-3 text-sm text-slate-500">Đang tải thông tin hồ sơ...</p>
          </div>
        }
      >
        <CamOnContent />
      </Suspense>
    </div>
  );
}
