"use client";

import React, { useEffect } from "react";
import { X, ShieldCheck, Zap } from "lucide-react";
import LeadForm from "./LeadForm";

interface LeadModalProps {
  isOpen: boolean;
  selectedPackage?: string;
  onClose: () => void;
}

export default function LeadModal({ isOpen, selectedPackage, onClose }: LeadModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog Card - Long Châu Style */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_60px_rgba(243,112,33,0.18)] border border-[#E4E8ED] z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#FFF4ED] border-b border-orange-200/60 px-5 py-4 sm:px-6 sm:py-4.5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#F37021] font-bold uppercase tracking-wider mb-0.5">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Tiếp Nhận Đăng Ký Trực Tuyến 24/7</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#20283D] tracking-tight">
              Đăng Ký Lắp Mạng FPT Siêu Tốc
            </h3>
            {selectedPackage && (
              <p className="text-xs text-[#657384] mt-0.5">
                Gói quan tâm: <strong className="text-[#20283D] font-bold">{selectedPackage}</strong>
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#657384] hover:text-[#20283D] hover:bg-white transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-3 sm:p-5 flex-1">
          {/* Promo Callout in Modal */}
          <div className="mb-3.5 p-3 rounded-xl bg-[#F4F6FB] border border-[#E4E8ED] text-xs text-[#2F364A] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FFF4ED] border border-orange-200 p-0.5 flex items-center justify-center shrink-0">
              <img
                src="/images/icons/liquid-glass/qua-tang.webp"
                alt="Ưu đãi hôm nay"
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
            </div>
            <div className="text-[11px] sm:text-xs leading-snug">
              <strong className="text-[#20283D] font-bold">Ưu đãi hôm nay:</strong> Trang bị Modem Wi-Fi 6 &amp; <strong className="text-[#F37021] font-bold">Camera AI 0đ</strong> &bull; Lắp đặt trong 24h.
            </div>
          </div>

          {/* Embedded Lead Form */}
          <LeadForm
            defaultPackage={selectedPackage || "Combo GIGA"}
            formTitle=""
            formSubtitle=""
            formLocation="lead-modal-form"
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
}
