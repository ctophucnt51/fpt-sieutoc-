"use client";

import React, { useEffect } from "react";
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Đăng Ký Tư Vấn
            </h3>
            {selectedPackage && (
              <p className="text-xs text-slate-500 mt-0.5">
                Gói: <strong className="text-slate-800 font-semibold">{selectedPackage}</strong>
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-2xl font-light leading-none p-1 transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
          <LeadForm
            defaultPackage={selectedPackage || "Combo GIGA"}
            formTitle=""
            formSubtitle=""
            formLocation="lead-modal-form"
            onSuccess={onClose}
            className="border-0 shadow-none p-0"
          />
        </div>
      </div>
    </div>
  );
}
