# DATA_INTEGRATIONS.md — Đánh Giá & Đặc Tả Kết Nối Dữ Liệu Thực Tế

> **Nguyên tắc:** Không tạo dữ liệu giả (mock data) thay thế dữ liệu thật. Khi một nguồn API chưa được cấu hình, hệ thống hiển thị rõ trạng thái `Chưa kết nối` kèm hướng dẫn cấu hình.

---

## 1. Ma Trận Đánh Giá Khả Năng Kết Nối

| Nguồn Dữ Liệu | Hiện trạng trong Repo (Đã xác minh) | Khả năng tích hợp trên cPanel hiện tại | Giới hạn & Rủi ro |
| :--- | :--- | :--- | :--- |
| **Google Search Console API** | **Đã có sẵn** (`src/lib/googleSearchConsole.ts`, dùng Node `crypto` RS256, 0 dependency ngoài). | **Tốt (100% tương thích).** Chỉ cần nhập Service Account JSON trong `/admin` → SEO. | Dữ liệu GSC trễ 2 ngày; chưa thấy `data/seoConfig.json` kết nối ở local `[Chưa xác minh trên prod]`. |
| **SERP Data Provider (Serper.dev)** | **Đã có sẵn** (`src/lib/serpChecker.ts`), hỗ trợ `gl: "vn"`, `hl: "vi"`, `location: "Can Tho, Vietnam"`. | **Tốt.** 1 request HTTP nhẹ. | Giới hạn credit theo gói Serper.dev (2.500 query free ban đầu); cần thêm **cache 24h & rate limit** để tránh đốt credit. |
| **PageSpeed Insights API** | **Chưa tích hợp API tự động** (mới test thủ công qua browser). | **Tốt.** Gọi REST API `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` không cần browser trên server. | Thời gian phản hồi 10–20s/URL → chỉ chạy 1–2 URL/lần hoặc qua cron nền, tránh timeout request đồng bộ. |
| **Google Analytics Data API (GA4)** | **Chưa có module server API** (hiện mới gắn GA4 ID ở `TrafficTracker.tsx` & `TrackingLoader.tsx`). | **Khả thi bằng Node `crypto` JWT RS256** (tái sử dụng hàm `getGoogleAccessToken` từ `googleSearchConsole.ts` với scope `analytics.readonly`). | Cần cấp quyền Service Account vào GA4 Property (`GA4_PROPERTY_ID` chưa có trong repo). |
| **Website Crawler nội bộ** | **Có 1 phần** (`src/lib/seoAuditor.ts` dùng `fetch` HTTP quét `AUDITED_ROUTES`). | **Tốt với HTTP `fetch` nhẹ.** Tuyệt đối **không cài Puppeteer/Playwright** trên cPanel vì `PassengerMaxInstances 1`. | Chỉ quét được HTML server-rendered (đủ với Next.js SSG/SSR vì nội dung chính nằm sẵn trong HTML). |
| **CMS / Database hiện tại** | **Đang hoạt động:** JSON files trong `data/` (`articles.json`, `leads.json`, `traffic-stats.json`, `siteConfig.json`). | **100% tương thích.** | Lưu ý cơ chế `/api/admin/sync` có bước backup/restore `data/` → cần bảo toàn `data/seo-memory/` khi sync. |
| **Git Repository** | **Đang hoạt động:** `/api/admin/sync` đã dùng `execFile("git", ...)` với giới hạn thread cho cPanel. | **Đã có sẵn** cho thao tác pull/reset trên cPanel. | Việc **push code & chạy `next build`** nên thực hiện từ máy dev / Antigravity / GitHub Actions, không build trực tiếp trên cPanel để tránh tràn 100 processes. |

---

## 2. Cơ Chế Chống Lãng Phí Ngân Sách & Giới Hạn API

1. **Deduplication & Cache:**
   - Serper.dev cache tối thiểu **24 giờ** cho mỗi cặp `(keyword, location)`.
   - PageSpeed Insights API cache tối thiểu **24 giờ** cho mỗi URL.
2. **Budget Guard (`data/seo-memory/api_usage.json`):**
   - Ghi nhận số lượt gọi theo ngày/tháng cho từng provider (`serper`, `gsc`, `psi`, `ai_llm`).
   - Ngưỡng cảnh báo khi đạt **80% hạn mức** và tự động ngắt ở **100%** để tránh phát sinh chi phí ngoài ý muốn.
