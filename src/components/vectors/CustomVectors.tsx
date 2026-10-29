"use client";

import React from "react";

interface VectorProps {
  className?: string;
  size?: number;
}

/**
 * 1. High-Speed Fiber Wi-Fi 6 Vector
 * Dual-band radiating signal with supersonic beam
 */
export function Wifi6Vector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="wifiOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#E05000" />
        </linearGradient>
        <linearGradient id="wifiPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA439" />
          <stop offset="100%" stopColor="#FF6B00" />
        </linearGradient>
      </defs>
      {/* Outer Wave */}
      <path
        d="M3 10.5C6.8 6.5 11.8 4 16 4C20.2 4 25.2 6.5 29 10.5"
        stroke="url(#wifiOrangeGrad)"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {/* Middle Wave */}
      <path
        d="M7 15C9.8 12.2 13 10.5 16 10.5C19 10.5 22.2 12.2 25 15"
        stroke="url(#wifiPulseGrad)"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {/* Inner Wave */}
      <path
        d="M11 19.5C12.5 18 14.2 17 16 17C17.8 17 19.5 18 21 19.5"
        stroke="#FF7A00"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Center Signal Core */}
      <circle cx="16" cy="24.5" r="2.75" fill="url(#wifiOrangeGrad)" />
      {/* Wi-Fi 6 Speed Badge */}
      <rect x="22" y="2" width="9" height="7" rx="3.5" fill="#059669" />
      <text x="26.5" y="6.8" textAnchor="middle" fill="#FFFFFF" fontSize="4.5" fontWeight="900" fontFamily="sans-serif">
        6
      </text>
    </svg>
  );
}

/**
 * 2. Premier League EPL Football Vector
 * Dynamic sphere with championship star arcs & gold/red gradients
 */
export function EplFootballVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="eplRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <linearGradient id="goldTrophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      {/* Football Base Sphere */}
      <circle cx="16" cy="16" r="13" fill="url(#eplRedGrad)" stroke="#F87171" strokeWidth="1.5" />
      {/* Hexagonal Pattern */}
      <polygon points="16,10 20.5,13.5 19,19 13,19 11.5,13.5" fill="#FFFFFF" opacity="0.95" />
      <path d="M16 10L16 4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      <path d="M20.5 13.5L26 11" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      <path d="M19 19L24 24" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      <path d="M13 19L8 24" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      <path d="M11.5 13.5L6 11" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      {/* EPL Crown Badge */}
      <path
        d="M10 2L12 4.5L16 2.5L20 4.5L22 2L21 7.5L11 7.5Z"
        fill="url(#goldTrophyGrad)"
        stroke="#FFFFFF"
        strokeWidth="0.75"
      />
    </svg>
  );
}

/**
 * 3. Smart TV & FPT Play Box Vector
 * 4K Display with voice recognition audio waves
 */
export function FptPlayTvVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="tvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* TV Screen Frame */}
      <rect x="2" y="4" width="28" height="19" rx="3" fill="#1E293B" stroke="url(#tvGrad)" strokeWidth="1.5" />
      {/* Inner Screen Display */}
      <rect x="4" y="6" width="24" height="15" rx="1.5" fill="#0F172A" />
      {/* FPT Play Colored Triangle */}
      <polygon points="13,9.5 21,13.5 13,17.5" fill="#FF7A00" />
      {/* TV Stand Base */}
      <path d="M11 27H21" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 23V27" stroke="#64748B" strokeWidth="2" />
      {/* 4K Voice badge */}
      <rect x="20" y="7" width="7" height="4" rx="1" fill="#E11D48" />
      <text x="23.5" y="10" textAnchor="middle" fill="#FFFFFF" fontSize="2.8" fontWeight="bold">
        4K
      </text>
    </svg>
  );
}

/**
 * 4. FPT Camera AI Vector
 * Sleek dome security camera with AI recognition sensor & scan beam
 */
export function CameraAiVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="camDomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
        <radialGradient id="lensRing" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </radialGradient>
      </defs>
      {/* Base Mount */}
      <path d="M7 6H25C26.1 6 27 6.9 27 8V9H5V8C5 6.9 5.9 6 7 6Z" fill="#334155" />
      {/* Dome Body */}
      <path
        d="M6 9H26V15C26 20.5 21.5 25 16 25C10.5 25 6 20.5 6 15V9Z"
        fill="url(#camDomeGrad)"
        stroke="#818CF8"
        strokeWidth="1.2"
      />
      {/* Camera Lens */}
      <circle cx="16" cy="16" r="5.5" fill="#0F172A" stroke="url(#lensRing)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="2.5" fill="#38BDF8" />
      {/* Active AI Status LED */}
      <circle cx="22" cy="12" r="1.2" fill="#22C55E" />
      {/* AI Label */}
      <rect x="11.5" y="24" width="9" height="5" rx="2" fill="#FF7A00" />
      <text x="16" y="27.8" textAnchor="middle" fill="#FFFFFF" fontSize="3.5" fontWeight="900" fontFamily="sans-serif">
        AI
      </text>
    </svg>
  );
}

