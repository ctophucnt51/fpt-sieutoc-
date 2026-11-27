"use client";

import { useSiteConfig } from "@/context/ConfigContext";
import { useLeadModal } from "@/context/LeadModalContext";
import { ArrowRight, CheckCircle2, CreditCard, Calendar, Clock } from "lucide-react";

export default function PricingComparisonMatrix() {
  const siteConfig = useSiteConfig();
  const { openLeadModal } = useLeadModal();

  const allPackages = [...siteConfig.packages.internet, ...siteConfig.packages.combo];

  return (
    <>
      {/* 1. Bảng So Sánh Thông Số Nhanh */}
      <section id="so-sanh-nhanh" className="py-10 sm:py-14 bg-white border-b border-[#E4E8ED]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFF4ED] text-[#C44D06] border border-orange-200/80 text-xs font-bold uppercase tracking-wider mb-2">
              So Sánh Trực Diện
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              Bảng Đối Chiếu Thông Số Các Gói Cước
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-1.5">
              Dễ dàng so sánh tốc độ, thiết bị đi kèm và mức cước hàng tháng (đã gồm 10% VAT).
            </p>
          </div>

          {/* Mobile Card Layout (< md): Zero horizontal scroll */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {allPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl border p-4 bg-white shadow-2xs ${
                  pkg.highlight
                    ? "border-[#F37021] bg-gradient-to-br from-[#FFF6EF]/70 to-white"
                    : "border-[#E4E8ED]"
                }`}
              >
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-base text-[#0F172A]">{pkg.name}</span>
                      {pkg.badge && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F37021] text-white">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {pkg.category === "combo" ? "Combo Net + TV" : "Internet Wi-Fi 6"}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-sm text-[#C44D06]">{pkg.priceDisplay}</div>
                    <div className="text-[10.5px] text-slate-500">{pkg.billingCycle}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 text-xs">
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase">Tốc độ</div>
                    <div className="font-extrabold text-slate-900 mt-0.5">{pkg.speed}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase">Thiết bị</div>
                    <div className="font-semibold text-slate-700 mt-0.5 leading-snug">
                      {pkg.equipment.join(" • ")}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openLeadModal(pkg.name)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#F37021] hover:bg-[#E05D10] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                >
                  <span>Chọn gói {pkg.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout (>= md) */}
          <div className="hidden md:block rounded-2xl border border-[#E4E8ED] overflow-hidden shadow-2xs bg-white">
            <table className="w-full text-left border-collapse text-xs lg:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="py-3.5 px-4 whitespace-nowrap">Tên Gói Cước</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Phân Loại</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Tốc Độ</th>
                  <th className="py-3.5 px-4">Thiết Bị Kèm Theo</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Giá Tham Khảo</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Đăng Ký</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPackages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className={`hover:bg-[#FFF9F5] transition-colors ${
                      pkg.highlight ? "bg-[#FFF6EF]/50" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-black text-[#0F172A] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{pkg.name}</span>
                        {pkg.badge && (
                          <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-[#F37021] text-white">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-medium">
                      {pkg.category === "combo" ? "Combo Net + TV" : "Internet Wi-Fi 6"}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                      {pkg.speed}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {pkg.equipment.join(" • ")}
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#C44D06] whitespace-nowrap">
                      {pkg.priceDisplay}
                      <span className="text-[11px] font-normal text-slate-500">
                        {pkg.billingCycle}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openLeadModal(pkg.name)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#F37021] hover:bg-[#E05D10] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                      >
                        <span>Chọn</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Hình Thức Thanh Toán & Chính Sách Trả Trước */}
      <section id="chinh-sach-uu-dai" className="py-10 sm:py-14 bg-[#F4F6FB] border-b border-[#E4E8ED]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              Chính Sách Thanh Toán &amp; Ưu Đãi Trả Trước
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-1.5">
              Áp dụng minh bạch theo quy định của FPT Telecom tại từng khu vực lắp đặt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E4E8ED] shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#0F172A]">Trả Sau Từng Tháng</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Linh hoạt thanh toán cước cuối mỗi tháng qua chuyển khoản, MoMo, ZaloPay hoặc app Hi FPT. Áp dụng phí hòa mạng theo quy định hiện hành.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-orange-200 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] text-[#F37021] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#0F172A]">Trả Trước 6 Tháng</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Hỗ trợ tối ưu chi phí hòa mạng ban đầu và hưởng các chính sách trang bị thiết bị Wi-Fi 6 / Camera theo từng chương trình khu vực.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-[#F37021] shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#F37021] text-white flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  TIẾT KIỆM NHẤT
                </span>
              </div>
              <h3 className="text-base font-black text-[#0F172A]">Trả Trước 12 Tháng</h3>
              <ul className="text-xs text-[#475569] space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Ưu đãi tặng thêm tháng cước sử dụng (tùy gói &amp; khu vực).</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Ưu tiên xét duyệt trang bị thiết bị Wi-Fi 6 &amp; Camera AI.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
