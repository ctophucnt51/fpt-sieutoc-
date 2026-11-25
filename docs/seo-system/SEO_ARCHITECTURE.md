# SEO_ARCHITECTURE.md — Kiến Trúc Hệ Thống AI SEO Multi-Agent Tích Hợp GoFPT.vn

---

## 1. Sơ Đồ Kiến Trúc Tổng Thể (System Architecture)

```text
+-------------------------------------------------------------------------+
|                    GOFPT.VN — SEO MANAGEMENT CENTER                     |
|           (/admin -> Tab SEO Intelligence + Approval Center)            |
+------------------------------------+------------------------------------+
                                     | REST API (/api/admin/seo/*)
                                     v
+-------------------------------------------------------------------------+
|                   ORCHESTRATOR (SEO MASTER AGENT)                       |
|   Chu trình: Collect -> Analyze -> Prioritize -> Plan -> Execute ->     |
|              Validate -> Measure -> Learn                               |
+---+-------------------+-------------------+-------------------+---------+
    |                   |                   |                   |
    v                   v                   v                   v
[Technical]       [Keyword &]          [Content &]        [Analytics &]
[SEO Agent]       [Competitor]         [Onpage Agent]     [Local/Auth Agent]
                        |                   |
                        +---------+---------+
                                  v
                        [QA & SAFETY AGENT]
           (Google Ads Guard + Diff Check + Rollback Gate)
                                  |
                                  v
+-------------------------------------------------------------------------+
|                PERSISTENT MEMORY (data/seo-memory/*.json)               |
|  inventory.json | keywords.json | baseline.json | competitors.json |    |
|  tasks.json | approvals.json | changes.json | performance.json |        |
|  lessons.json                                                           |
+-------------------------------------------------------------------------+
                                  |
         +------------------------+------------------------+
         v                        v                        v
  [External Data]          [CMS & Build]            [Notifications]
  - Google Search Console  - articles.json          - Telegram Bot
  - GA4 Data API           - sitemap.ts             - Admin Toast/UI
  - PageSpeed API          - next build + Git
  - Serper.dev
```

---

## 2. Phân Tách Rõ Hai Môi Trường Chạy (Runtime Architecture)

Vì hosting production chạy **cPanel / CloudLinux (`PassengerMaxInstances 1`)**, kiến trúc tách rõ 2 lớp runtime:

### Lớp A: Server Runtime Tự Động Trên cPanel (Không cần IDE mở)
- **Cơ chế kích hoạt:** Endpoint bảo mật `POST /api/cron/seo-tick` (xác thực bằng `CRON_SECRET`) được gọi định kỳ bởi **cPanel Cron Jobs** (ví dụ 1–2 lần/ngày).
- **Nhiệm vụ chạy nhẹ trên server (< 15 giây, không spawn process nặng):**
  1. Thu thập dữ liệu thực tế từ GSC API, Serper.dev, PageSpeed Insights API, Traffic/Lead nội bộ.
  2. Cập nhật `performance.json`, `baseline.json` và tự động sinh **Task Queue** (ví dụ: *"Từ khóa X tụt từ Top 4 xuống Top 7"*, *"Trang Y thiếu canonical"*).
  3. Gửi tóm tắt & cảnh báo về **Telegram** khi có biến động hoặc có đề xuất chờ duyệt trong **Approval Center**.
- **Giới hạn an toàn:** Server Runtime **không tự ý sửa code `.tsx` hay chạy `next build`** trên hosting cPanel yếu CPU/process.

### Lớp B: Execution Runtime (Antigravity Agent / GitHub Workflow)
- **Khi cần sửa code (`metadata`, `schema`, `canonical`), viết bài SSG mới, hoặc chạy `next build`:**
  - Thực thi bởi **Antigravity Multi-Agent Workflow** (hoặc khi admin bấm phê duyệt trên Approval Center để tạo bản nháp trong `articles.json` / `seo-overrides.json`).
  - Mọi thay đổi mã nguồn đều đi qua **Git diff → `next build` → QA & Safety Gate → Git push → cPanel `/api/admin/sync`**.

---

## 3. Bộ Nhớ Bền Vững (Persistent Memory — `data/seo-memory/`)

Sử dụng cấu trúc file JSON phân tách theo domain (đồng bộ cùng cơ chế `data/` hiện tại, không cần cài thêm database ngoài):

| File Path | Vai trò lưu trữ |
| :--- | :--- |
| `data/seo-memory/inventory.json` | Bản đồ toàn bộ URL, trạng thái index, metadata, schema, canonical hiện tại |
| `data/seo-memory/keywords.json` | Keyword Mapping (1 keyword ↔ 1 target URL), intent, độ ưu tiên |
| `data/seo-memory/baseline.json` | Điểm chuẩn trước tối ưu (Clicks, Impressions, Position, PageSpeed, Leads) |
| `data/seo-memory/competitors.json` | Dữ liệu Top 3 đối thủ từ Serper.dev (domain, title, snippet, điểm mạnh) |
| `data/seo-memory/fpt_knowledge.json` | Nguồn sự thật duy nhất về gói cước, giá, thiết bị, địa bàn Cần Thơ–Sóc Trăng–Hậu Giang (đồng bộ từ `siteConfig.ts`) |
| `data/seo-memory/tasks.json` | Task Queue: ID, Agent phụ trách, priority, bằng chứng, chi phí dự kiến, acceptance criteria |
| `data/seo-memory/approvals.json` | Hàng đợi **Approval Center**: các đề xuất cần Admin duyệt trước khi áp dụng |
| `data/seo-memory/changes.json` | Lịch sử thay đổi (Git commit/snapshot trước-sau) hỗ trợ rollback |
| `data/seo-memory/performance.json` | Chuỗi thời gian thứ hạng, traffic organic và số Lead chuyển đổi theo từng URL |
| `data/seo-memory/lessons.json` | Bài học rút ra (ví dụ: kiểu tiêu đề nào tăng CTR, dạng bài nào ra Lead cao) |