/**
 * 5. Free Promotion Camera Gift Vector
 * Replaces old "Tặng cước" with prominent "TẶNG CAMERA MIỄN PHÍ"
 */
export function GiftCameraVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="giftBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
      </defs>
      {/* Gift Box Base */}
      <rect x="4" y="14" width="24" height="15" rx="2.5" fill="url(#giftBoxGrad)" stroke="#C2410C" strokeWidth="1" />
      {/* Box Lid */}
      <rect x="2" y="10" width="28" height="5" rx="1.5" fill="#FB923C" stroke="#EA580C" strokeWidth="1" />
      {/* Vertical Ribbon */}
      <rect x="13.5" y="10" width="5" height="19" fill="url(#ribbonGrad)" />
      {/* Horizontal Ribbon */}
      <rect x="4" y="19" width="24" height="4" fill="url(#ribbonGrad)" opacity="0.9" />
      {/* Bow Loop Left */}
      <path
        d="M16 10C13 10 9.5 7 10.5 4.5C11.5 2 15 6 16 10Z"
        fill="url(#ribbonGrad)"
        stroke="#CA8A04"
        strokeWidth="0.75"
      />
      {/* Bow Loop Right */}
      <path
        d="M16 10C19 10 22.5 7 21.5 4.5C20.5 2 17 6 16 10Z"
        fill="url(#ribbonGrad)"
        stroke="#CA8A04"
        strokeWidth="0.75"
      />
      {/* Camera Icon Overlay Stamp */}
      <circle cx="23" cy="7" r="5.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.2" />
      <circle cx="23" cy="7" r="2.5" fill="#38BDF8" />
      <path d="M21 4.5H22V4H24V4.5H25" stroke="#FFFFFF" strokeWidth="0.6" />
    </svg>
  );
}

/**
 * 6. Super Fast 24H Installation Vector
 */
export function Fast24hVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#boltGrad)" stroke="#34D399" strokeWidth="1.5" />
      {/* Clock ticks */}
      <circle cx="16" cy="16" r="10" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1.5 3" opacity="0.6" />
      {/* 24H text */}
      <text x="16" y="19" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="900" fontFamily="sans-serif">
        24H
      </text>
      {/* Speed swoosh */}
      <path d="M8 7L13 3" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 11L9 8" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 7. Lifetime Equipment Warranty Shield Vector
 */
export function LifetimeWarrantyVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* Security Shield */}
      <path
        d="M16 3L27 7V15C27 22 22 27.5 16 29C10 27.5 5 22 5 15V7L16 3Z"
        fill="url(#shieldGrad)"
        stroke="#60A5FA"
        strokeWidth="1.5"
      />
      {/* Checkmark */}
      <path
        d="M11 16L14.5 19.5L21.5 12"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 8. Hotline Consultant Headset Vector
 */
export function HotlineHeadsetVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="headsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
      </defs>
      {/* Headband Arch */}
      <path
        d="M7 16C7 11 11 7 16 7C21 7 25 11 25 16"
        stroke="url(#headsetGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Left Ear Cushion */}
      <rect x="5" y="14" width="4" height="8" rx="2" fill="url(#headsetGrad)" />
      {/* Right Ear Cushion */}
      <rect x="23" y="14" width="4" height="8" rx="2" fill="url(#headsetGrad)" />
      {/* Microphone Boom */}
      <path d="M25 19C25 24 20 26 15 26H13" stroke="url(#headsetGrad)" strokeWidth="2" strokeLinecap="round" />
      {/* Microphone Tip */}
      <circle cx="12" cy="26" r="2" fill="#EF4444" />
    </svg>
  );
}

/**
 * 9. Transparent Pricing Chart Vector
 */
export function PricingChartVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      {/* Chart Canvas */}
      <rect x="4" y="4" width="24" height="24" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Bar 1 */}
      <rect x="8" y="18" width="4" height="6" rx="1.5" fill="#CBD5E1" />
      {/* Bar 2 */}
      <rect x="14" y="13" width="4" height="11" rx="1.5" fill="#A78BFA" />
      {/* Bar 3 */}
      <rect x="20" y="8" width="4" height="16" rx="1.5" fill="url(#chartGrad)" />
      {/* Growth Trend Arrow */}
      <path d="M7 15L14 10L23 5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="19,5 23,5 23,9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 10. Process Step 1: Phone Consultation Vector
 */
