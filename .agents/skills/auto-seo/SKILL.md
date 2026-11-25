---
name: auto-seo
description: "Hệ thống 5 Agent tự động SEO website gofpt.vn lên Top Google (Nghiên cứu từ khóa, Biên tập Clean Editorial, Kiểm duyệt Google Ads & Technical, Xuất bản SSG & Google Indexing, Theo dõi thứ hạng)."
---

# HỆ THỐNG MULTI-AGENT TỰ SEO GOFPT.VN LÊN TOP GOOGLE

Skill này điều phối 5 Agent chuyên biệt phối hợp khép kín để đưa các từ khóa địa phương (Cần Thơ, Sóc Trăng, Hậu Giang) và dịch vụ FPT Telecom lên Top 1–3 Google, đồng thời giữ chuẩn **100% không vi phạm chính sách Google Ads**.

---

## Nguyên tắc bất di bất dịch (Đọc từ `AGENTS.md`)
1. **Kim chỉ nam Google Ads:** CẤM dùng *tuyệt đối, bảo hành trọn đời, số 1, tốt nhất, giảm 99%, duy nhất, 100% không giật, hoàn toàn miễn phí* (không kèm điều kiện). Luôn minh bạch tư cách đại lý/kênh tư vấn dịch vụ FPT Telecom.
2. **Thông tin cố định:**
   - Địa chỉ: `Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ`
   - Hotline: `0878 800 400` | Zalo: `https://zalo.me/0878800400`
   - Email: `PhucNT51@fpt.com` | Domain: `https://gofpt.vn`
3. **Giao diện bài viết:** Chuẩn **Clean & Minimal Editorial** đã chốt (nền trắng sáng, H2 cam in đậm, H3 số cam chữ đen đậm, bảng sáng thanh lịch, không lặp ảnh bìa, FAQ ngắn, khối liên hệ cố định ở cuối).

---

## Quy trình 5 Agent (Chạy qua `.agents/workflows/auto-seo-pipeline.py`)

### Agent 1: Research & Keyword Spy
- Đọc danh sách bài đã có trong `src/data/articles.json` để tránh trùng lặp chủ đề (Keyword Cannibalization).
- Nếu đã kết nối `data/seoConfig.json` (GSC + Serper.dev), kiểm tra các từ khóa đang đứng **Top 4–15** hoặc có nhiều Impressions nhưng CTR thấp.
- Đề xuất:
  * Từ khóa chính (Primary Keyword) & 3–5 từ khóa phụ (LSI).
  * Tiêu đề H1 (55–65 ký tự), Slug không dấu, Excerpt (150–160 ký tự).
  * Dàn ý H2/H3 + 2–3 câu hỏi FAQ thực tế của khách hàng.

### Agent 2: SEO Content Writer
- Viết nội dung HTML theo đúng chuẩn **Clean & Minimal Editorial**.
- Gắn liên kết nội bộ tự nhiên về `/lap-mang-fpt`, `/bang-gia`, `/combo-ngoai-hang-anh`, `/camera-fpt`.
- Ghi bài vào `src/data/articles.json`, `data/articles.json` và `INITIAL_ARTICLES` trong `src/lib/articleStorage.ts`.

### Agent 3: Compliance & Technical Auditor
- Quét toàn bộ nội dung vừa viết với bộ từ cấm trong `src/lib/seoAuditor.ts` (`PROHIBITED_ADS_PATTERNS`).
- Kiểm tra JSON hợp lệ, đầy đủ thẻ `alt` ảnh, không lặp ảnh bìa, thông tin liên hệ chính xác 100%.
- Chạy `next build` xác nhận biên dịch trang tĩnh SSG (`/tin-tuc/<slug>`) thành công 0 lỗi.

### Agent 4: Publisher & Google Indexing
- Commit & push lên GitHub (`origin main`).
- Đảm bảo URL mới đã xuất hiện trong `https://gofpt.vn/sitemap.xml` và có đầy đủ Schema `NewsArticle` + `LocalBusiness` + `FAQPage`.
- Khi người dùng yêu cầu hoặc sau khi đồng bộ cPanel, hỗ trợ kiểm tra/gửi lập chỉ mục qua Google Search Console.

### Agent 5: Rank Tracker & Telegram Reporter
- Khi chạy định kỳ (hoặc qua `/schedule`), kiểm tra lại thứ hạng từ khóa qua GSC/Serper.dev và gửi báo cáo tổng hợp qua `sendSeoReportAlert()` trong `src/lib/telegram.ts`.
