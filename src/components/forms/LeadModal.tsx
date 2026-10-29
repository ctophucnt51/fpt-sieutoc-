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
      {/* Backdrop with soft blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog Card - White Glassmorphism */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-white/90 z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-50/90 via-white to-orange-50/50 border-b border-orange-100/80 px-5 py-4 sm:px-6 sm:py-4.5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-fpt-orange font-bold uppercase tracking-wider mb-0.5">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Tiếp Nhận Đăng Ký Trực Tuyến 24/7</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Đăng Ký Lắp Mạng FPT Siêu Tốc
            </h3>
            {selectedPackage && (
              <p className="text-xs text-slate-500 mt-0.5">
                Gói quan tâm: <strong className="text-slate-900 font-bold">{selectedPackage}</strong>
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-3 sm:p-5 flex-1">
          {/* Promo Callout in Modal */}
          <div className="mb-3.5 p-3 rounded-2xl bg-orange-50/70 border border-orange-200/70 text-xs text-slate-700 flex items-center gap-2.5 shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-orange-100 border border-orange-200 text-fpt-orange flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-[11px] sm:text-xs leading-snug">
              <strong className="text-slate-900 font-bold">Ưu đãi hôm nay:</strong> Trang bị Modem Wi-Fi 6 &amp; <strong className="text-fpt-orange font-bold">Camera AI 0đ</strong> &bull; Lắp đặt trong 24h.
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
