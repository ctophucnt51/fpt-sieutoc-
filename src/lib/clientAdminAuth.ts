"use client";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("fpt_admin_token");
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("fpt_admin_token", token);
  } catch {
    // ignore quota errors
  }
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("fpt_admin_token");
  } catch {
    // ignore
  }
}

export function getAdminHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    ...extraHeaders,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}
