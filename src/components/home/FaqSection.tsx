"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "Chi phí đăng ký và lắp đặt ban đầu là bao nhiêu?",
    a: "Khi quý khách lựa chọn hình thức thanh toán trả trước (6 tháng hoặc 12 tháng), FPT Telecom áp dụng chương trình miễn phí lắp đặt 100%, trang bị miễn phí Modem Wi-Fi 6 thế hệ mới và ĐẶC BIỆT TẶNG KÈM CAMERA FPT AI THÔNG MINH MIỄN PHÍ. Đối với hình thức thanh toán từng tháng, phí hòa mạng ban đầu là 299.000đ theo quy định.",
  },
  {
    q: "Tôi đang ở trọ hoặc thuê nhà có lắp mạng FPT được không?",
    a: "Hoàn toàn được! Thủ tục cực kỳ thuận tiện, chỉ cần chụp hình ảnh Căn cước công dân (CCCD) của bạn. Không cần sổ hộ khẩu hay giấy tờ chứng minh sở hữu nhà ở.",
  },
  {
    q: "Thủ tục đăng ký cần chuẩn bị những gì?",
    a: "Chỉ cần cung cấp Họ tên, Số điện thoại và Địa chỉ lắp đặt để nhân viên kiểm tra cổng quang. Khi ký hợp đồng, quý khách chỉ cần chụp ảnh CCCD chính chủ. Mọi thao tác ký hợp đồng đều được thực hiện điện tử bảo mật qua mã xác thực OTP gửi về số điện thoại của quý khách.",
  },
  {
    q: "Thời gian kỹ thuật viên đến lắp đặt là bao lâu sau khi đăng ký?",
    a: "FPT Telecom cam kết triển khai lắp đặt hoàn tất trong vòng 24 giờ đến 48 giờ kể từ khi hoàn tất đăng ký hợp đồng. Quý khách cũng có thể chủ động hẹn giờ lắp đặt theo khung giờ rảnh của gia đình (kể cả thứ Bảy, Chủ Nhật hoặc ngoài giờ hành chính).",
  },
  {
    q: "Nếu mạng bị sự cố hoặc giật lag thì báo cho ai?",
    a: "Quý khách có thể liên hệ trực tiếp tổng đài kỹ thuật FPT 1900 6600, báo qua ứng dụng chăm sóc khách hàng Hi FPT trên điện thoại, hoặc nhắn trực tiếp Hotline/Zalo 0878 800 400. Kỹ thuật viên khu vực sẽ có mặt hỗ trợ xử lý tại nhà trong vòng 2 giờ.",
  },
  {
    q: "Gói Combo Ngoại Hạng Anh xem trên TV như thế nào, có cần đầu thu Box không?",
    a: "Hoàn toàn không cần đầu thu Box cồng kềnh! FPT cung cấp tài khoản bản quyền FPT Play để quý khách cài đặt ứng dụng và đăng nhập xem trực tiếp trên mọi dòng Smart TV (Samsung, Sony, LG, Android TV...), điện thoại, máy tính bảng hoặc laptop vô cùng gọn gàng và tiện lợi.",
  },
];

export default function FaqSection() {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggle = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white/70 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-fpt-orange border border-orange-200/80 font-bold text-xs uppercase tracking-wider mb-2 shadow-2xs backdrop-blur-md">
            Giải Đáp Thắc Mắc
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight break-words">
            Câu Hỏi Thường Gặp Về Lắp Mạng FPT
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-normal">
            Tổng hợp các thắc mắc phổ biến nhất giúp quý khách an tâm trước khi đăng ký dịch vụ.
          </p>
        </div>

        {/* 2-Column Responsive FAQ Grid on Desktop, 1-Column on Mobile - White Glass Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 items-start">
          {faqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all overflow-hidden ${
                  isOpen
                    ? "bg-white/95 backdrop-blur-xl border border-orange-200 shadow-sm"
                    : "bg-white/80 backdrop-blur-md border border-slate-200/80 hover:border-orange-200 hover:shadow-2xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-4.5 text-left flex items-start justify-between gap-3 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isOpen ? "bg-orange-100 text-fpt-orange" : "bg-slate-100 text-slate-500 group-hover:text-fpt-orange"
                    }`}>
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-fpt-orange transition-colors leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 mt-1 ${
                      isOpen ? "rotate-180 text-fpt-orange" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-4.5 sm:pb-4.5 pt-0 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                    <p className="pt-2">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
