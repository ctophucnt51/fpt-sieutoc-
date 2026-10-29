import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";
import { FileText, ArrowLeft, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Điều Khoản Sử Dụng Dịch Vụ",
  description:
    "Quy định, điều kiện và tuyên bố độc lập của cổng tư vấn và hỗ trợ đăng ký dịch vụ Lắp Mạng FPT Siêu Tốc.",
};

export default function DieuKhoanPage() {
  return (
    <div className="py-12 sm:py-20 bg-surface-secondary min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-ink-border shadow-xs space-y-8">
          {/* Header */}
          <div className="border-b border-ink-border pb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-fpt-orange hover:underline mb-4 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang chủ</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-fpt-orange flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
                  Điều Khoản Sử Dụng & Tuyên Bố Độc Lập
                </h1>
                <p className="text-xs text-ink-secondary mt-1">
                  Cập nhật lần cuối: Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>

          {/* Alert box */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Tuyên bố quan trọng về tư cách pháp nhân:</strong> Website này hoạt động như một kênh đại lý bán hàng và hỗ trợ tư vấn trực tuyến độc lập cho các dịch vụ do FPT Telecom cung cấp. Chúng tôi không tự nhận là trang thông tin điện tử chính thức duy nhất của Tập đoàn FPT hay Công ty Cổ phần Viễn thông FPT.
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 text-sm text-ink-secondary leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-ink-primary">
                1. Quyền Sở Hữu Trí Tuệ & Thương Hiệu
              </h2>
              <p>
                Tất cả tên gọi thương mại, biểu trưng, logo FPT, FPT Telecom, FPT Play, FPT Camera và các tên gói cước xuất hiện trên website này đều thuộc quyền sở hữu trí tuệ của Công ty Cổ phần Viễn thông FPT (FPT Telecom). Việc tham chiếu các thương hiệu này chỉ nhằm mục đích định danh và giới thiệu sản phẩm dịch vụ chính hãng đến người tiêu dùng.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-ink-primary">
                2. Bảng Giá & Chương Trình Khuyến Mãi
              </h2>
              <p>
                Bảng giá cước và các chương trình khuyến mãi (tặng Camera AI an ninh, miễn phí modem Wi-Fi 6, ưu đãi phí hòa mạng) được cập nhật dựa trên chính sách công bố của FPT Telecom tại từng thời điểm.
              </p>
              <p>
                Giá cước thực tế có thể có sự chênh lệch nhỏ tùy theo khu vực địa lý cụ thể (khu vực nội thành Hà Nội, TP.HCM so với các huyện ngoại thành hoặc tỉnh thành khác). Khách hàng sẽ được chuyên viên thông báo chính xác giá cước áp dụng tại địa chỉ lắp đặt trước khi tiến hành ký kết hợp đồng.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-ink-primary">
                3. Quy Trình Ký Hợp Đồng & Thanh Toán
              </h2>
              <p>
                Hợp đồng cung cấp dịch vụ viễn thông được giao kết trực tiếp giữa Quý khách hàng và FPT Telecom dưới hình thức Hợp đồng điện tử. Quý khách chỉ thanh toán cước phí sau khi hợp đồng được xác lập thành công và nhận được tin nhắn xác nhận từ tổng đài FPT Telecom.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-ink-primary">
                4. Trách Nhiệm Của Khách Hàng
              </h2>
              <p>
                Quý khách cam kết cung cấp thông tin liên hệ chính xác (Họ tên, Số điện thoại chính chủ) để đảm bảo việc khảo sát hạ tầng và lắp đặt dịch vụ được thực hiện nhanh chóng, chính xác nhất.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
