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
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog Card Container */}
      <div className="relative w-full max-w-lg z-10 overflow-hidden my-auto max-h-[96vh] flex flex-col">
        <LeadForm
          defaultPackage={selectedPackage || "Combo GIGA"}
          formLocation="lead-modal-form"
          onSuccess={onClose}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
