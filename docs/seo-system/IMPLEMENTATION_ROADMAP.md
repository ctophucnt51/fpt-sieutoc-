# IMPLEMENTATION_ROADMAP.md — Lộ Trình Triển Khai & Chi Phí Dự Kiến

> **Nguyên tắc triển khai:** Thực hiện cuốn chiếu theo từng Milestone nhỏ, có kiểm thử & Git commit rõ ràng, không ảnh hưởng website bán hàng đang chạy.

---

## 1. Danh Sách Module Cần Xây Dựng & Mức Độ Ưu Tiên

| Mức độ | Module / Tính năng | Tái sử dụng từ | Tệp dự kiến tạo/mở rộng |
| :-: | :--- | :--- | :--- |
| **P0** | Vá lỗi SEO nền tảng: thêm `canonical` động cho từng trang + chặn `/admin` trong `robots.ts` + `noindex` | `src/app/robots.ts`, `src/app/layout.tsx` | `src/app/**/page.tsx`, `src/app/robots.ts` |
| **P0** | **Persistent Memory Engine** (`data/seo-memory/*.json`) + bảo vệ thư mục này trong `/api/admin/sync` | `src/lib/seoStorage.ts`, `src/app/api/admin/sync/route.ts` | `src/lib/seoMemory.ts`, `src/app/api/admin/sync/route.ts` |
| **P1** | **SEO Master Orchestrator & 8 Agent Specs** + Budget/Rate-Limit/Deduplication Guard | `.agents/skills/auto-seo/`, `.agents/workflows/` | `src/lib/seoOrchestrator.ts`, `src/app/api/cron/seo-tick/route.ts` |
| **P1** | **Mở rộng `seoAuditor.ts`**: Quét cả bài viết `/tin-tuc/[slug]`, kiểm tra mật độ từ khóa, kiểm tra NAP cố định, kiểm tra canonical | `src/lib/seoAuditor.ts` | `src/lib/seoAuditor.ts`, `src/app/api/admin/seo/audit/route.ts` |
| **P1** | **Nâng cấp SEO Management Center** trong `/admin`: thêm các tab Overview, Inventory, Keywords, Competitors, Technical Issues, Content, Agents, Task Queue, Approval Center, Change History, Performance, Conversion, API Usage | `src/components/admin/SeoManagement.tsx` | `src/components/admin/seo/*.tsx` |
| **P2** | **Tích hợp PageSpeed Insights API & GA4 Data API** (tái sử dụng JWT RS256 của `googleSearchConsole.ts`) | `src/lib/googleSearchConsole.ts` | `src/lib/pageSpeedClient.ts`, `src/lib/ga4Client.ts` |
| **P2** | **Local SEO Cluster Expansion:** Tạo cụm bài chuẩn Clean Editorial cho Cần Thơ (Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn, Thốt Nốt), Sóc Trăng, Hậu Giang | `src/data/articles.json`, `auto-seo` workflow | `src/data/articles.json` |

---

## 2. Lộ Trình Theo Milestone

- **Milestone 1 — Foundation & Memory (Tuần 1):**
  - Hoàn thành P0 (`canonical`, chặn `/admin`, `seoMemory.ts`, bảo vệ `sync/route.ts`).
  - Kết nối thực tế Google Search Console API + Serper.dev API trong `/admin`.
- **Milestone 2 — SEO Management Center & QA Gate (Tuần 2):**
  - Hoàn thành 13 phân hệ trong Admin SEO Center, đặc biệt là **Task Queue**, **Approval Center**, **Change History** (có Rollback) và **QA Google Ads Guard**.
- **Milestone 3 — Multi-Agent Orchestrator & Cron Server (Tuần 3):**
  - Hoàn thành `/api/cron/seo-tick` chạy nhẹ trên cPanel Cron + kết nối PageSpeed API & GA4 Data API + báo cáo Telegram tự động.
- **Milestone 4 — Local SEO Content & Tối ưu Thứ hạng (Tuần 4+):**
  - Vận hành chu trình tuần hoàn: sản xuất 2–3 bài Local SEO/tuần qua Approval Center, tối ưu các từ khóa Top 4–15 và đo chuyển đổi Lead thực tế.

---

## 3. Dự Toán Chi Phí Vận Hành Hàng Tháng

| Hạng mục | Chi phí ước tính | Ghi chú |
| :--- | :--- | :--- |
| **Hosting cPanel & Domain `gofpt.vn`** | **0đ phát sinh thêm** | Chạy chung trên hạ tầng Node.js hiện có. |
| **Google Search Console API / GA4 Data API / PageSpeed Insights API** | **0đ (Miễn phí)** | Google cung cấp miễn phí theo hạn mức tiêu chuẩn. |
| **Serper.dev (Kiểm tra thứ hạng SERP)** | **0đ (gói Free 2.500 queries)** hoặc ~\$10–\$20/tháng nếu scale lớn | Với ~30–50 từ khóa kiểm tra 2–3 ngày/lần + cache 24h, gói Free dùng được rất lâu. |
| **AI Model API (cho Cron Server tự động phân tích/nháp bài)** | **~\$5 – \$15/tháng** (tùy tần suất) | Có **Budget Cap** trong `api_usage.json`; hoặc **0đ** khi chạy qua Antigravity IDE Agent. |
