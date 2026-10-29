import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";
import { ShieldCheck, Lock, FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật Dữ Liệu Cá Nhân",
  description:
    "Cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của khách hàng đăng ký tư vấn dịch vụ viễn thông FPT theo Nghị định 13/2023/NĐ-CP.",
};

export default function ChinhSachBaoMatPage() {
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
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
                  Chính Sách Bảo Mật Dữ Liệu Cá Nhân
                </h1>
                <p className="text-xs text-ink-secondary mt-1">
                  Tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân tại Việt Nam
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6 text-sm text-ink-secondary leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-ink-primary flex items-center gap-2">
                1. Mục Đích & Phạm Vi Thu Thập Dữ Liệu
              </h2>
              <p>
                Khi quý khách chủ động gửi thông tin thông qua các biểu mẫu đăng ký tư vấn trên website{" "}
                <strong className="text-ink-primary">{siteConfig.brand.name}</strong>, chúng tôi chỉ thu thập các dữ liệu cá nhân cơ bản tối thiểu nhằm mục đích:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>
                  <strong className="text-ink-primary">Họ và tên:</strong> Để tiện xưng hô và xác nhận người đại diện yêu cầu lắp đặt.
                </li>
                <li>
                  <strong className="text-ink-primary">Số điện thoại:</strong> Để chuyên viên tư vấn gọi điện xác nhận nhu cầu, giải đáp bảng giá và báo kết quả đo cổng quang hạ tầng.
                </li>
                <li>
                  <strong className="text-ink-primary">Tỉnh/Thành phố & Địa chỉ dự kiến:</strong> Để nhân viên kỹ thuật FPT kiểm tra khoảng cách hộp cáp và hạ tầng khu vực.
                </li>
                <li>
                  <strong className="text-ink-primary">Gói cước quan tâm:</strong> Để chuẩn bị sẵn chương trình khuyến mãi phù hợp nhất.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-ink-primary flex items-center gap-2">
                2. Cam Kết Không Mua Bán Hoặc Tiết Lộ Dữ Liệu
              </h2>
              <p>
                Chúng tôi tuyệt đối cam kết <strong className="text-ink-primary">KHÔNG</strong> chia sẻ, cho thuê, trao đổi hoặc bán dữ liệu cá nhân của quý khách cho bất kỳ bên thứ ba nào vì mục đích quảng cáo hoặc tiếp thị không liên quan.
              </p>
              <p>
                Thông tin của quý khách chỉ được chuyển giao trực tiếp cho hệ thống tư vấn viên và kỹ thuật viên trực thuộc FPT Telecom để phục vụ việc khảo sát hạ tầng và ký kết hợp đồng dịch vụ viễn thông theo yêu cầu của quý khách.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-ink-primary flex items-center gap-2">
                3. Thời Gian Lưu Trữ & Quyền Của Chủ Thể Dữ Liệu
              </h2>
              <p>
                Dữ liệu đăng ký tư vấn được lưu trữ an toàn trong hệ thống nội bộ được mã hóa. Trường hợp khách hàng sau khi được tư vấn quyết định không lắp đặt, dữ liệu sẽ được chuyển vào trạng thái lưu trữ thụ động và tự động xóa bỏ định kỳ.
              </p>
              <p>
                Quý khách có toàn quyền yêu cầu chúng tôi kiểm tra, cập nhật hoặc xóa bỏ hoàn toàn dữ liệu cá nhân của mình bất kỳ lúc nào bằng cách liên hệ qua hotline:{" "}
                <strong className="text-fpt-orange">{siteConfig.contact.hotlineDisplay}</strong> hoặc gửi email về{" "}
                <strong className="text-ink-primary">{siteConfig.contact.supportEmail}</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-ink-primary flex items-center gap-2">
                4. Biện Pháp Bảo Đảm An Toàn Thông Tin
              </h2>
              <p>
                Hệ thống áp dụng các biện pháp kỹ thuật nghiêm ngặt: mã hóa truyền tải chuẩn SSL/TLS (HTTPS), phân quyền truy cập giới hạn, chống spam rate-limiting và cơ chế honeypot ngăn chặn việc tự động quét dữ liệu.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-ink-primary flex items-center gap-2">
                5. Thông Tin Liên Hệ Đơn Vị Tiếp Nhận Dữ Liệu
              </h2>
              <div className="p-4 rounded-xl bg-surface-secondary border border-ink-border text-xs sm:text-sm space-y-1.5 text-ink-primary">
                <p><strong>Đơn vị tư vấn:</strong> {siteConfig.brand.name}</p>
                <p><strong>Hotline tiếp nhận:</strong> {siteConfig.contact.hotlineDisplay}</p>
                <p><strong>Hỗ trợ trực tuyến:</strong> {siteConfig.contact.zaloUrl}</p>
                <p><strong>Thời gian làm việc:</strong> {siteConfig.contact.workingHours}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
