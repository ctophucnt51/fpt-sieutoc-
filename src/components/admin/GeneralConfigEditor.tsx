"use client";

import { useState, useRef } from "react";
import { SiteConfigType } from "@/lib/configStorage";
import { Save, RefreshCw, Phone, MessageSquare, ShieldCheck, Globe, Activity, AlertTriangle, Sparkles, Tag, Gift, GitBranch, Download, Upload, Shield } from "lucide-react";

interface GeneralConfigEditorProps {
  config: SiteConfigType;
  onSave: (updatedConfig: Partial<SiteConfigType>) => Promise<boolean>;
  onReset: () => Promise<boolean>;
  showToast: (msg: string, type?: "success" | "error") => void;
  onSyncGithub?: () => void;
  isSyncing?: boolean;
  commitInfo?: string;
}

export default function GeneralConfigEditor({
  config,
  onSave,
  onReset,
  showToast,
  onSyncGithub,
  isSyncing = false,
  commitInfo,
}: GeneralConfigEditorProps) {
  const [formData, setFormData] = useState<SiteConfigType>(config);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `fpt-siteConfig-${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Đã tải file sao lưu cấu hình về máy!", "success");
    } catch {
      showToast("Không thể tải file sao lưu.", "error");
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.brand && parsed.contact) {
          setFormData(parsed);
          showToast("Đã nạp dữ liệu từ file! Hãy bấm 'LƯU CẤU HÌNH HỆ THỐNG' bên dưới để áp dụng.", "success");
        } else {
          showToast("File không đúng định dạng cấu hình FPT.", "error");
        }
      } catch {
        showToast("Lỗi khi đọc file JSON.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const ok = await onSave(formData);
    setIsSaving(false);
    if (ok) {
      showToast("Cập nhật cấu hình website thành công!", "success");
    } else {
      showToast("Lỗi khi lưu cấu hình.", "error");
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục toàn bộ cài đặt về mặc định của hệ thống?")) {
      return;
    }
    setIsSaving(true);
    const ok = await onReset();
    setIsSaving(false);
    if (ok) {
      showToast("Đã khôi phục cài đặt gốc thành công!", "success");
    } else {
      showToast("Lỗi khi khôi phục cài đặt.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. KHỐI ĐỒNG BỘ MÃ NGUỒN GITHUB 1-CLICK */}
      {onSyncGithub && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-md border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-orange-500/20 text-fpt-orange border border-orange-500/30 flex items-center justify-center shrink-0">
                <GitBranch className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-base tracking-tight text-white">
                Đồng Bộ Mã Nguồn Website (1-Click Sync)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                GitHub: main
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Khi bạn yêu cầu cập nhật giao diện hoặc tính năng, chỉ cần bấm nút bên cạnh để hệ thống tự động kéo bản mới nhất từ GitHub và khởi động lại ứng dụng trong 3 giây (không cần mở cPanel hay Terminal).
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>An toàn tuyệt đối: Dữ liệu đơn Lead, Cài đặt Hotline &amp; Bảng giá được bảo vệ độc lập, không bị ghi đè.</span>
            </div>
            {commitInfo && (
              <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-700/50 inline-block">
                Phiên bản hiện tại: <span className="text-orange-300 font-semibold">{commitInfo}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onSyncGithub}
            disabled={isSyncing}
            className={`py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-all shadow-md cursor-pointer ${
              isSyncing
                ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                : "bg-fpt-orange hover:bg-fpt-hover text-white active:scale-95"
            }`}
          >
            <RefreshCw className={`w-4 h-4 shrink-0 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Đang đồng bộ & khởi động lại..." : "Đồng Bộ Code Mới Ngay"}</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
      {/* 0. SLOGAN HOT & THÔNG BÁO KHUYẾN MÃI NHANH */}
      <div className="bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30 rounded-3xl p-6 sm:p-7 border-2 border-orange-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-fpt-orange flex items-center justify-center">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Slogan Hot &amp; Khuyến Mãi Đầu Trang</h3>
              <p className="text-xs text-slate-500">Thay đổi câu khẩu hiệu chạy chữ, ưu đãi sốc hiển thị tức thì trên cả Desktop &amp; Mobile</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-orange-500 text-white uppercase tracking-wider shadow-2xs">
            Cài Đặt Nhanh
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-fpt-orange" />
              <span>Nội Dung Slogan / Khuyến Mãi Hot (Thanh Thông Báo Trên Cùng)</span>
            </label>
            <input
              type="text"
              required
              value={formData.promo?.topBarAnnouncement ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  promo: {
                    ...(formData.promo || { topBarBadge: "Ưu Đãi", heroGiftText: "", leadFormUrgentNote: "" }),
                    topBarAnnouncement: e.target.value,
                  },
                })
              }
              placeholder="VD: Miễn phí Modem Wi-Fi 6 & Camera FPT khi đăng ký online tại đây"
              className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:border-fpt-orange focus:ring-4 focus:ring-orange-500/10 text-xs sm:text-sm font-semibold text-slate-900 outline-none bg-white"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Dòng chữ xuất hiện trên thanh bar chạy chữ đầu website (cả máy tính &amp; điện thoại).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nhãn Badge Khuyến Mãi
              </label>
              <input
                type="text"
                value={formData.promo?.topBarBadge ?? "Ưu Đãi"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    promo: {
                      ...(formData.promo || { topBarAnnouncement: "", heroGiftText: "", leadFormUrgentNote: "" }),
                      topBarBadge: e.target.value,
                    },
                  })
                }
                placeholder="VD: Ưu Đãi / HOT / Mới"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nội Dung Banner Quà Tặng (Dưới Tiêu Đề Trang Chủ)</span>
              </label>
              <input
                type="text"
                value={formData.promo?.heroGiftText ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    promo: {
                      ...(formData.promo || { topBarAnnouncement: "", topBarBadge: "Ưu Đãi", leadFormUrgentNote: "" }),
                      heroGiftText: e.target.value,
                    },
                  })
                }
                placeholder="VD: Trang bị Modem Wi-Fi 6 thế hệ mới & Tặng kèm Camera FPT AI an ninh thông minh miễn phí"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ghi Chú Hỗ Trợ Gấp Dưới Nút Form Đăng Ký
            </label>
            <input
              type="text"
              value={formData.promo?.leadFormUrgentNote ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  promo: {
                    ...(formData.promo || { topBarAnnouncement: "", topBarBadge: "Ưu Đãi", heroGiftText: "" }),
                    leadFormUrgentNote: e.target.value,
                  },
                })
              }
              placeholder="VD: Cần lắp đặt gấp trong 2 - 4 giờ?"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none bg-white"
            />
          </div>
        </div>
      </div>
      {/* 1. Hotline & Zalo Contact */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Phone className="w-5 h-5 text-fpt-orange" />
          <h3 className="font-bold text-base text-slate-900">Hotline Bán Hàng &amp; Kênh Chat Tư Vấn</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Số Điện Thoại Hotline Hiển Thị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.contact.hotlineDisplay}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, hotlineDisplay: e.target.value },
                })
              }
              placeholder="VD: 0878 800 400"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Số Điện Thoại Quay Số (Raw) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.contact.hotlineRaw}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: {
                    ...formData.contact,
                    hotlineRaw: e.target.value,
                    hotlineTel: `tel:${e.target.value.replace(/\D/g, "")}`,
                  },
                })
              }
              placeholder="VD: 0878800400"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Đường Dẫn Chat Zalo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.contact.zaloUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, zaloUrl: e.target.value },
                })
              }
              placeholder="VD: https://zalo.me/0878800400"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Đường Dẫn Facebook Messenger
            </label>
            <input
              type="text"
              value={formData.contact.messengerUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, messengerUrl: e.target.value },
                })
              }
              placeholder="VD: https://m.me/lapmangfpt.sieutoc"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Thời Gian Làm Việc Hỗ Trợ
            </label>
            <input
              type="text"
              value={formData.contact.workingHours}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, workingHours: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Cam Kết Triển Khai
            </label>
            <input
              type="text"
              value={formData.contact.installationCommitment}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, installationCommitment: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Brand & Domain */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-base text-slate-900">Thông Tin Website &amp; Thương Hiệu</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên Website
            </label>
            <input
              type="text"
              value={formData.brand.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  brand: { ...formData.brand, name: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên Ngắn Gọn
            </label>
            <input
              type="text"
              value={formData.brand.shortName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  brand: { ...formData.brand, shortName: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Slogan / Tagline
          </label>
          <input
            type="text"
            value={formData.brand.tagline}
            onChange={(e) =>
              setFormData({
                ...formData,
                brand: { ...formData.brand, tagline: e.target.value },
              })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Mô Tả SEO Meta Description
          </label>
          <textarea
            rows={2}
            value={formData.brand.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                brand: { ...formData.brand, description: e.target.value },
              })
            }
            className="w-full p-3 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
          />
        </div>
      </div>

      {/* 3. Facebook Ads Tracking */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-base text-slate-900">Meta Pixel Tracking (Facebook Ads)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Meta Pixel ID
            </label>
            <input
              type="text"
              value={formData.tracking.facebookPixelId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tracking: { ...formData.tracking, facebookPixelId: e.target.value },
                })
              }
              placeholder="VD: 123456789012345"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
          </div>

          <div className="pt-4 sm:pt-0">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-bold text-slate-800">
              <input
                type="checkbox"
                checked={formData.tracking.enablePixel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tracking: { ...formData.tracking, enablePixel: e.target.checked },
                  })
                }
                className="w-4 h-4 text-fpt-orange rounded border-slate-300 focus:ring-fpt-orange cursor-pointer"
              />
              <span>Kích hoạt theo dõi Meta Pixel trên toàn website</span>
            </label>
            <p className="text-[11px] text-slate-400 mt-1 pl-6">
              Tự động gửi sự kiện PageView, ViewContent, Contact và Lead khi có đơn mới
            </p>
          </div>
        </div>
      </div>

      {/* 4. Google Ads Conversion Tracking (Hoàn tất form) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Activity className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-bold text-base text-slate-900">Google Ads Conversion Tracking (Đo Lường Hoàn Tất Form)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tự động ghi nhận chuyển đổi (Conversion) khi khách hàng gửi form đăng ký thành công về tài khoản Google Ads
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Google Tag / Conversion ID (Mã Google Ads)
            </label>
            <input
              type="text"
              value={formData.tracking.googleAdsId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tracking: { ...formData.tracking, googleAdsId: e.target.value.trim() },
                })
              }
              placeholder="VD: AW-123456789 hoặc G-ABC123DEF"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Định dạng chuẩn thường bắt đầu bằng <code>AW-</code> (hoặc <code>G-</code>)
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nhãn Chuyển Đổi Hoàn Tất Form (Conversion Label)
            </label>
            <input
              type="text"
              value={formData.tracking.googleAdsConversionLabel || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tracking: { ...formData.tracking, googleAdsConversionLabel: e.target.value.trim() },
                })
              }
              placeholder="VD: AbC_D-efGhIjKlMnOpQ"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Nhãn hành động chuyển đổi tạo trong Google Ads &gt; Mục tiêu &gt; Chuyển đổi
            </p>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-bold text-slate-800">
            <input
              type="checkbox"
              checked={formData.tracking.enableGoogleAds || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tracking: { ...formData.tracking, enableGoogleAds: e.target.checked },
                })
              }
              className="w-4 h-4 text-fpt-orange rounded border-slate-300 focus:ring-fpt-orange cursor-pointer"
            />
            <span>Kích hoạt theo dõi chuyển đổi Google Ads khi khách hoàn tất form</span>
          </label>
          <div className="mt-2 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-800 leading-relaxed">
            Khi kích hoạt, hệ thống sẽ tự động chèn mã <strong>Google Tag (gtag.js)</strong> và kích hoạt sự kiện chuyển đổi:
            <code className="block mt-1 font-mono text-[11px] text-blue-900 bg-white/80 p-2 rounded-lg border border-blue-200">
              gtag(&apos;event&apos;, &apos;conversion&apos;, &#123; &apos;send_to&apos;: &apos;{formData.tracking.googleAdsId || "AW-XXXXXXXX"}/{formData.tracking.googleAdsConversionLabel || "CONVERSION_LABEL"}&apos;, &apos;value&apos;: 1.0, &apos;currency&apos;: &apos;VND&apos; &#125;);
            </code>
          </div>
        </div>
      </div>

      {/* 5. Legal & Disclaimer */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base text-slate-900">Nghị Định 13 &amp; Tuyên Bố Pháp Lý</h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Tuyên Bố Miễn Trừ &amp; Minh Bạch Thương Hiệu
          </label>
          <textarea
            rows={2}
            value={formData.disclaimer.officialDisclaimer}
            onChange={(e) =>
              setFormData({
                ...formData,
                disclaimer: { ...formData.disclaimer, officialDisclaimer: e.target.value },
              })
            }
            className="w-full p-3 rounded-xl border border-slate-300 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 text-xs sm:text-sm text-slate-900 outline-none"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleExportBackup}
            className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Tải bản sao lưu cấu hình website về máy tính"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Sao Lưu File</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Nhập cấu hình từ file JSON đã lưu trước đó"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Phục Hồi File</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="py-2.5 px-3 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Khôi phục toàn bộ về cấu hình mặc định ban đầu"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cài Đặt Gốc</span>
          </button>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full md:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-fpt-orange to-fpt-dark hover:opacity-95 text-white font-extrabold text-sm shadow-cta flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Đang Lưu Cấu Hình..." : "LƯU CẤU HÌNH HỆ THỐNG"}</span>
        </button>
      </div>
    </form>
  </div>
);
}
