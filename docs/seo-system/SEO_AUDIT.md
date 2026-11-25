# SEO_AUDIT.md — Báo Cáo Kiểm Toán SEO Toàn Diện (Read-Only Audit)

> **Phạm vi kiểm tra:** Technical SEO, On-Page, Schema, Tracking/Conversion, Chính sách Google Ads và Khoảng trống SEO hiện tại trên repository `gofpt.vn`.

---

## 1. Bảng Tổng Hợp Kiểm Toán Kỹ Thuật (Technical SEO)

| Hạng mục | Trạng thái hiện tại (Đã xác minh) | File path bằng chứng | Mức độ ưu tiên xử lý |
| :--- | :--- | :--- | :---: |
| **Canonical Tags (`rel="canonical"`)** | **Chưa có trên từng trang con.** `metadataBase` đã khai báo ở `layout.tsx`, nhưng chưa có `alternates.canonical` ở các route (`/`, `/lap-mang-fpt`, `/bang-gia`, `/tin-tuc/[slug]`...). | `src/app/layout.tsx`, `grep -rn "canonical" src/app/` (0 kết quả) | **Cao (P0)** |
| **Robots.txt & Bảo vệ `/admin`** | `/admin` **chưa bị chặn** trong `src/app/robots.ts` (`disallow: ["/api/", "/cam-on"]`) và chưa có thẻ `noindex`. | `src/app/robots.ts`, `src/app/admin/page.tsx` | **Cao (P0)** |
| **Schema Structured Data (JSON-LD)** | Đã có `LocalBusiness`, `WebSite` (`layout.tsx`), `FAQPage` (`FaqSection.tsx`), `NewsArticle` (`tin-tuc/[slug]/page.tsx`). **Thiếu `BreadcrumbList` và `Product/Offer` cho các trang gói cước.** | `src/app/layout.tsx`, `src/components/home/FaqSection.tsx`, `src/app/tin-tuc/[slug]/page.tsx` | **Trung bình (P1)** |
| **Sitemap.xml** | Tự động nạp 13 trang tĩnh + tất cả bài viết từ `articles.json`. | `src/app/sitemap.ts` | **Đạt** |
| **Core Web Vitals / Speed** | Đã tối ưu Mobile 100, Desktop 92–100 (TBT thấp nhờ lazy-load tracking 12s). | `src/components/tracking/TrackingLoader.tsx` | **Đạt** |
| **Kiến trúc bài viết & 404** | Đã dùng SSG `generateStaticParams` + merge đồng bộ cPanel ở `sync/route.ts`. | `src/app/tin-tuc/[slug]/page.tsx`, `src/app/api/admin/sync/route.ts` | **Đạt** |

---

## 2. Kiểm Toán Hệ Thống Tracking & Chuyển Đổi (Conversion)

| Thành phần | Hiện trạng (Đã xác minh) | Bằng chứng | Đánh giá |
| :--- | :--- | :--- | :--- |
| **Traffic & Keyword Attribution** | Bắt được `utm_term`, `keyword`, `gclid`, referrer Google/Cốc Cốc/Bing/FB/Zalo/TikTok. | `src/lib/trackingUtils.ts` | Tốt — Cần nối dữ liệu này với báo cáo SEO để đo chuyển đổi từ Organic Search (`utm_medium=organic`). |
| **Pageview & Anti-Click-Fraud** | Ghi nhận IP, vị trí GeoIP, `gclid`, `visitorId`, cảnh báo click lặp về Telegram và lọc nguồn trên Admin. | `src/app/api/tracking/pageview/route.ts`, `src/lib/trafficStorage.ts` | Đã hoàn thiện. |
| **Lead Conversion** | Lưu `data/leads.json`, bắn Telegram ngay lập tức, hỗ trợ Meta CAPI & Google Ads conversion. | `src/app/api/leads/route.ts`, `src/components/forms/LeadForm.tsx` | Tốt — Cần bổ sung thống kê tỷ lệ chuyển đổi theo từng bài viết / landing page SEO (`landingPage` field đã có sẵn trong LeadRecord!). |

---

## 3. Kiểm Toán Nội Dung & Chính Sách Google Ads

- **Đã rà soát & làm sạch (Commit `8cffc1a`):** Loại bỏ toàn bộ cụm từ vi phạm (`tuyệt đối`, `bảo hành trọn đời`, `giảm 99%`, `hoàn toàn miễn phí` thiếu điều kiện) trên `siteConfig.ts`, `articles.json`, `CameraFeatureSection.tsx`.
- **Vấn đề còn tồn đọng cần lưu ý:**
  - Bộ quét `PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts` hiện mới chỉ quét trên `AUDITED_ROUTES` (13 route chính), **chưa quét tự động các bài viết con `/tin-tuc/[slug]`** và chưa kiểm tra `canonical` thực sự khớp URL từng trang.
  - `data/seoConfig.json` hiện chưa có thông tin kết nối GSC & Serper.dev trong môi trường local (cần kiểm tra/nhập key thực tế trên production).

---

## 4. Kết Luận Kiểm Toán

Website đang có **nền tảng kỹ thuật rất khỏe** (tốc độ nhanh, cấu trúc Next.js gọn, sẵn API GSC/Serper/Auditor). Để biến `gofpt.vn` thành cỗ máy kéo khách hàng đăng ký Internet FPT tự động từ Organic Search, cần tập trung xử lý ngay:
1. Bổ sung `canonical` chuẩn cho tất cả các trang + chặn index `/admin`.
2. Xây dựng **Persistent SEO Memory (`data/seo-memory/`)** để Agent nhớ từ khóa, lịch sử thay đổi và hiệu suất từng URL.
3. Mở rộng **SEO Management Center** trong `/admin` và triển khai **8 Agent chuyên biệt** theo cơ chế an toàn (có phê duyệt, Git diff, rollback, không tự sửa code/tracking nhạy cảm).
