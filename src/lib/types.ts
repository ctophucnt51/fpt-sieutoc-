export interface LeadPayload {
  fullName: string;
  phone: string;
  address?: string; // Số nhà, tên đường, xã/phường mới
  area: string;
  packageInterested: string;
  note?: string;
  agreeConsent: boolean;
  landingPage: string;
  // Honeypot field (should remain empty)
  website?: string;
  // Tracking & Attribution
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  fbc?: string;
  fbp?: string;
  eventId?: string;
}

export interface LeadRecord extends LeadPayload {
  id: string;
  createdAt: string;
  clientIp: string;
  userAgent: string;
  status: "new" | "contacted" | "surveyed" | "completed" | "cancelled";
  salesNotes?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  leadId?: string;
  eventId?: string;
  error?: string;
}
