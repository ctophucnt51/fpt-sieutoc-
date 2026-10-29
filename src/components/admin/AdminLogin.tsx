"use client";

import { useState } from "react";
import { Lock, Loader2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { setAdminToken } from "@/lib/clientAdminAuth";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pin.trim()) {
      setError("Vui lòng nhập mã PIN quản trị.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) {
          setAdminToken(data.token);
        }
        onLoginSuccess();
      } else {
        setError(data.message || "Mã PIN không đúng. Vui lòng thử lại.");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ xác thực.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-ink-border shadow-sm p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-fpt-orange flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-ink-primary tracking-tight">
            Quản Trị Hệ Thống
          </h2>
          <p className="text-xs text-ink-secondary mt-1">
            Nhập mã PIN để truy cập bảng điều khiển
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-primary mb-1.5">
              Mã PIN Bảo Mật
            </label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              autoFocus
              maxLength={12}
              className="w-full px-4 py-3 rounded-xl border border-ink-border focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-center tracking-[0.3em] text-xl font-bold text-ink-primary outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-sm placeholder:text-slate-400 bg-surface-secondary"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !pin.trim()}
            className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-fpt-orange hover:bg-fpt-hover text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang Xác Thực...</span>
              </>
            ) : (
              <>
                <span>Vào Bảng Điều Khiển</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-ink-border text-center flex items-center justify-center gap-1.5 text-xs text-ink-secondary">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Phiên đăng nhập an toàn 7 ngày</span>
        </div>
      </div>
    </div>
  );
}