export function ProcessConsultVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="pConsultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1.5" />
      <path
        d="M21.5 18.5C20.3 18.5 19.1 18.3 18 17.9C17.7 17.8 17.3 17.9 17.1 18.1L15.4 19.8C12.8 18.5 10.5 16.2 9.2 13.6L10.9 11.9C11.1 11.7 11.2 11.3 11.1 11C10.7 9.9 10.5 8.7 10.5 7.5C10.5 6.7 9.8 6 9 6H6.5C5.7 6 5 6.7 5 7.5C5 16.6 12.4 24 21.5 24C22.3 24 23 23.3 23 22.5V20C23 19.2 22.3 18.5 21.5 18.5Z"
        fill="url(#pConsultGrad)"
      />
      <circle cx="21" cy="9" r="1.5" fill="#F97316" />
      <circle cx="24" cy="12" r="1.5" fill="#F97316" />
      <circle cx="25" cy="8" r="1.5" fill="#EA580C" />
    </svg>
  );
}

/**
 * 11. Process Step 2: Infrastructure & Port Survey Vector
 */
export function ProcessSurveyVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="pSurveyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1.5" />
      {/* Map Pin Target */}
      <circle cx="16" cy="13" r="7" stroke="url(#pSurveyGrad)" strokeWidth="1.5" strokeDasharray="2 2" />
      <path
        d="M16 6C12.7 6 10 8.7 10 12C10 16.5 16 23 16 23C16 23 22 16.5 22 12C22 8.7 19.3 6 16 6Z"
        fill="url(#pSurveyGrad)"
      />
      <circle cx="16" cy="12" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 12. Process Step 3: Verified Digital OTP Contract Vector
 */
export function ProcessContractVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="pDocGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
      <rect x="9" y="7" width="14" height="18" rx="2" fill="#FFFFFF" stroke="url(#pDocGrad)" strokeWidth="1.5" />
      <line x1="12" y1="11" x2="18" y2="11" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="14" x2="20" y2="14" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="17" x2="17" y2="17" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
      {/* OTP Verified Stamp */}
      <circle cx="18" cy="20" r="4.5" fill="#10B981" />
      <path d="M16 20L17.5 21.5L20 18.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 13. Process Step 4: Rapid 24H Technical Deployment Vector
 */
export function ProcessInstallVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="pInstGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1.5" />
      {/* Technician Gear / Fiber Tool */}
      <path
        d="M21.5 13.5L18.5 10.5C18.9 9.9 19 9.2 18.8 8.5C18.4 7.2 17 6.4 15.7 6.8L13.7 8.8L12.2 7.3L10.7 8.8L12.2 10.3L7.7 14.8C7.3 15.2 7.3 15.8 7.7 16.2L15.8 24.3C16.2 24.7 16.8 24.7 17.2 24.3L21.5 20C21.9 19.6 21.9 19 21.5 18.6L19.5 16.6C20.1 16.2 20.8 16.1 21.5 16.3C22.8 16.7 23.6 15.3 23.2 14C23 13.7 22.3 13.4 21.5 13.5Z"
        fill="url(#pInstGrad)"
      />
      {/* 24h Speed Bolt */}
      <path d="M11 18L13 22L11 25" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 14. Zalo Vector
 */
export function ZaloVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="16" r="14" fill="#0068FF" />
      <path
        d="M8 12.5C8 9.5 11.5 7 16 7C20.5 7 24 9.5 24 12.5C24 15.5 20.5 18 16 18C14.8 18 13.7 17.8 12.7 17.4L9 19L10 16.5C8.8 15.4 8 14 8 12.5Z"
        fill="#FFFFFF"
      />
      <text
        x="16"
        y="14"
        textAnchor="middle"
        fill="#0068FF"
        fontSize="6"
        fontWeight="900"
        fontFamily="sans-serif"
        letterSpacing="-0.5"
      >
        Zalo
      </text>
    </svg>
  );
}

/**
 * 15. News & Editorial Article Vector
 */
export function NewsArticleVector({ className = "w-6 h-6", size = 24 }: VectorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="newsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="22" height="22" rx="3" fill="#F8FAFC" stroke="url(#newsGrad)" strokeWidth="1.75" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#3B82F6" />
      <line x1="18" y1="10" x2="23" y2="10" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="13" x2="23" y2="13" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="18" x2="23" y2="18" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="22" x2="19" y2="22" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

