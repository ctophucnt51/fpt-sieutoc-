"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import LeadModal from "@/components/forms/LeadModal";

interface LeadModalContextType {
  isOpen: boolean;
  selectedPackage?: string;
  openLeadModal: (pkgName?: string) => void;
  closeLeadModal: () => void;
}

const LeadModalContext = createContext<LeadModalContextType | undefined>(undefined);

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);

  const openLeadModal = (pkgName?: string) => {
    setSelectedPackage(pkgName);
    setIsOpen(true);
  };

  const closeLeadModal = () => {
    setIsOpen(false);
    setSelectedPackage(undefined);
  };

  // Support global custom event so any button without hook access can trigger modal
  useEffect(() => {
    const handleCustomOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ package?: string }>;
      openLeadModal(customEvent.detail?.package);
    };

    window.addEventListener("fpt:open-lead-modal", handleCustomOpen);
    return () => {
      window.removeEventListener("fpt:open-lead-modal", handleCustomOpen);
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <LeadModalContext.Provider value={{ isOpen, selectedPackage, openLeadModal, closeLeadModal }}>
      {children}
      <LeadModal isOpen={isOpen} selectedPackage={selectedPackage} onClose={closeLeadModal} />
    </LeadModalContext.Provider>
  );
}

export function useLeadModal() {
  const context = useContext(LeadModalContext);
  if (!context) {
    throw new Error("useLeadModal must be used within a LeadModalProvider");
  }
  return context;
}

// Global trigger function to open modal from anywhere
export function triggerLeadModal(pkgName?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("fpt:open-lead-modal", { detail: { package: pkgName } })
    );
  }
}
