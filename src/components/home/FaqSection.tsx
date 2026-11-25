"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

interface FaqItem {
  q: string;
  a: string;
  icon: string;
}

const faqs: FaqItem[] = [
  {
    q: "Chi phí đăng ký và lắp đặt ban đầu là bao nhiêu?",
    a: "Khi quý khách lựa chọn hình thức thanh toán trả trước (6 tháng hoặc 12 tháng), FPT Telecom áp dụng chương trình miễn phí lắp đặt 100%, trang bị miễn phí Modem Wi-Fi 6 thế hệ mới và ĐẶC BIỆT TẶNG KÈM CAMERA FPT AI THÔNG MINH MIỄN PHÍ. Đối với hình thức thanh toán từng tháng, phí hòa mạng ban đầu là 299.000đ theo quy định.",
    icon: "/images/icons/svg/qua-tang.svg",
  },
  {
    q: "Tôi đang ở trọ hoặc thuê nhà có lắp mạng FPT được không?",
    a: "Hoàn toàn được! Thủ tục cực kỳ thuận tiện, chỉ cần chụp hình ảnh Căn cước công dân (CCCD) của bạn. Không cần sổ hộ khẩu hay giấy tờ chứng minh sở hữu nhà ở.",
    icon: "/images/icons/svg/nha-thue.svg",
  },
  {
    q: "Thủ tục đăng ký cần chuẩn bị những gì?",
    a: "Chỉ cần cung cấp Họ tên, Số điện thoại và Địa chỉ lắp đặt để nhân viên kiểm tra cổng quang. Khi ký hợp đồng, quý khách chỉ cần chụp ảnh CCCD chính chủ. Mọi thao tác ký hợp đồng đều được thực hiện điện tử bảo mật qua mã xác thực OTP gửi về số điện thoại của quý khách.",
    icon: "/images/icons/svg/hop-dong.svg",
  },
  {
    q: "Thời gian kỹ thuật viên đến lắp đặt là bao lâu sau khi đăng ký?",
    a: "FPT Telecom cam kết triển khai lắp đặt hoàn tất trong vòng 24 giờ đến 48 giờ kể từ khi hoàn tất đăng ký hợp đồng. Quý khách cũng có thể chủ động hẹn giờ lắp đặt theo khung giờ rảnh của gia đình (kể cả thứ Bảy, Chủ Nhật hoặc ngoài giờ hành chính).",
    icon: "/images/icons/svg/lap-dat.svg",
  },
  {
    q: "Nếu mạng bị sự cố hoặc giật lag thì báo cho ai?",
    a: "Quý khách có thể liên hệ trực tiếp tổng đài kỹ thuật FPT 1900 6600, báo qua ứng dụng chăm sóc khách hàng Hi FPT trên điện thoại, hoặc nhắn trực tiếp Hotline/Zalo 0878 800 400. Kỹ thuật viên khu vực sẽ có mặt hỗ trợ xử lý tại nhà trong vòng 2 giờ.",
    icon: "/images/icons/svg/ho-tro.svg",
  },
  {
    q: "Gói Combo Ngoại Hạng Anh xem trên TV như thế nào, có cần đầu thu Box không?",
    a: "Hoàn toàn không cần đầu thu Box cồng kềnh! FPT cung cấp tài khoản bản quyền FPT Play để quý khách cài đặt ứng dụng và đăng nhập xem trực tiếp trên mọi dòng Smart TV (Samsung, Sony, LG, Android TV...), điện thoại, máy tính bảng hoặc laptop vô cùng gọn gàng và tiện lợi.",
    icon: "/images/icons/svg/fpt-play.svg",
  },
];

export default function FaqSection() {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggle = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-[#F4F6FB] border-b border-[#E4E8ED]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#9A3412] border border-[#E4E8ED] font-bold text-xs uppercase tracking-wider mb-2.5 shadow-xs">
            <img
              src="/images/icons/svg/cau-hoi.svg"
              alt="Hỏi đáp"
              width={16}
              height={16}
              loading="lazy"
              decoding="async"
              className="w-4 h-4 object-contain shrink-0"
            />
            <span>Giải Đáp Thắc Mắc</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight break-words">
            Câu Hỏi Thường Gặp Về Lắp Mạng FPT
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#334155] font-medium">
            Tổng hợp các thắc mắc phổ biến nhất giúp quý khách an tâm trước khi đăng ký dịch vụ.
          </p>
        </div>

        {/* 2-Column Responsive FAQ Grid on Desktop, 1-Column on Mobile - Phong cách Long Châu */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 items-start">
          {faqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-200 overflow-hidden bg-white ${
                  isOpen
                    ? "border-2 border-[#F37021] shadow-[0_8px_25px_rgba(243,112,33,0.12)]"
                    : "border border-[#E4E8ED] hover:border-orange-200 shadow-xs hover:shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF4ED] border border-orange-100 p-1 flex items-center justify-center shrink-0 mt-0.5">
                      <img
                        src={faq.icon}
                        alt="FAQ Icon"
                        width={20}
                        height={20}
                        loading="lazy"
                        decoding="async"
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#F37021] transition-colors leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#94A3B8] shrink-0 transition-transform duration-200 mt-1 ${
                      isOpen ? "rotate-180 text-[#F37021]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-[13px] text-[#334155] leading-relaxed border-t border-[#F4F6FB] mt-1">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/hoi-dap"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-[#FFF4ED] border border-[#E4E8ED] hover:border-orange-300 text-xs sm:text-sm font-bold text-[#0F172A] hover:text-[#9A3412] shadow-2xs transition-all whitespace-nowrap"
          >
            <span>Xem trang Hỏi Đáp &amp; Hỗ Trợ Kỹ Thuật</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
