# CURRENT_ARCHITECTURE.md — Kiến Trúc Hệ Thống Hiện Tại (GoFPT.vn)

> **Trạng thái dữ liệu:** Tài liệu được lập hoàn toàn từ kiểm tra thực tế mã nguồn repository `/Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc` (chế độ chỉ đọc). Các mục chưa thể kiểm chứng trực tiếp trên hosting production được gắn nhãn rõ ràng là `[Giả định / Chưa xác minh]`.

---

## 1. Tech Stack & Runtime Thực Tế (Đã xác minh)

| Thành phần | Công nghệ thực tế | Bằng chứng file path |
| :--- | :--- | :--- |
| **Framework** | Next.js `14.2.15` (App Router) | `package.json` |
| **UI Library** | React `18.3.1` + TypeScript `5.5.3` | `package.json` |
| **Styling** | Tailwind CSS `3.4.13` + Lucide Icons `0.453.0` | `package.json`, `tailwind.config.js` |
| **Server Entry** | Custom HTTP Server (`server.js` / `app.js` / `index.js`) & `next start -p 3000` | `server.js`, `ecosystem.config.js` |
| **Hosting Runtime** | cPanel / CloudLinux + Phusion Passenger (`PassengerMaxInstances 1`, `PassengerPoolIdleTime 120`, `PassengerMaxRequests 1000`) | `.htaccess` |
| **Lưu trữ dữ liệu (Database)** | File JSON cục bộ trong thư mục `data/` (persistent, `.gitignore`) & `src/data/` (seed) | `src/lib/configStorage.ts`, `src/lib/articleStorage.ts`, `src/lib/leadStorage.ts`, `src/lib/seoStorage.ts`, `src/lib/trafficStorage.ts` |
| **Cơ chế Deploy** | GitHub (`main`) → `/api/admin/sync` (Git fetch + reset + khôi phục `data/` + chạm `tmp/restart.txt` khởi động lại Passenger) | `src/app/api/admin/sync/route.ts` |

---

## 2. Cấu Trúc Thư Mục Mã Nguồn (Đã xác minh)

- `src/app/` — App Router pages (SSG/SSR) và REST API routes (`src/app/api/`).
- `src/components/`:
  - `home/` — Các section trang chủ (`HeroSection`, `SportsEplSection`, `PricingSection`, `CameraFeatureSection`, `Wifi6Explainer`, `ProcessSection`, `FaqSection`, `BottomCtaSection`).
  - `layout/` — `Header`, `Footer`, `StickyMobileBar`.
  - `forms/` — `LeadForm` (thu thập lead + UTM/GCLID).
  - `tracking/` — `TrackingLoader`, `TrafficTracker`, `GoogleAds`, `MetaPixel`.
  - `admin/` — Dashboard quản trị (`TrafficManagement`, `LeadManagement`, `GoogleAdsManagement`, `ArticleManagement`, `SeoManagement`, `PricingConfigEditor`, `AreaConfigEditor`, `GeneralConfigEditor`).
- `src/lib/` — Tầng xử lý logic & lưu trữ file JSON:
  - `adminAuth.ts` (HMAC-SHA256 cookie/Bearer token auth)
  - `configStorage.ts`, `articleStorage.ts`, `leadStorage.ts`, `trafficStorage.ts`, `seoStorage.ts`, `googleAdsStorage.ts`
  - `googleSearchConsole.ts`, `serpChecker.ts`, `seoAuditor.ts`, `telegram.ts`, `metaCapi.ts`, `trackingUtils.ts`
- `src/config/siteConfig.ts` — Cấu hình tĩnh mặc định (thương hiệu, gói cước, thông tin liên hệ cố định).
- `data/` — Dữ liệu runtime: `articles.json`, `leads.json`, `siteConfig.json`, `traffic-stats.json` (và `seoConfig.json` khi cấu hình SEO).

---

## 3. Các Thành Phần Có Thể Tái Sử Dụng Cho Hệ Thống AI SEO

1. **Admin Dashboard & Auth (`src/app/admin/page.tsx`, `src/lib/adminAuth.ts`):** Đã có sẵn giao diện phân tab, hệ thống xác thực HMAC token, và tab `SeoManagement.tsx` có thể mở rộng thành **SEO Management Center**.
2. **Google Search Console Connector (`src/lib/googleSearchConsole.ts`):** Đã cài đặt sẵn ký JWT RS256 bằng Node.js `crypto` (không cần cài thêm thư viện ngoài) để gọi Search Analytics API.
3. **SERP Checker (`src/lib/serpChecker.ts`):** Đã tích hợp sẵn Serper.dev API lấy Top 30 kết quả tìm kiếm tại `Can Tho, Vietnam`.
4. **On-Page & Google Ads Policy Auditor (`src/lib/seoAuditor.ts`):** Đã có sẵn bộ quét Title, Description, H1, Alt, OG, Canonical và kiểm tra từ cấm Google Ads (`PROHIBITED_ADS_PATTERNS`).
5. **CMS Bài viết SSG (`src/lib/articleStorage.ts`, `src/app/tin-tuc/[slug]/page.tsx`):** Đã hỗ trợ `generateStaticParams` (xuất bản HTML tĩnh chống 404), Schema `NewsArticle`, và tự động cập nhật `sitemap.xml`.
6. **Telegram Alert System (`src/lib/telegram.ts`):** Đã có sẵn `sendTelegramNotification`, `sendClickFraudAlert` và `sendSeoReportAlert`.
7. **Attribution & Conversion (`src/lib/trackingUtils.ts`, `src/app/api/leads/route.ts`):** Đã ghi nhận được `utm_source`, `utm_medium`, `utm_term` (từ khóa), `gclid`, và chuyển đổi đơn hàng.

---

## 4. Ràng Buộc Hạ Tầng & Rủi Ro Khi Tích Hợp (Đã xác minh)

- **Giới hạn Process trên cPanel:** `.htaccess` giới hạn `PassengerMaxInstances 1` do CloudLinux giới hạn 100 tiến trình. Do đó **không được chạy trình duyệt headless (Puppeteer/Playwright) hay spawn nhiều worker Node con trên hosting production**.
- **Chiến lược phù hợp:** Mọi tác vụ chạy tự động trên server phải là các request HTTP nhẹ (REST API calls, đọc/ghi JSON nhỏ), hoặc tách phần nghiên cứu/biên tập nặng chạy ở môi trường Antigravity Agent rồi đồng bộ qua Git/API.
- `[Chưa xác minh]` Dung lượng RAM còn trống và khả năng cấu hình Cron Job trên cPanel thực tế của tài khoản hosting `gofpt.vn`.
